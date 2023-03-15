import React,{useState}from "react"
import { useNavigate } from 'react-router-dom'
import {connect} from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar'
import { nearchNearbyApi } from '@/api/order'
import { saveSearchAddress } from "@/store/actions"

function SearchAddress(props) {
  
  const [searchValue,setSearchValue] = useState('') // 输入的搜索内容
  const [searchResult,setSearchResult] = useState(null) // 搜索结果

  const navigate = useNavigate()

  // 文本框输入搜索关键词
  const handleInput = (e) => {
    setSearchValue(e.target.value)
  }

  // 点击搜索
  const searchPlace = () => {
    if(searchValue) {
      nearchNearbyApi({keyword: searchValue}).then(res => {
        setSearchResult(res)
      })
    }
  }

  // 选择地址
  const chooseAddress = (item) => {
    props.saveSearchAddress(item)
    navigate(-1)
  }

  return (
    <div className="searchaddress-container">
      <ToolBar title="搜索" goBack={true}/>
      <div className="searchaddress-main">
        <div className="search-form">
          <input type="search" name="search" placeholder="请输入小区/写字楼/学校等" value={searchValue} onChange={handleInput} className="input-style" />
          <div className="search-btn" onClick={searchPlace}>搜索</div>
        </div>
        {searchResult ? <div className="address-list">
          {searchResult.map((item,index) => (<div className="address-item" key={index} onClick={() => chooseAddress(item)}>
            <div className="address-name">{item.name}</div>
            <div className="address-detail">{item.address}</div>
          </div>))}
        </div> : <div className="empty-tips">
          <p className="one-row">找不到地址？</p>
          <p className="two-row">尝试输入小区、写字楼或学校名</p>
          <p className="three-row">详细地址（如门牌号等）可稍后输入哦</p>
        </div> }
      </div>
    </div>
  )
}

export default connect(
  state => ({}),
  dispatch => (
    {
      saveSearchAddress: data => dispatch(saveSearchAddress(data))
    }
  )
)(SearchAddress)