import React,{useState} from 'react'
import { Link,Outlet,useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar'
import CSSTransition from 'react-transition-group/CSSTransition'
import { imgBaseUrl } from '@/config/envConfig'

function ShopDetail(props) {
  const location = useLocation()
  const [showImg,setShowImg] = useState(false) // 是否显示图片
  const [checkImg,setCheckImg] = useState(null) // 查看的图片路径
  const { shopDetail } = props

  // 显示图片
  const showLicenseImg = (img) => {
    //console.log('111',img,shopDetail);
    setCheckImg(img)
    setShowImg(true)
  }
  // 关闭显示图片控件
  const closeImg = () => {
    setShowImg(false)
  }

  return (
    <div className="shopdetail-container">
      <ToolBar title="商家详情" goBack={true} />

      <div className="shopdetail-main">
        <div className="activity-container">
          <div className="activity-header">活动与属性</div>
          <div className="activity-list">
            {shopDetail.activities.length > 0 && shopDetail.activities.map((item) => (
              <div className="activity-item" key={item.id}>
                <span className="icon-name" style={{backgroundColor: '#'+item.icon_color}}>{item.icon_name}</span>
                <span className="desc">{item.description}(APP专享)</span>
              </div>
            )) }
          </div>
          <div className="activity-list">
            {shopDetail.supports.length > 0 && shopDetail.supports.map((item) => (
              <div className="activity-item" key={item.id}>
                <span className="icon-name" style={{backgroundColor: '#'+item.icon_color}}>{item.icon_name}</span>
                <span className="desc">{item.description}(APP专享)</span>
              </div>
            ))}
          </div>
        </div>
        <div className="shop-status-container">
          <Link to="shopSafe" className="status-header">
            <span className="status-title">食品监督安全公示</span>
            <div className="status-content">
              <span className="identification-detail">企业认证详情</span>
              <span className="iconfont icon-arrow_right"></span>
            </div>
          </Link>
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
        <div className="shopinfo-container">
          <div className="info-header">商家信息</div>
          <p className="shop-name">{shopDetail.name}</p>
          <p className="shop-address">地址：{shopDetail.address}</p>
          <p className="open-time">营业时间：[{shopDetail.opening_hours[0]}]</p>
          <div className="shop-license" onClick={() => showLicenseImg(shopDetail.license.business_license_image)}>
            <span className="text">营业执照</span>
            <span className="iconfont icon-arrow_right"></span>
          </div>
          <div className="shop-license" onClick={() => showLicenseImg(shopDetail.license.catering_service_license_image)}>
            <span className="text">餐饮服务许可证</span>
            <span className="iconfont icon-arrow_right"></span>
          </div>
        </div>
      </div>
      <CSSTransition in={showImg} timeout={100} appear={true} classNames="fade" unmountOnExit>
        <div className="img-container" onClick={closeImg}>
          <img src={imgBaseUrl+checkImg} alt="" />
        </div>
      </CSSTransition>
      <CSSTransition in={location.pathname === '/shop/shopDetail/shopSafe'} timeout={500} appear={true} classNames="router-slid" unmountOnExit={true}>
        <Outlet />
      </CSSTransition>
    </div>
  )
}

export default connect(
  state => ({ shopDetail: state.shop.shopDetail })
)(ShopDetail)