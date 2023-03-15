import axios from 'axios'
import { baseUrl } from '@/config/envConfig'
import { convertParams } from './common'
import cache from './cache'
import {getToken} from './auth'
import errorCode from './errorCode'

import { Dialog,Toast } from 'antd-mobile'


// 是否显示重新登录
export let isRelogin = { show: false };

// 设置默认头信息
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.crossDomain = true
axios.defaults.withCredentials = true

// 创建axios实例
const request = axios.create({
  //withCredentials: true, //是否携带cookie发起请求
  //baseURL: baseUrl,
  baseURL: '/api', // 解决浏览器无法携带cookie发起请求的问题
  timeout: 5000,
})

// request拦截器
request.interceptors.request.use(config => {
  // 是否需要设置token
  const isToken = (config.headers || {}).isToken === false
  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  
  //if (getToken() && !isToken) {
  //  config.headers['Authorization'] = getToken() // 让每个请求携带自定义cookie 请根据实际情况自行修改
  //}

  //config.headers['From-Type'] = 'cloud' // 请求来源

  // get请求映射params参数
  if(config.method === 'get' && config.params) {
    let url = config.url + '?' + convertParams(config.params)
    config.params = {}
    config.url = url
  }

  // 数据提交
  if(!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    // 利用会话缓存判断是否重复提交
    const sessionObj = cache.session.getJSON('sessionObj')
    if(sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj',requestObj)
    } else {
      const s_url = sessionObj.url
      const s_data = sessionObj.data
      const s_time = sessionObj.time
      const interval = 1000
      if(s_data === requestObj.data && s_url === requestObj.url && requestObj.time - s_time < interval) {
        const message = '数据正在处理，请勿重复提交'
        console.warn(`[${s_url}]:` + message)
        return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj',requestObj)
      }
    }
  }
  return config
},error => {
  console.err('request-err',error)
  Promise.reject(error)
})

// response拦截器
request.interceptors.response.use(res => {
  //console.log(res);
  // 未设置状态码则默认成功状态
  let code = res.status || 200
  if(res.data.status == 1) code = 200
  if(res.data.status == 0) code = 500
  // 获取错误信息
  const msg = errorCode[code] || res.data.message || errorCode['default']
  // 二进制数据则直接返回
  if(res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer'){
    return res.data
  }
  if(code === 401) {
    if(!isRelogin.show) {
      isRelogin.show = true
      Dialog.confirm({
        title: '系统提示',
        content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
        confirmText: '重新登录',
        cancelText: '取消',
        onConfirm: () => {
          isRelogin.show = false
          // 退出登录
          console.log('退出登录');
        },
        onCancel: () => {
          isRelogin.show = false
        }
      })
    }
    return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
  } else if(code === 500) {
    Toast.show({
      content: msg
    })
    return Promise.reject(new Error(msg))
  } else if(code !== 200) {
    Toast.show({
      content: msg
    })
    return Promise.reject('error')
  } else {
    return res.data
  }
},error => {
  console.log('reponse-err' + error)
  let { message } = error;
  if (message == "Network Error") {
    message = "后端接口连接异常";
  }
  else if (message.includes("timeout")) {
    message = "系统接口请求超时";
  }
  else if (message.includes("Request failed with status code")) {
    message = "系统接口" + message.substr(message.length - 3) + "异常";
  }
  Toast.show({
    content: message,
    duration: 5 * 1000
  })
  return Promise.reject(error)
})

export default request