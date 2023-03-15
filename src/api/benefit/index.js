import request from '@/utils/request'

// 可用红包
export function getHongbaoApi(user_id) {
  let params = {
    limit: 20,
    offset: 0
  }
  return request({
    url: `promotion/v2/users/${user_id}/hongbaos`,
    method: 'get',
    params
  })
}

// 过期红包
export function expiredHongbaoApi(user_id) {
  let params = {
    limit: 20,
    offset: 0
  }
  return request({
    url: `promotion/v2/users/${user_id}/expired_hongbaos`,
    method: 'get',
    params
  })
}

// 兑换红包 v1/users/:user_id/hongbao/exchange
export function exchangeHongbaoApi(user_id,params) {
  return request({
    url: `v1/users/${user_id}/hongbao/exchange`,
    method: 'get',
    params
  })
}