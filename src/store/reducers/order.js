import { 
  CHOOSE_ADDRESS,
  SAVE_CART_ID_SIG,
  NEED_VALIDATION,
  ORDER_SUCCESS,
  SAVE_ORDER_PARAM,
  CONFIRM_REMARK,
  CONFIRM_INVOICE,
  CHOOSE_SEARCH_ADDRESS,
  CONFIRM_ADDRESS,
  CHANGE_ORDER_PARAM,
  SAVE_ORDER
} from '../action-types'

// 订单相关数据
const initOrder = {
  choosedAddress: null, // 选择地址
  cartId: null,  //购物车id
  sig: null,  //购物车sig,
  needValidation: null, //确认订单时是否需要验证
  cartPrice: null, //会员卡价格
  orderMessage: null, //订单返回的信息
  remarkText: null,//可选备注内容
	inputText: '',//输入备注内容
	invoice: false,//开发票
  orderParam: null, //订单的参数
  orderDetail: null, //订单详情
  searchAddress: null,//搜索并选择的地址
  newAddress: [], //确认订单页新的地址
  addressIndex: null, //选择地址的索引值
}

export default function(preState=initOrder,action) {
  const {type,data} = action
  switch (type) {
    case CHOOSE_ADDRESS:
      return Object.assign({},preState,{choosedAddress: data.address,addressIndex: data.index})
    case SAVE_CART_ID_SIG:
      return Object.assign({},preState,{cartId: data.cartId,sig: data.sig})
    case NEED_VALIDATION:
      return Object.assign({},preState,{needValidation: data})
    case ORDER_SUCCESS:
      return Object.assign({},preState,{cartPrice: null,orderMessage: data})
    case SAVE_ORDER_PARAM:
      return Object.assign({},preState,{orderParam: data})
    case CONFIRM_REMARK:
      return Object.assign({},preState,{remarkText: data.remarkText,inputText: data.inputText})
    case CONFIRM_INVOICE:
      return Object.assign({},preState,{invoice: data})
    case CHOOSE_SEARCH_ADDRESS:
      return Object.assign({},preState,{searchAddress: data})
    case CONFIRM_ADDRESS:
      let address = preState.newAddress
      address.push(data)
      return Object.assign({},preState,{newAddress: address})
    case CHANGE_ORDER_PARAM:
      const param = Object.assign({},preState.orderParam,data)
      return Object.assign({},preState,{orderParam: param})
    case SAVE_ORDER:
      return Object.assign({},preState,{orderDetail: data})
    default:
      return preState
  }
}