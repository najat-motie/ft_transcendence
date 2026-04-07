const { WebSocketServer, WebSocket } = require('ws');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const onlineService = require('../services/online.service');
const offlineService = require('../services/offline.service');
const aiSessionService = require('../services/ai-session.service');

const ONLINE_ROOM_PATH = /^\/ws\/online\/([^/]+)$/;
const OFFLINE_ROOM_PATH = /^\/ws\/offline\/([^/]+)$/;
const AI_ROOM_PATH = /^\/ws\/ai\/([^/]+)$/;
const ONLINE_DISCONNECT_GRACE_MS = 5000;
const SINGLE_PLAYER_DISCONNECT_GRACE_MS = 5000;

const sendJson = (socket, payload) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
};

const parseJsonMessage = (rawMessage) => {
  try {
    return JSON.parse(rawMessage.toString());
  } catch (error) {
    return null;
  }
};

const broadcast = (room, payload) => {
  for (const socket of room.sockets.values()) {
    sendJson(socket, payload);
  }
};

const clearSinglePlayerDisconnectTimer = (session) => {
  if (session.disconnectTimer) {
    clearTimeout(session.disconnectTimer);
    session.disconnectTimer = null;
  }
};

const closeOnlineRoom = async (room, reason, winnerId = null) => {
  if (room.closing) {
    return;
  }

  room.closing = true;

  if (room.disconnectTimer) {
    clearTimeout(room.disconnectTimer);
    room.disconnectTimer = null;
  }

  if (!room.finished && winnerId && room.roles[winnerId]) {
    room.finalState = {
      game_status: 'win',
      winner: room.roles[winnerId],
      reason: 'opponent_disconnected',
    };
    room.finished = true;
    try {
      await onlineService.persistFinishedRoom(room, room.finalState);
    } catch (error) {
      console.error('Failed to persist disconnect win:', error.message);
    }
  }

  if (room.finished && room.finalState && !room.persisted) {
    try {
      await onlineService.persistFinishedRoom(room, room.finalState);
    } catch (error) {
      console.error('Failed to persist finished online match during close:', error.message);
    }
  }

  if (reason) {
    broadcast(room, { message: reason, final_state: room.finalState });
  }

  for (const socket of room.sockets.values()) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  }

  room.sockets.clear();
  await onlineService.releaseRoom(room.gameId);
};

const handleOnlineMove = async (socket, room, playerId, message) => {
  const roomRole = room.roles[playerId];

  if (!message || typeof message !== 'object') {
    return sendJson(socket, { error: 'Invalid payload. Use a JSON object.' });
  }

  if (message.player_id !== playerId) {
    return sendJson(socket, { error: 'player_id does not match this websocket connection.' });
  }

  if (room.sockets.size < 2) {
    return sendJson(socket, { error: 'Both players must connect before the game starts.' });
  }

  if (room.finished) {
    return sendJson(socket, { error: 'Game already finished.' });
  }

  if (room.turn !== roomRole) {
    return sendJson(socket, { error: 'Not your turn.' });
  }

  if (!Number.isInteger(message.row) || !Number.isInteger(message.col)) {
    return sendJson(socket, { error: 'row and col must be integers.' });
  }

  try {
    const state = await onlineService.submitMove(room.gameId, {
      player_id: playerId,
      row: message.row,
      col: message.col,
    });

    room.finalState = state;
    room.turn = state.turn || null;
    room.finished = state.game_status && state.game_status !== 'ongoing';

    if (room.finished) {
      try {
        await onlineService.persistFinishedRoom(room, state);
      } catch (error) {
        console.error('Failed to persist finished online match:', error.message);
      }
    }

    broadcast(room, state);
  } catch (error) {
    return sendJson(socket, {
      error: onlineService.gameServiceError(error, 'Failed to process the move'),
    });
  }
};

const handleOnlineJoin = async (socket, room, playerId) => {
  if (socket.authUserId && socket.authUserId !== playerId) {
    sendJson(socket, { error: 'Authenticated user does not match player_id.' });
    socket.close();
    return;
  }

  if (!room.roles[playerId]) {
    sendJson(socket, { error: 'Unknown player_id for this game.' });
    socket.close();
    return;
  }

  const previousSocket = room.sockets.get(playerId);
  if (previousSocket && previousSocket !== socket) {
    room.sockets.delete(playerId);
    if (previousSocket.readyState === WebSocket.OPEN) {
      previousSocket.close();
    }
  }

  if (room.disconnectTimer) {
    clearTimeout(room.disconnectTimer);
    room.disconnectTimer = null;
  }

  socket.playerId = playerId;
  room.sockets.set(playerId, socket);

  sendJson(socket, {
    type: 'connection',
    game_id: room.gameId,
    player_id: playerId,
    role: onlineService.getTurnForPlayer(room, playerId),
    players: onlineService.getPlayersPayload(room),
  });

  if (room.sockets.size < 2) {
    sendJson(socket, {
      message: room.started
        ? 'Waiting for the other player to reconnect.'
        : 'Waiting for the other player to connect.',
    });
    return;
  }

  try {
    const state = await onlineService.fetchGameState(room.gameId);
    if (!room.started) {
      room.started = true;
      broadcast(room, { message: 'Enabled: Game Start' });
    }
    room.turn = state.turn || room.turn;
    broadcast(room, state);
  } catch (error) {
    await closeOnlineRoom(
      room,
      onlineService.gameServiceError(error, 'Failed to start the online game')
    );
  }
};

const attachOnlineConnection = (socket, room) => {
  socket.on('message', async (rawMessage) => {
    const message = parseJsonMessage(rawMessage);

    if (!message) {
      return sendJson(socket, { error: 'Invalid JSON payload.' });
    }

    await onlineService.withRoomLock(room, async () => {
      if (!socket.playerId) {
        let playerId;
        if (typeof message.player_id === 'string') {
          playerId = message.player_id.trim();
        } else {
          playerId = '';
        }
        await handleOnlineJoin(socket, room, playerId);
        return;
      }

      await handleOnlineMove(socket, room, socket.playerId, message);
    });
  });

  socket.on('close', async () => {
    if (!socket.playerId) {
      return;
    }

    await onlineService.withRoomLock(room, async () => {
      if (room.closing) {
        return;
      }

      if (room.sockets.get(socket.playerId) !== socket) {
        return;
      }

      room.sockets.delete(socket.playerId);

      if (room.finished) {
        if (room.sockets.size === 0) {
          await closeOnlineRoom(room);
        }
        return;
      }

      if (room.disconnectTimer) {
        clearTimeout(room.disconnectTimer);
      }

      room.disconnectTimer = setTimeout(() => {
        onlineService.withRoomLock(room, async () => {
          room.disconnectTimer = null;

          if (room.closing) {
            return;
          }

          if (room.finished) {
            if (room.sockets.size === 0) {
              await closeOnlineRoom(room);
            }
            return;
          }

          if (room.sockets.size >= 2) {
            return;
          }

          if (room.sockets.size > 0) {
            const remainingId = Array.from(room.sockets.keys())[0];
            await closeOnlineRoom(room, 'A player disconnected.', remainingId);
            return;
          }

          await closeOnlineRoom(room);
        }).catch((error) => {
          console.error('Failed to close online room after disconnect:', error.message);
        });
      }, ONLINE_DISCONNECT_GRACE_MS);
    });
  });

  socket.on('error', () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  });
};

const closeSinglePlayerSession = async (session, service) => {
  if (session.closing) {
    return;
  }

  session.closing = true;
  clearSinglePlayerDisconnectTimer(session);

  if (session.socket && session.socket.readyState === WebSocket.OPEN) {
    session.socket.close();
  }

  session.socket = null;
  await service.releaseSession(session.gameId);
};

const scheduleSinglePlayerRelease = (session, service) => {
  clearSinglePlayerDisconnectTimer(session);
  session.disconnectTimer = setTimeout(() => {
    service.withSessionLock(session, async () => {
      if (session.closing || session.socket) {
        return;
      }
      await closeSinglePlayerSession(session, service);
    }).catch((error) => {
      console.error('Failed to close single-player session after disconnect:', error.message);
    });
  }, SINGLE_PLAYER_DISCONNECT_GRACE_MS);
};

const handleSinglePlayerMove = async (socket, session, service, errorPrefix, message) => {
  if (!message || typeof message !== 'object') {
    return sendJson(socket, { error: 'Invalid payload. Use a JSON object.' });
  }

  if (message.player_id !== undefined && message.player_id !== session.playerId) {
    return sendJson(socket, { error: 'player_id does not match this game session.' });
  }

  if (session.finished) {
    return sendJson(socket, { error: 'Game already finished.' });
  }

  if (!Number.isInteger(message.row) || !Number.isInteger(message.col)) {
    return sendJson(socket, { error: 'row and col must be integers.' });
  }

  try {
    const state = await service.submitMove(session.gameId, {
      player_id: session.playerId,
      row: message.row,
      col: message.col,
    });

    session.finished = state.game_status && state.game_status !== 'ongoing';
    sendJson(socket, state);
  } catch (error) {
    return sendJson(socket, {
      error: service.gameServiceError(error, `Failed to process the ${errorPrefix} move`),
    });
  }
};

const attachSinglePlayerConnection = async (socket, session, service, startErrorMessage, moveErrorPrefix) => {
  await service.withSessionLock(session, async () => {
    clearSinglePlayerDisconnectTimer(session);

    if (session.socket && session.socket !== socket) {
      if (session.socket.readyState === WebSocket.OPEN) {
        session.socket.close();
      }
      session.socket = null;
    }

    session.socket = socket;
    session.closing = false;

    try {
      sendJson(socket, {
        type: 'connection',
        game_id: session.gameId,
        player_id: session.playerId,
      });
      sendJson(socket, { message: 'Enabled: Game Start' });

      const state = await service.fetchState(session.gameId);
      session.finished = state.game_status && state.game_status !== 'ongoing';
      sendJson(socket, state);
    } catch (error) {
      await closeSinglePlayerSession(session, service);
      sendJson(socket, {
        error: service.gameServiceError(error, startErrorMessage),
      });
    }
  });

  socket.on('message', async (rawMessage) => {
    const message = parseJsonMessage(rawMessage);

    if (!message) {
      return sendJson(socket, { error: 'Invalid JSON payload.' });
    }

    await service.withSessionLock(session, async () => {
      await handleSinglePlayerMove(socket, session, service, moveErrorPrefix, message);
    });
  });

  socket.on('close', async () => {
    await service.withSessionLock(session, async () => {
      if (session.socket !== socket) {
        return;
      }

      session.socket = null;

      if (session.finished) {
        await closeSinglePlayerSession(session, service);
        return;
      }

      scheduleSinglePlayerRelease(session, service);
    });
  });

  socket.on('error', () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  });
};

const resolveGatewayRoute = (pathname) => {
  const onlineMatch = pathname.match(ONLINE_ROOM_PATH);
  if (onlineMatch) {
    return { kind: 'online', gameId: onlineMatch[1] };
  }

  const offlineMatch = pathname.match(OFFLINE_ROOM_PATH);
  if (offlineMatch) {
    return { kind: 'offline', gameId: offlineMatch[1] };
  }

  const aiMatch = pathname.match(AI_ROOM_PATH);
  if (aiMatch) {
    return { kind: 'ai', gameId: aiMatch[1] };
  }

  return null;
};

const verifySocketAccessToken = (request) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const cookies = cookie.parse(request.headers.cookie || '');
  const candidates = [
    requestUrl.searchParams.get('token'),
    cookies.jwt_access,
    cookies.accessToken,
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      return jwt.verify(candidate, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
    }
  }

  return null;
};

const attachOnlineGateway = (server) => {
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', async (socket, request, route) => {
    socket.authUserId = request.user?.userId || null;

    if (route.kind === 'online') {
      const room = onlineService.getRoom(route.gameId);

      if (!room) {
        sendJson(socket, { error: 'Game not found.' });
        socket.close();
        return;
      }

      attachOnlineConnection(socket, room);
      return;
    }

    if (route.kind === 'offline') {
      const session = offlineService.getSession(route.gameId);

      if (!session) {
        sendJson(socket, { error: 'Game not found.' });
        socket.close();
        return;
      }

      await attachSinglePlayerConnection(
        socket,
        session,
        offlineService,
        'Failed to start the offline game',
        'offline'
      );
      return;
    }

    if (route.kind === 'ai') {
      const session = aiSessionService.getSession(route.gameId);

      if (!session) {
        sendJson(socket, { error: 'Game not found.' });
        socket.close();
        return;
      }

      await attachSinglePlayerConnection(
        socket,
        session,
        aiSessionService,
        'Failed to start the AI game',
        'AI'
      );
    }
  });

  server.on('upgrade', (request, socket, head) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);
    const pathname = requestUrl.pathname;
    const route = resolveGatewayRoute(pathname);

    if (!route) {
      socket.destroy();
      return;
    }

    const requireAuth = route.kind === 'online';
    const decoded = verifySocketAccessToken(request);

    if (decoded) {
      request.user = decoded;
    } else if (requireAuth) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    } else {
      request.user = { userId: 'guest' };
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, route);
    });
  });
};

module.exports = {
  attachOnlineGateway,
};
