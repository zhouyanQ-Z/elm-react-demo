import request from '@/utils/request'

// 获取城市列表 guess：定位城市，  hot：热门城市， group：所有城市
export function getCitiesApi(params) {
  return request({
    url: 'v1/cities',
    method: 'get',
    params: params
  })
}

// 获取所选城市信息
export function getCurrentCityApi(cityId) {
  return request(({
    url: 'v1/cities/'+ cityId,
    method: 'get'
  }))
}

// 搜索地址
export function searchPlaceApi(params) {
  return request({
    url: 'v1/pois',
    method: 'get',
    params
  })
}