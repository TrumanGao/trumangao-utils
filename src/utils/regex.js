/**
 * @method 正则验证函数
 */
module.exports = {
  /**
   * 校验是否包含特殊字符
   * @param {string} char
   * @returns {boolean}
   */
  hasSpecialChar(char = "") {
    const regex = /^[^`~!@$%&*?<>/\\|=+^{}\[\]\'\"【】‘’￥——、，。；：？《》！]*$/i;
    return !regex.test(char);
  },
  /**
   * 校验是否包含SQL注入
   * @param {string} char
   * @returns {boolean}
   */
  hasSqlChar(char = "") {
    const reg = /(\band\b)|(\bor\b)|(\bDELETE\b)|(\bUPDATE\b)|(\bINSERT\b)|(\bEXEC\b)|(\bEXECUTE\b)|(\blike\b)|(\bselect\b)|(\bset\b)|(\bcreate\b)|(\btable\b)|(\bexec\b)|(\bdeclare\b)|(\bmaster\b)|(\bbackup\b)|(\bmid\b)|(\bcount\b)|(\badd\b)|(\balter\b)|(\bdrop\b)|(\bfrom\b)|(\btruncate\b)|(\bunion\b)|(\bjoin\b)|(\script\b)|(\balert\b)|(\blink\b)/gi;
    return reg.test(char);
  },
  /**
   * 是否包含汉字
   * @param {string} char
   * @returns {boolean}
   */
  hasCnChar(char = "") {
    const reg = /[\u4E00-\u9FA5]/g;
    return reg.test(char);
  }
};
