import {INIT_CART,ADD_CART,REDUCE_CART,CLEAR_CART} from '../action-types'
import cache from '@/utils/cache'

// 加入购物车的商品列表
const initCart = {}

export default function(preState=initCart,action) {
  const {type,data} = action
  switch (type) {
    case INIT_CART:
      return cache.local.getJSON('cart') || {}
    case ADD_CART:
      let cart = preState
      let shop = cart[data.shopid] = cart[data.shopid] || {}
      let category = shop[data.category_id] = shop[data.category_id] || {}
      let item = category[data.item_id] = category[data.item_id] || {}
      if(item[data.food_id]) {
        item[data.food_id]['num']++
      } else {
        item[data.food_id] = {
          num: 1,
          id: data.food_id,
          name: data.name,
          price: data.price,
          specs: data.specs,
          packing_fee: data.packing_fee,
          sku_id: data.sku_id,
          stock: data.stock,
        }
      }
      cart = Object.assign({},preState,cart)
      //存入localStorage
      cache.local.setJSON('cart',cart)
      return cart
    case REDUCE_CART:
      let cart2 = preState
      let shop2 = cart2[data.shopid] || {}
      let category2 = shop2[data.category_id] || {}
      let item2 = category2[data.item_id] || {}
      console.log('reduce',item2);
      if(item2 && item2[data.food_id]) {
        if(item2[data.food_id]['num'] > 1) {
          item2[data.food_id]['num']--
          cart2 = Object.assign({},preState,cart2)
          //存入localStorage
          cache.local.setJSON('cart',cart2)
          return cart2
        } else {
          item2[data.food_id]['num']--
          //商品数量为0，则清空当前商品的信息
          item2[data.food_id] = null
          //存入localStorage
          cache.local.setJSON('cart',cart2)
          return Object.assign({},preState,cart2)
        }
      }
      return preState
    case CLEAR_CART:
      preState[data] = null
      preState = {...preState}
      cache.local.setJSON('cart',preState)
      return preState
    default:
      return preState
  }
}