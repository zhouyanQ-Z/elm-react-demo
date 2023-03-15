import React, {useState,useEffect,useMemo}from "react"
import { useNavigate,useSearchParams } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar'
import AlertTip from '@/components/alert-tip'
import { changeOrderParam,orderSuccess } from "@/store/actions"
import { getVerifyApi,validateOrderApi } from "@/api/order"

function UserValidation(props) {
  const [validate,setValidate] = useState('') // 验证码
  let [countDown,setCountDown] = useState(60) // 倒计时
  //const [sig,setSig] = useState(null) // sig值
  const [reCallVerify,setReCallVerify] = useState(null) // 重发验证码
  const [showAlert,setShowAlert] = useState(false)
  const [alertText,setAlertText] = useState(null)
  const [showVoiceTip,setShowVoiceTip] = useState(false) // 显示语音验证
  const [type,setType] = useState('sms')

  let timer = null
  const navigate = useNavigate()
  const [searchParam] = useSearchParams()

  useEffect(() => {
    //setSig(searchParam.get('sig'))

    count()
    getData(type)
  },[])

  // useEffect可以返回一个函数，该函数将在组件被卸载时的执行，可以等效于componentWillUnmount。
  useEffect(() => {
    return () => {
      clearInterval(timer)
    }
  },[])

  const needValidate = useMemo(() => {
    return props.needValidate
  },[props.needValidate])
  const cart_id = useMemo(() => {
    return props.cart_id
  },[props.cart_id])
  const sig = useMemo(() => {
    return props.sig
  },[props.sig])
  const orderParam = useMemo(() => {
    return props.orderParam
  },[props.orderParam])

  // 倒计时
  const count = () => {
    countDown = 60
    setCountDown(60)
    clearInterval(timer)
    timer = setInterval(() => {
      setCountDown(--countDown)
      if(countDown == 0) {
        clearInterval(timer)
      }
    }, 1000);
  }

  const getData = (type) => {
    getVerifyApi(cart_id,{sig,type}).then(res => {
      if(res.message) {
        setReCallVerify(res)
        setShowAlert(true)
        setAlertText(res.message)
      }
    })
  }

  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }

  // 确认订单
  const confirmOrder = () => {
    props.changeOrderParam({validation_code: validate,validation_token: reCallVerify.validation_token})
    validateOrderApi(orderParam).then(res => {
      //如果信息错误则提示，否则进入付款页面
      if(res.message) {
        setShowAlert(true)
        setAlertText(res.message)
        return
      }
      props.orderSuccess(res)
      navigate('/confirmOrder/payment')
    })
  }

  // 输入框输入事件
  const handleInput = (e) => {
    let value = e.target.value
    value = value.slice(0,6) // react中的maxLength无效
    setValidate(value)
  }

  // 重新发送
  const recall = () => {
    count()
    setType('sms')
    getData('sms')
  }

  //发送语音验证
  const sendVoice = () => {
    setShowVoiceTip(true)
    setType('voice')
    getData('voice')
  }

  return (
    <div className="uservalidation-container">
      <ToolBar title="用户手机验证" goBack={true}/>
      <div className="uservalidation-main">
        {showVoiceTip && <div className="voice-tips">
          <p className="tips-text">电话拨打中...</p>
          <p className="tips-text">请留意来自 <span>10105757</span> 或者 <span>021-315754XX</span> 的电话</p>
        </div>}
        <div className="tips-header">
          <span>收不到短信？使用 </span>
          <span className="header-text" onClick={sendVoice}>语音验证码</span>
        </div>
        <div className="validation-form">
          <input type="text" name="validate" value={validate} onChange={handleInput} placeholder="验证码" />
          {countDown > 0 ? <span className="disable">{countDown} S</span> : <span className="repost" onClick={recall}>重新发送</span> }
        </div>
      </div>
      <div className="confirm-btn" onClick={confirmOrder}>确定</div>
      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip}/> }
    </div>
  )
}

export default connect(
  state => ({needValidation: state.order.needValidation,cart_id: state.order.cartId,sig: state.order.sig,orderParam: state.order.orderParam}),
  dispatch => (
    {
      changeOrderParam: data => dispatch(changeOrderParam(data)),
      orderSuccess: data => dispatch(orderSuccess(data)),
    }
  )
)(UserValidation)