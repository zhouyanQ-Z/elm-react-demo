import request from '@/utils/request'

// 根据经纬度详细定位
export function getPositionApi(geohash) {
  return request({
    url: 'v2/pois/' + geohash,
    method: 'get',
  })
}