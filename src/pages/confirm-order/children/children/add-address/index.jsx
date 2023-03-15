import React,{useState,useMemo}from "react"
import { Link,useNavigate,Outlet,useLocation } from 'react-router-dom'
import {connect} from 'react-redux'
import CSSTransition from 'react-transition-group/CSSTransition'
import './index.scss'
import ToolBar from '@/components/toolbar'
import AlertTip from '@/components/alert-tip'
import { addAddressApi } from '@/api/order'
import { saveNewAddress } from "@/store/actions"

function AddAddress(props) {
  
  const [name,setName] = useState('') // 姓名
  const [sex,setSex] = useState(1) // 性别
  const [phone,setPhone] = useState('') // 电话
  const [addressDetail,setAddressDetail] = useState('') // 详细地址
  const [tag,setTag] = useState('') // 备注
  const [tagType,setTagType] = useState(1) // 备注类型
  const [phone_bk,setPhoneBk] = useState(false) // 是否选择备注电话
  const [anotherPhoneNumber,setAnotherPhoneNumber] = useState('') // 备注电话
  const [alertText,setAlertText] = useState(null) // 弹出框内容
  const [showAlert,setShowAlert] = useState(false) //显示提示组件
  const [poiType,setPoiType] = useState(0) //地址类型

  const navigate = useNavigate()
  const location = useLocation()

  const geohash = useMemo(() => {
    return props.geohash
  },[props.geohash])

  const userInfo = useMemo(() => {
    return props.userInfo
  },[props.userInfo])

  const searchAddress = useMemo(() => {
    return props.searchAddress
  },[props.searchAddress])

  // 选择性别
  const chooseSex = gender => {
    setSex(gender)
  }

  // 文本框输入
  const handleInput = (type,e) => {
    const value = e.target.value
    if(type === 'name') {
      setName(value)
    } else if(type === 'phone') {
      setPhone(value)
    } else if(type === 'anotherPhone') {
      setAnotherPhoneNumber(value)
    } else if(type === 'address-detail') {
      setAddressDetail(value)
    } else if(type === 'tag') {
      setTag(value)
    }
  }

  // 选择备选电话
  const choosePhoneBk = () => {
    setPhoneBk(true)
  }

  // 添加地址
  const addAddress = () => {
    if(!(userInfo && userInfo.user_id)) {
      setShowAlert(true)
      setAlertText('请登录')
      return
    } else if(!name) {
      setShowAlert(true)
      setAlertText('请输入姓名')
      return
    } else if(!phone) {
      setShowAlert(true)
      setAlertText('请输入电话号码')
      return
    } else if(!searchAddress) {
      setShowAlert(true)
      setAlertText('请选择地址')
      return
    } else if(!addressDetail) {
      setShowAlert(true)
      setAlertText('请输入详细地址')
      return
    } else if(!tag) {
      setShowAlert(true)
      setAlertText('请输入标签')
      return
    }
    if(tag == '家') {
      setTagType(2)
    } else if(tag == '学校') {
      setTagType(3)
    } else if(tag == '公司') {
      setTagType(4)
    }
    let params = {
      address: searchAddress.name,
      address_detail: addressDetail,
      geohash,
      name,
      phone,
      tag,
      sex,
      poi_type: poiType,
      phone_bk,
      tag_type: tagType,
    }
    addAddressApi(userInfo.user_id,params).then(res => {
      //保存成功返回上一页，否则弹出提示框
      if(res.message) {
        setShowAlert(true)
        setAlertText(res.message)
      } else {
        props.saveNewAddress(1)
        navigate(-1)
      }
    })
  }

  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }

  return (
    <div className="addaddress-container">
      <ToolBar title="添加地址" goBack={true}/>
      <div className="addaddress-main">
        <div className="section-list">
          <span className="list-left">联系人</span>
          <div className="list-right">
            <input type="text" name="name" placeholder="你的名字" value={name} onChange={(e) => handleInput('name',e)} className="input-style" />
            <div className="choose-sex">
              <div className="sex-option">
                <span className={`iconfont icon-choose ${sex==1 ? 'choose':''}`} onClick={() => chooseSex(1)}></span>
                <span className="label">先生</span>
              </div>
              <div className="sex-option">
                <span className={`iconfont icon-choose ${sex==2 ? 'choose':''}`} onClick={() => chooseSex(2)}></span>
                <span className="label">女士</span>
              </div>
            </div>
          </div>
        </div>
        <div className="section-list">
          <span className="list-left">联系电话</span>
          <div className="list-right">
            <div className="phone-add">
              <input type="number" name="phone" placeholder="你的手机号" value={phone} onChange={(e) => handleInput('phone',e)} className="input-style" />
              <span className="iconfont icon-add1" onClick={choosePhoneBk}></span>
            </div>
            {phone_bk && <input type="number" name="anotherPhoneNumber" placeholder="备选电话" value={anotherPhoneNumber} onChange={(e) => handleInput('anotherPhone',e)} className="input-style phone_bk" />}
          </div>
        </div>
        <div className="section-list">
          <span className="list-left">送餐地址</span>
          <div className="list-right">
            <Link to="/confirmOrder/chooseAddress/addAddress/searchAddress" className="choose-address">{searchAddress ? searchAddress.name : '小区/写字楼/学校等'}</Link>
            <input type="text" name="address-detail" placeholder="详细地址（如门牌号等）" value={addressDetail} onChange={(e) => handleInput('address-detail',e)} className="input-style" />
          </div>
        </div>
        <div className="section-list">
          <span className="list-left">标签</span>
          <div className="list-right">
            <input type="text" name="tag" placeholder="无/家/学校/公司" value={tag} onChange={(e) => handleInput('tag',e)} className="input-style" />
          </div>
        </div>
      </div>
      <div className="confirm-btn" onClick={addAddress}>确定</div>
      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip}/> }
      <CSSTransition 
        in={location.pathname === '/confirmOrder/chooseAddress/addAddress/searchAddress'} 
        timeout={500} appear={true}
        classNames="router-slid"
        unmountOnExit={true}>
        <Outlet />
      </CSSTransition>
    </div>
  )
}

export default connect(
  state => ({geohash: state.geohash.geohash,userInfo: state.user,searchAddress: state.order.searchAddress}),
  dispatch => (
    {
      saveNewAddress: data => dispatch(saveNewAddress(data))
    }
  )
)(AddAddress)