[Toc]

# trumangao-utils

常用JavaScript工具函数

A series of commonly used JavaScript utility functions. Here for the [API](https://github.com/TrumanGao/trumangao-utils#API).

## Install

```bash
npm install trumangao-utils
```

## Usage

```ts
import { url2obj } from "trumangao-utils";

const url =
  "https://www.npmjs.com/package/trumangao-utils?name=trumangao-utils&ltypescript=true";
const obj = url2obj(url);

console.log(obj); // { name: "trumangao-utils", typescript: "true" }
```

## API

### CryptoManager

管理字符的加密/解密，基于 crypto-js

Manage the encryption/decryption of characters, based on crypto-js.

```ts
// encryption
import { CryptoManager } from "trumangao-utils";

const cryptoManager = new CryptoManager({
  key: "test_key",
  iv: "test_iv",
  suffix: "test_suffix", // optional
});

const encrypted = cryptoManager.encryptAes("this is a test string");
```

```ts
// decryption
import { CryptoManager } from "trumangao-utils";

const cryptoManager = new CryptoManager({
  key: "test_key",
  iv: "test_iv",
  suffix: "test_suffix", // optional
});

const decrypted = cryptoManager.decryptAes(encrypted);

console.log(decrypted); // "this is a test string"
```

### getStorage

根据键名读取本地存储

Read local storage based on the key.

```ts
function getStorage<K extends string>(
  storageType: "sessionStorage" | "localStorage",
  storageKey: K,
): any;
```

### setStorage

根据键名写入本地存储

Write local storage based on the key.

```ts
function setStorage<K extends string>(
  storageType: "sessionStorage" | "localStorage",
  storageKey: K,
  storageData: any,
): void;
```

### validateValue

常见数据格式校验

Common data format validation for phone, email, and numEnCn (numbers and Chinese characters).

```ts
function validateValue(option: {
  type: "phone" | "email" | "numEnCn";
  value: any;
  required?: boolean;
}): boolean;
```

### checkDataType

精准判断数据类型，返回类型字符串

Precisely determine the data type and return the type string.

```ts
function checkDataType(
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
  | "Set";
```

### downloadBlob

下载blob

Download a blob.

```ts
function downloadBlob(blob: Blob, fileName?: string): void;
```

### prefetchAssets

资源预加载

Resource preloading.

```ts
function prefetchAssets(assets: { src: string; type: "img" | "audio" }[]): void;
```

### getCharLength

计算字符串长度

Calculate the length of a string.

```ts
function getCharLength(str: string): number;
```

### url2obj

获取URL的参数

Convert a URL to an object with query parameters.

```ts
function url2obj(url?: string): { [key: string]: string };
```

### filterEmptyValue

过滤对象中的空值，包括空字符串、null、undefined

Filter out empty values in an object, including empty strings, null, and undefined.

```ts
function filterEmptyValue<T extends { [key: string]: any }>(obj: T): Partial<T>;
```

### date2string

Date类型数据 转 时间标准格式字符串

Convert a Date object to a standard format string.

```ts
function date2string(option?: {
  date?: Date;
  hasTime?: boolean;
  dateSeparator?: string;
  timeSeparator?: string;
}): string;
```

### caniuse_webp

检测 webp 支持性，惰性函数

Detect webp support, lazy function

```ts
function caniuse_webp(): boolean;
```
