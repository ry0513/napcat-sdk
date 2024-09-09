import { EventEmitter } from "events";
import { AllHandlers } from "./Interfaces.js";

export class Events extends EventEmitter {
  _events: { [key in keyof AllHandlers]?: Function[] | Function };

  constructor() {
    super({ captureRejections: true });
    this._events = {};
    this.setMaxListeners(0);
  }

  emit<T extends keyof AllHandlers>(type: T, context: AllHandlers[T]): boolean {
    const handlers = this._events[type];
    // 已注册
    if (handlers) {
      if (typeof handlers === "function") {
        // 单个
        handlers(context);
      } else {
        // 多个
        for (let i = 0; i < handlers.length; i++) {
          handlers[i](context);
        }
      }
    }

    // 触发总类
    const indexOf = type.lastIndexOf(".");
    if (indexOf > 0) return this.emit(type.slice(0, indexOf) as T, context);

    return true;
  }
}
