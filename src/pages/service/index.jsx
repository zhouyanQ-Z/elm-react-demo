import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './index.scss';
import { connect } from 'react-redux'
import Toolbar from '@/components/toolbar';
import CSSTransition from 'react-transition-group/CSSTransition';
import {getServiceApi} from '@/api/service';
import { saveQuestion } from '../../store/actions';

function Service(props) {

  const [serviceData,setServiceData] = useState(null); // 服务信息
  const [questionTitle,setQuestionTitle] = useState([]); // 问题标题
  const [questionDetail,setQuestionDetail] = useState([]); // 问题详情
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initData();
  },[])

  const initData = () => {
    getServiceApi().then(res => {
      setServiceData(res);
      let qTitle = questionTitle;
      let qDetail = questionDetail;
      Object.keys(res).forEach(item => {
        let avoidRepeat = false;
        qTitle.forEach(itemTitle => {
          // 防止数据重复
          if(itemTitle == res[item]) avoidRepeat = true;
        })
        //将标题和内容分别放进数组中
        if(item.indexOf('Caption') !== -1 && !avoidRepeat) {
          qTitle.push(res[item])
        } else if (!avoidRepeat) qDetail.push(res[item]);
      })
      setQuestionTitle(qTitle);
      setQuestionDetail(qDetail);
    })
  }

  const toQuestionDetail = (title,index) => {
    //保存问题详情
    props.saveQuestion({title, detail: questionDetail[index]})
    navigate('/service/questionDetail');
  }

  return (
    <div className="service-container">
      <Toolbar title="服务中心" goBack={true} />
     
      <div className="service-connect">
        <a href="https://ecs-im.ele.me/" className="service-left">
          <span className="iconfont icon-service"></span>
          <span className="label-text">在线客服</span>
        </a>

        <a href="tel:10105757" className="service-right">
          <span className="iconfont icon-phone"></span>
          <span className="label-text">在线客服</span>
        </a>
      </div>

      {serviceData && <div className="hot-questions">
        <h4 className="qustion-header">热门问题</h4>
        <ul className="question-ul">
          {questionTitle.map((item,index) => (
            <li className="question-item" key={index} onClick={() => toQuestionDetail(item,index)}>
              <span>{item}</span>
              <span className="iconfont icon-arrow_right"></span>
            </li>
          ))}
        </ul>
      </div>}

      <CSSTransition
        in={
          location.pathname === '/service/questionDetail'
          }
        timeout={500} appear={true}
        classNames="router-slid"
        unmountOnExit={true}
        key={location.pathname}>
        <Outlet />
      </CSSTransition>
    </div>
  )
}

export default connect(
  state => ({}),
  dispatch => ({
    saveQuestion: (data) => dispatch(saveQuestion(data))
  }),
)(Service);