import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { useNavigate, Outlet, useLocation, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar'
import AlertTip from '@/components/alert-tip';
import Loader from '@/components/loader';
import CSSTransition from 'react-transition-group/CSSTransition';
import { getHongbaoApi } from '@/api/benefit';

const tabs = [
  { name: '红包', type: 1, id: 1 },
  { name: '商家代金券', type: 2, id: 2 },
]

function Benefit(props) {

  const navigate = useNavigate();
  const location = useLocation();

  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cateType, setCateType] = useState(1);
  const [hongbaoList, setHongbaoList] = useState([]); // 红包列表


  useEffect(() => {
    initData();
  }, [])

  const userInfo = useMemo(() => {
    return props.userInfo;
  }, [props.userInfo])


  useEffect(() => {
    initData();
  }, [userInfo])

  const initData = () => {
    if (userInfo && userInfo.user_id) {
      getHongbaoApi(userInfo.user_id).then(res => {
        setHongbaoList(res);
        setIsLoading(false);
      })
    }
  }

  const chooseTab = (type) => {
    setCateType(type);
  }

  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }

  const toDesc = () => {
    navigate('/benefit/hbDescription')
  }

  return (
    <div className="benefit-container">
      <ToolBar title="我的优惠券" goBack={true} />

      {!isLoading ? <div className="benefit-content">
        <div className="cate-tabs">
          {tabs.map((item, index) => (
            <span key={item.id} className={`tab-item${cateType == item.type ? ' choosed' : ''}`} onClick={() => chooseTab(item.type)}>{item.name}</span>
          ))}
        </div>
        <CSSTransition in={cateType == 1} classNames="router-fade" timeout={100} appear={true} unmountOnExit={true}>
          <Fragment>
            <div className="hongbao-container">
              <header className="hongbao-header">
                <div className="total-num">
                  有 <span>{hongbaoList.length}</span> 个红包即将到期
                </div>
                <div className="hongbao-desc" onClick={toDesc}>
                  <img src={require('@/assets/image/description.png')} height="24" width="24" alt="" />
                  <span className="desc-text">红包说明</span>
                </div>
              </header>
              <ul className="hongbao-list-ul">
                {hongbaoList.map((item, index) => (
                  <li className="hongbao-item" key={item.id}>
                    <div className="hongbao-item-content">
                      <div className="item-left">
                        <span className="unit">¥</span>
                        <span className="int-part">{String(item.amount).split('.')[0]}</span>
                        <span className="dot">.</span>
                        <span className="decimal-part">{String(item.amount).split('.')[1] || 0}</span>
                        <p className="desc">{item.description_map.sum_condition}</p>
                      </div>
                      <div className="item-right">
                        <h4>{item.name}</h4>
                        <p>{item.description_map.validity_periods}</p>
                        <p>{item.description_map.phone}</p>
                      </div>
                      <div className="time-remaining">{item.description_map.validity_delta}</div>
                    </div>
                    {item.limit_map && <footer className="list-footer-item">
                      <p>{item.limit_map.restaurant_flavor_ids}</p>
                    </footer>}
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/benefit/hbHistory" className="hongbao-history">
              <span className="check-history">查看历史红包</span>
              <span className="iconfont icon-arrow_right"></span>
            </Link>
            <footer className="hongbao-footer">
              <Link to="/benefit/exchange" className="footer-btn-style">兑换红包</Link>
              <Link to="/benefit/commend" className="footer-btn-style">推荐有奖</Link>
            </footer>
          </Fragment>

        </CSSTransition>

        <CSSTransition in={cateType == 2} classNames="router-fade" timeout={100} appear={true} unmountOnExit={true}>
          <div className="voucher-container">
            <section className="voucher-header">
              <img src={require('../../assets/image/description.png')} height="24" width="24" />
              <Link to="/benefit/coupon" className ="hongbao-detail">商家代金券说明</Link>
            </section>
            <section className="unable-use">
              <img src={require("../../assets/image/voucher.png")} height="170" width="300" />
              <p>无法使用代金券</p>
              <p>非客户端或客户端版本过低</p>
              <Link to="/download" className="download-app">
                下载或升级客户端
              </Link>
            </section>
          </div>
        </CSSTransition>
      </div> : <Loader />}

      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip} />}

      <CSSTransition
        in={
          location.pathname === '/benefit/hbDescription' ||
          location.pathname === '/benefit/hbHistory' ||
          location.pathname === '/benefit/exchange' ||
          location.pathname === '/benefit/commend' ||
          location.pathname === '/benefit/coupon'
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
  state => ({ userInfo: state.user })
)(Benefit)