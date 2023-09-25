import { EventEmitter } from "events";

export type EventManagerMapType = Map<
  EventEmitter | EventTarget | Window | Document,
  {
    [eventName: string]: {
      [eventListenerKey: string]: (...args: any[]) => void;
    };
  } & {
    [eventNameW in keyof WindowEventMap]?: {
      [eventListenerKey: string]: (...args: any[]) => void;
    };
  } & {
    [eventNameD in keyof DocumentEventMap]?: {
      [eventListenerKey: string]: (...args: any[]) => void;
    };
  }
>;

/**
 * Managing events on window, document, EventTarget or node EventEmitter.
 *
 * The instance exposes the eventManagerMap property and the addEventListener and removeEventListener methods
 * to manage the memory address of the eventListener to avoid memory leaks.
 *
 * window, document 等 EventTarget 和 node EventEmitter 事件管理器。
 *
 * 实例暴露 eventManagerMap 属性和 addEventListener 和 removeEventListener 方法，
 * 用于管理 eventListener 的内存地址，避免内存泄漏
 */
export class EventManager {
  static eventManagerMap: EventManagerMapType = new Map();

  /**
   * @param eventName 与 window.addEventListener 或 document.addEventListener 一致
   * @param eventListener 与 window.addEventListener 或 document.addEventListener 一致
   * @param eventListenerKey eventListener 的唯一标识，removeEventListener 时删除。命名参考: eventEmitter_eventName_fileName_functionName
   * @param eventEmitter "window" | "document"，默认 "window"
   * @example addEventListener("resize", this.handleResize, "window_resize_fileName_handleResize", "window")
   * @example addEventListener("visibilitychange", this.handleVisibilitychange, "document_visibilitychange_fileName_handleVisibilitychange", "document")
   */
  addEventListener(
    eventName: string,
    eventListener: (...args: any[]) => void,
    eventListenerKey: string,
    eventEmitter: EventEmitter,
  ): EventManagerMapType;
  addEventListener(
    eventName: string,
    eventListener: EventListenerOrEventListenerObject,
    eventListenerKey: string,
    eventEmitter: EventTarget,
  ): EventManagerMapType;
  addEventListener(
    eventName: string | keyof WindowEventMap,
    eventListener: (...args: any[]) => void,
    eventListenerKey: string,
    eventEmitter: Window,
  ): EventManagerMapType;
  addEventListener(
    eventName: string | keyof DocumentEventMap,
    eventListener: (...args: any[]) => void,
    eventListenerKey: string,
    eventEmitter: Document,
  ): EventManagerMapType;
  addEventListener(
    eventName: string | keyof WindowEventMap | keyof DocumentEventMap,
    eventListener: (...args: any[]) => void,
    eventListenerKey: string,
    eventEmitter: EventEmitter | EventTarget | Window | Document = window,
  ) {
    if (
      !(eventEmitter instanceof EventTarget) &&
      !(eventEmitter instanceof EventEmitter)
    ) {
      throw new Error("eventEmitter 参数类型错误，无法注册事件侦听器");
    }

    this.removeEventListener(eventName, eventListenerKey, eventEmitter as any);

    if (eventEmitter instanceof EventTarget) {
      eventEmitter.addEventListener(
        eventName,
        eventListener as EventListenerOrEventListenerObject,
      );
    } else if (eventEmitter instanceof EventEmitter) {
      eventEmitter.addListener(
        eventName,
        eventListener as (...args: any[]) => void,
      );
    }

    const eventNameMap = EventManager.eventManagerMap.get(eventEmitter) || {};
    eventNameMap[eventName] = {
      ...eventNameMap?.[eventName],
      [eventListenerKey]: eventListener,
    };
    EventManager.eventManagerMap.set(eventEmitter, eventNameMap);

    console.log(
      `eventManagerMap 新增 ${eventListenerKey}: `,
      EventManager.eventManagerMap,
    );

    return EventManager.eventManagerMap;
  }

  /**
   * @param eventName 与 window.addEventListener 或 document.addEventListener 一致
   * @param eventListenerKey eventListener 的唯一标识，addEventListener 时添加。命名参考: eventEmitter_eventName_fileName_functionName
   * @param eventEmitter "window" | "document"，默认 "window"
   * @example removeEventListener("resize", "window_resize_fileName_handleResize", "window")
   * @example removeEventListener("visibilitychange", "document_visibilitychange_fileName_handleVisibilitychange", "document")
   */
  removeEventListener(
    eventName: string,
    eventListenerKey: string,
    eventEmitter: EventEmitter,
  ): EventManagerMapType | void;
  removeEventListener(
    eventName: string,
    eventListenerKey: string,
    eventEmitter: EventTarget,
  ): EventManagerMapType | void;
  removeEventListener(
    eventName: string | keyof WindowEventMap,
    eventListenerKey: string,
    eventEmitter: Window,
  ): EventManagerMapType | void;
  removeEventListener(
    eventName: string | keyof DocumentEventMap,
    eventListenerKey: string,
    eventEmitter: Document,
  ): EventManagerMapType | void;
  removeEventListener(
    eventName: string | keyof WindowEventMap | keyof DocumentEventMap,
    eventListenerKey: string,
    eventEmitter: EventEmitter | EventTarget | Window | Document = window,
  ) {
    if (
      !(eventEmitter instanceof EventTarget) &&
      !(eventEmitter instanceof EventEmitter)
    ) {
      throw new Error("eventEmitter 参数类型错误，无法移除事件侦听器");
    }

    const eventNameMap = EventManager.eventManagerMap.get(eventEmitter) || {};
    if (
      !(eventNameMap[eventName] && eventNameMap[eventName][eventListenerKey])
    ) {
      return;
    }

    if (eventEmitter instanceof EventTarget) {
      eventEmitter.removeEventListener(
        eventName,
        eventNameMap[eventName][eventListenerKey],
      );
    } else if (eventEmitter instanceof EventEmitter) {
      eventEmitter.removeListener(
        eventName,
        eventNameMap[eventName][eventListenerKey],
      );
    }
    delete eventNameMap[eventName][eventListenerKey];
    EventManager.eventManagerMap.set(eventEmitter, eventNameMap);

    console.log(
      `eventManagerMap 删除 ${eventListenerKey}: `,
      EventManager.eventManagerMap,
    );

    return EventManager.eventManagerMap;
  }
}
