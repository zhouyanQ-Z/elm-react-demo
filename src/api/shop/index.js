import request from '@/utils/request'

// 获取商铺列表
export function getShopListApi(params) {
  return request({
    url: 'shopping/restaurants',
    method: 'get',
    params
  })
}

// 获取商铺详情
export function shopDetailApi(id,params) {
  return request({
    url: 'shopping/restaurant/'+id,
    method: 'get',
    params
  })
}

// 商铺食品列表
export function foodMenuApi(params) {
  return request({
    url: 'shopping/v2/menu',
    method: 'get',
    params
  })
}

// 商铺评价列表
export function ratingListApi(id,params) {
  const obj = {
    limit: 10,
    ...params
  }
  return request({
    url: 'ugc/v2/restaurants/' + id + '/ratings',
    method: 'get',
    params: obj
  })
}

// 商铺评价分数
export function ratingScoresApi(id) {
  return request({
    url: 'ugc/v2/restaurants/' + id + '/ratings/scores',
    method: 'get'
  })
}

// 商铺评价分类
export function ratingTagsApi(id) {
  return request({
    url: 'ugc/v2/restaurants/' + id + '/ratings/tags',
    method: 'get'
  })
}