import React, { useState, useEffect } from "react"
import {useNavigate} from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar'
import { saveAddDetail } from "@/store/actions";
import { searchPlaceApi } from "@/api/city";

function AddDetail(props) {

  const [address,setAddress] = useState('');
  const [warning,setWarning] = useState(true);
  const [addressList,setAddressList] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    setAddress(props.addAddress ? props.addAddress:address)
  },[])

  useEffect(() => {
    if(address == '') {
      setAddressList([]);
      setWarning(true);
    } else {
      setWarning(false);
    }
  },[address])

  // 输入
  const handleInput = (e) => {
    setAddress(e.target.value);
  }

  // 搜索
  const handleSearch = () => {
    if(address == '') return;
    searchPlaceApi({keyword: address, type: 'nearby'}).then(res => {
      setAddressList(res);
      setWarning(true);
      if(res.length > 0) {
        setWarning(false);
      }
    })
  }

  // 选择地址
  const chooseAddress = (index) => {
    props.saveAddDetail(addressList[index].name);
    navigate(-1);
  }
  return (
    <div className="address-edit-container">
      <ToolBar title="搜索地址" goBack={true} />

      <React.Fragment>
        <div className="add-detail">
          <input type="text" placeholder="请输入小区/写字楼/学校等" value={address}  onChange={handleInput} />
          <button onClick={handleSearch}>确认</button>
        </div>

        <p className="warn-part">为了满足商家的送餐要求，建议您从列表中选择地址</p>
        {warning && <div className="point">
          <p>找不到地址？</p>
          <p>请尝试输入小区、写字楼或学校名</p>
          <p>详细地址（如门牌号）可稍后输入哦。</p>
        </div>}
      </React.Fragment>

      {addressList.length > 0 && <div className="search-result-container">
        <ul>
          {addressList.map((item,index) => (
            <li className="address-item" key={index} onClick={() => chooseAddress(index)}>
              <p>{item.name}</p>
        			<p>{item.address}</p>
            </li>
          ))}
        </ul>
      </div>}
    </div>
  )
}


export default connect(
  state => ({ userInfo: state.user, removeAddress: state.profile.removeAddress, addAddress: state.profile.addAddress }),
  dispatch => ({
    saveAddDetail: (data) => dispatch(saveAddDetail(data))
  })
)(AddDetail)
