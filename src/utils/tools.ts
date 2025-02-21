import { UAParser } from "ua-parser-js";

/**
 * Retrieves data from storage by key.
 * @param storageType - The type of storage ("sessionStorage" or "localStorage").
 * @param storageKey - The key of the stored data.
 * @returns The parsed data or null if not found.
 */
export function getStorage<D = unknown>(
  storageType: "sessionStorage" | "localStorage",
  storageKey: string,
): D | null {
  const storage = window[storageType].getItem(storageKey) as D;
  if (storage) {
    try {
      return JSON.parse(storage as any);
    } catch (error) {
      return storage;
    }
  } else {
    return null;
  }
}

/**
 * Stores data in storage by key.
 * @param storageType - The type of storage ("sessionStorage" or "localStorage").
 * @param storageKey - The key to store the data under.
 * @param storageData - The data to store.
 * @warn If the data is undefined or null, it will be converted to an empty string.
 */
export function setStorage<K extends string>(
  storageType: "sessionStorage" | "localStorage",
  storageKey: K,
  storageData: any,
) {
  let _storageData;

  switch (getDataType(storageData)) {
    case "Undefined":
    case "Null":
      _storageData = "";
      break;
    case "String":
      _storageData = storageData;
      break;
    default:
      _storageData = JSON.stringify(storageData);
      break;
  }

  window[storageType].setItem(storageKey, _storageData);
}

/**
 * Validates common data formats.
 * @param option - The validation options.
 * @param option.type - The type of data to validate ("phone", "email", "numEnCn").
 * @param option.value - The value to validate.
 * @param option.required - Whether the value is required.
 * @returns True if the value is valid, false otherwise.
 */
export function validateValue(option: {
  type: "phone" | "email" | "numEnCn";
  value: any;
  required?: boolean;
}) {
  if (
    option.required &&
    (getDataType(option.value) === "Undefined" ||
      getDataType(option.value) === "Null" ||
      option.value === "")
  ) {
    return false;
  }

  switch (option.type) {
    case "phone":
      return /^1[0-9]{10}$/.test(option.value);
    case "email":
      return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(option.value);
    case "numEnCn":
      return /^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(option.value);
    default:
      throw new Error("Please provide a valid validation type.");
  }
}

/**
 * Determines the precise data type of a value.
 * @param data - The data to check.
 * @returns The data type as a string.
 */
export function getDataType(
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
  | "Set" {
  let _dataType;

  if (typeof data === "undefined") {
    _dataType = "Undefined";
  } else if (data === null) {
    _dataType = "Null";
  } else {
    const typeStr = Object.prototype.toString.call(data);
    _dataType = typeStr.slice(8, typeStr.length - 1);
  }

  return _dataType;
}

/**
 * Initiates a download of a Blob object.
 * @param blob - The Blob object to download.
 * @param fileName - The name of the file to save as.
 */
export function downloadBlob(blob: Blob, fileName = "download") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * Preloads assets such as images and audio.
 * @param assets - The assets to preload.
 */
export function prefetchAssets(
  assets: { src: string; type: "img" | "audio" }[],
) {
  assets.map((asset) => {
    switch (asset.type) {
      case "img":
        const imageElement = new Image();
        imageElement.src = asset.src;
        break;
      case "audio":
        const audioElement = new Audio();
        audioElement.src = asset.src;
        break;
      default:
        break;
    }
  });
}

/**
 * Calculates the length of a string, considering double-byte characters.
 * @param str - The string to measure.
 * @returns The length of the string.
 */
export function getCharLength(str: string) {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      length += 1;
    } else {
      length += 2;
    }
  }
  return length;
}

/**
 * Parses URL parameters into an object.
 * @param url - The URL to parse.
 * @returns An object containing the URL parameters.
 */
export function url2obj(url: string = window.location.search) {
  const obj: { [key: string]: string } = {};
  const queryStr = url.split("?")[1];

  queryStr?.split("&").map((qstr) => {
    const [key, val] = qstr.split("=");
    obj[decodeURIComponent(key)] = decodeURIComponent(val);
  });
  return obj;
}

/**
 * Converts an object to URL parameters.
 * @param obj - The object to convert.
 * @returns A string of URL parameters.
 */
export function obj2url(obj: { [key: string]: string } = {}) {
  let url = "?";
  Object.keys(obj).map((key) => {
    url += `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}&`;
  });
  return url.slice(0, url.length - 1);
}

/**
 * Filters out empty values from an object, including empty strings, null, and undefined.
 * @param obj - The object to filter.
 * @returns A new object with empty values removed.
 */
export function filterEmptyValue<T extends { [key: string]: any }>(
  obj: T,
): Partial<T> {
  const newObj: Partial<T> = { ...obj };
  Object.keys(newObj).map((key) => {
    const value = newObj[key as keyof T];
    if (value === "" || value === null || value === undefined) {
      delete newObj[key as keyof T];
    }
  });
  return newObj;
}

/**
 * Converts a Date object to a formatted string.
 * @param option - The formatting options.
 * @param option.date - The date to format.
 * @param option.hasTime - Whether to include the time.
 * @param option.dateSeparator - The separator for the date.
 * @param option.timeSeparator - The separator for the time.
 * @returns The formatted date string.
 */
export function date2string(
  option: {
    date?: Date;
    hasTime?: boolean;
    dateSeparator?: string;
    timeSeparator?: string;
  } = {},
) {
  const {
    date = new Date(),
    hasTime = true,
    dateSeparator = "/",
    timeSeparator = ":",
  } = option;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let formatStr = [year, month, day]
    .map((n) => (n.toString()[1] ? n : `0${n}`))
    .join(dateSeparator);

  if (hasTime) {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    formatStr = `${formatStr} ${[hour, minute, second]
      .map((n) => (n.toString()[1] ? n : `0${n}`))
      .join(timeSeparator)}`;
  }

  return formatStr; // YYYY/MM/DD hh:mm:ss
}

/**
 * Checks if the browser supports WebP images. This is a lazy function.
 * @returns True if WebP is supported, false otherwise.
 */
export let caniuse_webp = () => {
  const caniuse =
    document
      .createElement("canvas")
      ?.toDataURL("image/webp")
      .indexOf("data:image/webp") === 0;

  caniuse_webp = () => {
    return caniuse;
  };

  return caniuse;
};

/**
 * Toggles the browser's fullscreen mode.
 * @param fullscreenOptions - The options for fullscreen mode.
 * @returns A promise that resolves to true if entering fullscreen, false if exiting.
 */
export function toggleFullScreen(fullscreenOptions?: FullscreenOptions) {
  if (!document.fullscreenEnabled) {
    throw new Error(
      "Fullscreen feature not being allowed, or fullscreen mode not being supported.",
    );
  }

  return document.fullscreenElement
    ? document?.exitFullscreen?.().then(() => false)
    : document.documentElement
        .requestFullscreen(fullscreenOptions)
        .then(() => true);
}

/**
 * Retries a function upon failure, with a delay between attempts.
 * @param fn - The function to retry. If asynchronous, it must return a Promise.
 * @param count - The current retry count.
 * @param options - The retry options.
 * @param options.maxCount - The maximum number of retries.
 * @param options.delay - The delay between retries in milliseconds.
 * @returns A promise that resolves to the function's result or rejects after max retries.
 */
export async function retryFunction<T>(
  fn: (arg?: any) => Promise<T>,
  count: number,
  options: {
    maxCount?: number;
    delay?: number;
  } = {},
): Promise<T> {
  const { maxCount = 3, delay = 500 } = options;

  try {
    const result = await fn();
    return result;
  } catch (error) {
    if (count < maxCount) {
      return new Promise((resolve) =>
        setTimeout(() => resolve(retryFunction(fn, count + 1, options)), delay),
      );
    } else {
      throw error;
    }
  }
}

/**
 * Determines the device type more accurately by distinguishing between mobile and tablet, and adding desktop.
 * @returns The device type as a string.
 */
export function getDeviceType() {
  const uaResult = new UAParser().getResult();
  const deviceType = uaResult.device.type as
    | "console"
    | "mobile"
    | "tablet"
    | "smarttv"
    | "wearable"
    | "embedded";
  let _deviceType: typeof deviceType | "desktop";

  const isMobileSize = Math.min(window.innerWidth, window.innerHeight) < 450;
  // 1920x1080 HD
  // 1366x768 Standard
  const isDesktopSize = Math.min(window.innerWidth, window.innerHeight) > 1366;
  const isTouchable = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  switch (deviceType) {
    case "console":
    case "smarttv":
    case "wearable":
    case "embedded":
      _deviceType = deviceType;
      break;
    case "mobile":
    case "tablet":
      _deviceType = isMobileSize ? "mobile" : "tablet";
      break;
    default:
      if (isDesktopSize || !isTouchable) {
        _deviceType = "desktop";
      } else if (isMobileSize) {
        _deviceType = "mobile";
      } else {
        _deviceType = "tablet";
      }
      break;
  }

  return _deviceType;
}
