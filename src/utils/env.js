/**
 *  @method 判断数据类型/环境
 */
module.exports = {
  /**
   * 是否移动端
   * @returns {boolean}
   */
  isMobile() {
    const u = navigator.userAgent;
    const ua = {
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, // android终端或者uc浏览器
      iPhone: u.indexOf("iPhone") > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf("iPad") > -1 // 是否iPad
    };
    return ua.mobile || ua.ios || ua.android || ua.iPhone || ua.iPad;
  },
  /**
   * 是否微信内置浏览器（除企业微信）
   * @returns {boolean}
   */
  isWX() {
    const ua = navigator.userAgent;
    return ua.indexOf("MicroMessenger") !== -1 && ua.indexOf("wxwork") === -1;
  },
  /**
   * 是否企业微信
   * @returns {boolean}
   */
  isWXWork() {
    const ua = navigator.userAgent;
    return ua.indexOf("MicroMessenger") !== -1 && ua.indexOf("wxwork") !== -1;
  },
  /**
   * 是否谷歌浏览器
   * @returns {boolean}
   */
  isChrome() {
    const ua = navigator.userAgent;
    return ua.indexOf("Chrome") !== -1;
  }
};
