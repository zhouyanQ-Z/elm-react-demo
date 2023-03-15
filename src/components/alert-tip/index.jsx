import React,{Component} from 'react'
import PropTypes from 'prop-types'
import './index.scss'

export default class AlertTip extends Component {

  static propTypes = {
    alertText: PropTypes.string.isRequired,  // 提示内容
    closeTip: PropTypes.func.isRequired,   // 关闭
  }
  handleClick = () => {
    //console.log(this.props);
    this.props.closeTip()
  }
  render(){
    const {props} = this
    return (
      <div className="alerttip-container">
        <div className="tip-text-container">
          <div className="tip-icon">
            <span></span>
            <span></span>
          </div>
          <div className="tip-text">{props.alertText}</div>
          <div className="confirm-btn" onClick={this.handleClick}>确认</div>
        </div>
      </div>
    )
  }
}