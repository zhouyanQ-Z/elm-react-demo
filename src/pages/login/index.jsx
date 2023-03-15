import React,{ useState,useEffect } from 'react'
import {useNavigate,Link} from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import {isMobile} from '@/utils/verify.js'
import {mobileCodeApi,checkExistsApi,getCaptchaApi,sendLogin,accountLogin} from '@/api/user'
import ToolBar from '@/components/toolbar'
import AlertTip from '@/components/alert-tip'
import cache from '@/utils/cache'
import { saveUserInfo } from '@/store/actions'
import Animate from 'rc-animate'

let timer;
function Login(props) {

  const navigate = useNavigate()

  const [loginWay,setLoginWay] = useState(false) //登录方式，默认短信登录
  const [mobile,setMobile] = useState('') //手机号
  const [mobileCode,setMobileCode] = useState('') //短信验证码
  const [rightNumber,setRightNumber] = useState(false) // 手机号码是否正确
  const [cutdown,setCutdown] = useState(0) // 倒计时
  const [showAlert,setShowAlert] = useState(false) //显示提示组件
  const [alertText,setAlertText] = useState('密码错误') //提示的内容
  const [validate_token,setValidateToken] = useState('') //获取短信时返回的验证值，登录时需要
  const [userAccount,setUserAccount] = useState('') // 用户名
  const [password,setPassword] = useState('') // 密码
  const [showPassword,setShowPassword] = useState(false) // 是否显示密码
  const [codeNumber,setCodeNumber] = useState('') //图形验证码
  const [captchaCodeImg,setCaptchaCodeImg] = useState('') //图形验证码图片

  useEffect(() => {
    // 获取验证码
    if(!loginWay) {
      getCaptchaImg()
    }
  },[])

  useEffect(() => {
    setRightNumber(isMobile(mobile))
  },[mobile])

  //const goBack = () => {
  //  navigate(-1)
  //}

  // 输入框输入
  const handleInput = (e,type) => {
    let value = e.target.value
    // react中的maxLength无效
    if(type == 'mobile') { // 输入手机号
      value = value.slice(0,11)
      setMobile(value)
    } else if(type == 'mobileCode') { // 输入手机验证码
      value = value.slice(0,6)
      setMobileCode(value)
    } else if(type == 'userAccount') { // 输入账号
      setUserAccount(value)
    } else if(type == 'password') { // 输入密码
      setPassword(value)
    } else if(type == 'codeNumber') { // 输入图形验证码
      value = value.slice(0,4)
      setCodeNumber(value)
    }
  }

  // 获取验证码
  const getVerifyCode = async (e) => {
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
  }

  // componentWillUnmount
  useEffect(() => {
    return () => {
      clearInterval(timer)
    }
  },[])

  // 登录
  const handleLogin = async () => {
    let userInfo
    if(loginWay) { // 手机验证码登录
      if(!rightNumber) {
        setShowAlert(true)
        setAlertText('手机号码不正确')
        return
      } else if(!/\d{6}$/gi.test(mobileCode)) {
        setShowAlert(true)
        setAlertText('短信验证码不正确')
        return
      }
      // 手机号登录
      userInfo = await sendLogin({mobile,code: mobileCode,validate_token})
    } else { // 账号登录
      if(!userAccount) {
        setShowAlert(true)
        setAlertText('请输入手机号/邮箱/用户名')
        return
      } else if(!password) {
        setShowAlert(true)
        setAlertText('请输入密码')
        return
      } else if(!codeNumber) {
        setShowAlert(true)
        setAlertText('请输入验证码')
        return
      }
      // 账号登录
      userInfo = await accountLogin({username: userAccount,password,captcha_code: codeNumber})
    }
    //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
    //console.log(userInfo);
    if(!userInfo.user_id) {
      if(!loginWay) getCaptchaImg()
    } else {
      cache.local.set('userId',userInfo.user_id)
      props.saveUserInfo(userInfo)
      navigate(-1)
    }
  }

  // 切换密码显示
  const changePasswordStatus = () => {
    setShowPassword(!showPassword)
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
        <ToolBar title={loginWay ? '登 录': '密码登录'} goBack={true}/>
        <div className="login-main">
          {loginWay ? (
            <form className="loginForm bg-f">
              <div className="input-container mobile-number">
                <input type="number" placeholder="请输入手机号码" name="mobile" maxLength={11} value={mobile} onChange={(e) => handleInput(e,'mobile')} />
                {cutdown <= 0 ? (<button onClick={getVerifyCode} className={rightNumber? 'right-mobile':''}>获取验证码</button>) : (
                  <button onClick={(e) => {e.preventDefault()}}>已发送{cutdown}s</button>
                )}
              </div>
              <div className="input-container">
                <input type="text" placeholder="验证码"  name="mobileCode" maxLength={6} value={mobileCode} onChange={(e) => handleInput(e,'mobileCode')}/>
              </div>
            </form>

          ):(
            <form className="loginForm bg-f">
              <div className="input-container">
                <input type="text" placeholder="账号" value={userAccount} onChange={(e) => handleInput(e,'userAccount')} />
              </div>
              <div className="input-container">
                {!showPassword ? (
                  <input type="password" placeholder="密码" value={password} onChange={(e) => handleInput(e,'password')} />
                ) : (
                  <input type="text" placeholder="密码" value={password} onChange={(e) => handleInput(e,'password')} />
                )}
                <div className={`switch-button ${showPassword ? 'switch-active': ''}`}>
                  <div className={`switch-circle-btn ${showPassword ? 'to-right': ''}`} onClick={changePasswordStatus}></div>
                  { showPassword?(<span className="switch-on">ON</span>):(<span className="switch-off">OFF</span>)}
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
          )}
          <div className="login-tips">
            <p>温馨提示：未注册过的账号，登录时将自动注册</p>
            <p>注册过的用户可凭账号密码登录</p>
          </div>
          <div className="login-btn" onClick={handleLogin}>登录</div>
          {!loginWay && <Link className="to-forget" to="/forget">重置密码？</Link>}
          {showAlert && <AlertTip alertText={alertText} closeTip={closeTip}/> }
        </div>
      </div>
    </Animate>
  )
}

export default connect(
  () => ({}),
  dispatch => (
    {
      saveUserInfo: data => dispatch(saveUserInfo(data))
    }
  )
)(Login)