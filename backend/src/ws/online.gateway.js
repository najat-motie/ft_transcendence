const { WebSocketServer, WebSocket } = require('ws');
const onlineService = require('../services/online.service');
const offlineService = require('../services/offline.service');
const aiSessionService = require('../services/ai-session.service');

const ONLINE_ROOM_PATH = /^\/ws\/online\/([^/]+)$/;
const OFFLINE_ROOM_PATH = /^\/ws\/offline\/([^/]+)$/;
const AI_ROOM_PATH = /^\/ws\/ai\/([^/]+)$/;

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

const closeOnlineRoom = async (room, reason) => {
  if (room.closing) {
    return;
  }

  room.closing = true;

  if (room.finished && room.finalState && !room.persisted) {
    try {
      await onlineService.persistFinishedRoom(room, room.finalState);
    } catch (error) {
      console.error('Failed to persist finished online match during close:', error.message);
    }
  }

  if (reason) {
    broadcast(room, { message: reason });
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
  if (!room.roles[playerId]) {
    sendJson(socket, { error: 'Unknown player_id for this game.' });
    socket.close();
    return;
  }

  if (room.sockets.has(playerId)) {
    sendJson(socket, { error: 'This player is already connected.' });
    socket.close();
    return;
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
    sendJson(socket, { message: 'Waiting for the other player to connect.' });
    return;
  }

  if (room.started) {
    return;
  }

  room.started = true;

  try {
    broadcast(room, { message: 'Enabled: Game Start' });
    const state = await onlineService.fetchGameState(room.gameId);
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
        const playerId = typeof message.player_id === 'string' ? message.player_id.trim() : '';
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
      if (room.sockets.get(socket.playerId) === socket) {
        room.sockets.delete(socket.playerId);
      }

      if (room.finished) {
        if (room.sockets.size === 0) {
          await closeOnlineRoom(room);
        }
        return;
      }

      if (room.sockets.size > 0) {
        await closeOnlineRoom(room, 'A player disconnected.');
        return;
      }

      await closeOnlineRoom(room);
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

  if (session.socket && session.socket.readyState === WebSocket.OPEN) {
    session.socket.close();
  }

  session.socket = null;
  await service.releaseSession(session.gameId);
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
    if (session.socket) {
      sendJson(socket, { error: 'This game already has an active connection.' });
      socket.close();
      return;
    }

    session.socket = socket;

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
      if (session.socket === socket) {
        session.socket = null;
      }
      await closeSinglePlayerSession(session, service);
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

const attachOnlineGateway = (server) => {
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', async (socket, request, route) => {
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
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
    const route = resolveGatewayRoute(pathname);

    if (!route) {
      socket.destroy();
      return;
    }

    try {
      const cookieHeader = request.headers.cookie || '';
      const cookies = require('cookie').parse(cookieHeader);
      const token = cookies.jwt_access;
      if (!token) throw new Error('No token');
      const decoded = require('jsonwebtoken').verify(token, process.env.JWT_ACCESS_SECRET);
      request.user = decoded;
    } catch (error) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, route);
    });
  });
};

module.exports = {
  attachOnlineGateway,
};
