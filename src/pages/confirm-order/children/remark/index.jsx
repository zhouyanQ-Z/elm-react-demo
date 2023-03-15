import React,{useState,useEffect} from "react"
import { useSearchParams,useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar'
import Loader from '@/components/loader'
import {getRemarksApi} from '@/api/order'
import { saveRemark } from "@/store/actions"


function Remark(props) {

  const [searchParam] = useSearchParams()
  const navigate = useNavigate()

  const [id,setId] = useState(null)
  const [sig,setSig] = useState(null)
  const [remarkList,setRemarkList] = useState(null)
  const [isLoading,setIsLoading] = useState(true) // 显示加载动画
  const [remarkText,setRemarkText] = useState({})
  const [inputText,setInputText] = useState('')
  
  useEffect(() => {
    const id = searchParam.get('id')
    const sig = searchParam.get('sig')
    setId(id)
    setSig(sig)

    //setTimeout(() => {
    //  initData()
    //}, 1000);
    initData()
  },[])

  // 初始化数据
  const initData = () => {
    getRemarksApi(id || searchParam.get('id')).then(res => {
      //console.log('11',res);
      setRemarkList(res.remarks)
      setIsLoading(false)
    })
  }

  // 选择备注
  const chooseRemark = (index, remarkIndex, text) => {
    const flag = Object.keys(remarkText).some(item => item == index)
    if(!flag) {
      remarkText[index] = [remarkIndex,text]
    } else {
      if(remarkText[index][0] == remarkIndex) { // 取消已选的备注
        delete remarkText[index]
      } else {
        remarkText[index] = [remarkIndex,text]
      }
    }
    setRemarkText(Object.assign({},remarkText))
  }

  // 输入其他备注
  const handleInput = (e) => {
    setInputText(e.target.value)
  }

  // 提交备注
  const confirmRemark = () => {
    props.saveRemark({remarkText,inputText})
    navigate(-1)
  }

  return (
    <div className="remark-container">
      {!isLoading ? <div className="remark-content">
        <ToolBar title="订单备注" goBack={true} />
        <div className="remark-main">
          {remarkList.length > 0 && <div className="quick-remark">
            <div className="header">快速备注</div>
            <div className="remark-list">
              {remarkList.map((item,index) => (
                <div className="remark-item" key={index}>
                  {item.map((remarkItem,itemIndex) => (
                    <span 
                      className={`remark-item-i ${itemIndex == 0 ? 'first':''} ${itemIndex == item.length-1 ? 'last':''} ${remarkText[index] &&(remarkText[index][0] == itemIndex) ? 'choosed':''}`} 
                      onClick={() => chooseRemark(index,itemIndex,remarkItem)}
                      key={itemIndex}>{remarkItem}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>}
          <div className="input-remark quick-remark">
            <div className="header">其他备注</div>
            <textarea className="input-text" value={inputText} onChange={handleInput} placeholder="请输入备注内容(可不填)"></textarea>
          </div>
          <div className="confirm-btn" onClick={confirmRemark}>确定</div>
        </div>
      </div> : <Loader />}
    </div>
  )
}

export default connect(
  state => ({}),
  dispatch => (
    {
      saveRemark: data => dispatch(saveRemark(data))
    }
  )
)(Remark)