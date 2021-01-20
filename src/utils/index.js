/**
 * @method 工具函数
 */
module.exports = {
  /**
   * 根据键名读取本地存储
   * @param {string} key 本地存储的键名
   * @returns {*} 返回的数据
   */
  getStorage(key) {
    if (localStorage && localStorage.getItem) {
      let storage = localStorage.getItem(key);
      if (storage) {
        try {
          return JSON.parse(storage);
        } catch (error) {
          return storage;
        }
      } else {
        return "";
      }
    } else {
      // 不支持本地存储
      return false;
    }
  },
  /**
   * 根据键名写入本地存储
   * @param {string} key 本地存储的键名
   * @param {*} data 写入的数据
   */
  setStorage(key, data) {
    if (!localStorage || !localStorage.setItem) {
      return;
    }
    if (checkDataType(data) === "String") {
      localStorage.setItem(key, data);
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
  },
  /**
   * 下载blob文件
   * @param {boolean} blob
   * @param {string} fileName
   * @returns {Promise}
   */
  downloadBlob(blob, fileName = "下载文件") {
    const type = checkDataType(blob);
    if (type === "Blob") {
      try {
        if (window.navigator.msSaveOrOpenBlob) {
          // IE 浏览器
          navigator.msSaveBlob(blob, fileName);
        } else {
          // 谷歌浏览器
          let a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(blob);
        }
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject({ type, message: "文件不是blob类型" });
    }
  }
};
