import React, {useState,useEffect,useMemo}from "react"
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar'
import AlertTip from '@/components/alert-tip'
import { saveInvoice,clear_cart } from "@/store/actions"
import { payRequestApi } from "@/api/order"

function Payment(props) {
  const [payDetail,setPayDetail] = useState(null) // 付款信息详情
  const [showAlert,setShowAlert] = useState(false)
  const [alertText,setAlertText] = useState(null)
  let [payWay,setPayWay] = useState(1) // 付款方式
  let [countNum,setCountNum] = useState(900) // 倒计时15分钟
  let [gotoOrder,setGotoOrder] = useState(false) // 去付款

  const navigate = useNavigate()
  let timer = null

  useEffect(() => {
    initData()
    if(shopid) {
      // 清楚购物车中当前商铺的信息
      props.clearCart(shopid)
    }
    remainingTime()
  },[])

  let cartPrice = useMemo(() => {
    return props.cartPrice
  },[props.cartPrice])
  let orderMessage = useMemo(() => {
    return props.orderMessage
  },[props.orderMessage])
  let userInfo = useMemo(() => {
    return props.userInfo
  },[props.userInfo])
  let shopid = useMemo(() => {
    return props.shopid
  },[props.shopid])

  const remaining = useMemo(() => {
    let minute = parseInt(countNum/60)
    if(minute < 10) {
      minute = '0' + minute
    }
    let second = parseInt(countNum%60)
    if(second < 10) {
      second = '0' + second
    }
    return '00 : ' + minute + ' : ' + second
  },[countNum])

  // 倒计时
  const remainingTime = () => {
    clearInterval(timer)
    timer = setInterval(() => {
      setCountNum(--countNum)
      if(countNum == 0) {
        clearInterval(timer)
        setShowAlert(true)
        setAlertText('支付时间超时')
      }
    },1000)
  }

  // 初始化数据
  const initData = () => {
    //console.log(orderMessage);
    payRequestApi(orderMessage.order_id,userInfo.user_id).then(res => {
      setPayDetail(res)
      if(res.message) {
        setShowAlert(true)
        setAlertText(res.message)
        return
      }
    })
  }

  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
    if(gotoOrder) {
      navigate('/order')
    }
  }

  // 确认付款
  const confrimPay = () => {
    setShowAlert(true)
    setAlertText('当前环境无法支付，请打开官方APP进行付款')
    setGotoOrder(true)
  }
  
  // 选择支付方式
  const choosePayway = (type) => {
    setPayWay(type)
  }

  return (
    <div className="payment-container">
      <ToolBar title="在线支付" goBack={true}/>
      <div className="payment-main">
        <div className="show-time-amount">
          <div className="time-header">支付剩余时间</div>
          <p className="time-count">{remaining}</p>
          {payDetail && payDetail.resultData && <div className="footer">
            <span className="label">详情</span>
            <span className="price">¥ {cartPrice && cartPrice.toFixed(2) || payDetail.resultData.orderInfo.orderAmount&&(payDetail.resultData.orderInfo.orderAmount/100).toFixed(2)}</span>
          </div> }
        </div>
        <div className="choose-payway">
          <div className="payway-header">选择支付方式</div>
          <div className="payway-list">
            <div className="payway-item">
              <div className="icon-conatiner">
                <span className="iconfont icon-imagezhifubao"></span>
                <span className="text">支付宝</span>
              </div>
              <span className={`iconfont icon-choose ${payWay == 1 ? 'choosed':''}`} onClick={() => choosePayway(1)}></span>
            </div>
            <div className="payway-item">
              <div className="icon-conatiner">
                <span className="iconfont icon-wechat"></span>
                <span className="text">微信</span>
              </div>
              <span className={`iconfont icon-choose ${payWay == 2 ? 'choosed':''}`} onClick={() => choosePayway(2)}></span>
            </div>
          </div>
        </div>

      </div>
      <div className="confirm-btn" onClick={confrimPay}>确认支付</div>
      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip}/> }
    </div>
  )
}

export default connect(
  state => ({
    cartPrice: state.order.cartPrice,
    orderMessage: state.order.orderMessage,
    userInfo: state.user,
    shopid: state.shop.shopid}),
  dispatch => (
    {
      saveInvoice: data => dispatch(saveInvoice(data)),
      clearCart: data => dispatch(clear_cart(data)),
    }
  )
)(Payment)