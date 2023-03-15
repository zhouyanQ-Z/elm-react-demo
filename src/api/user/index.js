import request from '@/utils/request'

// 手机验证码登录
export function mobileCodeApi(params) {
  let paramsObj = {
    ...params,
    scene: 'login',
    type: 'sms'  
  }
  return request({
    url: 'v4/mobile/verify_code/send',
    method: 'post',
    data: paramsObj
  })
}

/**
 * 检测帐号是否存在
 */
 export function checkExistsApi(checkNumber,type) {
  return request({
    url: 'v1/users/exists',
    method: 'get',
    params: {[type]: checkNumber,type}
  })
}

// 获取图形验证码
export function getCaptchaApi() {
  return request({
    url: 'v1/captchas',
    method: 'post'
  })
}

// 账号登录
export function accountLogin(data) {
  return request({
    url: 'v2/login',
    method: 'post',
    data
  })
}

// 手机登录
export function sendLogin(data) {
  return request({
    url: 'v1/login/app_mobile',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfoApi(params) {
  return request({
    url: 'v1/user',
    method: 'get',
    params
  })
}

// 修改密码
export function resetPasswordApi(data) {
  return request({
    url: 'v2/changepassword',
    method: 'post',
    data
  })
}

// 退出登录
export function logoutApi() {
  return request({
    url: 'v2/signout',
    method: 'get'
  })
}