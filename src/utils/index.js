// 返回类型字符串
// String Boolean Number Object Error 等
function checkDataType(data = "") {
  let typeStr = Object.prototype.toString.call(data);
  return typeStr.slice(8, typeStr.length - 1);
}

// 下载blob文件
function downloadBlob(blob, fileName = "newfile") {
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

module.exports = { checkDataType, downloadBlob };
