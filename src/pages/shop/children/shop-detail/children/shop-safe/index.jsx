import React,{useState,useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import BScroll from 'better-scroll'
import './index.scss'
import ToolBar from '@/components/toolbar'
//import { localapi, proapi,imgBaseUrl } from '@/config/envConfig'
import { imgBaseUrl } from '@/config/envConfig'
import { getImgPath } from '@/utils/common'


function ShopSafe(props) {
  const [localapi,setLocalApi] = useState('')
  const [proapi,setProApi] = useState('')
  const location = useLocation()
  const { shopDetail } = props
  useEffect(() => {
    new BScroll('#scroll-section',{
      deceleration: 0.001,
      bounce: true,
      swipeTime: 1800,
      click: true,
    })
  },[])
  return (
    <div className="shopsafe-container">
      <ToolBar title="食品监督安全公示" goBack={true} />

      <div className="shopsafe-main" id="scroll-section">
        <div>
          <div className="shop-status-container">
            <div className="status-title">食品监督安全公示</div>
            <div className="status-detail">
              <div className="detail-left">
                {shopDetail.status == 1 ? <span className="iconfont icon-res-well"></span> : <span className="iconfont icon-res-bad"></span> }
              </div>
              <div className="detail-right">
                <div className="check-date-top">
                  <span className="check-text">监督检查结果：</span>
                  {shopDetail.status == 1 ? <span className="status-well">良好</span> : <span className="status-bad">差</span> }
                </div>
                <div className="check-date-bottom">
                  <span className="check-text">检查日期：</span>
                  <span className="date">{shopDetail.identification.identificate_date && shopDetail.identification.identificate_date.split('T')[0]}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="shop-status-container">
            <div className="status-title">工商登记信息</div>
            <div className="status-list">
              <div className="status-item">
                <span className="item-label">企业名称</span>
                <span className="item-content">{shopDetail.identification.company_name}</span>
              </div>
              <div className="status-item">
                <span className="item-label">工商执照注册号</span>
                <span className="item-content">{shopDetail.identification.identificate_agency}</span>
              </div>
              <div className="status-item">
                <span className="item-label">注册资本</span>
                <span className="item-content">{shopDetail.identification.registered_number}</span>
              </div>
              <div className="status-item">
                <span className="item-label">注册地址</span>
                <span className="item-content">{shopDetail.identification.registered_address}</span>
              </div>
              <div className="status-item">
                <span className="item-label">属地监管所</span>
                <span className="item-content">{shopDetail.identification.registered_principal}</span>
              </div>
              <div className="status-item">
                <span className="item-label">法定代表人</span>
                <span className="item-content">{shopDetail.identification.legal_person}</span>
              </div>
              <div className="status-item">
                <span className="item-label">经营范围</span>
                <span className="item-content">{shopDetail.identification.operation_period}</span>
              </div>
            </div>
          </div>
          <div className="shop-status-container">
            <div className="status-title">餐饮许可证</div>
            <div className="status-list">
              <div className="status-item">
                <span className="item-label">营业范围</span>
                <span className="item-content">{shopDetail.identification.operation_period}</span>
              </div>
              <div className="status-item">
                <span className="item-label">许可证有效期</span>
                <span className="item-content">{shopDetail.identification.licenses_date}</span>
              </div>
              <div className="status-item">
                <span className="item-label">许可证号</span>
                <span className="item-content">{shopDetail.identification.licenses_number}</span>
              </div>
              <div className="status-item">
                <span className="item-label">发证时间</span>
                <span className="item-content">{shopDetail.identification.licenses_scope}</span>
              </div>
              <div className="status-item">
                <span className="item-label">发证机关</span>
                <span className="item-content">{shopDetail.identification.registered_principal}</span>
              </div>
            </div>
          </div>
          <div className="license-img shop-status-container">
            <div className="status-title">许可证书</div>
            <div className="license-img-container">
              <img src={ localapi || proapi ? imgBaseUrl + shopDetail.license.business_license_image : getImgPath(shopDetail.license.business_license_image)} />
              <img src={ localapi || proapi ? imgBaseUrl + shopDetail.license.catering_service_license_image : getImgPath(shopDetail.license.catering_service_license_image)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => ({ shopDetail: state.shop.shopDetail })
)(ShopSafe)