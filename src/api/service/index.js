import request from '@/utils/request';

// getService
export function getServiceApi() {
  return request({
    url: 'v3/profile/explain',
    method: 'get'
  })
}