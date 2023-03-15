import React, { useState,useEffect } from 'react'
import { useNavigate, Link,useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { Swiper } from 'antd-mobile'
import ToolBar from '@/components/toolbar'
import Loader from '@/components/loader'
import ShopList from '@/components/shop-list'
import './index.scss'
import { getPositionApi } from '@/api/position'
import { getCitiesApi } from '@/api/city'
import { getFoodCateApi } from '@/api/food'
import { getUserInfoApi } from '@/api/user'
import { saveGeohash,saveUserInfo,saveLatitude, saveLongitude } from '@/store/actions'
import cache from '@/utils/cache'

// 食品导航一次显示的数量
const len = 8
// 图片的baseUrl
const imgBaseUrl = 'https://fuss10.elemecdn.com'
function Msite(props) {

  //const {saveGeohash,saveUserInfo,geohash,saveLongitude,saveLatitude} = props
  

  const navigate = useNavigate()

  const location = useLocation()

  const [title,setTitle] = useState('请选择地址...')
  //const [isLogin,setIsLogin] = useState(false)
  const [geohash_1,setGeohash] = useState('')
  const [hasGetData,setHasGetData] = useState(false)
  const [isLoading,setIsLoading] = useState(true)
  const [foodCategory,setFoodCategory] = useState([])

  //传递一个空数组（[]）作为第二个参数，这个 Effect 将永远不会重复执行，因此可以达到componentDidMount的效果。
  useEffect(() => {
    getPageData();
  }, [])

  // 获取页面参数
  const getPageData = async () => {
    let geo = '';
    if( location.state && location.state.geohash ) {
      geo = location.state.geohash
    } else if( props.geohash ) {
      geo = props.geohash
    } else {
      let city = await getCitiesApi({type: 'guess'})
      geo = city.latitude + ',' + city.longitude
    }
    
    setGeohash(geo)

    // 保存geohash到redux
    props.saveGeohash(geo)
    // 获取位置信息
    //getPosition(geo)
    Promise.all([getPosition(geo),getFoodCate()]).finally(() => setIsLoading(false))

    // 获取用户信息
    if(cache.local.get('userId')) {
      getUserInfoApi({user_id: cache.local.get('userId')}).then(res => {
        //cache.local.setJSON('userInfo',res)
        props.saveUserInfo(res)
      })
    }
  }

  
  // 获取食品分类
  const getFoodCate = () => {
    return new Promise((resolve,reject) => {
      getFoodCateApi().then(res => {
        let result = [...res]
        let resLen = res.length
        let foodCate = []
        for (let i = 0, j = 0; i < resLen; i += len, j++) {
          foodCate[j] = result.splice(0,len)
        }
        setFoodCategory(foodCate)
        resolve(res)
      }).catch(reject)
    })
  }

  // 获取城市列表
  const getCity = () => {
    return new Promise((resolve,reject) => {
      getCitiesApi({type: 'guess'}).then(res => {
        //setGeohash([res.latitude,res.longitude])
        let geo = res.latitude + ',' + res.longitude
        props.saveGeohash(geo)
        getPosition(geo)
        resolve(res)
      }).catch(reject)
    })
  }

  // 根据经纬度获取位置信息
  const getPosition = (geohash) => {
    return new Promise((resolve,reject) => {
      getPositionApi(geohash).then(res => {
        setTitle(res.name)
        // 记录当前经度和纬度
        props.saveLatitude(res.latitude)
        props.saveLongitude(res.longitude)
        setHasGetData(true)
        resolve(res)
      }).catch(reject)
    })
  }

  // 根据link获取categoryId
  const getCateId = (link) => {
    let urlData = decodeURIComponent(link.split('=')[1].replace('&target_name',''))
    if(urlData.includes('restaurant_category_id')) { // /restaurant_category_id/gi.test(urlData)
      return JSON.parse(urlData).restaurant_category_id.id
    } else {
      // 默认
      return 270
    }
  }

  // 跳转至搜索页面
  const goSearch = () => {
    navigate('/search',{
      replace: true
    })
  }

  

 
  return (
    <div className="msite">
      {/*<ToolBar title={ title } signUp={ isLogin } goSearch={ goSearch } />*/}
      <ToolBar signUp='miste'>
        <div slot='search' className="toolbar-left iconfont icon-search_1" onClick={goSearch}></div>
        <Link slot="msite-title" className="toolbar-title oneline-hide" to="/location">{title}</Link>
      </ToolBar>
      <div className="msite-main">
        <div className="content-box">
          <div className="msite-nav bg-f">
            {!foodCategory.length ? (
              <div className="nav-container">
                {[1,2,3,4,5,6,7,8].map((item,index) => (
                  <div className="nav-item nav-item-loader" key={index}>
                    <div className="cate-img"></div>
                    <span className="cate-title"></span>
                  </div>
                ))}
              </div>
              ):(
              <Swiper className="swiper" style={{'--track-padding': ' 0 0 .36rem'}} >
                {foodCategory.map((item,index) => (
                    <Swiper.Item className="swiper-slide nav-container" key={index}>
                      {item.map((cateItem,index2) => (
                          <Link className="nav-item" to="/food" state={{geohash: geohash_1,title: cateItem.title,cateId: getCateId(cateItem.link)}} key={index2}>
                            <img className="cate-img" src={imgBaseUrl + cateItem.image_url} alt="" />
                            <span className="cate-title">{cateItem.title}</span>
                          </Link>
                        )
                      )}
                    </Swiper.Item>
                  )
                )}
              </Swiper>
              ) 
            }
          </div>

          <div className="shop-list bg-f">
            <div className="shop-header">
              <span className="iconfont icon-shangpu fs-36"></span>
              <span className="header-title">附近商家</span>
            </div>
            { hasGetData && <ShopList geohash = { geohash_1 } />}
          </div>
        </div>

        {
          isLoading && <div className="msite-loader">
            {/*<div className="mask"></div>*/}
            <div className="loader-wrap"><Loader /></div>
          </div>
        }
      </div>

    </div>
  )
  
}

export default connect(
  state => ({ geohash: state.geohash.geohash }),
  // 函数
  dispatch => (
    {
      saveGeohash: value => dispatch(saveGeohash(value)),
      saveLongitude: value => dispatch(saveLongitude(value)),
      saveLatitude: value => dispatch(saveLatitude(value)),
      saveUserInfo: data => dispatch(saveUserInfo(data))
    }
  )
  // 对象形式---自动派发
  //{saveGeohash}
)(Msite)