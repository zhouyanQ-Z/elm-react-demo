import React, {useState,useMemo,useEffect}from "react"
import { useNavigate,Link } from 'react-router-dom'
import { connect } from 'react-redux'
import BScroll from 'better-scroll'
import './index.scss'
import ToolBar from '@/components/toolbar'
import Loader from '@/components/loader'
import { saveInvoice } from "@/store/actions"
import { imgBaseUrl } from '@/config/envConfig'
import { orderDetailApi } from '@/api/order'


function OrderDetail(props) {
  const [orderData,setOrderData] = useState(false) // 订单数据
  const [isLoading,setIsLoading] = useState(true) // 是否显示加载动画

  const navigate = useNavigate()

  useEffect(() => {
    initData()
  },[])

  useEffect(() => {
    if(props.userInfo && props.userInfo.user_id) {
      initData()
    }
  },[props.userInfo])

  const orderDetail = useMemo(() => {
    return props.orderDetail
  },[props.orderDetail])
  const geohash = useMemo(() => {
    return props.geohash
  },[props.geohash])
  let userInfo = useMemo(() => {
    return props.userInfo
  },[props.userInfo])

  // 初始化数据
  const initData = () => {
    if(userInfo && userInfo.user_id) {
      orderDetailApi(userInfo.user_id,orderDetail.unique_id).then(res => {
        setOrderData(res)
        setIsLoading(false)
        //let scroll = new BScroll('#scroll-section',{
        //  deceleration: 0.001,
        //  bounce: true,
        //  swipeTime: 1800,
        //  click: true,
        //  scrollY: true,
        //  disableTounch: false
        //})
        //scroll.on('scroll',(pos) => {
        //  console.log('滚动了');
        //})
      })
    }
  }

  // 再来一单
  const buyAgain = () => {
    navigate(`/shop?geohash=${props.geohash}&id=${orderDetail.restaurant_id}`)
  }

  return (
    <div className="orderdetail-container">
      <ToolBar title="订单详情" goBack={true}/>
      <div className={`scroll-container ${isLoading ? '':'show'}`} id="scroll-section">
        <div className="scroll-insert">
          <div className="order-title">
            <img src={imgBaseUrl + orderDetail.restaurant_image_url} alt="" />
            <p className="order-status-title">{orderDetail.status_bar.title}</p>
            <p className="order-timeline">{orderDetail.timeline_node.description}</p>
            <span className="order-again-btn" onClick={buyAgain}>再来一单</span>
          </div>
          <div className="food-list">
            <Link to={`/shop?geohash=${geohash}&id=${orderDetail.restaurant_id}`} className="food-list-header">
              <div className="shop-name">
                <img src={imgBaseUrl + orderDetail.restaurant_image_url} alt="" />
                <span className="name">{orderDetail.restaurant_name}</span>
              </div>
              <span className="iconfont icon-arrow_right"></span>
            </Link>
            <div className="food-list-container">
              {orderDetail.basket.group[0].map((item,index) => (
                <div className="food-item" key={index}>
                  <p className="food-name oneline-hide">{item.name}</p>
                  <div className="quantity-price">
                    <span className="quantity">X {item.quantity}</span>
                    <span className="price">¥ {item.price}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="delivery-fee">
              <span className="text">配送费</span>
              <span className="fee">{orderDetail.basket.deliver_fee&&orderDetail.basket.deliver_fee.price || 0}</span>
            </div>
            <div className="payment">实付{orderDetail.total_amount.toFixed(2)}</div>
          </div>
          <div className="order-detail-style">
            <p className="order-detail-header">配送信息</p>
            <div className="detail-item-style">
              <p className="item-left">送达时间：</p>
              <div className="item-right">
                <p className="deliver-time">{orderData.deliver_time}</p>
              </div>
            </div>
            <div className="detail-item-style">
              <p className="item-left">送货地址：</p>
              <div className="item-right">
                <p className="consignee">{orderData.consignee}</p>
                <p className="phone">{orderData.phone}</p>
                <p className="address">{orderData.address}</p>
              </div>
            </div>
            <div className="detail-item-style">
              <p className="item-left">配送方式：</p>
              <div className="item-right">
                <p className="deliver-type">蜂鸟专送</p>
              </div>
            </div>
          </div>
          <div className="order-detail-style">
            <p className="order-detail-header">订单信息</p>
            <div className="detail-item-style">
              <p className="item-left">订单号：</p>
              <div className="item-right">
                <p className="order-id">{orderDetail.id}</p>
              </div>
            </div>
            <div className="detail-item-style">
              <p className="item-left">支付方式：</p>
              <div className="item-right">
                <p className="pay-way">在线支付</p>
              </div>
            </div>
            <div className="detail-item-style">
              <p className="item-left">下单时间：</p>
              <div className="item-right">
                <p className="create-at">{orderDetail.formatted_created_at}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loader />}
    </div>
  )
}

export default connect(
  state => ({orderDetail: state.order.orderDetail,geohash: state.geohash.geohash,userInfo: state.user}),
  dispatch => (
    {
      saveInvoice: data => dispatch(saveInvoice(data))
    }
  )
)(OrderDetail)