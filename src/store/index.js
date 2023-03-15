/**
 * redux最核心的store对象模块
 * 该文件专门用于暴露一个store对象，整个应用只有一个store对象
 */
/**
 * 目前createStore已经弃用，所以我们要引用legacy_createStore 
 * compose：用来合成函数，在同时配置applyMiddleware、devtool时候需要引入
 * applyMiddleware：使用中间件来增强store
 * thunk：创建异步actions
 * devtool：判断浏览器是否有安装调试的插件，有则启用
 */
import { legacy_createStore as createStore,compose,applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

const devtool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

export default createStore(reducers,compose(applyMiddleware(thunk),devtool))
