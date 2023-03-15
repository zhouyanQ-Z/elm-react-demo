import {
  SAVE_GEOHASH,
  SAVE_LATITUDE,
  SAVE_LONGITUDE,
  SAVE_USERINFO,
  INIT_CART,
  ADD_CART,
  REDUCE_CART,
  CLEAR_CART,
  SAVE_SHOP_DETAIL,
  SAVE_SHOP_ID,
  SAVE_CART_ID_SIG,
  CHOOSE_ADDRESS,
  NEED_VALIDATION,
  ORDER_SUCCESS,
  SAVE_ORDER_PARAM,
  CONFIRM_REMARK,
  CONFIRM_INVOICE,
  CHOOSE_SEARCH_ADDRESS,
  CONFIRM_ADDRESS,
  CHANGE_ORDER_PARAM,
  SAVE_ORDER,
  OUT_LOGIN,
  RESET_NAME,
  SAVE_ADDRESS,
  ADD_ADDRESS,
  SAVE_ADDDETAIL,
  BUY_CARD,
  SAVE_QUESTION
} from './action-types'

import { addressListApi } from '@/api/order'

// 保存经纬度
export const saveGeohash = (value) => ({type: SAVE_GEOHASH,data: value})

// 保存经度
export const saveLongitude = (value) => ({type: SAVE_LONGITUDE,data: value})

// 保存纬度
export const saveLatitude = (value) => ({type: SAVE_LATITUDE,data: value})

// 保存用户信息
export const saveUserInfo = (data) => ({type: SAVE_USERINFO,data})

export const init_cart = () => ({type: INIT_CART})
export const add_cart = (data) => ({type: ADD_CART,data})
export const reduce_cart = (data) => ({type: REDUCE_CART,data})
export const clear_cart = (data) => ({type: CLEAR_CART,data})

// 保存商家信息
export const saveShopDetail = (data) => ({type: SAVE_SHOP_DETAIL,data})
export const saveShopId = (data) => ({type: SAVE_SHOP_ID,data})
export const saveCartidSig = (data) => ({type: SAVE_CART_ID_SIG,data})
export const chooseAddress = (data) => ({type: CHOOSE_ADDRESS,data})
//保存下单需要验证的返回值
export const needValidation = (data) => ({type: NEED_VALIDATION,data})
//下单成功，保存订单返回信息
export const orderSuccess = (data) => ({type: ORDER_SUCCESS,data})
//保存下单参数，用户验证页面调用
export const saveOrderParam = (data) => ({type: SAVE_ORDER_PARAM,data})
//记录订单页面用户选择的备注, 传递给订单确认页面
export const saveRemark = (data) => ({type: CONFIRM_REMARK,data})
// 是否开发票
export const saveInvoice = (data) => ({type: CONFIRM_INVOICE,data})
// 选择搜索的地址
export const saveSearchAddress = (data) => ({type: CHOOSE_SEARCH_ADDRESS,data})
// 确认订单页添加新的的地址
export const saveNewAddress = (data) => ({type: CONFIRM_ADDRESS,data})
// 改变下单参数
export const changeOrderParam = (data) => ({type: CHANGE_ORDER_PARAM,data})
// 进入订单详情页前保存该订单信息
export const saveOrder = (data) => ({type: SAVE_ORDER,data})

// 退出登录
export const outLogin = () => ({type: OUT_LOGIN})

// 修改用户名
export const resetUsername = (data) => ({type: RESET_NAME,data})


export const saveAddress = (data) => ({type: SAVE_ADDRESS,data})

// 获取地址列表
export const asyncSaveAddress = () => {
  return async (dispatch,getState) => {
    if(getState().profile.removeAddress.length > 0) return;

    let address = await addressListApi(getState().user.user_id);
    dispatch(saveAddress(address));
  }
}

export const addAddress = (data) => ({type: ADD_ADDRESS,data});
export const saveAddDetail = (data) => ({type: SAVE_ADDDETAIL,data});

// 购买会员卡
export const buyCard = (data) => ({type: BUY_CARD,data});

//保存所选问题标题和详情
export const saveQuestion = (data) => ({type: SAVE_QUESTION,data})