import React,{ useState,useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
//import { connect } from 'react-redux'
import './index.scss'
//import {isMobile} from '@/utils/verify.js'
import {mobileCodeApi,checkExistsApi,getCaptchaApi,resetPasswordApi} from '@/api/user'
import ToolBar from '@/components/toolbar'
import AlertTip from '@/components/alert-tip'
//import cache from '@/utils/cache'
//import { saveUserInfo } from '@/store/actions'
import Animate from 'rc-animate'

let timer;
export default function Forget(props) {

  const navigate = useNavigate()

  //const [loginWay,setLoginWay] = useState(false) //登录方式，默认短信登录
  //const [mobile,setMobile] = useState('') //手机号
  //const [mobileCode,setMobileCode] = useState('') //短信验证码
  //const [rightNumber,setRightNumber] = useState(false) // 手机号码是否正确
  //const [cutdown,setCutdown] = useState(0) // 倒计时
  const [showAlert,setShowAlert] = useState(false) //显示提示组件
  const [alertText,setAlertText] = useState('密码错误') //提示的内容
  //const [validate_token,setValidateToken] = useState('') //获取短信时返回的验证值，登录时需要
  const [userAccount,setUserAccount] = useState('') // 用户名
  const [oldPassword,setOldPassword] = useState('') // 旧密码
  const [newPassword,setNewPassword] = useState('') // 新密码
  const [confirmPassword,setConfirmPassword] = useState('') // 确认密码
  const [showOldPassword,setShowOldPassword] = useState(false) // 是否显示密码
  const [showNewPassword,setShowNewPassword] = useState(false) // 是否显示密码
  const [showConfPassword,setShowConfPassword] = useState(false) // 是否显示密码
  const [codeNumber,setCodeNumber] = useState('') //图形验证码
  const [captchaCodeImg,setCaptchaCodeImg] = useState('') //图形验证码图片

  useEffect(() => {
    // 获取验证码
    getCaptchaImg()
  },[])

  //useEffect(() => {
  //  setRightNumber(isMobile(mobile))
  //},[mobile])

  // 输入框输入
  const handleInput = (e,type) => {
    let value = e.target.value
    // react中的maxLength无效
    if(type == 'userAccount') { // 输入账号
      setUserAccount(value)
    } else if(type == 'oldPassword') { // 输入旧密码
      setOldPassword(value)
    } else if(type == 'newPassword') { // 输入新密码
      setNewPassword(value)
    } else if(type == 'confirmPassword') { // 输入确认密码
      setConfirmPassword(value)
    } else if(type == 'codeNumber') { // 输入图形验证码
      value = value.slice(0,4)
      setCodeNumber(value)
    }
  }

  // 获取验证码
  /*const getVerifyCode = async (e) => {
    e.preventDefault()
    if(rightNumber) {
      let time = 30
      setCutdown(time)
      timer = setInterval(() => {
        setCutdown(--time)
        if(time == 0) clearInterval(timer)
      }, 1000);

      // 判断用户是否存在
      let exists = await checkExistsApi(mobile,'mobile')
      if(exists.message) {
        setShowAlert(true)
        setAlertText(exists.message)
        return
      }else if(!exists.is_exists) {
        setShowAlert(true)
        setAlertText('您输入的手机号码尚未绑定')
        return
      }
      // 发送短信验证码
      let res = await mobileCodeApi(mobile)
      if(res.message) {
        setShowAlert(true)
        setAlertText(exists.message)
        return
      }
      setValidateToken(res.validate_token)
    }
  }*/

  // componentWillUnmount
  useEffect(() => {
    return () => {
      clearInterval(timer)
    }
  },[])

  // 确认修改
  const handleReset = () => {
    if(!userAccount) {
      setShowAlert(true)
      setAlertText('请输入正确的账号')
      return
    } else if(!oldPassword) {
      setShowAlert(true)
      setAlertText('请输入旧密码')
      return
    } else if(!newPassword) {
      setShowAlert(true)
      setAlertText('请输入新密码')
      return
    } else if(!confirmPassword) {
      setShowAlert(true)
      setAlertText('请输入确认密码')
      return
    } else if(newPassword !== confirmPassword) {
      setShowAlert(true)
      setAlertText('两次输入的密码不一致')
      return
    } else if(!codeNumber) {
      setShowAlert(true)
      setAlertText('请输入验证码')
      return
    }
    let obj = {
      username: userAccount,
      oldpassWord: oldPassword,
      newpassword: newPassword,
      confirmpassword: confirmPassword,
      captcha_code: codeNumber
    }

    resetPasswordApi(obj).then(res => {
      if(res.message) {
        setShowAlert(true)
        setAlertText(res.message)
        return
      } else {
        setShowAlert(true)
        setAlertText('密码修改成功')
        navigate(-1)
      }
    })
  }

  // 切换密码显示
  const changePasswordStatus = (type) => {
    if(type === 'old') setShowOldPassword(!showOldPassword)
    else if (type === 'new') setShowNewPassword(!showNewPassword)
    else if (type === 'confirm') setShowConfPassword(!showConfPassword)
  }

  // 获取图形验证码
  const getCaptchaImg = async () => {
    let res = await getCaptchaApi()
    setCaptchaCodeImg(res.code)
  }

  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }

  return (
    <Animate transitionName="fade">
      <div className="login-container">
        <ToolBar title="重置密码" goBack={true}/>
        <div className="login-main">
          <form className="loginForm bg-f">
            <div className="input-container">
              <input type="text" placeholder="账号" value={userAccount} onChange={(e) => handleInput(e,'userAccount')} />
            </div>
            <div className="input-container">
              {!showOldPassword ? (
                <input type="password" placeholder="旧密码" value={oldPassword} onChange={(e) => handleInput(e,'oldPassword')} />
              ) : (
                <input type="text" placeholder="旧密码" value={oldPassword} onChange={(e) => handleInput(e,'oldPassword')} />
              )}
              <div className={`switch-button ${showOldPassword ? 'switch-active': ''}`}>
                <div className={`switch-circle-btn ${showOldPassword ? 'to-right': ''}`} onClick={()=>changePasswordStatus('old')}></div>
                { showOldPassword ?(<span className="switch-on">ON</span>):(<span className="switch-off">OFF</span>)}
              </div>
            </div>
            <div className="input-container">
              {!showNewPassword ? (
                <input type="password" placeholder="请输入新密码" value={newPassword} onChange={(e) => handleInput(e,'newPassword')} />
              ) : (
                <input type="text" placeholder="请输入新密码" value={newPassword} onChange={(e) => handleInput(e,'newPassword')} />
              )}
              <div className={`switch-button ${showNewPassword ? 'switch-active': ''}`}>
                <div className={`switch-circle-btn ${showNewPassword ? 'to-right': ''}`} onClick={()=>changePasswordStatus('new')}></div>
                { showNewPassword ? (<span className="switch-on">ON</span>):(<span className="switch-off">OFF</span>)}
              </div>
            </div>
            <div className="input-container">
              {!showConfPassword ? (
                <input type="password" placeholder="请确认新密码" value={confirmPassword} onChange={(e) => handleInput(e,'confirmPassword')} />
              ) : (
                <input type="text" placeholder="请确认新密码" value={confirmPassword} onChange={(e) => handleInput(e,'confirmPassword')} />
              )}
              <div className={`switch-button ${showConfPassword ? 'switch-active': ''}`}>
                <div className={`switch-circle-btn ${showConfPassword ? 'to-right': ''}`} onClick={()=>changePasswordStatus('confirm')}></div>
                { showConfPassword ? (<span className="switch-on">ON</span>):(<span className="switch-off">OFF</span>)}
              </div>
            </div>
            <div className="input-container captchacode-container">
              <input type="text" placeholder="验证码"  name="mobileCode" maxLength={4} value={codeNumber} onChange={(e) => handleInput(e,'codeNumber')}/>
              {captchaCodeImg && <div className="captcha-img">
                <img src={captchaCodeImg} alt="" />
                <div className="change-img" onClick={getCaptchaImg}>
                  <p className="p1">看不清</p>
                  <p className="p2">换一张</p>
                </div>
              </div>}
            </div>
          </form>
          <div className="reset-btn" onClick={handleReset}>确认修改</div>
          {showAlert && <AlertTip alertText={alertText} closeTip={closeTip}/> }
        </div>
      </div>
    </Animate>
  )
}

//export default connect(
//  () => ({}),
//  dispatch => (
//    {
//      saveUserInfo: data => dispatch(saveUserInfo(data))
//    }
//  )
//)(Forget)