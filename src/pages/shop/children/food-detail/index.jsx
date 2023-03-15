import React,{useState,useEffect} from 'react'
import { useSearchParams } from 'react-router-dom'
import './index.scss'
import ToolBar from '@/components/toolbar'
import RatingStar from '@/components/rating-star'
import { imgBaseUrl } from '@/config/envConfig'

export default function FoodDetail(props) {
  const [imagePath,setImagePath] = useState(null)
  const [description,setDescription] = useState(null)
  const [monthSales,setMonthSales] = useState(null)
  const [name,setName] = useState(null)
  const [rating,setRating] = useState(null)
  const [ratingCount,setRatingCount] = useState(null)
  const [satisfyRate,setSatisfyRate] = useState(null)
  const [foods,setFoods] = useState(null)
  const [shopId,setShopId] = useState(null)

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const food = JSON.parse(searchParams.get('foods'))
    //console.log(food);
    setFoods(food)
    setImagePath(food.image_path)
    setDescription(food.description)
    setMonthSales(food.month_sales)
    setName(food.name)
    setRating(food.rating)
    setRatingCount(food.rating_count)
    setSatisfyRate(food.satisfy_rate)
    setName(food.name)
    setShopId(searchParams.get('shopId'))
  },[])

  return (
    <div className="fooddetail-container">
      <ToolBar title={name} goBack={true}/>
      <div className="food-main">
        <div className="food-img">
          <img src={imgBaseUrl+imagePath} alt="" />
          <div className="img-cover"></div>
        </div>
        <p className="food-desc">{description}</p>
        <div className="detail-container">
          <div className="detail-left">
            <p className="food-name">{name}</p>
            <div className="rating-sale">
              <span className="label">评分</span>
              <RatingStar rating={rating} />
              {rating && <span className="rating-score">{rating.toFixed(1)}</span>}
            </div>
            <div className="sale-spec">
              <span className="sales">月售 {monthSales}单</span>
              {foods && <span className="price">售价 {foods.specfoods[0].price}单</span>}
              {foods && foods.specfoods.length > 0 && <span className="text">起</span> }
            </div>
            <div className="rating-satisfy">
              <span className="rating-count">评论数 {ratingCount}</span>
              <span className="satisfy-rating">好评率 {satisfyRate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}