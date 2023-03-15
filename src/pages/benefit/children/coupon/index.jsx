import React from 'react'
import './index.scss'
import ToolBar from '@/components/toolbar';
import BScroll from 'better-scroll'

export default function Coupon(props) {

  //useEffect(() => {
  //  new BScroll('#scroll-box',{
  //    deceleration: 0.001,
  //    bounce: true,
  //    swipeTime: 1800,
  //    click: true,
  //  })
  //},[])

  return (
    <div className="children-container detail-box">
      <ToolBar title="代金券说明" goBack={true} />
      <div className="scroll-container" id="scroll-box">
        <div className="markdown">
          <h3 id="q1-">Q1: 什么是商家代金券？</h3>
          <p>商家代金券是指由商家自己发放代金券，只限在指定的商家使用，可根据条件抵扣相应金额。</p>
          <h3 id="q2-">Q2: 怎么获得商家代金券？</h3>
          <ul>
            <li>进入有「进店领券」或「下单返券」标示的商家即有机会获得代金券。</li>
            <li>「下单返券」需要在指定商家完成满足返券金额要求的订单后才会返还，代金券可在下次下单时使用。</li>
          </ul>
          <h3 id="q3-">Q3: 商家代金券使用条件</h3>
          <ul>
            <li>商家代金券仅限在指定商家使用</li>
            <li>商家代金券仅限在线支付使用</li>
            <li>每个订单只能使用一张商家代金券，不可与其他代金券叠加使用</li>
          </ul>
        </div>
      </div>
    </div>
  )
}