export interface Options {
  baseUrl: string;
  accessToken?: string;
}

// ============= Websocket =============
export interface WSReconnection {
  // enable: boolean;
  // attempts: number;
  // delay: number;
  nowAttempts: number;
}

export interface WSOpenRes {
  type: "open";
  reconnection: WSReconnection;
}
export interface WSCloseRes {
  type: "close";
  code: number;
  reason: string;
  reconnection: WSReconnection;
}
export interface WSErrorRes {
  type: "error";
  reconnection: WSReconnection;
}
export interface WSSuccessRes {
  type: "success";
  reconnection: WSReconnection;
}

export interface SocketHandler {
  "socket.open": WSOpenRes;
  "socket.close": WSCloseRes;
  "socket.error": WSErrorRes;
  "socket.success": WSSuccessRes;
  socket: WSOpenRes | WSCloseRes | WSErrorRes | WSSuccessRes;
}

export type AllHandlers = SocketHandler;

export type EventHandle<T extends keyof AllHandlers> = (
  context: AllHandlers[T]
) => any;
