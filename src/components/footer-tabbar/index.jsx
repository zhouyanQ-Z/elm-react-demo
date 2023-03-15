import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './index.scss'


export default class FooterTabbar extends Component {

  render() {
    return (
      <section className="footer-tabbar footer-fixed bg-f">
        <NavLink className="guide-item" to="/msite">
          <div className="iconfont icon-elment"></div>
          <span className="item-text">外卖</span>
        </NavLink>
        <NavLink className="guide-item" to="/search">
          <div className="iconfont icon-search"></div>
          <span className="item-text">搜索</span>
        </NavLink>
        <NavLink className="guide-item" to="/order">
          <div className="iconfont icon-order"></div>
          <span className="item-text">订单</span>
        </NavLink>
        <NavLink className="guide-item" to="/profile">
          <div className="iconfont icon-profile"></div>
          <span className="item-text">我的</span>
        </NavLink>
      </section>
    )
  }
}