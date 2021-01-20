/**
 * @method 对象/URL数据处理
 */
module.exports = {
  /**
   * 删除对象中的空值属性
   * @param {object} obj
   * @returns {object}
   */
  deleteEmptyProperty(obj = {}) {
    let tempObj = {};
    Object.entries(obj).map(item => {
      if (item[1] || item[1] === 0 || item[1] === false) {
        tempObj[item[0]] = item[1];
      }
    });
    return tempObj;
  },
  /**
   * 过滤并返回对象中的指定键值对
   * @param {object} obj
   * @param {Array} keys
   * @returns {object}
   */
  filterPropertyByKey(obj, keys = []) {
    let resObj = {};
    Object.entries(obj).map(item => {
      if (keys.indexOf(item[0]) !== -1) {
        resObj[item[0]] = item[1];
      }
    });
    return resObj;
  },
  /**
   * 对象转url参数
   * @param {object} obj
   * @returns {string} name=zs&age=20
   */
  obj2url(obj = {}) {
    let url = "";
    Object.keys(obj).map(key => {
      url += `${key}=${encodeURIComponent(obj[key])}&`;
    });
    return url.slice(0, url.length - 1);
  },
  /**
   * 剔除URL里的#号及其后字符，仅保留标准含参URL
   * @param {string} url
   * @returns {string}
   */
  noPoundUrl(url = location.href) {
    return url.indexOf("#") === -1 ? url : url.slice(0, url.indexOf("#"));
  },
  /**
   * 获取URL的参数
   * @param {string} url
   * @returns {object}
   */
  url2obj(url = location.href) {
    if (url.indexOf("?") === -1) {
      // 如果没有参数
      return {};
    }
    // 过滤#号
    url = noPoundUrl(url);
    // 截取参数
    const queryStr = url.slice(url.indexOf("?") + 1);
    const urlArr = queryStr.split("&"); // "['name=zs', 'age=12']"
    if (!urlArr.length) {
      return {};
    }
    let tempObj = {};
    urlArr.map(item => {
      let itemArr = item.split("=");
      tempObj[itemArr[0]] = itemArr[1];
    });
    return tempObj;
  }
};
