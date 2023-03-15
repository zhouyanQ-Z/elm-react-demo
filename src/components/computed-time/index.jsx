import React, {useState,useMemo,useEffect} from "react";
import './index.scss'
import AlertTip from '@/components/alert-tip'


export default function ComputedTime(props) {

  let [countNum,setCountNum] = useState(900)
  const [showAlert,setShowAlert] = useState(false)
  const [alertText,setAlertText] = useState(null)

  const {time} = props
  let timer = null

  useEffect(() => {
    countNum -= numTime
    setCountNum(countNum)
    remainingTime()
  },[])
  
  let numTime = useMemo(() => {
    if(time.toString().indexOf('分钟') !== -1) {
      return parseInt(time)*60
    } else {
      return parseInt(time)
    }
  },[time])

  // 计算时间
  let remainingTime = () => {
    clearInterval(timer)
    timer = setInterval(() => {
      setCountNum(--countNum)
      if(countNum == 0) {
        clearInterval(timer)
        setShowAlert(true)
        setAlertText('支付超时')
      }
    }, 1000);
  }

  //转换时间成分秒
  let remaining = useMemo(() => {
    let minute = parseInt(countNum/60)
    let second = parseInt(countNum%60)
    if(minute < 10) {
      minute = '0' + minute
    }
    if(second < 10) {
      second = '0' + second
    }
    return '去支付（还剩' + minute + '分' + second + '秒）'
  },[countNum])

  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }

  // 支付
  const gotoPay = () => {
    setShowAlert(true)
    setAlertText('暂不开放支付接口')
  }

  return (
    <div className="computedtime-container">
      <span className="remain-time" onClick={gotoPay}>{remaining}</span>
      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip}/> }
    </div>
  )
}