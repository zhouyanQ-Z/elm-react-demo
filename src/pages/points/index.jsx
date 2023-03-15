import React, { useState,useEffect,useMemo } from 'react'
import { useNavigate,Outlet,useLocation } from 'react-router-dom'
import './index.scss'
import ToolBar from '@/components/toolbar'
import AlertTip from '@/components/alert-tip';
import CSSTransition from 'react-transition-group/CSSTransition'

export default function Points(props) {

  const navigate = useNavigate();
  const location = useLocation();

  const [alertText,setAlertText] = useState('');
  const [showAlert,setShowAlert] = useState(false);

  const toDetail = () => {
    navigate('/points/detail');
  }

  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }

  const usePoints = () => {
    setShowAlert(true);
    setAlertText('快去下单赚取大量积分吧');
  }

  return (
    <div className="balance-container">
      <ToolBar title="我的积分" goBack={true} />
      <div className="balance-content">
        <div className="content-box">
          <header className="content-header">
            <span className="content-title-style">当前积分</span>
            <div className="content-desc" onClick={toDetail}>
              <img src={require('@/assets/image/description.png')} height="24" width="24" alt="" />
              <span className="content-title-style">积分说明</span>
            </div>
          </header>
          <div className="content-num">
            <span className="num">0</span>
            <span className="unit">分</span>
          </div>
          <div className="promit-btn" onClick={usePoints}>积分兑换商品</div>
        </div>
      </div>

      <div className="deal-detail">最近30天积分记录</div>
      <div className="no-log">
        <img src={require('@/assets/image/no-log.png')} alt="" />
        <p>最近30天无积分纪录</p>
        <p>快去下单赚取大量积分吧</p>
      </div>
      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip}/> }

      <CSSTransition 
        in={
          location.pathname === '/points/detail'
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