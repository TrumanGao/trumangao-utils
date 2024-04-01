/**
 * 根据键名读取本地存储
 */
export function getStorage<K extends string>(
  storageType: "sessionStorage" | "localStorage",
  storageKey: K,
) {
  const storage = window[storageType].getItem(storageKey);
  if (storage) {
    try {
      return JSON.parse(storage);
    } catch (error) {
      return storage;
    }
  } else {
    return "";
  }
}

/**
 * 根据键名写入本地存储
 * @warn 如果是 undefined 或 null，转换为空字符串，否则会保存为 "undefined" 或 "null"
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
 * 常见数据格式校验
 * phone 手机号
 * email 邮箱
 * numEnCn 数字及中英文
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
      throw new Error("请传入正确的校验类型参数");
  }
}

/**
 * 精准判断数据类型，返回类型字符串
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
 * 下载blob
 */
export function downloadBlob(blob: Blob, fileName = "下载文件") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * 资源预加载
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
 * 计算字符串长度
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
 * 获取URL的参数
 */
export function url2obj(url: string = window.location.search) {
  const obj: { [key: string]: string } = {};
  const queryStr = url.split("?")[1];

  queryStr?.split("&").map((qstr) => {
    const [key, val] = qstr.split("=");
    obj[key] = decodeURIComponent(val);
  });
  return obj;
}

/**
 * 对象转URL参数
 */
export function obj2url(obj: { [key: string]: string } = {}) {
  let url = "?";
  Object.keys(obj).map((key) => {
    url += `${key}=${encodeURIComponent(obj[key])}&`;
  });
  return url.slice(0, url.length - 1);
}

/**
 * 过滤对象中的空值，包括空字符串、null、undefined
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
 * Date类型数据 转 时间标准格式字符串
 */
export function date2string(
  option: {
    date?: Date;
    hasTime?: boolean; // 是否包含时分秒
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
 * 检测 webp 支持性，惰性函数
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
 * 切换浏览器全屏/非全屏
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
 * 重试，捕获到异常时递归调用
 * @fn 需要重试执行的函数。如果是异步函数，必须返回Promise，否则无法串行重试
 * @count 递归次数，首次调用时传入0
 * @options
 * @property maxCount 最大重试次数，默认3
 * @property delay 重试间隔，默认500ms
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
