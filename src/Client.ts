import WebSocket from "isomorphic-ws";
import {
  AllHandlers,
  EventHandle,
  Options,
  WSReconnection,
} from "./Interfaces.js";
import { Events } from "./Events.js";

export class createClient {
  baseUrl: string;
  accessToken: string;
  socket?: WebSocket;
  events: Events;
  reconnection: WSReconnection;

  constructor(options: Options) {
    this.baseUrl = options.baseUrl;
    this.accessToken = options.accessToken || "";
    this.reconnection = { nowAttempts: 1 };
    this.events = new Events();
  }

  test() {
    return new Promise<{ status: boolean; message: string }>((resolve) => {
      const socket = new WebSocket(
        `${this.baseUrl}/event?access_token=${this.accessToken}`
      );
      socket.onmessage = (event) => {
        const json = JSON.parse(event.data.toString());
        if (
          json.post_type === "meta_event" &&
          json.meta_event_type === "lifecycle" &&
          json.sub_type === "connect"
        ) {
          socket.close(1000);
          resolve({ status: true, message: "连接成功" });
        } else if (json.message === "token验证失败") {
          resolve({ status: false, message: json.message });
        }
      };
      socket.onerror = (event) => {
        resolve({ status: false, message: event.message });
      };
    });
  }

  connect() {
    this.socket = new WebSocket(
      `${this.baseUrl}/event?access_token=${this.accessToken}`
    );
    // 打开
    this.socket.onopen = () => {
      this.events.emit("socket.open", {
        type: "open",
        reconnection: this.reconnection,
      });
    };
    // 关闭
    this.socket.onclose = (event) => {
      this.events.emit("socket.close", {
        type: "close",
        code: event.code,
        reason: event.reason,
        reconnection: this.reconnection,
      });
      this.socket = undefined;
    };
    // 错误
    this.socket.onerror = (event) => {
      event.error.type = "error";
      event.error.reconnection = this.reconnection;
      this.events.emit("socket.error", event.error);
    };
    // 消息
    this.socket.onmessage = (event) => {
      const json = JSON.parse(event.data.toString());
      console.log(json);

      if (
        json.post_type === "meta_event" &&
        json.meta_event_type === "lifecycle" &&
        json.sub_type === "connect"
      ) {
        this.events.emit("socket.success", {
          type: "success",
          reconnection: this.reconnection,
        });
      }
    };
  }

  /**
   * 注册监听方法
   * @param event
   * @param handle
   */
  on<T extends keyof AllHandlers>(event: T, handle: EventHandle<T>) {
    this.events.on(event, handle);
    return this;
  }
  /**
   * 只执行一次
   * @param event
   * @param handle
   */
  once<T extends keyof AllHandlers>(event: T, handle: EventHandle<T>) {
    this.events.once(event, handle);
    return this;
  }

  /**
   * 解除监听方法
   * @param event
   * @param handle
   */
  off<T extends keyof AllHandlers>(event: T, handle: EventHandle<T>) {
    this.events.off(event, handle);
    return this;
  }
}
