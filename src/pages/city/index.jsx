import React, { useState,useEffect } from 'react'
import { useParams,useNavigate,Link } from 'react-router-dom'
import './index.scss'
import ToolBar from '@/components/toolbar'
import {getCurrentCityApi,searchPlaceApi} from '@/api/city'
import cache from '@/utils/cache'
import {throttle} from '@/utils/common'
import Empty from '@/components/empty'
import {toast,confirm} from '@/utils/app/modal'

export default function City(props) {

  const [cityname,setCityname] = useState('') // 当前城市名字
  const [cityid,setCityid] = useState('') // 当前城市id
  const [placeList,setPlaceList] = useState([]) // 搜索城市列表
  const [placeHistory,setPlaceHistory] = useState([]) // 历史搜索记录
  const [inputValue,setInputValue] = useState('') // 搜索内容
  const [showHistory,setShowHistory] = useState(true) // 默认显示搜索历史头部，点击搜索后隐藏
  const [noPlace,setNoPlace] = useState(false)  // 搜索无结果，显示提示信息
  const [isDelete,setIsDelete] = useState(false)

  const { cityId } = useParams();

  const navigate = useNavigate()

  useEffect(() => {
    // 接收传过来的cityid
    if(cityId) {
      setCityid(cityId)
      // 获取当前城市名字
      getCurrentCityApi(cityId).then(res => {
        setCityname(res.name)
      })
      initData()
    }
  },[])

  // 初始化数据
  const initData = () => {
    // 获取搜索历史记录
    if(cache.local.getJSON('placeHistory')) {
      setPlaceHistory(cache.local.getJSON('placeHistory'))
    } else {
      setPlaceHistory([])
    }
  }

  // 输入搜索内容
  const handleInput = (e) => {
    let val = e.target.value.trim()
    //setInputValue(val)
    // 搜索提交
    let search = throttle(handleSubmit,1000)
    search(val)
  }

  // 搜索
  const handleSubmit = (searchVal) => {
    //e.preventDefault()
    setInputValue(searchVal)

    if(searchVal) {
      searchPlaceApi({ city_id: cityId, keyword: searchVal, type: 'search' }).then(res => {
        if(res.message) {
          toast(res.message)
          return
        } else {
          setPlaceList(res)
          setShowHistory(false)
          setNoPlace(!res.length)
        }
      })
    } else {
      setPlaceList([])
      setNoPlace(false)
      setShowHistory(true)
    }
  }

  // 选择搜索地址
  const choosePlace = (index) => {
    let targetItem = placeList[index]
    let history = cache.local.getJSON('placeHistory') || []
    let idex = history.findIndex(item => item.geohash == targetItem.geohash && item.name == targetItem.name)
    idex > -1 && history.splice(idex,1)
    history.unshift({name: targetItem.name,geohash: targetItem.geohash})
    cache.local.setJSON('placeHistory',history)

    
    navigate('/msite',{state: { geohash: targetItem.geohash }})
    //console.log(navigate);
  }

  // 点击删除按钮
  const handleDelete = () => {
    setIsDelete(true)
  }

  // 删除搜索历史（单个删除）
  const handleClearItem = (index,event) => {
    event.stopPropagation()
    let history = cache.local.getJSON('placeHistory') || []
    history.splice(index,1)
    cache.local.setJSON('placeHistory',history)
    setPlaceHistory(history)
  }

  // 删除搜索历史（全部删除）
  const handleClearAll = () => {
    confirm('重要提示','您确定要删除全部历史记录吗？',() => {
      cache.local.setJSON('placeHistory',[])
      setPlaceHistory([])
    })
  }

  // 退出删除模式
  const handleClearExist = () => {
    setIsDelete(false)
  }



  return (
    <div className="city-container">
      <ToolBar title={cityname} goBack={true}>
        <Link slot='change-city' to="/location" className="toolbar-right">切换城市</Link>
      </ToolBar>
      <div className="city-main">
        <form className="city-form" onSubmit={(e) => e.preventDefault()}>
          <div className="search-input">
            <span className="iconfont icon-search_1"></span>
            <input className="city-input" type="search" name="city" placeholder="输入学校、商务楼、地址" value={inputValue} onInput={handleInput} required/>
          </div>
          {/*<div className="search-submit">
            <input className="city-submit" type="submit" name="submit" value="提交" onClick={handleSubmit} />
          </div>*/}
        </form>
        {showHistory && <div className="history-container city-main-content">
          {placeHistory.length ? <div className="history-content">
            <div className="history-header">
              <span className="history-title">历史搜索</span>
              { !isDelete ? <span className="iconfont icon-delete" onClick={handleDelete}></span> : <div className="del-container">
                <span className="del-text-all" onClick={handleClearAll}>全部删除</span>
                <span className="split-line">&nbsp;|&nbsp;</span>
                <span className="del-text-cancel" onClick={handleClearExist}>完成</span>
              </div> }
            </div>
            <div className="history-list clearfix">
              {placeHistory.map((item,index) => (
                <div className="history-item" onClick={() => handleSubmit(item.name)} key={index}>
                  <span>{item.name}</span>
                  <span className={`iconfont icon-clear ${isDelete ? 'show':''}`} onClick={(e) => handleClearItem(index,e)}></span>
                </div>
              ))}
            </div>
          </div> : <Empty tips="暂无历史搜索"/>
          }
        </div>}
        {!showHistory && <div className="placelist-container city-main-content">
          {placeList.length && <div className="place-content">
            {placeList.map((item,index) => (
              <div className="place-item" onClick={() => choosePlace(index)} key={index}>
                <div className="place-name oneline-hide">{item.name}</div>
                <div className="place-address oneline-hide">{item.address}</div>
              </div>
            ))}
          </div>}
          {noPlace && <Empty tips="很抱歉！暂无搜索结果"/>}
        </div> }
      </div> 
    </div>
  )
}