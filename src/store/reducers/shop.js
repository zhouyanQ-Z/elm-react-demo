import {SAVE_SHOP_DETAIL,SAVE_SHOP_ID} from '../action-types'
import cache from '@/utils/cache'

// 加入购物车的商品列表
const initShop = {
  shopDetail: null,
  shopid: null
}

export default function(preState=initShop,action) {
  const {type,data} = action
  switch (type) {
    case SAVE_SHOP_DETAIL:
      return Object.assign({},preState,{shopDetail: data})
    case SAVE_SHOP_ID:
      return Object.assign({},preState,{shopid: data})
    default:
      return preState
  }
}