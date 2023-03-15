import { combineReducers } from 'redux'
import geohash from './geohash'
import user from './user'
import cart from './cart'
import shop from './shop'
import order from './order'
import profile from './profile'

export default combineReducers({
  geohash,
  user,
  cart,
  shop,
  order,
  profile
})