import React, { useMemo } from 'react';
import { Outlet, useLocation, Link,useNavigate } from 'react-router-dom';
import { connect } from 'react-redux'
import './index.scss';
import Toolbar from '@/components/toolbar';
import CSSTransition from 'react-transition-group/CSSTransition';
import { orderSuccess,buyCard } from '@/store/actions';


function VipCard(props) {

  const location = useLocation();
  const navigate = useNavigate();


  let userInfo = useMemo(() => {
    return props.userInfo;

  }, [props.userInfo])

  const handleBuyCard = () => {
    props.orderSuccess({order_id: '399525134200981325'});
    props.buyCard(20);
    navigate('/confirmOrder/payment')
  }

  return (
    <div className="vipcard-container">
      <Toolbar title="会员中心" goBack={true} />
      {userInfo && userInfo.user_id && <div className="vipcard-content">
        <p className="desc-title">为账户 <span>{userInfo.username}</span> 购买会员</p>
        <div className="vip-prerogative">
          <Link to="/vipcard/vipDescription" className="header-style">
            <span className="header-left">会员特权</span>
            <div className="header-right">
              <span className="desc">会员说明</span>
              <span className="iconfont icon-arrow_right"></span>
            </div>
          </Link>
          <div className="vip-detail">
            <div className="detail-left">
              <img src={require('../../assets/image/sheng.jpeg')} alt="" height="80" width="70" />
            </div>
            <div className="detail-right">
              <h4>减免配送费</h4>
              <p>每月减免30单，每日可减免3单，每单最高减4元</p>
              <p>蜂鸟专送专享</p>
            </div>
          </div>
          <div className="vip-detail">
            <div className="detail-left">
              <img src={require('../../assets/image/jifen.jpeg')} alt="" height="80" width="70" />
            </div>
            <div className="detail-right">
              <h4>减免配送费</h4>
              <p>每月减免30单，每日可减免3单，每单最高减4元</p>
              <p>蜂鸟专送专享</p>
            </div>
          </div>
        </div>

        <div className="apply-vip">
          <header className="header-style">
            <span className="header-left">开通会员</span>
          </header>
          <div className="apply-vip-buy">
            <div className="apply-vip-buy-left">
              <span>1个月</span>
              <span> ¥20</span>
            </div>
            <div className="apply-vip-buy-right" onClick={handleBuyCard}>购买</div>
          </div>
        </div>

        <Link to="/vipcard/useCard" className="header-style use-card">
          <span className="header-left">兑换会员</span>
          <div className="header-right">
            <span className="desc">使用卡号卡密</span>
            <span className="iconfont icon-arrow_right"></span>
          </div>
        </Link>
        <Link to="/vipcard/invoiceRecord" className="header-style use-card">
          <span className="header-left">购买记录</span>
          <div className="header-right">
            <span className="desc">开发票</span>
            <span className="iconfont icon-arrow_right"></span>
          </div>
        </Link>

      </div>}

      <CSSTransition
        in={
          location.pathname === '/vipcard/vipDescription' ||
          location.pathname === '/vipcard/useCard' ||
          location.pathname === '/vipcard/invoiceRecord'
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
  state => ({ userInfo: state.user }),
  dispatch => ({
    orderSuccess: (data) => (dispatch(orderSuccess(data))),
    buyCard: (data) => (dispatch(buyCard(data))),
  })
)(VipCard)