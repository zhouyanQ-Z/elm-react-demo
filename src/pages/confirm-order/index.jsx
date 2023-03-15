import React,{useState,useEffect,useMemo} from "react"
import { useSearchParams,Link,useNavigate,Outlet,useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import CSSTransition from 'react-transition-group/CSSTransition'
import './index.scss'
import ToolBar from '@/components/toolbar'
import { saveGeohash,init_cart,saveShopId,saveCartidSig,chooseAddress,needValidation,orderSuccess,saveOrderParam } from '@/store/actions'
import { checkoutApi,placeOrdersApi,addressListApi } from '@/api/order'
import Loader from '@/components/loader'
import AlertTip from '@/components/alert-tip'
import { imgBaseUrl } from '@/config/envConfig'


function ConfirmOrder(props) {

  const [isLoading,setIsLoading] = useState(true) // 显示加载动画
  const [geohash,setGeohash] = useState('') //geohash位置信息
  const [shopId,setShopId] = useState(null) //商店id
  const [shopCart,setShopCart] = useState(null) //购物车数据
  const [checkoutData,setCheckoutData] = useState(null) // 数据返回值
  const [showPayWay,setShowPayWay] = useState(null) // 显示付款方式
  const [alertText,setAlertText] = useState(null) // 弹出框内容
  const [showAlert,setShowAlert] = useState(false) //显示提示组件
  const [payWayId,setPayWayId] = useState(1) // 付款方式

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const shopid = searchParams.get('shopId')
    const geo = searchParams.get('geohash')
    setGeohash(geo)
    setShopId(shopid)
    props.init_cart()
    props.saveShopId(shopid)
    //获取当前商铺购物车信息
    let cart = props.cartList[shopid]
    setShopCart(cart)

    if(geo) {
      initData(cart,shopid,geo)
      props.saveGeohash(geo)
    }

  },[])

  const choosedAddress = useMemo(() => {
    return props.choosedAddress
  },[props.choosedAddress])

  const remarkText = useMemo(() => {
    return props.remarkText
  },[props.remarkText])

  const inputText = useMemo(() => {
    return props.inputText
  },[props.inputText])

  //备注页返回的信息进行处理
  const remarklist = useMemo(() => {
    let str = ''
    if(remarkText) {
      Object.values(remarkText).forEach(item => {
        str += item[1] + '，'
      })
      //是否有自定义备注，分开处理
      if(inputText) {
        return str + inputText
      } else {
        return str.substr(0,str.lastIndexOf('，'))
      }
    }
    return props.remarklist
  },[remarkText,inputText])

  useEffect(() => {
    if(props.userInfo && props.userInfo.user_id) {
      initAddress()
    }

  },[props.userInfo])

  // 初始化数据
  const initData = async (data,shopid,geo) => {
    let arr = []
    Object.values(shopCart || data).forEach(cateItem => {
      Object.values(cateItem).forEach(itemVal => {
        Object.values(itemVal).forEach(item => {
          if(item) {
            arr.push({
              attrs: [],
              extra: {},
              id: item.id,
              name: item.name,
              packing_fee: item.packing_fee,
              price: item.price,
              quantity: item.num,
              sku_id: item.sku_id,
              specs: [item.specs],
              stock: item.stock
            })
          }
        })
      })
    })
    // 检验订单是否满足条件
    let res = await checkoutApi({restaurant_id: shopId || shopid,geohash: geohash || geo,entities: [arr]})
    setCheckoutData(res)
    props.saveCartidSig({cartId: res.cart.id,sig: res.sig})
    initAddress()
    setIsLoading(false)
  }

  // 初始化地址
  const initAddress = async () => {
    if(props.userInfo && props.userInfo.user_id) {
      const res = await addressListApi(props.userInfo.user_id)
      if (res instanceof Array && res.length) {
        props.chooseAddress({address: res[0], index: 0});
      }
    }
  }

  //地址备注颜色
  const iconColor = (name) => {
    switch (name) {
      case '公司': return '#4cd964';
      case '学校': return '#3190e8';
    }
  }

  //显示付款方式
  const showPayWayFun = () => {
    setShowPayWay(!showPayWay)
  }

  // 确认下单
  const confirmOrder = async () => {
    //用户未登录时弹出提示框
    if(!(props.userInfo && props.userInfo.user_id)) {
      setShowAlert(true)
      setAlertText('请登录')
      return
    } else if(!choosedAddress) { //未选择地址则提示
      setShowAlert(true)
      setAlertText('请添加一个收货地址')
      return
    }
    let obj = {
      //user_id: props.userInfo.user_id,
      //cart_id: checkoutData.cart.id,
      address_id: choosedAddress.id,
      description: remarklist,
      entities: checkoutData.cart.groups,
      geohash: geohash,
      sig: checkoutData.sig,
    }
    //保存订单
    props.saveOrderParam({user_id: props.userInfo.user_id,cart_id: checkoutData.cart.id,...obj})
    //发送订单信息
    let res = await placeOrdersApi(props.userInfo.user_id,checkoutData.cart.id,obj)
    //第一次下单的手机号需要进行验证，否则直接下单成功
    if (res.need_validation) {
      props.needValidation(res);
      navigate('/confirmOrder/userValidation');
    }else{
      props.orderSuccess(res);
      navigate('/confirmOrder/payment');
    }

  }

  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }

  // 选择支付方式
  const choosePayWay = (is_online_payment, id) => {
    if(is_online_payment) {
      setShowPayWay(!showPayWay)
      setPayWayId(id)
    }
  }

  return (
    <div className="confirm-order-container">
      {!isLoading ? <div>
        <ToolBar title="确认订单" goBack={true} signUp="confirmOrder" />

        <div className="confirm-order-main">
          <Link to={`/confirmOrder/chooseAddress?id=${checkoutData.cart.id}&sig=${checkoutData.sig}`} className="address-container">
            <div className="address-left">
              <span className="iconfont icon-dingwei icon-location"></span>
              {!choosedAddress ? <div className="add-address">请添加一个收货地址</div> :  <div className="address-detail-container">
                <div className="detail-header">
                  <span className="address-name">{choosedAddress.name}</span>
                  <span className="address-sex">&nbsp;{choosedAddress.sex == 1 ? '先生':'女士'}&nbsp;</span>
                  <span className="address-phone">{choosedAddress.phone}</span>
                </div>
                <div className="address-detail">
                  {choosedAddress.tag && <span className="address-tag" style={{backgroundColor: iconColor(choosedAddress.tag)}}>{choosedAddress.tag}</span> }
                  <p className="detail-content">{choosedAddress.address_detail}</p>
                </div>
              </div>}
            </div>
            <div className="address-right">
              <span className="iconfont icon-arrow_right"></span>
            </div>
          </Link>
          <div className="delivery-model container-style">
            <div className="delivery-text">送达时间</div>
            <div className="delivery-time">
              <span className="tips-text">尽快送达 | 预计 {checkoutData.delivery_reach_time}</span>
              {checkoutData.cart.is_deliver_by_fengniao && <div className="character">蜂鸟专送</div>}
            </div>
          </div>
          <div className="pay-way container-style">
            <div className="payway-header" onClick={showPayWayFun}>
              <span className="header-label">支付方式</span>
              <div className="more-type">
                <span className="text">在线支付</span>
                <span className="iconfont icon-arrow_right"></span>
              </div>
            </div>
            <div className="hongbao">
              <span className="text">红包</span>
              <span className="tips">暂时只在饿了么&nbsp;&nbsp;APP&nbsp;&nbsp;中支持</span>
            </div>
          </div>
          <div className="food-list">
            {checkoutData.cart.restaurant_info && <div className="list-header">
              <img src={imgBaseUrl+checkoutData.cart.restaurant_info.image_path} alt="" />
              <span className="name">{checkoutData.cart.restaurant_info.name}</span>
            </div>}
            {checkoutData.cart.groups && <div className="list">
              {checkoutData.cart.groups[0].map(item => 
                <div className="list-item" key={item.id}>
                  <p className="food-name oneline-hide">{item.name}</p>
                  <div className="num-price">
                    <span className="quantity">x {item.quantity}</span>
                    <span className="price">¥ {item.price}</span>
                  </div>
                </div>
              )}
            </div>}
            {checkoutData.cart.extra && <div className="list-item">
              <p className="food-name oneline-hide">{checkoutData.cart.extra[0].name}</p>
              <div className="num-price">
                <span className="quantity"></span>
                <span className="price">¥ {checkoutData.cart.extra[0].price}</span>
              </div>
            </div> }
            <div className="list-item">
              <p className="food-name oneline-hide">配送费</p>
              <div className="num-price">
                <span className="quantity"></span>
                <span className="price">¥ {checkoutData.cart.deliver_amount || 0}</span>
              </div>
            </div>
            <div className="total-price list-item">
              <p className="food-name oneline-hide">订单 ¥{checkoutData.cart.total}</p>
              <div className="num-price">
                <span className="quantity">待支付 ¥{checkoutData.cart.total}</span>
              </div>
            </div>
          </div>
          <div className="pay-way container-style">
            <Link to={`/confirmOrder/remark?id=${checkoutData.cart.id}&sig=${checkoutData.sig}`} className="payway-header">
              <span className="header-label">订单备注</span>
              <div className="more-type">
                <span className="text oneline-hide">{remarkText||inputText? remarklist: '口味、偏好等'}</span>
                <span className="iconfont icon-arrow_right"></span>
              </div>
            </Link>
            <Link to={checkoutData.invoice.is_available? '/confirmOrder/invoice': ''} className={`hongbao ${checkoutData.invoice.is_available ? 'available' :''}`}>
              <span className="text">发票抬头</span>
              <div className="content">
                <span className="status-text">{checkoutData.invoice.status_text}</span>
                <span className="iconfont icon-arrow_right"></span>
              </div>
            </Link>
          </div>
          <div className="confirm-order">
            <div className="confirm-left">待支付 ¥{checkoutData.cart.total}</div>
            <div className="confirmorder-btn" onClick={confirmOrder}>确认下单</div>
          </div>
          <CSSTransition in={showPayWay} timeout={100} appear={true} classNames="fade" unmountOnExit>
            <div className="pay-cover" onClick={showPayWayFun}></div>
          </CSSTransition>
          <CSSTransition in={showPayWay} timeout={100} appear={true} classNames="slid-up" unmountOnExit>
            <div className="choose-type-container">
              <div className="header">支付方式</div>
              <div className="pay-type-list">
                {checkoutData.payments.length > 0 && checkoutData.payments.map(item => (
                  <div className={`type-item ${payWayId == item.id ? 'choose':''}`} key={item.id}>
                    <span className="pay-name">{item.name}{!item.is_online_payment && <span className="desc">{item.description}</span>}</span>
                    <div className="choose-icon" onClick={() => choosePayWay(item.is_online_payment, item.id)}>
                      <span className="iconfont icon-choose"></span>
                    </div>
                  </div>
                )) }
              </div>
            </div>
          </CSSTransition>
        </div>
      </div> : <Loader /> }
      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip}/> }
      <CSSTransition 
        in={
          location.pathname === '/confirmOrder/remark' ||
          location.pathname == '/confirmOrder/invoice' ||
          location.pathname === '/confirmOrder/chooseAddress' ||
          location.pathname === '/confirmOrder/userValidation' ||
          location.pathname === '/confirmOrder/payment' ||
          location.pathname === '/confirmOrder/chooseAddress/addAddress' ||
          location.pathname === '/confirmOrder/chooseAddress/addAddress/searchAddress'
        } 
        timeout={500} appear={true}
        classNames="router-slid"
        unmountOnExit={true}
        key={location.pathname}>
        <Outlet />
      </CSSTransition>
    </div>
  )
}

export default connect(
  state => ({
    cartList: state.cart,
    choosedAddress: state.order.choosedAddress,
    remarkText: state.order.remarkText,
    inputText: state.order.inputText,
    invoice: state.order.invoice,
    userInfo: state.user
  }),
  dispatch => (
    {
      init_cart: () => dispatch(init_cart()),
      saveGeohash: data => dispatch(saveGeohash(data)),
      saveShopId: data => dispatch(saveShopId(data)),
      saveCartidSig: data => dispatch(saveCartidSig(data)),
      chooseAddress: data => dispatch(chooseAddress(data)),
      needValidation: data => dispatch(needValidation(data)),
      orderSuccess: data => dispatch(orderSuccess(data)),
      saveOrderParam: data => dispatch(saveOrderParam(data)),
    }
  )
)(ConfirmOrder)