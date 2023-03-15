import React from 'react';
//import { useNavigate, useLocation } from 'react-router-dom'
import './index.scss'
import ToolBar from '@/components/toolbar';

export default function InvoiceRecord(props) {
  return (
    <div className="children-container detail-box invoice-record-container">
      <ToolBar title="购买记录" goBack={true} />
      {/* 还没有数据 */}
      <div className="invoice-content">
        <img src={require('../../../../assets/image/no-log.png')} alt="" />
        <p>没有购买记录</p>
      </div>
    </div>
  )
}