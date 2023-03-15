import React, { useState,useEffect,useMemo } from 'react'
import { Link,Outlet,useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import CSSTransition from 'react-transition-group/CSSTransition'
import './index.scss'
import ToolBar from '@/components/toolbar'
import QueueAnim from 'rc-queue-anim'
import { imgBaseUrl } from '@/config/envConfig'

function Profile(props){
  
  const [username,setUsername] = useState('')
  const [mobile,setMobile] = useState('')
  const [balance,setBalance] = useState(0)
  const [couponCount,setCouponCount] = useState(0)
  const [points,setPoints] = useState(0)
  const [avatar,setAvatar] = useState('')

  const location = useLocation()

  

  useEffect(() => {
    initData()
  },[])

  let userInfo = useMemo(() => {
    return props.userInfo
  },[props.userInfo])

  useEffect(() => {
    initData();
  },[userInfo])

  
  
  // 初始化数据
  const initData = () => {
    if(userInfo && userInfo.user_id) {
      setAvatar(userInfo.avatar)
      setUsername(userInfo.username)
      setMobile(userInfo.mobile || '暂无绑定手机号')
      setBalance(userInfo.balance)
      setCouponCount(userInfo.gift_amount)
      setPoints(userInfo.point)
    } else {
      setUsername('登录/注册')
      setMobile('暂无绑定手机号')
    }
  }

  return (
    <div className="profile-container">
      <QueueAnim type="bottom">
        <ToolBar title="我 的" />
        <div className="profile-main" key="s1">
          <div className="profile-info-main">
            <Link to={userInfo&&userInfo.user_id ? '/profile/info':'/login'} className="profile-link">
              <img className="profile-img" src={userInfo&&userInfo.user_id ? (imgBaseUrl + avatar) : require('@/assets/image/default-avatar.png')} alt="" />
              <div className="user-info">
                <div className="user-name">{username}</div>
                <div className="phone-wrap">
                  <span className="iconfont icon-mobile"></span>
                  <span className="phone-number">{mobile}</span>
                </div>
              </div>
              <span className="iconfont icon-arrow_right"></span>
            </Link>
          </div>
          <div className="info-data clearfix" key="i1">
            <Link to="/balance" className="info-data-item">
              <span className="item-top">
                <span className="num-strong">{parseInt(balance).toFixed(2)}</span>元
              </span>
              <span className="item-bottom">我的余额</span>
            </Link>
            <Link to="/benefit" className="info-data-item">
              <span className="item-top">
                <span className="num-strong">{couponCount}</span>个
              </span>
              <span className="item-bottom">我的优惠</span>
            </Link>
            <Link to="/points" className="info-data-item">
              <span className="item-top">
                <span className="num-strong">{points}</span>分
              </span>
              <span className="item-bottom">我的积分</span>
            </Link>
          </div>
          <div className="profile-list m-top10">
            {/*<QueueAnim delay="0.4">*/}
              <Link to="/order" className="list-item" key="i2">
                <span className="iconfont icon-dingdan"></span>
                <div className="item-content">
                  <span className="item-text">我的订单</span>
                  <span className="iconfont icon-arrow_right"></span>
                </div>
              </Link>
              <a href="https://home.m.duiba.com.cn/#/chome/index" className="list-item" key="i3">
                <span className="iconfont icon-shangcheng"></span>
                <div className="item-content">
                  <span className="item-text">积分商城</span>
                  <span className="iconfont icon-arrow_right"></span>
                </div>
              </a>
              <Link to="/vipcard" className="list-item" key="i4">
                <span className="iconfont icon-huiyuan"></span>
                <div className="item-content">
                  <span className="item-text">饿了么会员卡</span>
                  <span className="iconfont icon-arrow_right"></span>
                </div>
              </Link>
              <Link to="/service" className="list-item m-top10" key="i5">
                <span className="iconfont icon-fuwuzhongxin"></span>
                <div className="item-content">
                  <span className="item-text">服务中心</span>
                  <span className="iconfont icon-arrow_right"></span>
                </div>
              </Link>
              <Link to="/download" className="list-item">
                <span className="iconfont icon-elemo"></span>
                <div className="item-content">
                  <span className="item-text">下载饿了么APP</span>
                  <span className="iconfont icon-arrow_right"></span>
                </div>
              </Link>
            {/*</QueueAnim>*/}
          </div>
        </div>
      </QueueAnim>
      <CSSTransition 
        in={
          location.pathname === '/profile/info' ||
          location.pathname === '/profile/info/setUsername' ||
          location.pathname === '/profile/info/address'||
          location.pathname === '/profile/info/address/add' ||
          location.pathname === '/profile/info/address/add/addDetail'
        } 
        timeout={500}
        appear={true}
        classNames="router-slid"
        unmountOnExit={true}
        key={location.pathname}>
        <Outlet />
      </CSSTransition>
    </div>
  )
}

export default connect(
  state => ({userInfo: state.user}),
)(Profile)