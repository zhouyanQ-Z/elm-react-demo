import request from '@/utils/request'

// 获取食品分类列表[msite页面]
export function getFoodCateApi() {
  return request({
    url: 'v2/index_entry',
    method: 'get'
  })
}

// 获取所有商铺分类列表 [获取food页面的 category 种类列表]
export function getRestaurantCateApi(params) {
  return request({
    url: 'shopping/v2/restaurant/category',
    method: 'get',
    params
  })
}

// 获取配送方式
export function getDeliveryModeApi(params) {
  return request({
    url: 'shopping/v1/restaurants/delivery_modes',
    method: 'get',
    params
  })
}

//商家属性活动列表
export function getActivityApi(params) {
  return request({
    url: 'shopping/v1/restaurants/activity_attributes',
    meth: 'get',
    params
  })
}