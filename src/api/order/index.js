import request from '@/utils/request'

// 获取订单列表
export function orderListApi(user_id,params) {
  const param = {
    limit: 10,
    ...params
  }
  return request({
    url: `bos/v2/users/${user_id}/orders`,
    method: 'get',
    params: param
  })
}

// 加入购物车
export function checkoutApi(data) {
  return request({
    url: 'v1/carts/checkout',
    method: 'post',
    data
  })
}

// 下单
export function placeOrdersApi(user_id,cart_id,data) {
  return request({
    url: `v1/users/${user_id}/carts/${cart_id}/orders`,
    method: 'post',
    data
  })
}

// 获取收货地址列表
export function addressListApi(userId) {
  return request({
    url: `v1/users/${userId}/addresses`,
    method: 'get'
  })
}

// 获取备注信息
export function getRemarksApi(cardId) {
  return request({
    url: `v1/carts/${cardId}/remarks`,
    method: 'get'
  })
}

// 增加收货地址
export function addAddressApi(user_id,data) {
  return request({
    url: `v1/users/${user_id}/addresses`,
    method: 'post',
    data
  })
}

// 搜索地址
export function nearchNearbyApi(params) {
  const param = {
    type: 'nearby',
    ...params
  }
  return request({
    url: 'v1/pois',
    method: 'get',
    params: param,
  })
}

// 获取验证信息
export function getVerifyApi(cart_id,data) {
  return request({
    url: '/v1/carts/' + cart_id + '/verify_code',
    method: 'post',
    data
  })
}

// 下单 v1/users/:user_id/carts/:cart_id/orders
export function validateOrderApi(data) {
  const user_id = data.user_id
  const cart_id = data.cart_id
  delete data.user_id
  delete data.cart_id
  return request({
    url: 'v1/users/'+ user_id +'/carts/' + cart_id + '/orders',
    method: 'post',
    data
  })
}

// 付款信息详情 
export function payRequestApi(merchantOrderNo,userId) {
  const param = {
    merchantId: 5,
    merchantOrderNo,
    source: 'MOBILE_WAP',
    userId,
    version: '1.0.0',
  }
  return request({
    url: `/payapi/payment/queryOrder`,
    method: 'get',
    params: param
  })
}

// 订单详情
export function orderDetailApi(user_id,order_id) {
  return request({
    url: `bos/v1/users/${user_id}/orders/${order_id}/snapshot`,
    method: 'get'
  })
}


// 删除地址
export function deleteAddressApi(user_id,address_id) {
  return request({
    url: `v1/users/${user_id}/addresses/${address_id}`,
    method: 'delete'
  })
}