import React, { useState,useEffect,useMemo } from 'react'
import { Link } from 'react-router-dom'
import './index.scss'
import { getCitiesApi } from '@/api/city'
import ToolBar from '@/components/toolbar'


export default function Location(props) {

  const [guessCity,setGuessCity] = useState('') //当前城市
  const [guessCityid,setGuessCityId] = useState('') //当前城市id
  const [hotCity,setHotCity] = useState([]) //热门城市列表
  const [groupCity,setGroupCity] = useState({}) //所有城市列表

  useEffect(() => {
    // 获取当前城市
    getCitiesApi({type: 'guess'}).then(res => {
      setGuessCity(res.name)
      setGuessCityId(res.id)
    })
    //获取热门城市
    getCitiesApi({type: 'hot'}).then(res => {
      setHotCity(res)
    })
    //获取所有城市
    getCitiesApi({type: 'group'}).then(res => {
      setGroupCity(res)
    })
  },[])

  // 实现computed 将获取的数据按照A-Z字母开头排序
  const sortGroupCity = useMemo(() => {
    let sortObj = {}
    for (let i = 65; i <= 90; i++) {
      if(groupCity[String.fromCharCode(i)]) {
        sortObj[String.fromCharCode(i)] = groupCity[String.fromCharCode(i)]
      }
    }
    return sortObj
  },[groupCity])

  const reload = () => {
    window.location.reload()
  }
  return (
    <div className="location-container">
      <ToolBar signUp="location">
        {/*<span slot='logo' className="toolbar-left" onClick={reload}>ele.com</span>*/}
        <Link slot='logo' to="/msite" className="toolbar-left">ele.com</Link>
      </ToolBar>
      <div className="location-main">
        <div className="city-nav">
          <div className="location-tip">
            <span className="tip-left">当前定位城市：</span>
            <span className="tip-right">定位不准确时，请在城市列表中选择</span>
          </div>
          <Link to={`/city/${guessCityid}`} className="guess-city">
            <span className="city-name">{guessCity}</span>
            <span className="iconfont icon-arrow_right"></span>
          </Link>
        </div>
        <div className="hotcity-container m-top10">
          <div className="city-title">热门城市</div>
          <div className="hotcity-list clearfix">
            {hotCity.map((item,index) => (
              <Link to={`/city/${item.id}`} className="hotcity-item" key={item.id}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="groupcity-container m-top10">
          {Object.keys(sortGroupCity).map((keyItem,index) => (
            <div className="groupcity-item-container" key={keyItem}>
              <div className="city-title">
                {keyItem}
                {index == 0 && <span className="letter-sort">（按字母排序）</span> }
              </div>
              <div className="groupcity-list clearfix">
                {sortGroupCity[keyItem].map((item,idex) => (
                  <Link to={`/city/${item.id}`} className="groupcity-item oneline-hide" key={item.id}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}