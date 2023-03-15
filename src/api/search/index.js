import request from '@/utils/request'

// 获取搜索结果
export function getRestaurantsApi(data) {
  return request({
    url: 'v4/restaurants',
    method: 'get',
    params: data
  })
}