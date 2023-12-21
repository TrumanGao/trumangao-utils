import { EventEmitter } from "events";

export type EventManagerMapType = Map<
  Window | Document | EventTarget | EventEmitter,
  {
    [eventName in keyof WindowEventMap]?: {
      [eventListenerKey: string]: EventListenerOrEventListenerObject;
    };
  } & {
    [eventName in keyof DocumentEventMap]?: {
      [eventListenerKey: string]: EventListenerOrEventListenerObject;
    };
  } & {
    [eventName: string]: {
      [eventListenerKey: string]: (...args: any[]) => void;
    };
  }
>;

/**
 * Managing events on window, document, EventTarget(Web), EventEmitter(Node).
 * The instance exposes the eventManagerMap property and addEventListener / removeEventListener methods
 * to manage the memory address of the eventListener on the purpose of avoiding memory leaks.
 *
 * window, document, EventTarget(Web), EventEmitter(Node) 事件侦听管理器。
 * 实例暴露 eventManagerMap 属性和 addEventListener / removeEventListener 方法，
 * 用于管理 eventListener 的内存地址，避免内存泄漏
 */
export class EventManager {
  /**
   * @example { Window: { resize: { window_resize_handleResize: handleResize } }
   */
  static eventManagerMap: EventManagerMapType = new Map();

  /**
   * @param eventName 事件名称。WindowEventMap / DocumentEventMap / 其他 EventTarget 或 EventEmitter 支持监听的事件
   * @param eventListener EventTarget / EventEmitter 支持的事件侦听器
   * @param eventListenerKey eventListener 的唯一标识，removeEventListener 时删除。命名参考: eventEmitter_eventName_functionName
   * @param eventEmitter Window / Document / EventTarget / EventEmitter, 默认 Window
   * @example addEventListener("resize", handleResize, "window_resize_handleResize", Window)
   */
  addEventListener(
    eventName: keyof WindowEventMap,
    eventListener: EventListenerOrEventListenerObject,
    eventListenerKey: string,
    eventEmitter: Window,
  ): EventManagerMapType;
  addEventListener(
    eventName: keyof DocumentEventMap,
    eventListener: EventListenerOrEventListenerObject,
    eventListenerKey: string,
    eventEmitter: Document,
  ): EventManagerMapType;
  addEventListener(
    eventName: string,
    eventListener: (...args: any[]) => void,
    eventListenerKey: string,
    eventEmitter: EventTarget | EventEmitter,
  ): EventManagerMapType;
  addEventListener(
    eventName: keyof WindowEventMap | keyof DocumentEventMap | string,
    eventListener: (...args: any[]) => void,
    eventListenerKey: string,
    eventEmitter: Window | Document | EventTarget | EventEmitter = window,
  ) {
    if (
      !(
        eventEmitter instanceof EventTarget ||
        eventEmitter instanceof EventEmitter
      )
    ) {
      throw new Error("参数 eventEmitter 类型错误，无法注册事件侦听器");
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

    // console.log(
    //   `eventManagerMap 新增 ${eventListenerKey}: `,
    //   eventNameMap[eventName][eventListenerKey],
    // );

    return EventManager.eventManagerMap;
  }

  /**
   * @param eventName 事件名称。WindowEventMap / DocumentEventMap / 其他 EventTarget 或 EventEmitter 支持监听的事件
   * @param eventListenerKey eventListener 的唯一标识，removeEventListener 时删除。命名参考: eventEmitter_eventName_functionName
   * @param eventEmitter Window / Document / EventTarget / EventEmitter, 默认 Window
   * @example removeEventListener("resize", "window_resize_fileName_handleResize", "window")
   * @example addEventListener("resize", handleResize, "window_resize_handleResize", Window)
   */
  removeEventListener(
    eventName: keyof WindowEventMap,
    eventListenerKey: string,
    eventEmitter: Window,
  ): EventManagerMapType | void;
  removeEventListener(
    eventName: keyof DocumentEventMap,
    eventListenerKey: string,
    eventEmitter: Document,
  ): EventManagerMapType | void;
  removeEventListener(
    eventName: string,
    eventListenerKey: string,
    eventEmitter: EventTarget | EventEmitter,
  ): EventManagerMapType | void;
  removeEventListener(
    eventName: keyof WindowEventMap | keyof DocumentEventMap | string,
    eventListenerKey: string,
    eventEmitter: Window | Document | EventTarget | EventEmitter = window,
  ) {
    if (
      !(
        eventEmitter instanceof EventTarget ||
        eventEmitter instanceof EventEmitter
      )
    ) {
      throw new Error("参数 eventEmitter 类型错误，无法移除事件侦听器");
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

    // console.log(
    //   `eventManagerMap 删除 ${eventListenerKey}: `,
    //   eventNameMap[eventName],
    // );

    return EventManager.eventManagerMap;
  }
}
