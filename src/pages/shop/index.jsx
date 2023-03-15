import React,{useState,useEffect,useMemo,useRef} from 'react'
import {useSearchParams,useNavigate,Link,useLocation,Outlet} from 'react-router-dom'
import { connect } from 'react-redux'
import CSSTransition from 'react-transition-group/CSSTransition'
//import {useSpring,animated} from 'react-spring'
import BScroll from 'better-scroll'
import './index.scss'
import { getPositionApi } from '@/api/position'
import { imgBaseUrl } from '@/config/envConfig'
import Loader from '@/components/loader'
import RatingStar from '@/components/rating-star'
import BuyCart from '@/components/buy-cart'
import {saveLatitude,saveLongitude,init_cart,add_cart,reduce_cart,clear_cart,saveShopDetail} from '@/store/actions'
import { shopDetailApi,foodMenuApi,ratingListApi,ratingScoresApi,ratingTagsApi } from '@/api/shop'
import { getImgPath } from '@/utils/common'

function Shop(props){
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const transitionRef = useRef(null)
  const cartContainer = useRef(null)
  const menuFoodList = useRef(null)
  const wrapperMenu = useRef(null)

  const [geohash,setGeohash] = useState('')
  const [shopId,setShopId] = useState(null)
  const [shopDetail,setShopDetail] = useState(null) // 商铺详情
  const [isLoading,setIsLoading] = useState(true) // 正在加载
  const [showActivity,setShowActivity] = useState(false) // 是否显示活动弹窗
  const [showType,setShowType] = useState('food') // 默认显示'商品'
  const [menuList,setMenuList] = useState([]) // 食品列表
  const [menuIndex,setMenuIndex] = useState(0) //已选菜单索引值，默认为0
  const [categoryNum,setCategoryNum] = useState([]) //商品类型右上角已加入购物车的数量
  const [titleDetailIndex,setTitleDetailIndex] = useState(null)  //点击展示列表头部详情
  const [choosedFoods,setChoosedFoods] = useState(null) //当前选中视频数据
  const [showSpecs,setShowSpecs] = useState(false) //控制显示食品规格
  const [specsIndex,setSpecsIndex] = useState(0) //当前选中的规格索引值
  const [cartFoodList,setCartFoodList]  = useState([]) //购物车商品列表
  let [totalPrice,setTotalPrice] = useState(0) // 总价格
  const [receiveInCart,setReceiveInCart] = useState(false) // 购物车组件下落的圆点是否到达目标位置
  const [showMoveDot,setShowMoveDot] = useState(false) //控制下落的小圆点显示隐藏
  let [windowHeight,setWindowHeight] = useState(null) // 屏幕的高度
  let [fontSize,setFontSize] = useState(null) // 根元素的字体大小
  let [elLeft,setElLeft] = useState(0) //当前点击加按钮在网页中的绝对left值
  let [elBottom,setElBottom] = useState(0) // 当前点击加按钮在网页中的绝对top值
  const [menuIndexChange,setMenuIndexChange] = useState(true) //解决选中index时，scroll监听事件重复判断设置index的bug
  const [shopListTop,setShopListTop] = useState([]) //商品列表的高度集合
  const [foodScroll,setFoodScroll] = useState(null) // 食品列表scroll
  const [showCartList,setShowCartList] = useState(false) // 显示购物车列表
  const [ratingList,setRatingList] = useState(null) //评价列表
  let [ratingOffset,setRatingOffset] = useState(0) //评价获取数据offset值
  const [ratingScoresData,setRatingScoresData] = useState(null) //评价总体分数
  const [ratingTagsList,setRatingTagsList] = useState(null) //评价分类列表
  const [ratingTagIndex,setRatingTagIndex] = useState(0) //评价分类索引
  const [ratingTagName,setRatingTagName] = useState('') //评价类型
  const [ratingScroll,setRatingScroll] = useState(null) // 评论页scroll
  const [preventRepeatRequest,setPreventRepeatRequest] = useState(false) // 防止多次触发数据请求
  const [loadRating,setLoadRating] = useState(false) // 加载更多评论是显示加载组件
  const navigate = useNavigate()

  useEffect(() => {
    setGeohash(searchParams.get('geohash'))
    setShopId(searchParams.get('id'))
    props.init_cart()
    setWindowHeight(window.innerHeight)
    setFontSize(Number((window.getComputedStyle(window.document.documentElement)['font-size']).replace(/[^0-9]/ig,'')))
    initData()
  },[])

  const latitude = useMemo(() => {
    return props.latitude
  },[props.latitude])

  const longitude = useMemo(() => {
    return props.longitude
  },[props.longitude])

  const promotionInfo = useMemo(() => {
    return (shopDetail && shopDetail.promotion_info) || '欢迎光临，用餐高峰期请提前下单，谢谢！'
  },[shopDetail && shopDetail.promotion_info])

  //当前商店购物信息
  const shopCart = useMemo(() => {
    return Object.assign({},props.cartList && props.cartList[shopId] || {})
  },[props.cartList && shopId])

  //购物车中总共商品的数量
  const totalNum = useMemo(() => {
    let num = cartFoodList.reduce((preVal,curItem) => {
      return preVal + (curItem ? curItem.num : 0)
    },0)
    return num
  },[cartFoodList])

  // 配送费
  const deliveryFee = useMemo(() => {
    if(shopDetail) {
      return shopDetail.float_delivery_fee
    } else {
      return null
    }
  },[shopDetail])

  //还差多少元起送，为负数时显示去结算按钮
  const minimumOrderAmount = useMemo(() => {
    if(shopDetail) {
      return shopDetail.float_minimum_order_amount - totalPrice
    } else {
      return null
    }
  },[shopDetail && totalPrice])

  //监听isLoading的变化，说明组件已经获取初始化数据
  useEffect(() => {
    getFoodListHeight()
    initCategoryNum()
  },[isLoading])

  // 监听shopCart的变化
  useEffect(() => {
    initCategoryNum()
  },[shopCart])

  //购物车列表发生变化，没有商铺时，隐藏
  useEffect(() => {
    if(!cartFoodList.length) {
      setShowCartList(false)
    }
  },[cartFoodList])

  // 监听商品、评论切换
  useEffect(() => {
    if(showType === 'rating') {
      const scroll = new BScroll('#ratingContainer',{
        probeType: 3,
        deceleration: 0.003,
        bounce: false,
        swipeTime: 2000,
        click: true,
      })
      setRatingScroll(scroll)
      scroll.on('scroll',(pos) => {
        if(Math.abs(Math.round(pos.y)) >= Math.abs(Math.round(scroll.maxScrollY))) {
          loadMoreRating()
          scroll.refresh()
        }
      })
    }
  },[showType])

  

  const initData = async () => {
    if(!latitude) {
      //防止刷新页面时，redux状态丢失，经度纬度需要重新获取，并存入redux
      let res = await getPositionApi(geohash || searchParams.get('geohash'))
      // 记录当前经度和纬度
      props.saveLatitude(res.latitude)
      props.saveLongitude(res.longitude)
    }
    // 获取商铺信息
    let res = await shopDetailApi(shopId || searchParams.get('id'),{latitude,longitude})
    setShopDetail(res)
    //获取商铺食品列表
    let menu = await foodMenuApi({restaurant_id: shopId || searchParams.get('id')})
    setMenuList(menu)
    //评论列表
    let rating_list = await ratingListApi(shopId || searchParams.get('id'),{offset: ratingOffset,tag_name: ''})
    setRatingList(rating_list)
    //商铺评论详情
    let rating_score = await ratingScoresApi(shopId || searchParams.get('id'))
    setRatingScoresData(rating_score)
    //评论Tag列表
    let rating_tag = await ratingTagsApi(shopId || searchParams.get('id'))
    setRatingTagsList(rating_tag)
    // 再redux中保存shopDetail
    props.saveShopDetail(res)
    //隐藏加载动画
    hideLoading()
  }

  //当滑动食品列表时，监听其scrollTop值来设置对应的食品列表标题的样式
  const listenScroll = (el) => {
    let scroll = new BScroll(el,{
      probeType: 3,
      deceleration: 0.001,
      bounce: false,
      swipeTime: 2000,
      click: true
    })
    setFoodScroll(scroll)
    const wrapMenu = new BScroll('#wrapper_menu', {
      click: true
    })
    let menuWrap = wrapperMenu.current
    const wrapMenuHeight = menuWrap.clientHeight
    scroll.on('scroll',(pos) => {
      if(!wrapperMenu) return
      shopListTop.forEach((item,index) => {
        if(menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
          setMenuIndex(index)
          const menuList = menuWrap.querySelectorAll('.left-item-actived')
          const element = menuList[0]
          wrapMenu.scrollToElement(element,800,0,-(wrapMenuHeight/2 - 50))
        }
      })
    })
  }

  //获取食品列表的高度，存入shopListTop
  const getFoodListHeight = () => {
    const listenContainer = menuFoodList ? menuFoodList.current : null
    if(listenContainer) {
      const listArr = Array.from(listenContainer.children[0].children)
      listArr.forEach((item,index) => {
        shopListTop[index] = item.offsetTop
      })
      setShopListTop([...shopListTop])
      listenScroll(listenContainer)
    }
  }

  // 初始化categoryNum
  const initCategoryNum = () => {
    let newArr = []
    let cartFoodNum = 0
    setTotalPrice(0)
    let total_price = 0
    setCartFoodList([])
    menuList.forEach((item,index) => {
      //console.log('1111',shopCart,shopCart[item.foods[0].category_id],item.foods[0].category_id);
      if(shopCart && shopCart[item.foods[0].category_id]) {
        let num = 0
        Object.keys(shopCart[item.foods[0].category_id]).forEach(itemid => {
          Object.keys(shopCart[item.foods[0].category_id][itemid]).forEach(foodid => {
            let foodItem = shopCart[item.foods[0].category_id][itemid][foodid]
            if(foodItem) {
              num += foodItem.num
              if(item.type == 1) {
                total_price += foodItem.num * foodItem.price
                setTotalPrice(total_price)
                if(foodItem.num > 0) {
                  cartFoodList[cartFoodNum] = {}
                  cartFoodList[cartFoodNum].category_id = item.foods[0].category_id
                  cartFoodList[cartFoodNum].item_id = itemid
                  cartFoodList[cartFoodNum].food_id = foodid
                  cartFoodList[cartFoodNum].num = foodItem.num
                  cartFoodList[cartFoodNum].price = foodItem.price
                  cartFoodList[cartFoodNum].name = foodItem.name
                  cartFoodList[cartFoodNum].specs = foodItem.specs
                  setCartFoodList([...cartFoodList])
                  cartFoodNum++
                }
              }
            }
          })
        })
        newArr[index] = num
      } else {
        newArr[index] = 0
      }
    })
    setTotalPrice(total_price.toFixed(2))
    setCategoryNum([...newArr])
  }

  // 隐藏加载效果
  const hideLoading = () => {
    setIsLoading(false)
  }

  const goBack = () => {
    navigate(-1)
  }

  // 活动弹窗的显示与隐藏
  const showActivityFun = () => {
    setShowActivity(!showActivity)
  }

  // 选择显示哪类内容
  const selectShowType = (type) => {
    setShowType(type)
  }

  //点击左侧食品列表标题，相应列表移动到最顶层
  const chooseMenu = (index) => {
    setMenuIndex(index)
    //menuIndexChange解决运动时listenScroll依然监听的bug
    setMenuIndexChange(false)
    foodScroll.scrollTo(0,-shopListTop[index],400)
    foodScroll.on('scrollEnd',() => {
      setMenuIndexChange(true)
    })
  }

  // food头部右边'...'的点击事件
  const showTitleDetail = (index) => {
    if(titleDetailIndex == index) {
      setTitleDetailIndex(null)
    } else {
      setTitleDetailIndex(index)
    }
  }

  //显示规格列表
  const showChooseList = (food) => {
    if(food) {
      setChoosedFoods(food)
    }
    setShowSpecs(!showSpecs)
    setSpecsIndex(0)
  }

  //记录当前所选规格的索引值
  const chooseSpecs = (valueIndex) => {
    setSpecsIndex(valueIndex)
  }

  //多规格商品加入购物车
  const addSpecsToCart = () => {
    const params = {
      shopid: shopId,
      category_id: choosedFoods.category_id,
      item_id: choosedFoods.item_id,
      food_id: choosedFoods.specfoods[specsIndex].food_id,
      name: choosedFoods.specfoods[specsIndex].name,
      price: choosedFoods.specfoods[specsIndex].price,
      specs: choosedFoods.specifications[0].values[specsIndex],
      packing_fee: choosedFoods.specfoods[specsIndex].packing_fee,
      sku_id: choosedFoods.specfoods[specsIndex].sku_id,
      stock: choosedFoods.specfoods[specsIndex].stock,
    }
    props.add_cart(params)
    showChooseList()
  }

  // 
  const showMoveDotFun = (flag,left,bottom) => {
    //console.log(flag,left,bottom);
    setShowMoveDot(flag)
    setElLeft(left)
    setElBottom(bottom)
    let el = transitionRef.current
    el.style.transform = `translate3d(${left}px,${bottom-windowHeight}px,0)`
    //el.children[0].style.transform = `translate3d(px,0,0)`
    el.children[0].style.opacity = 0;
    setTimeout(() => {
      afterEnter(el)
    }, 700);
  }

  // 监听圆点是否进入购物车
  const listenInCart = () => {
    setShowMoveDot(false)
    if(!receiveInCart) {
      setReceiveInCart(true)
      const container = cartContainer.current
      container.addEventListener('animationend',() => {
        setReceiveInCart(false)
      })
      container.addEventListener('webkitAnimationEnd',() => {
        setReceiveInCart(false)
      })
    }
  }

  const beforeEnter = (el) => {
    //console.log('before',el);
    el.style.transform = `translate3d(0,${37 + elBottom - windowHeight}px,0)`
    el.children[0].style.transform = `translate3d(${elLeft - 30}px,0,0)`
    el.children[0].style.opacity = 0;
  }
  const afterEnter = (el) => {
    //console.log('after',el,el.children);
    el.style.transform = `translate3d(0,0,0)`
    el.children[0].style.transform = `translate3d(0,0,0)`;
    el.style.transition = `transform .6s cubic-bezier(0.3, -0.25, 0.7, -0.15)`
    el.children[0].style.transition = 'transform .6s linear'
    el.children[0].style.opacity = 1;
    el.addEventListener('transitionend', () => {
      listenInCart();
    })
    el.addEventListener('webkitAnimationEnd', () => {
      listenInCart();
    })
  }

  //控制购物列表是否显示
  const toggleCartList = () => {
    setShowCartList(!showCartList)
  }

  // 清空购物车
  const clearCart = () => {
    toggleCartList()
    props.clear_cart(shopId)
  }

  //移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
  const removeOutCart = (food) => {
    const obj = {
      shopid: shopId,
      category_id: food.category_id,
      item_id: food.item_id,
      food_id: food.food_id,
      name: food.name,
      price: food.price,
      specs: food.specs
    }
    props.reduce_cart(obj)
  }
  //加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
  const addToCart = (food) => {
    const obj = {
      shopid: shopId,
      category_id: food.category_id,
      item_id: food.item_id,
      food_id: food.food_id,
      name: food.name,
      price: food.price,
      specs: food.specs
    }
    props.add_cart(obj)
  }

  // 查看不同类型的评论列表
  const changeTagIndex = (index,name,event) => {
    event.preventDefault() // 解决点击一次而触发多次的问题
    setRatingTagIndex(index)
    setRatingOffset(0)
    setRatingTagName(name)
    ratingListApi(shopId,{offset: 0,tag_name: name}).then(res => {
      setRatingList([...res])
      ratingScroll.refresh()
    })
  }

  // 加载更多评论
  const loadMoreRating = () => {
    if(preventRepeatRequest) return
    setLoadRating(true)
    setPreventRepeatRequest(true)
    ratingOffset += 10
    setRatingOffset(ratingOffset)
    ratingListApi(shopId,{offset: ratingOffset,tag_name: ratingTagName}).then(res => {
      setRatingList([...ratingList,...res])
      if(res.length >= 10) {
        setPreventRepeatRequest(false)
      }
      setLoadRating(false)
    })
  }

  //const springs = useSpring({
  //  from: {opacity: 0,x: elLeft,y:elBottom},
  //  to: () => {
  //    afterEnter(transitionRef.current)
  //  }
  //})
  

  return (
    <div className="shop-container">
      {!isLoading && <div className="shop-detail-container">
        <div className="goback" onClick={goBack}>
          <span className="iconfont icon-arrow_left"></span>
        </div>
        <div className="shop-header">
          <div className="header-cover-img">
            <img src={imgBaseUrl+shopDetail.image_path} className="cover-img" alt="" />
          </div>
          <div className="header-content">
            <Link to='/shop/shopDetail' className="header-top">
              <div className="top-left">
                <img src={imgBaseUrl+shopDetail.image_path} alt="" />
              </div>
              <div className="top-right">
                <div className="shop-name oneline-hide">{shopDetail.name}</div>
                <p className="desc-text">商家配送/{shopDetail.order_lead_time}分钟送达/配送费¥{shopDetail.float_delivery_fee}</p>
                <p className="shop-promotio oneline-hide">公告：{promotionInfo}</p>
              </div>
              <span className="iconfont icon-arrow_right"></span>
            </Link>
            {shopDetail.activities.length > 0 && <div className="activity-footer" onClick={showActivityFun}>
              <p className="oneline-hide footer-left">
                <span className="actvity-icon" style={{backgroundColor: `#${shopDetail.activities[0].icon_color}`,borderColor: `#${shopDetail.activities[0].icon_color}`}}>{shopDetail.activities[0].icon_name}</span>
                <span className="actvity-desc">{shopDetail.activities[0].description}（APP专享）</span>
              </p>
              <p className="footer-right">
                <span className="activity-len">{shopDetail.activities.length}个活动</span>
                <span className="iconfont icon-arrow_down"></span>
              </p>
            </div>
            }
          </div>
        </div>
        <CSSTransition in={showActivity} timeout={100} appear={true} classNames="fade" unmountOnExit>
          <div className="activity-details">
            <div className="activity-cover"></div>
            <div className="details-content">
              <div className="details-title">{shopDetail.name}</div>
              <div className="ratingstar-wrap">
                <RatingStar rating={shopDetail.rating} />
              </div>
              <div className="activity-list">
                <div className="title-act">优惠信息</div>
                <div className="activity-content">
                  {shopDetail.activities.map(item => (
                    <div className="activity-item" key={item.id}>
                      <span className="actvity-icon" style={{backgroundColor: `#${item.icon_color}`,borderColor: `#${item.icon_color}`}}>{item.icon_name}</span>
                      <span className="actvity-desc">{item.description}（APP专享）</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="activity-promotion">
                <div className="title-act">商家公告</div>
                <p className="promotion-info">{promotionInfo}</p>
              </div>
              <div className="activity-close" onClick={showActivityFun}>
                <span className="iconfont icon-close-circle"></span>
              </div>
            </div>
          </div>
        </CSSTransition>
        <div className="showtype-container">
          <div className="showtype-item">
            <span className={`item-conetnt ${showType == 'food' ? 'actived' : ''}`} onClick={() => selectShowType('food')}>商品</span>
          </div>
          <div className="showtype-item">
            <span className={`item-conetnt ${showType == 'rating' ? 'actived' : ''}`} onClick={() => selectShowType('rating')}>评价</span>
          </div>
        </div>
        <div className={`food-container ${showType == 'food' ? 'show':'hide'}`}>
          <div className="menu-container">
            <div className="menu-left" id="wrapper_menu" ref={wrapperMenu}>
              {menuList.length > 0 && menuList.map((item,index) => (
                <div className={`left-item ${index == menuIndex ? 'left-item-actived' : ''}`} key={item.id} onClick={() => chooseMenu(index)}>
                  {item.icon_url && <img className="img-icon" src={getImgPath(item.icon_url)} alt="" /> }
                  <span className="item-name">{item.name}</span>
                  {categoryNum[index] > 0 && item.type == 1 && <span className="category-num">{categoryNum[index]}</span>}
                </div>
              ))}
            </div>
            <div className="menu-right" ref={menuFoodList}>
              <div className="menu-food-list">
                {menuList.length > 0 && menuList.map((item,index) => (
                <div className="right-item" key={index}>
                  <div className="item-header">
                    <div className="header-left">
                      <strong className="item-name" >{item.name}</strong>
                      <span className="item-desc">{item.description}</span>
                    </div>
                    <span className="header-right" onClick={() => showTitleDetail(index)}></span>
                    {titleDetailIndex == index && <p className="description-tip">
                      <span className="name">{item.name}</span>
                      <span className="desc">{item.description}</span>
                    </p> }
                  </div>
                  <div className="menu-detail-list">
                    {item.foods.map((food,idex) => (
                      <div className="list-item" key={idex}>
                        <Link to={`/shop/foodDetail?shopId=${shopId}&foods=${JSON.stringify(food)}`}  className="item-top-link">
                          <div className="item-img">
                            <img src={imgBaseUrl+food.image_path} alt="" />
                          </div>
                          <div className="item-content">
                            <div className="content-head">
                              <strong className="food-name">{food.name}</strong>
                              {food.attributes.length > 0 && <div className="food-attribute">
                                {food.attributes.map((attr,attrIndex) => (
                                  attr && <div className={`attribute-item ${attr.icon_name == '新' ? 'attr-new':''}`} key={attrIndex} style={{color: `#${attr.icon_color}`,borderColor: `#${attr.icon_color}`}}>
                                    <span style={{color: `#${attr.icon_name == '新'? 'fff': attr.icon_color}`}}>{attr.icon_name == '新' ? '新品':attr.icon_name}</span>
                                  </div>
                                ))}
                              </div>}
                            </div>
                            <div className="food-desc">{food.description}</div>
                            <div className="food-sale-rating">
                              <span className="food-sales">月售{food.month_sales}份</span>
                              <span className="food-rating">好评率{food.satisfy_rate}%</span>
                            </div>
                            {food.activity && <div className="food-activity">
                              <span style={{color: '#' + food.activity.image_text_color,borderColor:'#' +food.activity.icon_color}}>{food.activity.image_text}</span>
                            </div> }
                          </div>
                        </Link>
                        <div className="item-footer">
                          <div className="food-price">
                            <span className="unit">¥</span>
                            <span className="price">{food.specfoods[0].price}</span>
                            {food.specifications.length > 0 && <span className="spec-text">起</span> }
                          </div>
                          <BuyCart shopId={shopId} foods={food} showChooseList={showChooseList} showMoveDot={showMoveDotFun}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
          <div className="cart-container">
            <div className="buycart-left">
              <div className={`cart-icon-wrap ${totalPrice > 0 ? 'actived':''} ${receiveInCart ? 'move-in-cart':''}`} ref={cartContainer} onClick={toggleCartList}>
                {totalNum > 0 && <span className="cartlist-length">{totalNum < 100 ? totalNum : '99+'}</span> }
                <span className="iconfont icon-cart"></span>
              </div>
              <div className="cart-price-wrap">
                <div className="total-price">¥&nbsp;{totalPrice}</div>
                <div className="delivery-fee">配送费¥{deliveryFee}</div>
              </div>
            </div>
            <div className={`buycart-right ${minimumOrderAmount <= 0 ? 'actived':''}`}>
              {minimumOrderAmount > 0 ? (<span className="pay-btn">还差¥{minimumOrderAmount}起送</span>) : (
                <Link to={`/confirmOrder?geohash=${geohash}&shopId=${shopId}`} className="pay-btn">去结算</Link>
              ) }
            </div>
          </div>
          <CSSTransition in={ showCartList && cartFoodList.length > 0} appear classNames="toggle-cart" timeout={500} unmountOnExit>
            <div className={`cart-food-list`}>
              <div className="list-header">
                <div className="list-title">购物车</div>
                <div className="clear-cart" onClick={clearCart}>
                  <span className="iconfont icon-delete1"></span>
                  <span className="clear-text">清空</span>
                </div>
              </div>
              <div className="cart-food-content">
                {cartFoodList.map((item,index) => (
                  <div className="cart-food-item" key={index}>
                    <div className="item-left">
                      <div className="item-name oneline-hide">{item.name}</div>
                      <div className="item-specs oneline-hide">{item.specs}</div>
                    </div>
                    <div className="food-item-price">
                      <span className="unit">¥</span>
                      <span className="price">{item.price}</span>
                    </div>
                    <div className="cart-list-control">
                      <div className='control-reduce' onClick={() => removeOutCart(item)}>
                        <span className="iconfont icon-reduce"></span>
                      </div>
                      <div className='control-number'>
                        <span className="control-num">{item.num}</span>
                      </div>
                      <div className="control-add" onClick={() => addToCart(item)}>
                        <span className="iconfont icon-add"></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CSSTransition>
          {/*<div className={`toggle-cart ${showCartList && cartFoodList.length > 0 ? 'show':''}`}>
            <div className={`cart-food-list`}>
              <div className="list-header">
                <div className="list-title">购物车</div>
                <div className="clear-cart" onClick={clearCart}>
                  <span className="iconfont icon-delete1"></span>
                  <span className="clear-text">清空</span>
                </div>
              </div>
              <div className="cart-food-content">
                {cartFoodList.map((item,index) => (
                  <div className="cart-food-item" key={index}>
                    <div className="item-left">
                      <div className="item-name oneline-hide">{item.name}</div>
                      <div className="item-specs oneline-hide">{item.specs}</div>
                    </div>
                    <div className="food-item-price">
                      <span className="unit">¥</span>
                      <span className="price">{item.price}</span>
                    </div>
                    <div className="cart-list-control">
                      <div className='control-reduce' onClick={() => removeOutCart(item)}>
                        <span className="iconfont icon-reduce"></span>
                      </div>
                      <div className='control-number'>
                        <span className="control-num">{item.num}</span>
                      </div>
                      <div className="control-add" onClick={() => addToCart(item)}>
                        <span className="iconfont icon-add"></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>*/}
          <CSSTransition in={showCartList && cartFoodList.length > 0} appear classNames="fade" timeout={100} unmountOnExit>
            <div className="screen-cover" onClick={toggleCartList}></div>
          </CSSTransition>
          {/*{showCartList && cartFoodList.length > 0 && <div className="screen-cover" onClick={toggleCartList}></div> }*/}
        </div>

        <CSSTransition in={showType == 'rating'} timeout={100} appear={true} classNames="fade-choose" unmountOnExit>
          <div className="rating-container" id="ratingContainer">
            <div className="rating-inner">
              <div className="rating-header">
                <div className="rating-header-left">
                  <p className="rating-score">{shopDetail.rating}</p>
                  <p className="comprehensive-evaluation">综合评价</p>
                  <p className="exceed">高于周边商家{(ratingScoresData.compare_rating*100).toFixed(1)}%</p>
                </div>
                <div className="rating-header-right">
                  <div className="right-item">
                    <span className="title">服务态度</span>
                    <RatingStar rating={ratingScoresData.service_score}/>
                    <span className="rating-num">{ratingScoresData.service_score.toFixed(1)}</span>
                  </div>
                  <div className="right-item">
                    <span className="title">菜品评价</span>
                    <RatingStar rating={ratingScoresData.food_score} />
                    <span className="rating-num">{ratingScoresData.food_score.toFixed(1)}</span>
                  </div>
                  <div className="right-item">
                    <span className="title">送达时间</span>
                    <span className="delivery-time">{shopDetail.order_lead_time}分钟</span>
                  </div>
                </div>
              </div>
              <div className="tag-list">
                {ratingTagsList.length > 0 && ratingTagsList.map((tag,index) => (
                  <div className={`tag-item ${tag.unsatisfied ? 'unsatisfied':''} ${ratingTagIndex == index ? 'actived':''}`} key={index} onClick={(e) => changeTagIndex(index,tag.name,e)}>{tag.name}({tag.count})</div>
                )) }
              </div>
              <div className="rating-list">
                {ratingList.length > 0 && ratingList.map((item,index) => (
                  <div className="rating-list-item" key={index}>
                    <img src={getImgPath(item.avatar)} className="user-avatar" alt="" />
                    <div className="item-details">
                      <div className="details-header">
                        <div className="details-header-left">
                          <p className="user-name">{item.username}</p>
                          <div className="star-desc">
                            <RatingStar rating={item.rating_star} />
                            <span className="time-spent-desc">{item.time_spent_desc}</span>
                          </div>
                        </div>
                        <time className="details-header-right">{item.rated_at}</time>
                      </div>
                      <div className="foodimg-box">
                        {item.item_ratings.map((rating,ratingIndex) => (
                          <div className="foodimg-item" key={ratingIndex}>
                            {rating.image_hash && <img src={getImgPath(rating.image_hash)} alt="" />}
                          </div>
                        ))}
                      </div>
                      <div className="foodname-box">
                        {item.item_ratings.map((rating,ratingIndex) => (
                          <div className="foodimg-item oneline-hide" key={ratingIndex}>
                            <span className="item-food-name">{rating.food_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
      }

      {showSpecs && <div className="foods-specs">
        <div className="specs-cover" onClick={() => showChooseList()}></div>
        <div className="specs-list">
          <div className="list-title">{choosedFoods.name}</div>
          <div className="list-details">
            {choosedFoods.specifications.map((item,index) => (
              <div className="spec-item" key={index}>
                <div className="spec-item-title oneline-hide">{item.name}</div>
                <div className="spec-item-values">
                  {item.values.map((val,valIndex) => (
                    <div className={`value-item ${specsIndex == valIndex ? 'actived':''}`} key={valIndex} onClick={() => chooseSpecs(valIndex)}>
                      <span className="value-text">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="specs-footer">
            <div className="food-price">
              <span className="unit">¥</span>
              <span className="price">{choosedFoods.specfoods[specsIndex].price}</span>
            </div>
            <div className="addtocart-btn" onClick={addSpecsToCart}>加入购物车</div>
          </div>
          <div className="close-specs" onClick={() => showChooseList()}>
            <span className="iconfont icon-close-circle"></span>
          </div>
        </div>
      </div>}

      {/*<CSSTransition in={showMoveDot} appear classNames="dot-move" timeout={100} onEnter={beforeEnter} onEntered={afterEnter}>
        {showMoveDot ?  <span className="iconfont icon-add"></span>: <span></span> }
      </CSSTransition>*/}
      {/*{showMoveDot && <animated.div style={springs} ref={transitionRef} className="move-dot">
        <span className="iconfont icon-add"></span>
      </animated.div>}*/}
      <div className={`move-dot ${showMoveDot ? 'show':''}`} ref={transitionRef}>
        <span className="iconfont icon-add"></span>
      </div>
      
      

      {
        (isLoading || loadRating) && <Loader />
      }

      <CSSTransition in={location.pathname === '/shop/shopDetail' || 
        location.pathname === '/shop/shopDetail/shopSafe' || 
        location.pathname === '/shop/foodDetail'} 
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
  state => ({latitude: state.geohash.latitude,longitude: state.geohash.longitude,cartList: state.cart}),
  dispatch => (
    {
      saveLatitude: value => dispatch(saveLatitude(value)),
      saveLongitude: value => dispatch(saveLongitude(value)),
      init_cart: () => dispatch(init_cart()),
      add_cart: data => dispatch(add_cart(data)),
      reduce_cart: data => dispatch(reduce_cart(data)),
      clear_cart: data => dispatch(clear_cart(data)),
      saveShopDetail: data => dispatch(saveShopDetail(data))
    }
  )
)(Shop)