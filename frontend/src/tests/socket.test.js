// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildSocketUrl, closeSocket, connectSocket, getSocket } from "../services/socket";

class FakeWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  constructor(url) {
    this.url = url;
    this.readyState = FakeWebSocket.CONNECTING;
    this.listeners = new Map();
  }

  addEventListener(type, handler) {
    this.listeners.set(type, handler);
  }

  close() {
    this.readyState = FakeWebSocket.CLOSED;
  }
}

describe("socket service", () => {
  let originalWebSocket;

  beforeEach(() => {
    originalWebSocket = global.WebSocket;
    global.WebSocket = FakeWebSocket;
    global.window.location = {
      origin: "https://10.12.7.1",
      protocol: "https:",
      host: "10.12.7.1",
      hostname: "10.12.7.1",
    };
    global.document.cookie = "";
  });

  afterEach(() => {
    closeSocket();
    vi.restoreAllMocks();
    global.WebSocket = originalWebSocket;
  });

  it("builds an absolute websocket URL when only a relative path is provided", () => {
    const url = new URL(buildSocketUrl("/ws/online/test-game", "", "secret-token"));

    expect(url.protocol === "ws:" || url.protocol === "wss:").toBe(true);
    expect(url.pathname).toBe("/ws/online/test-game");
    expect(url.searchParams.get("token")).toBe("secret-token");
  });

  it("converts https websocket bases to wss and preserves existing query params", () => {
    const url = buildSocketUrl(
      "/ws/online/test-game?room=alpha",
      "https://10.12.7.1",
      "secret-token"
    );

    expect(url).toBe("wss://10.12.7.1/ws/online/test-game?room=alpha&token=secret-token");
  });

  it("passes an absolute websocket URL to the browser constructor", () => {
    connectSocket("/ws/online/test-game", {
      token: "secret-token",
    });

    const socket = getSocket();
    const url = new URL(socket.url);

    expect(url.protocol === "ws:" || url.protocol === "wss:").toBe(true);
    expect(url.pathname).toBe("/ws/online/test-game");
    expect(url.searchParams.get("token")).toBe("secret-token");
  });
});
