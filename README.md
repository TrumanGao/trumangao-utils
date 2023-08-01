# trumangao-utils

A series of commonly used JavaScript utility functions.

## Install

```bash
npm install trumangao-utils
```

## Usage

```js
import { url2obj } from "trumangao-utils";

const url =
  "https://www.npmjs.com/package/trumangao-utils?name=trumangao-utils&ltypescript=true";
const obj = url2obj(url);

console.log(obj); // { name: "trumangao-utils", typescript: "true" }
```

## API

### getStorage

Read local storage based on the key.

```ts
function getStorage<K extends string>(
  storageType: "sessionStorage" | "localStorage",
  storageKey: K,
): any;
```

### setStorage

Write local storage based on the key.

```ts
function setStorage<K extends string>(
  storageType: "sessionStorage" | "localStorage",
  storageKey: K,
  storageData: any,
): void;
```

### validateValue

Common data format validation for phone, email, and numEnCn (numbers and Chinese characters).

```ts
function validateValue(option: {
  type: "phone" | "email" | "numEnCn";
  value: any;
  required?: boolean;
}): boolean;
```

### checkDataType

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

Download a blob.

```ts
function downloadBlob(blob: Blob, fileName?: string): void;
```

### prefetchAssets

Resource preloading.

```ts
function prefetchAssets(assets: { src: string; type: "img" | "audio" }[]): void;
```

### getCharLength

Calculate the length of a string.

```ts
function getCharLength(str: string): number;
```

### url2obj

Convert a URL to an object with query parameters.

```ts
function url2obj(url?: string): { [key: string]: string };
```

### filterEmptyValue

Filter out empty values in an object, including empty strings, null, and undefined.

```ts
function filterEmptyValue<T extends { [key: string]: any }>(obj: T): Partial<T>;
```

### date2string

Convert a Date object to a standard format string.

```ts
function date2string(option?: {
  date?: Date;
  hasTime?: boolean;
  dateSeparator?: string;
  timeSeparator?: string;
}): string;
```
