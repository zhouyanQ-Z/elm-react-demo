import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar';
import BScroll from 'better-scroll';
import Loader from '@/components/loader';
import {expiredHongbaoApi} from '@/api/benefit'

function BenefitHistory(props) {

  const [isLoading, setIsLoading] = useState(true);
  const [expiredList, setExpiredList] = useState([]); // 历史红包列表

  useEffect(() => {
    initData();
  },[])

  const userInfo = useMemo(() => {
    return props.userInfo;
  },[props.userInfo])


  useEffect(() => {
    initData();
  },[userInfo])

  const initData = () => {
    if(userInfo && userInfo.user_id) {
      expiredHongbaoApi(userInfo.user_id).then(res => {
        setExpiredList(res);
        setIsLoading(false);
        //  new BScroll('#scroll-box',{
        //    deceleration: 0.001,
        //    bounce: true,
        //    swipeTime: 1800,
        //    click: true,
        //  })
      })
    }
  }

  return (
    <div className="children-container hbhistory-container">
      <ToolBar title="历史红包" goBack={true} />
      {!isLoading ? <div className="scroll-container" id="scroll-box">
        <ul className="hongbao-list-ul">
          {expiredList.map((item, index) => (
            <li className="hongbao-item" key={item.id}>
              <div className="hongbao-item-content">
                <div className="item-left">
                  <span className="unit">¥</span>
                  <span className="int-part">{String(item.amount).split('.')[0]}</span>
                  <span className="dot">.</span>
                  <span className="decimal-part">{String(item.amount).split('.')[1] || 0}</span>
                  <p className="desc">{item.description_map.sum_condition}</p>
                </div>
                <div className="item-right">
                  <h4>{item.name}</h4>
                  <p>{item.description_map.validity_periods}</p>
                  <p>{item.description_map.phone}</p>
                </div>
              </div>
              {item.limit_map && <footer className="list-footer-item">
                <p>{item.limit_map.restaurant_flavor_ids}</p>
              </footer>}
              <span className="iconfont icon-iconseal expired"></span>
            </li>
          ))}
        </ul>
      </div> : <Loader />}
    </div>
  )
}

export default connect(
  state => ({userInfo: state.user})
)(BenefitHistory)