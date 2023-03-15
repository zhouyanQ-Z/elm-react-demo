import React,{ useState,useMemo } from 'react'
import { connect } from 'react-redux'
import './index.scss'
import {toast} from '@/utils/app/modal'
import { add_cart, reduce_cart } from '@/store/actions'

function BuyCart(props) {
  //let [foodNum,setFoodNum] = useState(0)
  //const [showMoveDot,setShowMoveDot] = useState(false) //控制下落的小圆点显示隐藏
  const {foods,shopId,cartList} = props

  // 监听cartList变化，更新当前商铺的购物车信息shopCart，同时返回一个新的对象
  const shopCart = useMemo(() => {
    //console.log('shop',cartList[shopId]);
    return Object.assign({},cartList && cartList[shopId] || {})
  },[cartList])

  //shopCart变化的时候重新计算当前商品的数量
  let foodNum = useMemo(() => {
    let cateId = foods.category_id
    let itemId = foods.item_id
    //console.log('num');
    if(shopCart && shopCart[cateId] && shopCart[cateId][itemId]) {
      let num = Object.values(shopCart[cateId][itemId]).reduce((preVal,item) => {
        return preVal + (item ? item.num : 0)
      },0)
      return num
    } else {
      return 0
    }
  },[shopCart])

  //移出购物车
  const removeOutCart = (event) => {
    event.preventDefault()
    event.stopPropagation()
    //setFoodNum(--foodNum)
    //console.log('gbg',foodNum);
    if(foodNum > 0) {
      const obj = {
        shopid: shopId,
        category_id: foods.category_id,
        item_id: foods.item_id,
        food_id: foods.specfoods[0].food_id,
        name: foods.specfoods[0].name,
        price: foods.specfoods[0].price,
        specs: '',
        packing_fee: foods.specfoods[0].packing_fee,
        sku_id: foods.specfoods[0].sku_id,
        stock: foods.specfoods[0].stock,
      }
      props.reduce_cart(obj)
    }
  }

  // 加入购物车
  const addToCart = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const obj = {
      shopid: shopId,
      category_id: foods.category_id,
      item_id: foods.item_id,
      food_id: foods.specfoods[0].food_id,
      name: foods.specfoods[0].name,
      price: foods.specfoods[0].price,
      specs: '',
      packing_fee: foods.specfoods[0].packing_fee,
      sku_id: foods.specfoods[0].sku_id,
      stock: foods.specfoods[0].stock,
    }
    props.add_cart(obj)
    let elLeft = event.target.getBoundingClientRect().left;
    let elBottom = event.target.getBoundingClientRect().bottom;
    //this.showMoveDot.push(true);
    //setShowMoveDot(true)
    props.showMoveDot(true,elLeft,elBottom)
    //this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);
  }

  //点击多规格商品的减按钮，弹出提示
  const showReduceTip = () => {
    toast('多规格商品只能去购物车删除哦~')
  }

  //显示规格列表
  const showChooseList = () => {
    props.showChooseList(foods)
  }

  return (
    <div className="buycart-container">
      {!foods.specifications.length > 0 ? (
        <div className="cart-button">
          <div className={`reduce-btn ${foodNum > 0 ? 'show':''}`} onClick={removeOutCart}>
            <span className="iconfont icon-reduce"></span>
          </div>
          <div className={`food-number ${foodNum > 0 ? 'show':''}`}>
            <span className="food-num">{foodNum}</span>
          </div>
          <div className="add-btn" onClick={addToCart}>
            <span className="iconfont icon-add"></span>
          </div>
        </div>
      ):(
        <div className="choose-specification">
          <div className={`reduce-btn ${foodNum > 0 ? 'show':''}`} onClick={showReduceTip}>
            <span className="iconfont icon-reduce"></span>
          </div>
          <div className={`food-number ${foodNum > 0 ? 'show':''}`}>
            <span className="food-num">{foodNum}</span>
          </div>
          <span className="choose-btn" onClick={showChooseList}>选规格</span>
        </div>
      )}
    </div>
  )
}

export default connect(
  state => ({cartList: state.cart}),
  dispatch => (
    {
      add_cart: data => dispatch(add_cart(data)),
      reduce_cart: data => dispatch(reduce_cart(data))
    }
  )
)(BuyCart)