import './index.scss'
export default function RatingStar(props) {
  const { rating } = props
  return (
    <div className="rating-container">
      <div className="star-container">
        <div className="star-box grey-fill">
          {[1,2,3,4,5].map((item,index) => (
            <img src={require("@/assets/image/star-fill.png")} key={index} />
          ))}
        </div>
        <div style={{width: `${rating / 5 *100}%`}} className="star-box light-fill">
          {[1,2,3,4,5].map((item,index) => (
            <img src={require("@/assets/image/star-light.png")} key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}