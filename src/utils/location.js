/* 
  获取当前位置的经纬度
*/
import { toast } from '@/utils/app/modal'

export function getLocation() {
  let location = {}
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
      location.longitude = position.coords.longitude
      location.latitude = position.coords.latitude
    } , onError);
  } else {
    toast("您的浏览器不支持使用HTML 5来获取地理位置服务");
    location = null
  }
  return location
}

//定位数据获取成功响应
function  onSuccess(position){
  /*
    纬度: position.coords.latitude
    经度: position.coords.longitude
    海拔: position.coords.altitude
    水平精度: position.coords.accuracy
    垂直精度: position.coords.altitudeAccura
  */
  //return { longitude: position.coords.longitude,latitude: position.coords.latitude }
  
}

//定位数据获取失败响应
function onError(error) {
  switch(error.code)
  {
    case error.PERMISSION_DENIED:
      toast("您拒绝对获取地理位置的请求");
      return;
    case error.POSITION_UNAVAILABLE:
      toast("位置信息是不可用的");
      return;
    case error.TIMEOUT:
      toast("请求您的地理位置超时");
      return;
    case error.UNKNOWN_ERROR:
      toast("未知错误");
      return;
  }
}