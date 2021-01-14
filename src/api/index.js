import $axios from "./request";
import * as $_utils from "@/utils/index.js";

// https://ape-api.yuanfudao.biz/verifier/api/swagger/swagger-ui.html#/verification-controller
// 发送验证码
// @params UDID UDID Default value : C37798E9-7067-43AF-BCDA-6D8DC0984E71
// @params _productId 在 Planet 定义的 ProductId Default value : 101
// @params client Client Default value : api
// @params phone 手机号，需 RSA 加密，加密规则同密码
// @params version version Default value : 1.0.0
export function postSms(params = {}) {
  return $axios.postFormData(
    `/apiYFD/verifier/api/sms?${$_utils.obj2url(params)}`
  );
}

// https://ape-api.yuanfudao.biz/accounts/api/swagger/swagger-ui.html#/auth-controller
// 登录(验证码、密码、共享登录三合一，支持自动注册)
// @params UDID UDID Default value : C37798E9-7067-43AF-BCDA-6D8DC0984E71
// @params _debug_user_ 测试userId Default value : 123456
// @params _productId 在 Planet 定义的 ProductId Default value : 101
// @params autoRegister boolean (query) 验证码登录时账号不存在时是否自动注册，默认为true Default value : true
// @params client Client Default value : api
// @params email 老用户可通过email登录，与phone二选一。 需RSA加密，加密规则同密码
// @params keyfrom PIPE统计会收集调用日志，建议加上
// @params password 需RSA加密，token、password和verification三选一
// @params phone 手机号，与email二选一。需RSA加密，加密规则同密码
// @params token 实现是使用persistent cookie，token、password和verification三选一
// @params verification: "" 手机验证码，需RSA加密，加密规则同密码，token、password和verification三选一
export function postLogin(params = {}) {
  return $axios.postFormData(
    `/apiYBC/accounts/api/login?${$_utils.obj2url(params)}`
  );
}

// 获取微信签名，用于通过config接口注入权限验证配置
// @appId 必填
// @url 必填
export function getWxSign(params = {}) {
  return $axios.get("/ada-scsp-gyact/api/wx/mp/jsapi-ticket", params);
}

// 根据 code 获取 openID、token
export function getAuth2Callback(params = {}) {
  return $axios.get(
    `/ada-scsp-gyact/api/wx/mp/oauth2-callback?${$_utils.obj2url(params)}`
  );
}

/**
 * 绑定微信
 * @params openId string
 * @params yfdId integer
 * @params phone
 * @return 绑定后的token
 */
export function postWxBind(params = {}) {
  return $axios.postFormData("/ada-scsp-gyact/api/wx/mp/bind", params);
}
