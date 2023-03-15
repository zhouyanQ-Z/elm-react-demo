import React, { useState, useRef, useMemo } from "react"
import { Link, useLocation, Outlet ,useNavigate} from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import ToolBar from '@/components/toolbar'
import { addAddress } from "@/store/actions";
import { addAddressApi } from "@/api/order";
import AlertTip from '@/components/alert-tip'
import CSSTransition from 'react-transition-group/CSSTransition'

function AddressAdd(props) {

  const [name, setName] = useState('');//姓名
  const [verifyName, setVerifyName] = useState(false); //验证
  //const [addAddress, setAddAddress] = useState('');//添加地址
  const [mesthree, setMesthree] = useState('');//送餐地址
  const [sendaddress, setSendaddress] = useState('');//送餐地址
  const [verifyMesthree, setVerifyMesthree] = useState(false); //验证
  const [telenum, setTelenum] = useState(''); //手机号
  const [telephone, setTelephone] = useState(''); //手机号
  const [verifyTelenum, setVerifyTelenum] = useState(false); //验证
  const [standbytelenum, setStandbytelenum] = useState(''); //手机号
  const [standbytele, setStandbytele] = useState(''); //手机号
  const [verifyStandTelenum, setVerifyStandTelenum] = useState(false); //验证
  const [opacityAll, setOpacityAll] = useState(false)

  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState(null);


  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef(); // 为了解决usestate数据更新不同步问题

  const adress = useMemo(() => {
    return props.adress;
  },[props.adress])

  // 输入
  const handleInput = (type, e) => {
    let val = e.target.value;
    if (type == 'name') {
      setName(val);
      if (!val) setVerifyName(true)
      else setVerifyName(false);

    } else if (type == 'mesthree') {
      setMesthree(val);
      setVerifyMesthree(true);
      if (val.length == 0) {
        setSendaddress('请详细填写送餐地址');
      } else if (val.length > 0 && val.length <= 2) {
        setSendaddress('送餐地址太短了，不能辨识');
      } else {
        setSendaddress('');
        setVerifyMesthree(false);
      }

    } else if (type == 'telenum') {
      setVerifyTelenum(true);
      ref.current = true;
      setTelenum(val);
      if ((/^[1][358][0-9]{9}$/).test(val)) {
        setVerifyTelenum(false);
        ref.current = false;
      } else if (val == '') {
        setTelephone("手机号不能为空");
      } else {
        setTelephone("请输入正确的手机号");
      }

    } else if (type == 'standbytelenum') {
      setVerifyStandTelenum(true);
      setStandbytelenum(val);
      if ((/^[1][358][0-9]{9}$/).test(val) || val == '') {
        setVerifyStandTelenum(false);
      } else {
        setStandbytele("请输入正确的手机号");
      }
    }

    handleBind();
  }

  const handleBind = () => {
    //console.log(verifyTelenum)
    if (name && mesthree && !ref.current) {
      setOpacityAll(true);
    } else {
      setOpacityAll(false);
    }
  }


  // 提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    let params = {
      address: adress,
      address_detail: mesthree,
      geohash: props.geohash,
      name,
      phone: telenum,
      tag: '公司',
      sex: 1,
      poi_type: 0,
      phone_bk: standbytelenum,
      tag_type: 4,
    }
    //  this.mesthree, this.addAddress, this.geohash, this.message, this.telenum, this.standbytelenum, 0, 1, '公司', 4
    let res = await addAddressApi(props.userInfo.user_id, params);
    if (res.message) {
      setShowAlert(true);
      setAlertText(res.message);
    } else if (opacityAll) {
      //保存的地址存入vuex
      props.addAddress({
        name,
        address: adress,
        address_detail: mesthree,
        geohash: 'wtw37r7cxep4',
        phone: telenum,
        phone_bk: standbytelenum,
        poi: addAddress,
        poi_type: 0,
      });
      navigate(-1);
    }

  }


  // 关闭提示组件
  const closeTip = () => {
    setShowAlert(false)
  }

  return (
    <div className="address-edit-container">
      <ToolBar title="新增地址" goBack={true} />
      <div className="adddetail-box">
        <form action="" onClick={(e) => e.preventDefault()}>
          <div className="ui-padding-block">
            <div className="input-new">
              <input type="text" placeholder="请填写你的姓名" className={verifyName ? 'verify' : ''} value={name} onChange={(e) => handleInput('name', e)} />
              {verifyName && <p>请填写您的姓名</p>}
            </div>
            <Link to="/profile/info/address/add/addDetail" className="add-address">
              <div className="input-new">
                <input type="text" placeholder="小区/写字楼/学校等" readOnly value={adress}/>
              </div>
            </Link>
            <div className="input-new">
              <input type="text" placeholder="请填写详细送餐地址" className={verifyMesthree ? 'verify' : ''} value={mesthree} onChange={(e) => handleInput('mesthree', e)} />
              {verifyMesthree && <p>{sendaddress}</p>}
            </div>
            <div className="input-new">
              <input type="text" placeholder="请填写能够联系到您的手机号" className={verifyTelenum ? 'verify' : ''} value={telenum} onChange={(e) => handleInput('telenum', e)} />
              {verifyTelenum && <p>{telephone}</p>}
            </div>
            <div className="input-new">
              <input type="text" placeholder="备用联系电话（选填）" className={verifyStandTelenum ? 'verify' : ''} value={standbytelenum} onChange={(e) => handleInput('standbytelenum', e)} />
              {verifyStandTelenum && <p>{standbytele}</p>}
            </div>
          </div>
          <div className="addbutton">
            <button className={opacityAll ? 'opacity-all' : ''} onClick={handleSubmit}>新增地址</button>
          </div>
        </form>
      </div>

      {showAlert && <AlertTip alertText={alertText} closeTip={closeTip} />}

      <CSSTransition
        in={location.pathname === '/profile/info/address/add/addDetail'}
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
  state => ({ userInfo: state.user, 
    removeAddress: state.profile.removeAddress, 
    geohash: state.geohash.geohash,
    adress: state.profile.addAddress }),
  dispatch => ({
    addAddress: (data) => dispatch(addAddress(data))
  })
)(AddressAdd)
