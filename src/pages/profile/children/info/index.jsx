import React ,{useState,useEffect,useMemo}from "react"
import {Link,useNavigate,Outlet,useLocation} from 'react-router-dom'
import {connect} from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar'
import { imgBaseUrl } from '@/config/envConfig'
import store from '@/store'
import AlertTip from '@/components/alert-tip'
import { outLogin } from "@/store/actions"
import cache from "@/utils/cache"
import {logoutApi} from '@/api/user'
import CSSTransition from 'react-transition-group/CSSTransition'

function ProfileInfo(props) {

  //const [userInfo,setUserInfo] = useState({});
  const [showAlert,setShowAlert] = useState(false);
  const [alertText,setAlertText] = useState(null);
  const [username,setUsername] = useState('') // 用户名
  const [mobile,setMobile] = useState('') // 用户手机
  const [avatar,setAvatar] = useState('') // 用户头像
  const [isEnter,setIsEnter] = useState(false) // 退出登录进入
  const [isLeave,setIsLeave] = useState(false) // 退出登录离开
  const [isLogout,setIsLogout] = useState(false) // 显示退出登录

  let timer = -1;
  const navigate = useNavigate();

  const location = useLocation()

  let userInfo = useMemo(() => {
    return props.userInfo;
  },[props.userInfo])

  useEffect(() => {
    if(userInfo && userInfo.user_id) {
      setUsername(userInfo.username);
      setAvatar(userInfo.avatar);
      setMobile(userInfo.mobile);
    }
  },[userInfo])

  // componentWillUnmount
  useEffect(() => {
    return () => {
      clearTimeout(timer)
    }
  })

  // 上传头像
  const uploadAvatar = async () => {
    if(userInfo) {
      let input = document.querySelector('.avatar-upload');
      let data = new FormData();
      data.append('file',input.files[0]);
      try {
        let response = await fetch('/eus/v1/users'+userInfo.user_id+'/avatar',{
          method: 'POST',
          credentials:'include',
          body: data
        })
        let res = await response.json();
        if(res.status == 1) userInfo = Object.assign({},userInfo,{avatar: res.image_path})

      } catch (error) {
        setShowAlert(true);
        setAlertText('上传失败');
        throw new Error(error);
      }
    }
  }

  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }

  // 改变手机号
  const changePhone = () => {
    setShowAlert(true);
    setAlertText('请在手机APP中设置');
  }

  // 退出登录
  const logout = () => {
    setIsLogout(true);
    setIsEnter(true);
    setIsLeave(false);
  }

  // 确认退出
  const confirmLogout = async () => {
    props.outLogin();
    waiting();
    navigate(-1);
    cache.local.remove('userId');
    await logoutApi()
  }

  // 再等等
  const waiting = () => {
    clearTimeout(timer);
    setIsEnter(false);
    setIsLeave(true);
    timer = setTimeout(() => {
      clearTimeout(timer);
      setIsLogout(false)
    },200)
  }


  return (
    <div className="profileinfo-container">
      <ToolBar title="账户信息" goBack={true} />
      <div className="profile-info">
        <div className="div-box">
          <input type="file" className="avatar-upload" onChange={uploadAvatar} />
          <span className="text">头像</span>
          <div className="div-right">
            {userInfo.id ? <img src={ imgBaseUrl +  userInfo.avatar} alt="" className="avatar-right-div" /> : 
            <span className=" iconfont icon-default-avatar avatar-right-div"></span> }
            <span className="iconfont icon-arrow_right"></span>
          </div>
        </div>

        <Link to="/profile/info/setUsername" className="info-router">
          <div className="div-box div-box2">
            <span className="text">用户名</span>
            <div className="div-right">
              <p className="username">{username}</p>
              <span className="iconfont icon-arrow_right"></span>
            </div>
          </div>
        </Link>

        <Link to="/profile/info/address" className="info-router">
          <div className="div-box div-box2 div-box3">
            <span className="text">收货地址</span>
            <div className="div-right">
              <span className="iconfont icon-arrow_right"></span>
            </div>
          </div>
        </Link>

        <div className="box-title">账号绑定</div>
        <div className="info-router" onClick={changePhone}>
          <div className="div-box div-box2 div-box3">
            <div className="div-left"><img src={require('@/assets/image/bindphone.png')} alt="" />手机</div>
            <div className="div-right">
              <p className="username">{mobile}</p>
              <span className="iconfont icon-arrow_right"></span>
            </div>
          </div>
        </div>

        <div className="box-title">安全设置</div>
        <Link to="/forget" className="info-router">
          <div className="div-box div-box2 div-box3">
            <span className="text">登录密码</span>
            <div className="div-right">
              <p className="username">修改</p>
              <span className="iconfont icon-arrow_right"></span>
            </div>
          </div>
        </Link>

        <div className="logout-btn" onClick={logout}>退出登录</div>
      </div>

      {isLogout && <div className="logout-container">
        <div className="cover-box"></div>
        <div className={`content-box${isEnter ? ' cover-animate':''}${isLeave ? ' cover-animate-leave':''}`}>
          <div className="warning-icon">
            <span className="icon-body"></span>
            <span className="icon-dot"></span>
          </div>
          <p className="title">是否退出登录？</p>
          <div className="btn-box">
            <div className="waiting-btn" onClick={waiting}>再等等</div>
            <div className="exit-btn" onClick={confirmLogout}>退出登录</div>
          </div>
        </div>
      </div> }
      
      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip}/> }

      <CSSTransition
        in={ location.pathname === '/profile/info/setUsername' || 
              location.pathname === '/profile/info/address' || 
              location.pathname === '/profile/info/address/add' ||
              location.pathname === '/profile/info/address/add/addDetail'}
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
  state => ({userInfo: state.user}),
  dispatch => (
    {
      outLogin: () => dispatch(outLogin())
    }
  )
)(ProfileInfo)