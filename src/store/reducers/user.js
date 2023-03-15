/* 经纬度的reducer */
import { SAVE_USERINFO,RESET_NAME,OUT_LOGIN } from '../action-types'
//import cache from '@/utils/cache'

//初始化
const initUserInfo = {}


export default function(preState=initUserInfo,action) {
  const {type,data} = action
  switch (type) {
    case SAVE_USERINFO:
      return data
    case RESET_NAME:
      return Object.assign({},preState,{username:data});
    case OUT_LOGIN:
      return Object.assign({});
    default:
      return preState
  }
}