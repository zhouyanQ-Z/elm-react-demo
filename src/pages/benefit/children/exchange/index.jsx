import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar';
import AlertTip from '@/components/alert-tip';
import {getCaptchaApi } from '@/api/user';
import { exchangeHongbaoApi } from '@/api/benefit';

function Exchange(props) {

  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [exchangeCode,setExchangeCode] = useState('')
  const [codeNum,setCodeNum] = useState('')
  const [captchaCodeImg,setCaptchaCodeImg] = useState('')

  useEffect(() => {
    getCaptchaCode();
  },[])

  const userInfo = useMemo(() => {
    return props.userInfo;
  },[props.userInfo])

  const status = useMemo(() => {
    let status = (/^\d+$/gi.test(exchangeCode)) && (/^\w{4}$/gi.test(codeNum));
    return status;
  },[props.userInfo])

  // 获取验证码
  const getCaptchaCode = () => {
    //线上环境采用固定的图片，编译环境获取真实的验证码
    getCaptchaApi().then(res => {
      setCaptchaCodeImg(res.code);
    })
  }

  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }

  // 输入
  const handleInput = (type,e) => {
    let val = e.target.value;
    if(type == 'exchangeCode' && val.length <= 4) {
      setExchangeCode(val)
    } else if (type == 'codeNum') {
      setCodeNum(val);
    }
  }


  // 进行兑换
  const exchange = () => {
    if(status) {
      exchangeHongbaoApi(userInfo.user_id,{exchange_code: exchangeCode,captcha_code: codeNum}).then(res => {
        //不成功则弹出提示框
        if(res.message) {
          getCaptchaCode();
          setShowAlert(true);
          setAlertText(res.message);
        }
      })
    }
  }

  return (
    <div className="children-container">
      <ToolBar title="兑换红包" goBack={true} />
      
      <form action="" className="exchange-code">
        <input type="text" placeholder="请输入兑换码" value={exchangeCode} className="exchange-input" onChange={(e) => handleInput('exchangeCode',e)} />
        <div className="input-box">
          <input type="text" placeholder="验证码" value={codeNum} onChange={(e) => handleInput('codeNum',e)} />
          <div className="img-change">
            {captchaCodeImg && <img src={captchaCodeImg} alt="" /> }
            <div className="change-img" onClick={getCaptchaCode}>
              <p>看不清</p>
              <p>换一张</p>
            </div>
          </div>
        </div>
      </form>
      <div className={`exchangeconfirm-btn${status ? ' active':''}`} onClick={exchange}>兑换</div>
      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip}/> }
    </div>
  )
}

export default connect(
  state => ({userInfo: state.user})
)(Exchange)