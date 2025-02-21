English | [中文](./README.zh.md)

# trumangao-utils

Commonly used JavaScript utility functions.

## Install

```bash
npm install trumangao-utils
```

## Documentation

```typescript
/**
 * Retrieves data from storage by key.
 * @param storageType - The type of storage ("sessionStorage" or "localStorage").
 * @param storageKey - The key of the stored data.
 * @returns The parsed data or null if not found.
 */
declare function getStorage<D = unknown>(
  storageType: "sessionStorage" | "localStorage",
  storageKey: string,
): D | null;

/**
 * Stores data in storage by key.
 * @param storageType - The type of storage ("sessionStorage" or "localStorage").
 * @param storageKey - The key to store the data under.
 * @param storageData - The data to store.
 * @warn If the data is undefined or null, it will be converted to an empty string.
 */
declare function setStorage<K extends string>(
  storageType: "sessionStorage" | "localStorage",
  storageKey: K,
  storageData: any,
): void;

/**
 * Validates common data formats.
 * @param option - The validation options.
 * @param option.type - The type of data to validate ("phone", "email", "numEnCn").
 * @param option.value - The value to validate.
 * @param option.required - Whether the value is required.
 * @returns True if the value is valid, false otherwise.
 */
declare function validateValue(option: {
  type: "phone" | "email" | "numEnCn";
  value: any;
  required?: boolean;
}): boolean;

/**
 * Determines the precise data type of a value.
 * @param data - The data to check.
 * @returns The data type as a string.
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
 * Initiates a download of a Blob object.
 * @param blob - The Blob object to download.
 * @param fileName - The name of the file to save as.
 */
declare function downloadBlob(blob: Blob, fileName?: string): void;

/**
 * Preloads assets such as images and audio.
 * @param assets - The assets to preload.
 */
declare function prefetchAssets(
  assets: {
    src: string;
    type: "img" | "audio";
  }[],
): void;

/**
 * Calculates the length of a string, considering double-byte characters.
 * @param str - The string to measure.
 * @returns The length of the string.
 */
declare function getCharLength(str: string): number;

/**
 * Parses URL parameters into an object.
 * @param url - The URL to parse.
 * @returns An object containing the URL parameters.
 */
declare function url2obj(url?: string): {
  [key: string]: string;
};

/**
 * Converts an object to URL parameters.
 * @param obj - The object to convert.
 * @returns A string of URL parameters.
 */
declare function obj2url(obj?: { [key: string]: string }): string;

/**
 * Filters out empty values from an object, including empty strings, null, and undefined.
 * @param obj - The object to filter.
 * @returns A new object with empty values removed.
 */
declare function filterEmptyValue<
  T extends {
    [key: string]: any;
  },
>(obj: T): Partial<T>;

/**
 * Converts a Date object to a formatted string.
 * @param option - The formatting options.
 * @param option.date - The date to format.
 * @param option.hasTime - Whether to include the time.
 * @param option.dateSeparator - The separator for the date.
 * @param option.timeSeparator - The separator for the time.
 * @returns The formatted date string.
 */
declare function date2string(option?: {
  date?: Date;
  hasTime?: boolean;
  dateSeparator?: string;
  timeSeparator?: string;
}): string;

/**
 * Checks if the browser supports WebP images. This is a lazy function.
 * @returns True if WebP is supported, false otherwise.
 */
declare let caniuse_webp: () => boolean;

/**
 * Toggles the browser's fullscreen mode.
 * @param fullscreenOptions - The options for fullscreen mode.
 * @returns A promise that resolves to true if entering fullscreen, false if exiting.
 */
declare function toggleFullScreen(
  fullscreenOptions?: FullscreenOptions,
): Promise<boolean>;

/**
 * Retries a function upon failure, with a delay between attempts.
 * @param fn - The function to retry. If asynchronous, it must return a Promise.
 * @param count - The current retry count.
 * @param options - The retry options.
 * @param options.maxCount - The maximum number of retries.
 * @param options.delay - The delay between retries in milliseconds.
 * @returns A promise that resolves to the function's result or rejects after max retries.
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
 * Determines the device type more accurately by distinguishing between mobile and tablet, and adding desktop.
 * @returns The device type as a string.
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
