import React, { useState } from 'react'
import { connect } from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar';
import AlertTip from '@/components/alert-tip';

function Commend(props) {

  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);


  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }



  // 进行分享
  const share = () => {
    setShowAlert(true);
    setAlertText('请在饿了么APP中打开');
  }

  return (
    <div className="children-container detail-box commend-container">
      <ToolBar title="推荐有奖" goBack={true} />
      <div className="activity-banner">
        <img src={require('../../../../assets/image/activity.png')} alt="" />
      </div>
      <div className="invite-firend">
        <div className="invite-firend-style">
          <img src={require('../../../../assets/image/weixin.png')} alt="" onClick={share} />
          <p>邀请微信好友</p>
        </div>
        <div className="invite-firend-style">
          <img src={require('../../../../assets/image/qq.png')} alt="" onClick={share} />
          <p>邀请QQ好友</p>
        </div>
        <div className="invite-firend-style">
          <img src={require('../../../../assets/image/fenxiang.png')} alt="" onClick={share} />
          <p>面对面邀请</p>
        </div>
      </div>
      <div className="invite-num">
        <div className="invite-num-style">
          <p>累计收益</p>
          <p><span>0</span>元</p>
        </div>
        <div className="invite-num-style invite-people">
          <p>成功邀请</p>
          <p><span>0</span>人</p>
        </div>
      </div>
      <p className="income-detail">-收益明细-</p>
      <div className="incom_tips">
        <img src={require('../../../../assets/image/qianbao.png')} />
        <p>还不赶紧去邀请好友</p>
      </div>
      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip} />}
    </div>
  )
}

export default connect(
  state => ({ userInfo: state.user })
)(Commend)