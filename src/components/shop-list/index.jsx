import React, { useEffect, useState, useMemo, useRef,createRef } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ProTypes from 'prop-types'
//import { List } from 'antd-mobile'
//import { List as VirtualizedList,AutoSizer } from 'react-virtualized'
import './index.scss'
import { imgBaseUrl } from '@/config/envConfig'
import { getShopListApi } from '@/api/shop'
import RatingStar from '../rating-star'
import Loader from '../loader'
import LoadMore from '../load-more'
import { showBackToTop, animate,isTouchBottom,throttle } from '@/utils/common'


function ShopList(props) {

  const scrollRef = createRef()

  const [shopList, setShopList] = useState([]) // 商铺列表
  const [offset, setOffset] = useState(0) // 批次加载店铺列表，每次加载20个 limit = 20
  //const [latitude,setLatitude] = useState('') // 纬度
  //const [longitude,setLongitude] = useState('') // 经度
  //const [isEnd, setIsEnd] = useState(false) // 到达底部，没有更多数据了
  const [isLoading, setIsLoading] = useState(true) // 显示加载效果
  const [isBackTop, setIsBackTop] = useState(false) // 是否回到顶部
  //const [preventRepeatReuqest, setPreventRepeat] = useState(false) // 防止重复请求
  
  const [loadMoreStatus, setLoadMoreStatus] = useState('loadmore')


  // 为解决监听函数无法获取到最新 state 值的问题,使用 useRef 代替 state
  const currentRef = useRef(0);
  const endRef = useRef(false);
  const repeatRef = useRef(false);
  const listRef = useRef([]);

  const restaurantCategoryId = useRef(null);
  const restaurantCategoryIds = useRef([]);
  const deliveryMode = useRef(null);
  const supportIds = useRef(null);
  const sortByType = useRef(null);

  useEffect(() => {
    
    if(props.restaurantCategoryId) {
      restaurantCategoryId.current = props.restaurantCategoryId;
      restaurantCategoryIds.current = props.restaurantCategoryIds
      sortByType.current = props.sortByType
      supportIds.current = props.supportIds
      deliveryMode.current = props.deliveryMode
    }

    getShopList()

    // 监听滚动事件
    window.addEventListener('scroll',handleScroll);

    return () => {
      window.removeEventListener('scroll',handleScroll)
    }
    
  }, [])

  const latitude = useMemo(() => {
    return props.latitude
  }, [props.latitude])

  const longitude = useMemo(() => {
    return props.longitude
  }, [props.longitude])


  useEffect(() => {
    if(props.restaurantCategoryIds || props.sortByType || props.confirmSelect) {
      restaurantCategoryIds.current = props.restaurantCategoryIds
      sortByType.current = props.sortByType
      supportIds.current = props.supportIds
      deliveryMode.current = props.deliveryMode
      // 进行移除
      //window.removeEventListener('scroll',handleScroll);
      // 重新监听
      //window.addEventListener('scroll',handleScroll);
  
      listenPropChange()
    }
  }, [props.restaurantCategoryIds, props.sortByType, props.confirmSelect])

  //#region 
  /*// 实现监听
  componentDidUpdate(preProps,preState,snapshotValue) {
    //console.log('Count---componentDidUpdate',preProps,preState,snapshotValue);
    if(this.props.latitude != preProps.latitude) {
      this.setState({latitude: this.props.latitude})
    }
    if(this.props.longitude != preProps.longitude) {
      this.setState({longitude: this.props.longitude})
    }
    //监听父级传来的restaurantCategoryIds，当值发生变化的时候重新获取餐馆数据，作用于排序和筛选
    if(this.props.restaurantCategoryIds != preProps.restaurantCategoryIds) {
      this.listenPropChange()
    }
    //监听父级传来的排序方式
    if(this.props.sortByType != preProps.sortByType) {
      this.listenPropChange()
    }
    //监听父级的确认按钮是否被点击，并且返回一个自定义事件通知父级，已经接收到数据，此时父级才可以清除已选状态
    if(this.props.confirmSelect != preProps.confirmSelect) {
      this.listenPropChange()
    }
  }*/
  //#endregion

  //监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据
  const listenPropChange = () => {
    if (restaurantCategoryId.current) {
      setIsLoading(true)
      //setOffset(0)
      currentRef.current = 0; // 重置
      getShopListApi(getParams()).then(res => {
        hideLoading()
        setShopList(res)
      })
      backTop(); // 返回顶部
    }
  }

  const getParams = () => {
    // 收集参数
    let obj;
    // 实现排序或
    if(restaurantCategoryId.current) {
      let ids = []
      supportIds.current.forEach(item => {
        if(item.status) {
          ids.push(item.id)
        }
      })
      obj = {
        restaurant_category_ids: restaurantCategoryIds.current,
        order_by: sortByType.current,
        delivery_mode: deliveryMode.current,
        support_ids: ids.join(','),
      }
    }
    obj = {
      latitude: latitude,
      longitude: longitude,
      offset: currentRef.current,
      limit: 20,
      restaurant_category_id: restaurantCategoryId.current,
      ...obj
    }
    return obj;
  }

  // 获取商铺列表
  const getShopList = () => {
    
    getShopListApi(getParams()).then(res => {
      listRef.current.concat(res);
      setShopList(res)
      if (res.length < 20) {
        //setIsEnd(true)
        endRef.current = true
        setLoadMoreStatus('nomore')
      }
      hideLoading()
      //开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
      showBackToTop(status => {
        setIsBackTop(status)
      })
    })
  }

  // 隐藏加载效果
  const hideLoading = () => {
    setIsLoading(false)
  }

  // 是否有'准时达'服务
  const isZhun = (supports) => {
    let result = false;
    if (supports instanceof Array && supports.length) {
      if (supports.some(item => item.icon_name === '准')) {
        result = true
      }
    }
    return result
  }

  // 置顶操作
  const backTop = () => {
    animate(document.documentElement, { scrollTop: '0' }, 400, 'ease-out')
    animate(document.body, { scrollTop: '0' }, 400, 'ease-out')
  }


  // 滚动事件
  const handleScroll = throttle(function(){
    isTouchBottom(loadMore);
  },1000)

  // 加载更多
  const loadMore = async () => {
    if(endRef.current) return
    if(repeatRef.current) return
    setLoadMoreStatus('loadmore')
    //数据的定位加20位
    currentRef.current += 20
    setIsLoading(true)
    repeatRef.current = true
    //setOffset(currentRef.current);

    setLoadMoreStatus('loading');
    let res = await getShopListApi(getParams())
    setIsLoading(false);
    listRef.current = listRef.current.concat(res);
    setShopList([...listRef.current]);
    //setShopList([...shopList,...res]); // shopList没有及时更新
    if (res.length < 20) { //当获取数据小于20，说明没有更多数据，不需要再次请求数据
      endRef.current = true;
      setLoadMoreStatus('nomore')
    }
    //setPreventRepeat(false);
    repeatRef.current = false;
  }

  //到达底部加载更多数据【原本的】
  /*const handleLoadMore = () => {
    if(isEnd) return
    if(preventRepeatReuqest) return
    let off = offset+20
    setIsLoading(true)
    setPreventRepeat(true)
    setOffset(off)
    let obj
    if(props.restaurantCategoryId !== undefined) {
      let ids = []
      props.supportIds.forEach(item => {
        if(item.status) {
          ids.push(item.id)
        }
      })
      obj = {
        latitude: latitude,
        longitude: longitude,
        offset: off,
        //limit: 20,
        restaurant_category_id: props.restaurantCategoryId,
        restaurant_category_ids: props.restaurantCategoryIds,
        order_by: props.sortByType,
        delivery_mode: props.deliveryMode,
        support_ids: ids.join(','),
      }
    } else {
      obj = {
        latitude: latitude,
        longitude: longitude,
        offset: off,
        //limit: 20,
        restaurant_category_id: props.restaurantCategoryId || '',
      }
    }
    
    getShopListApi(obj).then(res => {
      hideLoading()
      setShopList([...shopList,...res])
      if(res.length < 20) {
        setIsEnd(true)
        return
      }
      setPreventRepeat(false)
    })
  }*/

  // 不行
  /*const handleScroll = () => {
    if(scrollRef) {
      const node = scrollRef.current
      const contentScrollTop = node.scrollTop; //滚动条距离顶部
      const clientHeight = node.clientHeight; //可视区域
      const scrollHeight = node.scrollHeight; //滚动条内容的总高度
      // console.log(contentScrollTop,clientHeight,scrollHeight);
      //if (contentScrollTop + clientHeight >= scrollHeight) {
      //  getLogPages();    // 获取数据的方法
      //}
    }
  }*/


  return (
    <div className="shoplist-container" ref={scrollRef} onScrollCapture={handleScroll}>
      {shopList.length > 0 ? shopList.map((item, index) => (
        <Link to={`/shop?geohash=${props.geohash}&id=${item.id}`} key={index} className="shop-item">
          <img className="shop-img" src={imgBaseUrl + item.image_path} alt="" />
          <div className="shop-content">
            <div className="shop-content-header">
              <div className="header-left">
                <span className="shop-brand">品牌</span>
                <span className="shop-name oneline-hide">{item.name}</span>
              </div>
              <div className="header-right">
                {item.supports && item.supports.map((suppport, idx) => (
                  <span key={idx}>{suppport.icon_name}</span>
                ))}
              </div>
            </div>
            <div className="shop-content-center">
              <div className="center-left">
                <div className="rating-wrap">
                  <RatingStar rating={item.rating} />
                  <span className="rating-text">{item.rating}</span>
                </div>
                <span className="desc">月售{item.recent_order_num}单</span>
              </div>
              {item.delivery_mode && <div className="center-right">
                <span className="delivery-mode" style={{ backgroundColor: `#${item.delivery_mode.color}` }}>{item.delivery_mode.text}</span>
                {isZhun(item.supports) && <span className="delivery-mode2" style={{ color: `#${item.delivery_mode.color}`, borderColor: `#${item.delivery_mode.color}` }}>准时达</span>}
              </div>}
            </div>
            <div className="shop-content-footer">
              <div className="footer-left">
                <span className="start-price">￥{item.float_minimum_order_amount}起送</span>
                <span className="segmentation">&nbsp;/&nbsp;</span>
                {item.piecewise_agent_fee && <span className="delivery-fee">{item.piecewise_agent_fee.tips}</span>}
                
              </div>
              <div className="footer-right">
                {Number(item.distance) ? <span className="distance">{item.distance > 1000 ? (item.distance / 1000).toFixed(2) + 'km' : item.distance + 'm'}</span>
                  : <span className="distance">{item.distance}</span>
                }
                <span className="segmentation">&nbsp;/&nbsp;</span>
                <span className="order-time">{item.order_lead_time}</span>
              </div>
            </div>
          </div>
        </Link>
      )) : <ul className="skeleton">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
          <li className="shop-li" key={index}>
            <div className="shop-img"></div>
            <div className="shop-progress">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </li>))
        }
      </ul>
      }

      {/*{isEnd && <div className="ending-tips">没有更多了</div>}*/}

      {isBackTop && <div className="back-top" onClick={backTop}>
        <span className="iconfont icon-top1"></span>
      </div>}

      {
        isLoading && <Loader />
        //isLoading && <div className="msite-loader">
        //  {/*<div className="mask"></div>*/}
        //  <div className="loader-wrap"><Loader /></div>
        //</div>
      }

      <LoadMore status={loadMoreStatus} />
    </div>
  )
}

ShopList.propTypes = {
  geohash: ProTypes.string.isRequired,
  //restaurantCategoryId: ProTypes.number,
  //restaurantCategoryIds: ProTypes.number,
  //sortByType: ProTypes.string,
  //deliveryMode: ProTypes.string,
  //supportIds: ProTypes.array,
  //confirmSelect: ProTypes.bool
}
//ShopList.defaultProps = {
//  restaurantCategoryIds: '',
//  sortByType: '',
//  confirmSelect: false
//}

export default connect(
  state => ({ latitude: state.geohash.latitude, longitude: state.geohash.longitude })
)(ShopList)


/*<AutoSizer disableHeight style={{width: '100%'}}>
  {({width}) => (
    <VirtualizedList
      rowCount={shopList.length}
      rowRenderer={this.rowRenderer}
      width={width}
      height={window.screen.height-50}
      autoHeight={true}
      rowHeight={100}
      overscanRowCount={10}
    />
  )}
</AutoSizer>*/