import React, { useState,useEffect,useMemo } from 'react'
import {useLocation} from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import Toolbar from '@/components/toolbar'
import ShopList from '@/components/shop-list'
import { getPositionApi } from '@/api/position'
import { getRestaurantCateApi,getDeliveryModeApi,getActivityApi } from '@/api/food'
import { saveLatitude, saveLongitude } from '@/store/actions'
import { getImgPath,deepCopy } from '@/utils/common'
import { sortTypes } from '@/enum/sortTypes'


function Food(props) {

  const [title,setTitle] = useState('')  // msiet页面头部标题
  const [foodTitle,setFoodTitle] = useState('') // 排序左侧头部标题
  const [geohash,setGeohash] = useState('') // 地址geohash
  const [categoryId,setCategoryId] = useState('') // 食品分类id
  const [categoryIds,setCategoryIds] = useState('') // 筛选类型的id
  const [sortBy,setSortBy] = useState('') // 筛选条件
  const [sortByType,setSortByType] = useState('') // 排序方式
  const [category,setCategory] = useState([]) // 分类数据
  const [categoryDetail,setCategoryDetail] = useState([]) // category分类右侧的详细数据
  const [delivery,setDelivery] = useState([]) // 配送方式数据
  const [activity,setActivity] = useState([])  // 商家支持活动数据
  const [deliveryMode,setDeliveryMode] = useState(null)  // 配送方式
  let [filterNum,setFilterNum] = useState(0)  // 筛选个数
  const [supportIds,setSupportIds] = useState([])  // 选中的商铺活动列表
  const [confirmStatus,setConfirmStatus] = useState(false)  // 确认选择

  const [flag,setFlag] = useState(false); // 让父组件先加载，子组件shop-list后加载，方便父组件传参

  const location = useLocation()

  useEffect(() => {
    // 初始化数据
    initData()
  },[])

  const latitude = useMemo(() => {
    return props.latitude
  },[props.latitude])

  const longitude = useMemo(() => {
    return props.longitude
  },[props.longitude])

  const initData = async () => {
    if(location.state) {
      const {state:{geohash,title,cateId}} = location
      setGeohash(geohash)
      setTitle(title)
      setFoodTitle(title)
      setCategoryId(cateId)

      if(!latitude) {
        //防止刷新页面时，redux状态丢失，经度纬度需要重新获取，并存入redux
        let res = await getPositionApi(geohash)
        // 记录当前经度和纬度
        saveLatitude(res.latitude)
        saveLongitude(res.longitude)
      }

      // 获取category分类左侧数据 注意：第一项应该为全部商品
      let cate = await getRestaurantCateApi({latitude,longitude})
      initCate(cate)
      //setCategory(cate)
      // 初始化category右侧内容
      cate.forEach((item,index) => {
        if(cateId == item.id) {
          setCategoryDetail(item.sub_categories)
        }
      })

      //获取筛选列表的配送方式
      let deli = await getDeliveryModeApi({latitude,longitude})
      setDelivery(deli)
      //获取筛选列表的商铺活动
      let acit = await getActivityApi({latitude,longitude})
      setActivity(acit)
      //记录support_ids的状态，默认不选中，点击状态取反，status为true时为选中状态
      let ids = []
      acit.forEach((item, index) => {
        ids[index] = { status: false, id: item.id };
      });
      setSupportIds(ids)

      setFlag(true);
    }
  }

  // 点击顶部三个选项选择展示不同的内容
  const chooseType = (type) => {
    if(sortBy !== type) {
      setSortBy(type)
      // 设置标题
      if(type == 'food') {
        setFoodTitle('分类')
      } else {
        //将foodTitle 和 title 进行同步
        setFoodTitle(title)
      }
    } else {
      //再次点击相同选项时收回列表
      setSortBy('')
      if(type == 'food') {
        //将foodTitle 和 title 进行同步
        setFoodTitle(title)
      }
    }
  }

  // 初始化category
  const initCate = (data) => {
    // 深拷贝
    let tempData = deepCopy(data)
    // 如果第一项不是 全部商家，要进行移动
    tempData.map((item,index) => {
      if(item.name == '全部商家') {
        if(index !== 0) {
          tempData.unshift(tempData.splice(index,1)[0])
        }
      }
    })
    setCategory(tempData)
  }

  //选中Category左侧列表的某个选项时，右侧渲染相应的sub_categories列表
  const selectCateName = (id,index,event) => {
    // 阻止事件冒泡
    event.stopPropagation()
    //第一个选项 -- 全部商家 因为没有自己的列表，所以点击则默认获取选所有数据
    if(index === 0) {
      setCategoryIds(null)
      setSortBy('')
    } else {
      //不是第一个选项时，右侧展示其子级sub_categories的列表
      setCategoryId(id)
      setCategoryDetail(category[index].sub_categories)
    }
  }

  // 选中Category右侧列表的某个选项时，进行筛选，重新获取数据并渲染
  const selectCateIds = (id,name,event) => {
    // 阻止事件冒泡
    event.stopPropagation()

    //console.log(id, name)
    setCategoryIds(id)
    setTitle(name)
    setFoodTitle(name)
    setSortBy('')
  }

  // 选择排序方式
  const chooseSortType = (event) => {
    event.stopPropagation()
    //console.log(event);
    let node
    // 如果点击的是 span 中的文字，则需要获取到 span 的父标签 p
    if(event.target.nodeName.toUpperCase() == 'SPAN') {
      node = event.target.parentNode
    } else {
      node = event.target
    }
    setSortByType(node.getAttribute('data-type'))
    setSortBy('')
  }

  // 选择配送方式
  const selectDeliveryMode = (id,event) => {
    event.stopPropagation()
    // deliveryMode为空时，选中当前选项，并且filterNum加一
    if(deliveryMode == null) {
      setDeliveryMode(id)
      setFilterNum(++filterNum)
    } else if(deliveryMode == id) { // deliveryMode为当前值，清空所选项，并且filterNum减一
      setDeliveryMode(null)
      setFilterNum(--filterNum)
    } else { // deliveryMode已有值并且不等于当前项
      setDeliveryMode(id)
    }
  }

  // 选择商家支持活动
  const selectSupportIds = (index,id,event) => {
    event.stopPropagation()
    let support_ids = supportIds
    // 修改状态
    support_ids.splice(index,1,{
      status: !supportIds[index].status,
      id
    })
    //重新计算filterNum的个数
    let num = deliveryMode === null ? 0:1
    num += support_ids.reduce((pre,cur) => {
      return pre + (cur.status ? 1:0)
    },0)
    //console.log(num);
    setSupportIds(support_ids)
    setFilterNum(num)
  }

  // 清空按钮事件
  const handleClear = (event) => {
    event.stopPropagation()
    supportIds.map(item => (item.status = false))
    setSupportIds(supportIds)
    setDeliveryMode(null)
    setFilterNum(0)
  }
  // 确定按钮事件
  const handleConfirm = (event) => {
    event.stopPropagation()
    setConfirmStatus(!confirmStatus)
    setSortBy('')
  }
 
  return (
    <div className="food-container">
      <Toolbar title={title} goBack={true} />

      <div className="food-main">
        <div className="sort-container">
          <div className={`sort-item ${sortBy == 'food' ? 'actived':''}`}  onClick={() => chooseType('food')}>
            <div className="sort-item-inner">
              <span className="sort-item-title">{foodTitle}</span>
              <span className="iconfont icon-triangle-down"></span>
            </div>
            {category.length > 0 && sortBy == 'food' && <div className={`sort-item-content ${sortBy == 'food' ? 'show':''}`}>
              <div className="category-left">
                {category.map((item,index) => (
                  <div className={`category-left-item ${categoryId == item.id ? 'cate-left-actived':''}`} onClick={(e)=> selectCateName(item.id,index,e)} key={index}>
                    <div className="left-content-left">
                      {index > 0 && <img className="left-item-img" src={getImgPath(item.image_url)} alt="" />}
                      <span className="left-item-name">{item.name}</span>
                    </div>
                    <div className="left-content-right">
                      <span className="left-item-count">{item.count}</span>
                      <span className="iconfont icon-arrow_right"></span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="category-right">
                {categoryDetail.map((item,index) => (
                  index > 0 && <div className={`category-right-item ${(categoryIds == item.id || (!categoryIds) && index==0) ? 'cate-right-actived':''}`} key={index} onClick={(e)=>selectCateIds(item.id,item.name,e)}>
                    <span className="right-item-name">{item.name}</span>
                    <span className="right-item-count">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>}
          </div>
          <div className={`sort-item ${sortBy == 'sort' ? 'actived':''}`}  onClick={() => chooseType('sort')}>
            <div className="sort-item-inner">
              <span className="sort-item-title">排序</span>
              <span className="iconfont icon-triangle-down"></span>
            </div>
            {sortBy == 'sort' && <div className={`sort-item-content ${sortBy == 'sort' ? 'show':''}`}>
              <div className="sort-content" onClick={chooseSortType}>
                {sortTypes.data.map((item,index) => (<div className="sort-content-item" key={item.value}>
                  <span className={`iconfont icon-${item.icon}`}></span>
                  <div className="item-content" data-type={item.value}>
                    <span className={`item-text ${sortByType == item.value ? 'actived': ''}`}>{item.name}</span>
                    {sortByType == item.value && <span className="iconfont icon-select"></span> }
                  </div>
                </div>))}
              </div>
            </div>}
          </div>
          <div className={`sort-item ${sortBy == 'activity' ? 'actived':''}`}  onClick={() => chooseType('activity')}>
            <div className="sort-item-inner">
              <span className="sort-item-title">筛选</span>
              <span className="iconfont icon-triangle-down"></span>
            </div>
            {sortBy == 'activity' && <div className={`sort-item-content filter-container ${sortBy == 'activity' ? 'show':''}`}>
              <div className="filter-item">
                <div className="filter-title">配送方式</div>
                <div className="filter-content">
                  {delivery.map((item,index) => (<div className="content-item" key={index} onClick={(e)=>selectDeliveryMode(item.id,e)}>
                    <span style={{opacity: `${(item.id == 0 && deliveryMode != 0 ? 0 : 1)}`}} className={`iconfont icon-${deliveryMode == item.id? 'select':'fengniao'}`}></span>
                    <span className={`item-name ${item.id == deliveryMode ? 'actived' : ''}`}>{item.text}</span>
                  </div>))}
                </div>
              </div>
              <div className="filter-item">
                <div className="filter-title">商家属性（可以多选）</div>
                <div className="filter-content" style={{paddingBottom: '0.24rem'}}>
                  {activity.map((item,index) => (<div className="content-item" key={index} onClick={(e)=>selectSupportIds(index,item.id,e)}>
                    <span style={{display: `${supportIds[index].status ? 'block':'none'}`}} className="iconfont icon-select"></span>
                    <span style={{display: `${!supportIds[index].status ? 'block':'none'}`,color: '#'+item.icon_color,borderColor: '#'+item.icon_color}} className="iconfont filter-icon">{item.icon_name}</span>
                    <span className={`item-name ${supportIds[index].status ? 'actived' : ''}`}>{item.name}</span>
                  </div>))}
                </div>
              </div>
              <div className="filter-item">
                <div className="filter-btn-container">
                  <div className="clear-btn filetr-btn" onClick={handleClear}>清空</div>
                  <div className="confirm-btn filetr-btn" onClick={handleConfirm}>确定 <span style={{display: `${filterNum > 0 ? 'inline-block':'none'}`}}>({filterNum})</span></div>
                </div>
              </div>
            </div>}
          </div>
        </div>

        <div className={`cover ${sortBy ? 'show':''}`}></div>

        <div className="shop-list-container">
          {latitude && flag && <ShopList geohash={ geohash } restaurantCategoryId={categoryId} restaurantCategoryIds={categoryIds} sortByType={sortByType} deliveryMode={deliveryMode} confirmSelect={confirmStatus} supportIds={supportIds} />}
        </div>
      </div>
    </div>
  )
  
}

export default connect(
  state => ({latitude: state.geohash.latitude,longitude: state.geohash.longitude}),
  dispatch => (
    {
      saveLongitude: value => dispatch(saveLongitude(value)),
      saveLatitude: value => dispatch(saveLatitude(value)),
    }
  )
)(Food)