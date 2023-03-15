import React, { useState,useEffect,useMemo } from 'react'
import { useNavigate,Outlet,useLocation } from 'react-router-dom'
import './index.scss'
import ToolBar from '@/components/toolbar'
import AlertTip from '@/components/alert-tip';
import CSSTransition from 'react-transition-group/CSSTransition'

export default function Balance(props) {

  const navigate = useNavigate();
  const location = useLocation();

  const [alertText,setAlertText] = useState('');
  const [showAlert,setShowAlert] = useState(false);


  const toDetail = () => {
    navigate('/balance/detail');
  }

  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }


  return (
    <div className="balance-container">
      <ToolBar title="我的余额" goBack={true} />
      <div className="balance-content">
        <div className="content-box">
          <header className="content-header">
            <span className="content-title-style">当前余额</span>
            <div className="content-desc" onClick={toDetail}>
              <img src={require('@/assets/image/description.png')} height="24" width="24" alt="" />
              <span className="content-title-style">余额说明</span>
            </div>
          </header>
          <div className="content-num">
            <span className="num">0.00</span>
            <span className="unit">元</span>
          </div>
          <div className="withdraw-btn">提现</div>
        </div>
      </div>

      <div className="deal-detail">交易明细</div>
      <div className="no-log">
        <img src={require('@/assets/image/no-log.png')} alt="" />
        <p>暂无明细记录</p>
      </div>
      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip}/> }

      <CSSTransition 
        in={
          location.pathname === '/balance/detail'
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