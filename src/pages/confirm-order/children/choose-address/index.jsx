import React, {useState,useEffect,useMemo} from "react"
import { Link,Outlet,useLocation,useSearchParams,useNavigate } from 'react-router-dom'
import {connect} from 'react-redux'
import CSSTransition from 'react-transition-group/CSSTransition'
import './index.scss'
import ToolBar from '@/components/toolbar'
import AlertTip from '@/components/alert-tip'
import { chooseAddress } from "@/store/actions"
import {addressListApi} from '@/api/order'

function ChooseAddress(props) {

  const location = useLocation()
  const [searchParam] = useSearchParams()
  const navigate = useNavigate()

  let [addressList,setAddressList] = useState([]) // 地址列表
  let [deliverable,setDeliverable] = useState([]) // 有效地址列表
  let [deliverdisable,setDeliverdisable] = useState([]) // 无效地址列表
  const [id,setId] = useState(null)
  const [sig,setSig] = useState(null)
  const [alertText,setAlertText] = useState(null) // 弹出框内容
  const [showAlert,setShowAlert] = useState(false) //显示提示组件
  

  useEffect(() => {
    setId(searchParam.get('id'))
    setSig(searchParam.get('sig'))
  },[])

  useEffect(() => {
    if(props.userInfo && props.userInfo.user_id) {
      initData()
    }
  },[props.userInfo])

  useEffect(() => {
    initData()
  },[props.newAddress])

  const defaultIndex = useMemo(() => {
    if(props.addressIndex) {
      return props.addressIndex
    } else {
      return 0
    }
  },[props.addressIndex || 1])

  // 初始化数据
  const initData = () => {
    setAddressList([])
    setDeliverable([])
    setDeliverdisable([])
    const deliverable_1 = []
    const deliverdisable_1 = []

    if(props.userInfo && props.userInfo.user_id) {
      addressListApi(props.userInfo.user_id).then(res => {
        setAddressList(res)
        res.forEach(item => {
          if (item.is_deliverable) {
            deliverable_1.push(item)
          }else{
            deliverdisable_1.push(item)
          }
        })
        setDeliverable(deliverable_1)
        setDeliverdisable(deliverdisable_1)
      })
    }
  }

  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }

  // 选择地址
  const chooseAddress = (address,index) => {
    props.chooseAddress({address,index})
    navigate(-1)
  }

  //地址备注颜色
  const iconColor = (name) => {
    switch (name) {
      case '公司': return '#4cd964';
      case '学校': return '#3190e8';
    }
  }

  return (
    <div className="chooseaddress-container">
      <ToolBar title="选择地址" goBack={true}/>
      <div className="chooseaddress-main">
        <Link to="/confirmOrder/chooseAddress/addAddress" className="add-address-footer">
          <span className="iconfont icon-round_add"></span>
          <span className="add-text">新增收货地址</span>
        </Link>
        <div className="scroll-container" id="scroll-section">
          <div className="list_cotainer">
            <div className="deliverable_address">
              {deliverable.map((item,index) => (
                <div className="address-item" onClick={() => chooseAddress(item,index)} key={index}>
                  <span className={`iconfont icon-choose ${defaultIndex == index ? 'choosed':''}`}></span>
                  <div className="item-right">
                    <div className="header">
                      <span className="name">{item.name}</span>
                      <span className="sex">&nbsp;{item.sex === 1 ? '先生':'女士'}&nbsp;</span>
                      <span className="phone">{item.phone}</span>
                    </div>
                    <div className="address-detail oneline-hide">
                      {item.tag && <span className="tag" style={{backgroundColor: iconColor(item.tag)}}>{item.tag}</span> }
                      <p className="detail-content">{item.address_detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {deliverdisable.length > 0 && <div className="out-delivery">
              <div className="header">以下地址超出范围</div>
              <div className="deliverdisable_address">
              {deliverdisable.map((item,index) => (
                <div className="address-item" key={index}>
                  <span className='iconfont icon-choose'></span>
                  <div className="item-right">
                    <div className="header">
                      <span className="name">{item.name}</span>
                      <span className="sex">&nbsp;{item.sex === 1 ? '先生':'女士'}&nbsp;</span>
                      <span className="phone">{item.phone}</span>
                    </div>
                    <div className="address-detail oneline-hide">
                      {item.tag && <span className="tag" style={{backgroundColor: '#ccc', color: '#fff'}}>{item.tag}</span> }
                      <p className="detail-content">{item.address_detail}</p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>}
          </div>
        </div>
      </div>
      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip}/> }
      <CSSTransition 
        in={location.pathname === '/confirmOrder/chooseAddress/addAddress' || location.pathname === '/confirmOrder/chooseAddress/addAddress/searchAddress'} 
        timeout={500} appear={true}
        classNames="router-slid"
        unmountOnExit={true}>
        <Outlet />
      </CSSTransition>
    </div>
  )
}

export default connect(
  state => ({userInfo: state.user,addressIndex: state.order.addressIndex,newAddress: state.order.newAddress}),
  dispatch => (
    {
      chooseAddress: data => dispatch(chooseAddress(data))
    }
  )
)(ChooseAddress)