export interface EventListenerMapInterface {
  window: {
    [type: string]: {
      [listenerKey: string]: EventListenerOrEventListenerObject;
    };
  };
  document: {
    [type: string]: {
      [listenerKey: string]: EventListenerOrEventListenerObject;
    };
  };
}

/**
 * window eventListener 和 document eventListener 管理类
 *
 * 实例暴露 addEventListener 和 removeEventListener 方法
 */
export class EventListener {
  /**
   * parent => type => listenerKey => listener 映射关系
   *
   * 用于保存 listener 的内存地址，方便管理 listener，避免内存泄漏
   */
  eventListenerMap: EventListenerMapInterface = {
    window: {},
    document: {},
  };

  /**
   * @param type 与 window.addEventListener 或 document.addEventListener 一致
   * @param listener 与 window.addEventListener 或 document.addEventListener 一致
   * @param listenerKey listener 的唯一标识，removeEventListener 时删除。命名参考: parent_type_fileName_functionName
   * @param parent "window" | "document"，默认 "window"
   * @example addEventListener("resize", this.handleResize, "window_resize_fileName_handleResize", "window")
   * @example addEventListener("visibilitychange", this.handleVisibilitychange, "document_visibilitychange_fileName_handleVisibilitychange", "document")
   */
  addEventListener(
    type: keyof WindowEventMap,
    listener: EventListenerOrEventListenerObject,
    listenerKey: string,
    parent?: "window",
  ): EventListenerMapInterface;
  addEventListener(
    type: keyof DocumentEventMap,
    listener: EventListenerOrEventListenerObject,
    listenerKey: string,
    parent: "document",
  ): EventListenerMapInterface;
  addEventListener(
    type: keyof WindowEventMap | keyof DocumentEventMap,
    listener: EventListenerOrEventListenerObject,
    listenerKey: string,
    parent: "window" | "document" = "window",
  ) {
    if (parent === "window") {
      this.removeEventListener(
        type as keyof WindowEventMap,
        listenerKey,
        parent,
      );
      window.addEventListener(type, listener);
    } else if (parent === "document") {
      this.removeEventListener(
        type as keyof DocumentEventMap,
        listenerKey,
        parent,
      );
      document.addEventListener(type, listener);
    } else {
      throw new Error("parent 参数错误，仅支持 window 和 document");
    }
    this.eventListenerMap[parent][type] = {
      ...this.eventListenerMap[parent][type],
      [listenerKey]: listener,
    };

    console.log(
      `eventListenerMap 新增 ${listenerKey}: `,
      this.eventListenerMap,
    );

    return this.eventListenerMap;
  }

  /**
   * @param type 与 window.addEventListener 或 document.addEventListener 一致
   * @param listenerKey listener 的唯一标识，addEventListener 时添加。命名参考: parent_type_fileName_functionName
   * @param parent "window" | "document"，默认 "window"
   * @example removeEventListener("resize", "window_resize_fileName_handleResize", "window")
   * @example removeEventListener("visibilitychange", "document_visibilitychange_fileName_handleVisibilitychange", "document")
   */
  removeEventListener(
    type: keyof WindowEventMap,
    listenerKey: string,
    parent?: "window",
  ): false | EventListenerMapInterface;
  removeEventListener(
    type: keyof DocumentEventMap,
    listenerKey: string,
    parent: "document",
  ): false | EventListenerMapInterface;
  removeEventListener(
    type: keyof WindowEventMap | keyof DocumentEventMap,
    listenerKey: string,
    parent: "window" | "document" = "window",
  ) {
    if (
      !this.eventListenerMap[parent][type] ||
      !this.eventListenerMap[parent][type][listenerKey]
    ) {
      return false;
    }

    if (parent === "window") {
      window.removeEventListener(
        type,
        this.eventListenerMap[parent][type][listenerKey],
      );
    } else if (parent === "document") {
      document.removeEventListener(
        type,
        this.eventListenerMap[parent][type][listenerKey],
      );
    } else {
      throw new Error("parent 参数错误，仅支持 window 和 document");
    }
    delete this.eventListenerMap[parent][type][listenerKey];

    console.log(
      `eventListenerMap 删除 ${listenerKey}: `,
      this.eventListenerMap,
    );

    return this.eventListenerMap;
  }
}
