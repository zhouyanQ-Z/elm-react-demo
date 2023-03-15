import {SAVE_ADDRESS,ADD_ADDRESS,SAVE_ADDDETAIL, BUY_CARD, SAVE_QUESTION} from '../action-types'

const initProfile = {
  removeAddress: [], ////移除地址
  addAddress: '', // 新添加地址
  cardPrice: 0, // 会员卡价格
  question: null, // 问题详情
}

export default function(preState=initProfile,action) {
  const {type,data} = action
  switch (type) {
    case SAVE_ADDRESS:
      return Object.assign({},preState,{removeAddress: data})
    case ADD_ADDRESS:
      return Object.assign({},preState,{removeAddress: [data,...preState.removeAddress]})
    case SAVE_ADDDETAIL:
      return Object.assign({},preState,{addAddress: data})
    case BUY_CARD:
      return Object.assign({},preState,{cardPrice: data});
    case SAVE_QUESTION: //保存所选问题标题和详情
      //let val = {...data};
      return Object.assign({},preState,{question: data});
    default:
      return preState
  }
}