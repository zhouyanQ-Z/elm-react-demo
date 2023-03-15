import React, { useMemo, useState } from 'react';
//import { useNavigate, useLocation } from 'react-router-dom'
import './index.scss'
import ToolBar from '@/components/toolbar';
import store from '@/store';
import AlertTip from '@/components/alert-tip';
import { exchangeVipApi } from '@/api/vipcard';

export default function UseVipCard(props) {

  const [cardNum, setCardNum] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  let userInfo = store.getState().user;

  let status = useMemo(() => {
    return (/^\d{10}$/.test(cardNum)) && (/^\d{6}$/.test(password))
  },[cardNum,password])

  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }

  const handleInput = (type, e) => {
    let val = e.target.value;

    if(type== 'cardNum' && val.length <= 10) setCardNum(val);
    else if(type== 'password' && val.length <= 6) setPassword(val);
  }

  const confirmBuy = () => {
    if(status) {
      exchangeVipApi(userInfo.user_id,{number: cardNum,password}).then(res => {
        if(res.message) {
          setShowAlert(true);
          setAlertText(res.message);
        } else if (res.name) {
          setShowAlert(true);
          setAlertText(res.name);
        }
      })
    }
  }

  return (
    <div className="children-container use-card-container">
      <ToolBar title="兑换会员" goBack={true} />
      <p className="buy-for">成功兑换后将关联到当前帐号： <span>{userInfo.username}</span></p>
      <form action="" className="form-style">
        <input type="text" placeholder="请输入10位卡号" name="cardNum" value={cardNum} onChange={(e) => handleInput('cardNum', e)} />
        <input type="text" placeholder="请输入6位卡密" name="password" value={password} onChange={(e) => handleInput('password', e)} />
      </form>
      <div className={`buycard-btn${status ? ' active':''}`} onClick={confirmBuy}>兑换</div>
      <footer className="binding">
        <h3>——温馨提示——</h3>
        <p>新兑换的会员服务，权益以「会员说明」为准。</p>
        <p>月卡：<b>30次</b>减免配送费。</p>
        <p>季卡：<b>90次</b>减免配送费。</p>
        <p>年卡：<b>360</b>次减免配送费。</p>
        <p>＊仅限蜂鸟专送订单，每日最多减免3单，每单最高减免4元（一个月按31天计算）</p>
      </footer>
      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip} />}
    </div>
  )
}