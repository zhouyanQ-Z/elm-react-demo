import React, { useState,useEffect } from 'react'
import './index.scss'
import ToolBar from '@/components/toolbar'
import AlertTip from '@/components/alert-tip';

export default function Download(props) {


  const [alertText,setAlertText] = useState('');
  const [showAlert,setShowAlert] = useState(false);
  const [system,setSystem] = useState(null);



  useEffect(() => {
    // 判断系统
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 ||  u.indexOf('Linux') > -1;
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid) {
      setSystem('Android');
    } else if(isIOS) {
      setSystem('IOS');
    } else {
      setSystem('pc');
    }
  },[])
  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }

  const download = () => {
    //如果是ios用户则提示，否则直接下载
    if(system == 'IOS') {
      setShowAlert(true);
      setAlertText('IOS用户请前往AppStore下载');
    } else {
      try {
        let elIF = document.createElement('iframe');
        elIF.src = 'http://cangdu.org/files/elm.apk';
        elIF.style.display = 'none';
        document.body.appendChild(elIF);
      } catch (error) {
        setShowAlert(true);
        setAlertText('下载失败');
      }
    }
  }


  return (
    <div className="download-container">
      <ToolBar title="下载" goBack={true} />
      <div className="dowload-content">
        <img src={require('../../assets/image/elmlogo.jpeg')} className="logo-img" />
        <p>下载饿了么APP</p>
        <div className="download-btn" onClick={download}>下载</div>
      </div>

      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip}/> }
    </div>
  )
}