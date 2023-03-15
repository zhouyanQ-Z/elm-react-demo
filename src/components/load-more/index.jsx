import React from "react";
import './index.css';
export default function LoadMore(props) {
   return (
    <div className="loadmore-container">
      {props.status === 'loadmore' && <div>下拉加载</div> }
      {props.status === 'loading' && <div>加载中...</div> }
      {props.status === 'nomore' && <div>已加载全部内容</div> }
    </div>
   )
}