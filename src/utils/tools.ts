import isNull from "lodash.isnull";

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
 */
export function setStorage<K extends string>(
  storageType: "sessionStorage" | "localStorage",
  storageKey: K,
  storageData: any,
) {
  if (typeof storageData === "string") {
    window[storageType].setItem(storageKey, storageData);
  } else {
    window[storageType].setItem(storageKey, JSON.stringify(storageData));
  }
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
    (isNull(option.value) ||
      typeof option.value === "undefined" ||
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
export function checkDataType(
  data: unknown,
):
  | "String"
  | "Number"
  | "Boolean"
  | "Undefined"
  | "Null"
  | "Symbol"
  | "Function"
  | "Array"
  | "Object"
  | "Date"
  | "RegExp"
  | "Error"
  | "Map"
  | "Set" {
  const typeStr = Object.prototype.toString.call(data);
  return typeStr.slice(8, typeStr.length - 1);
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
 * 计算字符长度
 */
export function computedStrLen(str: string) {
  // 获取字符串长度
  let maxLen = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      maxLen++;
    } else {
      maxLen += 2;
    }
  }
  return maxLen;
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
  console.log("url参数解析为：", obj);
  return obj;
}
