import * as CryptoJS from "crypto-js";

/**
 * @param key 自定义字符串，创建实例时会自动加上后缀 suffix ，并转化为32位的md5字符串
 * @param iv 自定义字符串，创建实例时会自动加上后缀 suffix ，并转化为32位的md5字符串
 * @param suffix 自定义字符串，key和iv的后缀，默认为"0"
 */
export class CryptoManager {
  rawKey: string | number;
  rawIv: string | number;
  rawSuffix: string | number;
  key: CryptoJS.lib.WordArray;
  iv: CryptoJS.lib.WordArray;

  constructor({
    key,
    iv,
    suffix = "0",
  }: {
    key: string | number;
    iv: string | number;
    suffix?: string | number;
  }) {
    this.rawKey = key;
    this.rawIv = iv;
    this.rawSuffix = suffix;
    this.key = CryptoJS.MD5(`${this.rawKey}_${this.rawSuffix}`);
    this.iv = CryptoJS.MD5(`${this.rawIv}_${this.rawSuffix}`);
  }

  /**
   * AES 加密
   */
  encryptAes(message: string | CryptoJS.lib.WordArray) {
    const ciphertext = CryptoJS.AES.encrypt(message, this.key, {
      iv: this.iv,
    }).toString();
    return ciphertext;
  }

  /**
   * AES 解密
   */
  decryptAes(ciphertext: string | CryptoJS.lib.CipherParams) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.key, {
      iv: this.iv,
    }).toString(CryptoJS.enc.Utf8);
    return bytes;
  }

  /**
   * HmacSHA1 加密
   * @param message — The message to hash.
   * @param key — The secret key.
   */
  encryptHmacSHA1(message: string | CryptoJS.lib.WordArray) {
    const ciphertext = CryptoJS.HmacSHA1(message, this.key).toString();
    return ciphertext;
  }

  /**
   * HmacMD5 加密
   * @param message — The message to hash.
   * @param key — The secret key.
   */
  encryptHmacMD5(message: string | CryptoJS.lib.WordArray) {
    const ciphertext = CryptoJS.HmacMD5(message, this.key).toString();
    return ciphertext;
  }

  /**
   * 生成随机数
   * @param nBytes — The number of random bytes to generate.
   */
  getRandom(nBytes: number) {
    const wordArray = CryptoJS.lib.WordArray.random(nBytes);
    return CryptoJS.enc.Hex.stringify(wordArray);
  }
}
