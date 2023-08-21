import cryptoJS from "crypto-js";

export class CryptoJS {
  key: cryptoJS.lib.WordArray;
  iv: cryptoJS.lib.WordArray;

  constructor(key: string, iv: string) {
    this.key = cryptoJS.enc.Utf8.parse(key);
    this.iv = cryptoJS.enc.Utf8.parse(iv);
  }

  /**
   * AES 加密
   */
  aesEncrypt(message: string | cryptoJS.lib.WordArray) {
    const ciphertext = cryptoJS.AES.encrypt(message, this.key, {
      iv: this.iv,
    }).toString();
    return encodeURIComponent(ciphertext);
  }

  /**
   * AES 解密
   */
  aesDecrypt(ciphertext: string | cryptoJS.lib.CipherParams) {
    const bytes = cryptoJS.AES.decrypt(ciphertext, this.key, {
      iv: this.iv,
    }).toString(cryptoJS.enc.Utf8);
    return decodeURIComponent(bytes);
  }

  /**
   * HmacSHA1 加密
   * @param message — The message to hash.
   * @param key — The secret key.
   */
  HmacSHA1Encode(message: string | cryptoJS.lib.WordArray) {
    return cryptoJS.HmacSHA1(message, this.key).toString();
  }

  /**
   * 生成随机数
   * @param nBytes — The number of random bytes to generate.
   */
  getRandom(nBytes: number) {
    const wordArray = cryptoJS.lib.WordArray.random(nBytes);
    return cryptoJS.enc.Hex.stringify(wordArray);
  }
}
