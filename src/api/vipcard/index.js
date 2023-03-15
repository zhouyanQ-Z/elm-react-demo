import request from '@/utils/request'

//'/member/v1/users/' + id + '/delivery_card/physical_card/bind'
export function exchangeVipApi(user_id,data) {
  return request({
    url: `member/v1/users/${user_id}/hongbaos`,
    method: 'post',
    data
  })
}