import React,{Component} from 'react'
import ProTypes from 'prop-types'
import './index.scss'
import {createSlot} from '@/utils/common'

export default class Empty extends Component{
  static propTypes = {
    customStyle: ProTypes.object,
    tips: ProTypes.string,
    imageUrl: ProTypes.string
  }

  static defaultProps = {
    tips: '很抱歉！暂无相关数据。',
    imageUrl: require('@/assets/image/empty.png')
  }

  //实现具名插槽
  //createSlot = (slotName) => {
  //  let children = this.props.children
  //  if(children) {
  //    if(typeof children === 'object' && !Array.isArray(children)) children = [children]
  //    for (const el of children) {
  //      if(el.props.slot === slotName) return el
  //    }
  //  }
  //  return null
  //}

  render() {
    const {props} = this
    return (
      <div className="empty-container" style={props.customStyle}>
        <div className="empty-icon">
          <img src={props.imageUrl} className="empty-img" alt="" />
        </div>
        <div className="empty-tips">{props.tips}</div>
        {createSlot('empty-slot',props.children)}
      </div>
    )
  }
}