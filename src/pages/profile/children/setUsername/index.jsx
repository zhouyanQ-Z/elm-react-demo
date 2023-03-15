import React ,{useState,useEffect,useMemo}from "react"
import {Link,useNavigate} from 'react-router-dom'
import {connect} from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar'
//import AlertTip from '@/components/alert-tip'
import { resetUsername } from "@/store/actions"
import {logoutApi} from '@/api/user'

function SetUsername(props) {

  const [borderLight,setBorderLight] = useState(false);
  const [username,setUsername] = useState('') // 用户名
  const [warn,setWarn] = useState(false) // 输入框提示
  const [opacityAll,setOpacityAll] = useState(false) // 字体透明度

  const navigate = useNavigate();




  const handleInput = (e) => {
    let val = e.target.value;
    setUsername(val);

    if(val.length<5 || val.length > 24) {
      setBorderLight(true);
      setWarn(true);
      setOpacityAll(false);
      //return false;
    } else {
      setBorderLight(false);
      setWarn(false);
      setOpacityAll(true);
      //return true;
    }
  }

  // 修改用户名
  const updateUsername = () => {
    if(!opacityAll) return;
    props.resetUsername(username);

    navigate(-1);
  }


  return (
    <div className="children-container">
      <ToolBar title="修改用户名" goBack={true} />
      <div className="setname-box">
        <div className="setname-input">
          <input type="text" placeholder="输入用户名" className={borderLight ?'input-border':''} value={username} onChange={handleInput} />
          <div className="tips-box">
            {!warn ? <span className="tips-text">用户名只能修改一次（5-24字符之间）</span> :  <span className="warn-text">用户名长度在5到24位之间</span>}
          </div>
        </div>
        <div className='updateusername-btn' onClick={updateUsername}>
          <span className={opacityAll?'all-opacity':''}>确认修改</span>
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => ({}),
  dispatch => (
    {
      resetUsername: (value) => dispatch(resetUsername(value))
    }
  )
)(SetUsername)