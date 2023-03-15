import React, {useEffect,useState,useMemo}from "react"
import { Link,useLocation,Outlet } from 'react-router-dom'
import {connect} from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar'
import { asyncSaveAddress } from "@/store/actions";
import { deleteAddressApi } from "@/api/order";
import CSSTransition from 'react-transition-group/CSSTransition'

function Address(props) {

  const [editText,setEditText] = useState('编辑');
  const [deleteSite,setDeleteSite] = useState(false); //是否编辑状态

  const location = useLocation()


  useEffect(() => {
    initData()
  },[])

  let userInfo = useMemo(() => {
    return props.userInfo

  },[props.userInfo])

  let addressList = useMemo(() => {
    return props.removeAddress || []

  },[props.removeAddress])

  useEffect(() => {
    initData();
  },[userInfo])

  // 初始化信息
  const initData = () => {
    if(userInfo&&userInfo.user_id) {
      props.saveAddress();
    }
  }

  // 切换编辑状态
  const handleEdit = () => {
    if(editText == '编辑') {
      setEditText('完成');
      setDeleteSite(true);
    } else {
      setEditText('编辑');
      setDeleteSite(false);
    }
  }

  // 删除地址
  const handleDelete = async (index,address) => {
    if(userInfo&&userInfo.user_id) {
      await deleteAddressApi(userInfo.user_id,address.id)
      addressList.splice(index,1);
    }
  }
  
  return (
    <div className="address-edit-container">
      <ToolBar title="编辑地址" goBack={true}>
        <span slot="edit" className="toolbar-right" onClick={handleEdit}>{editText}</span>
      </ToolBar>
      <div className="address-box">
        <ul className="addresslist">
          {addressList.length > 0 && addressList.map((item,index) => (
            <li className="address-item" key={item.id}>
              <div className="address-item-left">
                <p className="address-name">{item.address}</p>
                <p className="address-phone"><span>{item.phone}</span>{item.phonepk && <span>、{item.phonepk}</span>}</p>
              </div>
              {deleteSite && <div className="delete-site">
                <span className="delete-icon" onClick={() => handleDelete(index,item)}>x</span>
              </div>}
            </li>
          ))}
        </ul>

        <Link to="/profile/info/address/add">
          <div className="addsite">
            <span className="text">新增地址</span>
            <span className="iconfont icon-arrow_right"></span>
          </div>
        </Link>

      </div>


      <CSSTransition
        in={ location.pathname === '/profile/info/address/add' || location.pathname === '/profile/info/address/add/addDetail' }
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
  state => ({userInfo: state.user,removeAddress: state.profile.removeAddress}),
  dispatch => ({
    saveAddress: () => dispatch(asyncSaveAddress())
  })
)(Address)
