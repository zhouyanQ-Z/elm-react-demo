import React, { useState,useEffect,useRef } from 'react'
import { Link } from 'react-router-dom'
import ToolBar from '@/components/toolbar'
//import { connect } from 'react-redux'
import store from '@/store'
import './index.scss'
import cache from '@/utils/cache'
import { getRestaurantsApi } from '@/api/search'
import Empty from '@/components/empty'
import { confirm } from '@/utils/app/modal'
import { imgBaseUrl } from '@/config/envConfig'

const SEARCH_HISTORY = 'searchHistory'

export default function Search(props){
  const [title] = useState('搜 索')
  const [searchValue,setSearchValue] = useState('') // 搜索内容
  const [searchResult,setSearchResult] = useState([]) // 搜索结果
  const [searchHistory,setSearchHistory] = useState([]) // 搜索历史记录
  const [showHistory,setShowHistory] = useState(true) // 是否显示历史记录，只有在返回搜索结果后隐藏
  const [emptyResult,setEmptyResult] = useState(false) // 搜索结果为空时显示
  let [geohash,setGeohash] = useState('')
  // useRef解决useState异步问题 但还是会有一些延迟
  const searchValRef = useRef()

  useEffect(() => {
    // 获取经纬度
    setGeohash(store.getState().geohash.geohash)
    
    // 获取搜索历史
    setSearchHistory(getHistory())
  },[])

  useEffect(() => {
    searchValRef.current = searchValue
  },[searchValue])

  const getHistory = () => {
    return cache.local.getJSON(SEARCH_HISTORY) || []
  }
  

  //搜索结束后，删除搜索内容直到为空时清空搜索结果，并显示历史记录
  const handleChange = (e) => {
    const searchVal = e.target.value.trim()
    setSearchValue(searchVal)
    if(searchVal === '') {
      setShowHistory(true) //显示历史记录
      setSearchResult([]) //清空搜索结果
      setEmptyResult(false) //隐藏搜索为空提示
    }
  }

  // 更新搜索历史缓存
  const updateHistory = (history) => {
    cache.local.setJSON(SEARCH_HISTORY,history)
  }

  // 记录搜索历史 
  const setHistory = val => {
    if(!val) return
    const history = getHistory()
    const index = history.indexOf(val)
    index > -1 && history.splice(index,1)
    history.unshift(val)
    setSearchHistory([...history])
    updateHistory(history)
  }

  // 点击提交
  const handleSubmit = async (searchVal,e) => {
    // 阻止事件的默认行为
    e.preventDefault()
    if(searchVal) setSearchValue(searchVal)
    // 修正useRef解决useState异步问题
    setTimeout(async() => {
      if(!searchValRef.current) return
      // 隐藏搜索历史
      setShowHistory(false)
      // 获取搜索结果
      const result = await getRestaurantsApi({geohash,keyword: searchValRef.current})
      //console.log(result.length);
      Array.isArray(result) && setSearchResult(result)

      setEmptyResult(!result.length)
      // 记录搜索历史
      setHistory(searchValRef.current)
    },100)
    
  }

  // 删除历史记录
  const deleteHistory = (index) => {
    
    const history = searchHistory
    history.splice(index,1)
    setSearchHistory([...history]) // 深拷贝
    updateHistory(history)
  }

  // 删除全部历史记录
  const clearAllHistory = () => {
    confirm('重要提示','您确认要删除全部历史记录吗？',() => {
      setSearchHistory([])
      updateHistory([])
    })
  }

  return (
    <div className="search-container">
      <ToolBar title={ title }/>

      <div className="search-main">
        <form className="search-form bg-f">
          <input type="search" name="search" className="search-input" value={searchValue} onChange={handleChange} placeholder="请输入商家或美食名称" />
          <input type="submit" name="submit" className="search-submit" onClick={(e) => handleSubmit('',e)} />
        </form>
        {searchResult.length > 0 && <div className="search-list">
          <div className="list-title">商家</div>
          <div className="list-content">
            {searchResult.map((item,index) => (
              <Link className="list-item" to={{pathname: '/shop',query: {id: item.id}}} key={index}>
                <div className="item-left">
                  <img className="item-img" src={imgBaseUrl + item.image_path} alt="" />
                </div>
                <div className="item-right">
                  <div className="item-right-text">
                    <div>
                      <span className="name">{item.name}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="14" className="pay-icon">
                          <polygon points="0,14 4,0 24,0 20,14" style={{fill:'none',stroke:'#FF6000',strokeWidth:1 }} />
                          <line x1="1.5" y1="12" x2="20" y2="12" style={{stroke:'#FF6000',strokeWidth:1.5}}/>
                          <text x="3.5" y="9" style={{fill:'#FF6000',fontSize:9,fontWeight:'bold'}}>支付</text>
                      </svg>
                    </div>
                    <div>月售 {item.month_sales||item.recent_order_num} 单</div>
                    <div>{item.delivery_fee||item.float_minimum_order_amount}元起送 / 距离{item.distance}</div>
                  </div>
                  <div className="item-right-detail">
                    {item.activities.map((activity,idex) => (
                      <div className="activity-item" key={idex}>
                        <span style={{backgroundColor: '#' + activity.icon_color}} className="activity-icon">{activity.icon_name}</span>
                        <span className="activity-name">{activity.name}</span>
                        <span className="only-phone">(手机客户端专享)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div> }
        {(searchHistory.length > 0 && showHistory) && <div className="search-history">
          <div className="history-title">搜索历史</div>
          <div className="history-content bg-f">
            {searchHistory.map((item,index) => (
              <div className="history-item" key={item + index}>
                <span className="item-text oneline-hide" onClick={(e) => handleSubmit(item,e)}>{item}</span>
                <span className="iconfont icon-clear" onClick={() => deleteHistory(index)}></span>
              </div>
            ))}
          </div>
          <div className="clear-history bg-f" onClick={clearAllHistory}>清空搜索历史</div>
        </div> }
        {emptyResult && <Empty tips="很抱歉！暂无相关搜索结果。" />}
      </div>
    </div>
  )
}

//export default connect(
//  state => ({geohash: state.geohash}),
//)(Search)