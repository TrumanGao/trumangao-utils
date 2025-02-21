中文 | [English](./README.md)

# trumangao-utils

常用的 JavaScript 工具函数。

## 安装

```bash
npm install trumangao-utils
```

## 文档

```typescript
/**
 * 根据键名读取本地存储。
 * @param storageType - 存储类型 ("sessionStorage" 或 "localStorage")。
 * @param storageKey - 存储数据的键名。
 * @returns 解析后的数据或 null（如果未找到）。
 */
declare function getStorage<D = unknown>(
  storageType: "sessionStorage" | "localStorage",
  storageKey: string,
): D | null;

/**
 * 根据键名写入本地存储。
 * @param storageType - 存储类型 ("sessionStorage" 或 "localStorage")。
 * @param storageKey - 存储数据的键名。
 * @param storageData - 要存储的数据。
 * @warn 如果数据是 undefined 或 null，将被转换为空字符串。
 */
declare function setStorage<K extends string>(
  storageType: "sessionStorage" | "localStorage",
  storageKey: K,
  storageData: any,
): void;

/**
 * 校验常见数据格式。
 * @param option - 校验选项。
 * @param option.type - 要校验的数据类型 ("phone", "email", "numEnCn")。
 * @param option.value - 要校验的值。
 * @param option.required - 是否必填。
 * @returns 如果值有效则返回 true，否则返回 false。
 */
declare function validateValue(option: {
  type: "phone" | "email" | "numEnCn";
  value: any;
  required?: boolean;
}): boolean;

/**
 * 精确判断数据类型。
 * @param data - 要检查的数据。
 * @returns 数据类型的字符串表示。
 */
declare function getDataType(
  data: unknown,
):
  | "Undefined"
  | "Null"
  | "String"
  | "Number"
  | "Boolean"
  | "Symbol"
  | "Function"
  | "Array"
  | "Object"
  | "Date"
  | "RegExp"
  | "Error"
  | "Map"
  | "Set";

/**
 * 下载 Blob 对象。
 * @param blob - 要下载的 Blob 对象。
 * @param fileName - 保存的文件名。
 */
declare function downloadBlob(blob: Blob, fileName?: string): void;

/**
 * 预加载资源，如图片和音频。
 * @param assets - 要预加载的资源。
 */
declare function prefetchAssets(
  assets: {
    src: string;
    type: "img" | "audio";
  }[],
): void;

/**
 * 计算字符串长度，考虑双字节字符。
 * @param str - 要测量的字符串。
 * @returns 字符串的长度。
 */
declare function getCharLength(str: string): number;

/**
 * 将 URL 参数解析为对象。
 * @param url - 要解析的 URL。
 * @returns 包含 URL 参数的对象。
 */
declare function url2obj(url?: string): {
  [key: string]: string;
};

/**
 * 将对象转换为 URL 参数。
 * @param obj - 要转换的对象。
 * @returns URL 参数字符串。
 */
declare function obj2url(obj?: { [key: string]: string }): string;

/**
 * 过滤对象中的空值，包括空字符串、null 和 undefined。
 * @param obj - 要过滤的对象。
 * @returns 过滤后的新对象。
 */
declare function filterEmptyValue<
  T extends {
    [key: string]: any;
  },
>(obj: T): Partial<T>;

/**
 * 将 Date 对象转换为格式化字符串。
 * @param option - 格式化选项。
 * @param option.date - 要格式化的日期。
 * @param option.hasTime - 是否包含时间。
 * @param option.dateSeparator - 日期分隔符。
 * @param option.timeSeparator - 时间分隔符。
 * @returns 格式化的日期字符串。
 */
declare function date2string(option?: {
  date?: Date;
  hasTime?: boolean;
  dateSeparator?: string;
  timeSeparator?: string;
}): string;

/**
 * 检查浏览器是否支持 WebP 图片。这是一个惰性函数。
 * @returns 如果支持 WebP 则返回 true，否则返回 false。
 */
declare let caniuse_webp: () => boolean;

/**
 * 切换浏览器的全屏模式。
 * @param fullscreenOptions - 全屏模式选项。
 * @returns 一个 Promise，解析为 true 表示进入全屏，解析为 false 表示退出全屏。
 */
declare function toggleFullScreen(
  fullscreenOptions?: FullscreenOptions,
): Promise<boolean>;

/**
 * 在失败时重试函数，重试之间有延迟。
 * @param fn - 要重试的函数。如果是异步函数，必须返回 Promise。
 * @param count - 当前重试次数。
 * @param options - 重试选项。
 * @param options.maxCount - 最大重试次数。
 * @param options.delay - 重试之间的延迟（毫秒）。
 * @returns 一个 Promise，解析为函数的结果或在最大重试次数后拒绝。
 */
declare function retryFunction<T>(
  fn: (arg?: any) => Promise<T>,
  count: number,
  options?: {
    maxCount?: number;
    delay?: number;
  },
): Promise<T>;

/**
 * 更准确地确定设备类型，区分移动设备和平板电脑，并添加桌面设备。
 * @returns 设备类型的字符串表示。
 */
declare function getDeviceType():
  | "console"
  | "mobile"
  | "smarttv"
  | "tablet"
  | "wearable"
  | "embedded"
  | "desktop";
```
