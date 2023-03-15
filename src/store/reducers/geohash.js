/* 经纬度的reducer */
import {SAVE_GEOHASH,SAVE_LATITUDE,SAVE_LONGITUDE} from '../action-types'
//初始化
const initGeohash = {
  geohash: '',
  latitude: '',
  longitude: ''
}

export default function(preState=initGeohash,action) {
  const {type,data} = action
  switch (type) {
    case SAVE_GEOHASH:
      return Object.assign({},preState,{geohash: data})
    case SAVE_LATITUDE:
      return Object.assign({},preState,{latitude: data})
    case SAVE_LONGITUDE:
      return Object.assign({},preState,{longitude: data})
    default:
      return preState
  }
}