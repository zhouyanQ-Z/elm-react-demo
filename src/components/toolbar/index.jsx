import React, { useState,useEffect,useMemo } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import ProTypes from 'prop-types'
import './index.scss'
import {createSlot} from '@/utils/common'
import store from '@/store'

function ToolBar(props) {

  //const [userInfo,setUserInfo] = useState({})

  const navigate = useNavigate()

  //useEffect(() => {
  //  setUserInfo(store.getState().user)
  //},[])

  let userInfo = useMemo(() => {
    return props.userInfo
  },[props.userInfo])

  const handleBack = () => {
    navigate(-1)
  }

  //handleSearch = () => {
  //  this.props.goSearch()
  //}


  return (
    <div className="toolbar-container">
      {createSlot('logo',props.children)}
      {createSlot('search',props.children)}
      { props.goBack && <div className="toolbar-left iconfont icon-arrow_left" onClick={handleBack}></div> }
      {/*{ props.goSearch && <div className="toolbar-left iconfont icon-search_1" onClick={this.handleSearch}></div> }*/}
      { props.title && <div className="toolbar-title oneline-hide">{props.title}</div> }
      { props.signUp && <Link className="toolbar-right" to={userInfo && userInfo.user_id ? '/profile':'/login'}>
        {userInfo && userInfo.user_id ? <span className="iconfont icon-avatar"></span>: <span className="fs-30">登录 | 注册</span> }
      </Link>
      }
      {/*{ props.signUp === true ? <Link className="toolbar-right iconfont icon-avatar" to="/profile"></Link> : props.signUp === false && <Link className="toolbar-right fs-30" to="/login">登录 | 注册</Link> }*/}
      {createSlot('msite-title',props.children)}
      {createSlot('edit',props.children)}
      {createSlot('change-city',props.children)}
    </div>
  )
}

ToolBar.propTypes = {
  title: ProTypes.string,
  signUp: ProTypes.string,
  goBack: ProTypes.bool,
}

export default connect(
  state => ({userInfo: state.user})
)(ToolBar)