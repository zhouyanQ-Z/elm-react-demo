import React, {useState}from "react"
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar'
import { saveInvoice } from "@/store/actions"


function Invoice(props) {
  const [useInvoice,setUseInvoice] = useState(false) // 是否选择开发票

  const navigate = useNavigate()

  // 是否选择发票信息
  const chooseInvoice = () => {
    setUseInvoice(!useInvoice)
  }

  //保存发票信息
  const confirmInvoice = () => {
    props.saveInvoice(useInvoice)
    navigate(-1)
  }

  return (
    <div className="invoice-container">
      <ToolBar title="选择发票抬头" goBack={true}/>
      <div className="invoice-main">
        <div className="choose-invoice">
          <span className="invoice-item">不需要开发票</span>
          <span className={`iconfont icon-choose ${useInvoice ? 'choosed':''}`} onClick={chooseInvoice}></span>
        </div>
        <div className="confirm-btn" onClick={confirmInvoice}>确定</div>
      </div>
    </div>
  )
}

export default connect(
  state => ({}),
  dispatch => (
    {
      saveInvoice: data => dispatch(saveInvoice(data))
    }
  )
)(Invoice)