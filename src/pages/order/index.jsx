import React, { useState,useEffect,useMemo} from 'react'
import { useNavigate,useLocation,Outlet } from 'react-router-dom'
import { connect } from 'react-redux'
import CSSTransition from 'react-transition-group/CSSTransition'
import './index.scss'
import ToolBar from '@/components/toolbar'
import Loader from '@/components/loader'
import ComputedTime from '@/components/computed-time'
import { imgBaseUrl } from '@/config/envConfig'
import { orderListApi } from '@/api/order'
import { saveOrder } from '@/store/actions'

function Order(props) {

  const [orderList,setOrderList] = useState(null) // 订单列表
  const [offset,setOffset] = useState(0)
  const [preventRepeat,setPreventRepeat] = useState(false) // 防止重复获取
  const [isLoading,setIsLoading] = useState(true) // 是否显示加载动画

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    initData()
  },[])

  const userInfo = useMemo(() => {
    return props.userInfo
  },[props.userInfo])

  useEffect(() => {
    if(userInfo && userInfo.user_id && !orderList) {
      initData()
    }
  },[userInfo])
  
  const geohash = useMemo(() => {
    return props.geohash
  },[props.geohash])


  // 初始化数据
  const initData = () => {
    if(userInfo && userInfo.user_id) {
      orderListApi(userInfo.user_id,{offset}).then(res => {
        setOrderList([...res])
        hideLoading()
      })
    } else {
      hideLoading()
    }
  }

  // 隐藏加载组件
  const hideLoading = () => {
    setIsLoading(false)
  }

  // 订单详情
  const showDetail = (item) => {
    props.saveOrder(item)
    setPreventRepeat(false)
    navigate('/order/orderDetail')
  }

  // 再来一单
  const buyAgain = (id) => {
    navigate(`/shop?geohash=${props.geohash}&id=${id}`)
  }


  return (
    <div className="order-container">
      <ToolBar title="订单列表" />
      <div className="order-main">
        {!isLoading ? <div className="order-list">
          {orderList && orderList.map(item => (
            <div className="order-list-item" key={item.id}>
              <img src={imgBaseUrl + item.restaurant_image_url} alt="" />
              <div className="item-right">
                <div className="order-detail" onClick={() => showDetail(item)}>
                  <div className="detail-header">
                    <div className="header-left">
                      <div className="header-left-title">
                        <span className="name oneline-hide">{item.restaurant_name}</span>
                        <span className="iconfont icon-arrow_right"></span>
                      </div>
                      <span className="order-time">{item.formatted_created_at}</span>
                    </div>
                    <div className="order-status">{item.status_bar.title}</div>
                  </div>
                  <div className="order-basket">
                    <p className="order-name">{item.basket.group[0][0].name}{item.basket.group[0].length > 1 ? ' 等' + item.basket.group[0].length + '件商品' : ''}</p>
                    <p className="order-amount">¥ {item.total_amount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="order-again">
                  {item.status_bar.title == '等待支付' ? <ComputedTime  time={item.time_pass} /> : <span className="order-again-btn" onClick={() => buyAgain(item.restaurant_id)}>再来一单</span> }
                </div>
              </div>
            </div>
          ))}
        </div> : <Loader />}
        
      </div>
      <CSSTransition in={location.pathname === '/order/orderDetail'} timeout={500} appear={true} classNames="router-slid" unmountOnExit={true} key={location.pathname}>
        <Outlet />
      </CSSTransition>
    </div>
  )
}

export default connect(
  state => ({userInfo: state.user,geohash: state.geohash.geohash}),
  dispatch => (
    {
      saveOrder: data => dispatch(saveOrder(data))
    }
  )
)(Order)