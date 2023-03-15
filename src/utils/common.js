/**
 * 通用js方法封装处理
 */

import store from '@/store'

/**
* 参数处理
* @param {*} params  参数
*/
export function convertParams(params) {
  let result = ''
  for (const propName in params) { // const propName of Object.keys(params)
    const val = params[propName]
    // encodeURIComponent将字符串作为 URI 组件进行编码
    var part = encodeURIComponent(propName) + "="
    if(typeof val !== null && typeof val !== 'undefined') {
      if(typeof val === 'object') {
        for (const key in val) { // const key of Object.keys(val)
          if(typeof val !== null && typeof val !== 'undefined') {
            let paramStr = propName + '[' + key + ']'
            var subPart = encodeURIComponent(paramStr) + '='
            result += subPart + encodeURIComponent(val[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(val) + '&'
      }
    }
  }
  // 截掉最后一个&
  result = result.slice(0,-1)
  return result
}

/**
 * 判断是否登录
 */
export function checkLogin() {
  return !!store.getState().user.user_id
}

//  实现具名插槽
export function createSlot(slotName,children){
  //let children = this.props.children
  if(children) {
    if(typeof children === 'object' && !Array.isArray(children)) children = [children]
    for (const el of children) {
      if(el.props.slot === slotName) return el
    }
  }
  return null
}

// 防抖函数
export function debounce(fn,delay=100) {
  let timer
  return function() {
    let that = this
    let args = arguments
    if(timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(that,args)
    },delay)
  }
}

// 节流函数
export const throttle = (fn,delay=200) => {
  let oldTime = 0;
  let timer;
  return function(){
    let newTime = Date.now(),context = this;
    if(oldTime && newTime - oldTime < delay) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        oldTime = newTime;
        fn.apply(context,arguments);
      }, delay);
    } else {
      fn.apply(context,arguments);
      oldTime = newTime;
    }
  }
}

// 获取图片路径
export function getImgPath(path) {
  let suffix
  //传递过来的图片地址需要处理后才能正常使用
  if(!path) {
    return 'https://elm.cangdu.org/img/default.jpg'
  }
  if(path.indexOf('jpeg') != -1) {
    suffix = '.jpeg'
  } else {
    suffix = '.png'
  }

  let url = '/' + path.substr(0,1) + '/' + path.substr(1,2) + '/' + path.substr(3) + suffix
  return 'https://fuss10.elemecdn.com' + url
}

// 实现对象或数组的深拷贝
export function deepCopy(data) {
  if(typeof data != 'object') return data
  if(data == null) return data
  let newObj = Array.isArray(data) ? [] : {}
  for (const i in data) {
    newObj[i] = deepCopy(data[i])
  }
  return newObj
}

/**
 * 显示返回顶部按钮，开始、结束、运动 三个过程中调用函数判断是否达到目标点
 */
export function showBackToTop(callback) {
  let requestFram
  let oldScrollTop

  
  document.addEventListener('scroll',() => {
    isBackFunc()
  },false)

  document.addEventListener('touchstart',() => {
    isBackFunc()
  },{passive: true})

  document.addEventListener('touchmove',() => {
    isBackFunc()
  },{passive: true})

  document.addEventListener('touchend',() => {
    oldScrollTop = getScroll().top
    moveEnd()
  },{passive: true})

  // 移动到底部
  const moveEnd = () => {
    requestFram = requestAnimationFrame(() => {
      if(getScroll().top != oldScrollTop) {
        oldScrollTop = getScroll().top
        moveEnd()
      } else {
        cancelAnimationFrame(requestFram)
      }
      isBackFunc()
    })
  }

  // 判断是否达到目标
  const isBackFunc = () => {
    if(getScroll().top > 500) {
      callback(true)
    } else {
      callback(false)
    }
  }
}

function getScroll() {
  return {
    left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
    top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
  }
}

/**
 * 获取style样式
 */
 export const getStyle = (element, attr, NumberMode = 'int') => {
  let target;
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === 'scrollTop') { 
      target = element.scrollTop;
  }else if(element.currentStyle){
      target = element.currentStyle[attr]; 
  }else{ 
      target = document.defaultView.getComputedStyle(element,null)[attr]; 
  }
  //在获取 opactiy 时需要获取小数 parseFloat
  return  NumberMode == 'float'? parseFloat(target) : parseInt(target);
} 


/**
 * 运动效果
 * @param {HTMLElement} element   运动对象，必选
 * @param {JSON}        target    属性：目标值，必选
 * @param {number}      duration  运动时间，可选
 * @param {string}      mode      运动模式，可选
 * @param {function}    callback  可选，回调函数，链式动画
 */
 export const animate = (element, target, duration = 400, mode = 'ease-out', callback) => {
  clearInterval(element.timer);

  //判断不同参数的情况
  if (duration instanceof Function) {
      callback = duration;
      duration = 400;
  }else if(duration instanceof String){
      mode = duration;
      duration = 400;
  }

  //判断不同参数的情况
  if (mode instanceof Function) {
      callback = mode;
      mode = 'ease-out';
  }

  //获取dom样式
  const attrStyle = attr => {
      if (attr === "opacity") { 
          return Math.round(getStyle(element, attr, 'float') * 100);
      } else {
          return getStyle(element, attr);
      }
  }
  //根字体大小，需要从此将 rem 改成 px 进行运算
  const rootSize = parseFloat(document.documentElement.style.fontSize);

  const unit = {};
  const initState = {};

  //获取目标属性单位和初始样式值
  Object.keys(target).forEach(attr => {
      if (/[^\d^\.]+/gi.test(target[attr])) {
          unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px';
      }else{
          unit[attr] = 'px';
      }
      initState[attr] = attrStyle(attr);
  });

  //去掉传入的后缀单位
  Object.keys(target).forEach(attr => {
      if (unit[attr] == 'rem') {
          target[attr] = Math.ceil(parseInt(target[attr])*rootSize);
      }else{
          target[attr] = parseInt(target[attr]);
      }
  });


  let flag = true; //假设所有运动到达终点
  const remberSpeed = {};//记录上一个速度值,在ease-in模式下需要用到
  element.timer = setInterval(() => {
      Object.keys(target).forEach(attr => {
          let iSpeed = 0;  //步长
          let status = false; //是否仍需运动
          let iCurrent = attrStyle(attr) || 0; //当前元素属性址
          let speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
          let intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
          switch(mode){
              case 'ease-out': 
                  speedBase = iCurrent;
                  intervalTime = duration*5/400;
                  break;
              case 'linear':
                  speedBase = initState[attr];
                  intervalTime = duration*20/400;
                  break;
              case 'ease-in':
                  let oldspeed = remberSpeed[attr] || 0;
                  iSpeed = oldspeed + (target[attr] - initState[attr])/duration;
                  remberSpeed[attr] = iSpeed
                  break;
              default:
                  speedBase = iCurrent;
                  intervalTime = duration*5/400; 
          }
          if (mode !== 'ease-in') {
              iSpeed = (target[attr] - speedBase) / intervalTime;
              iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
          }
          //判断是否达步长之内的误差距离，如果到达说明到达目标点
          switch(mode){
              case 'ease-out': 
                  status = iCurrent != target[attr]; 
                  break;
              case 'linear':
                  status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                  break;
              case 'ease-in':
                  status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                  break;
              default:
                  status = iCurrent != target[attr]; 
          }

          if (status) {
              flag = false; 
              //opacity 和 scrollTop 需要特殊处理
              if (attr === "opacity") {
                  element.style.filter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";
                  element.style.opacity = (iCurrent + iSpeed) / 100;
              } else if (attr === 'scrollTop') {
                  element.scrollTop = iCurrent + iSpeed;
              }else{
                  element.style[attr] = iCurrent + iSpeed + 'px';
              }
          } else {
              flag = true;
          }

          if (flag) {
              clearInterval(element.timer);
              if (callback) {
                  callback();
              }
          }
      })
  }, 20);
}


/**
 * 页面到达底部，加载更多
 */
 export const loadMore = (element, callback) => {
  // console.log(element,callback);
	let windowHeight = window.screen.height;
	let height;
	let setTop;
	let paddingBottom;
	let marginBottom;
  let requestFram;
  let oldScrollTop;

  document.body.addEventListener('scroll',() => {
    loadMore();
  }, false)
    //运动开始时获取元素 高度 和 offseTop, pading, margin
	element.addEventListener('touchstart',() => {
    height = element.offsetHeight;
    setTop = element.offsetTop;
    paddingBottom = getStyle(element,'paddingBottom');
    marginBottom = getStyle(element,'marginBottom');
  },{passive: true})

    //运动过程中保持监听 scrollTop 的值判断是否到达底部
    element.addEventListener('touchmove',() => {
       loadMore();
    },{passive: true})

    //运动结束时判断是否有惯性运动，惯性运动结束判断是非到达底部
    element.addEventListener('touchend',() => {
       	oldScrollTop = getScroll().top;
       	moveEnd();
    },{passive: true})
    
    const moveEnd = () => {
        requestFram = requestAnimationFrame(() => {
            if (getScroll().top != oldScrollTop) {
                oldScrollTop = getScroll().top;
                loadMore();
                moveEnd();
            }else{
            	cancelAnimationFrame(requestFram);
            	//为了防止鼠标抬起时已经渲染好数据从而导致重获取数据，应该重新获取dom高度
            	height = element.offsetHeight;
                loadMore();
            }
        })
    }

    const loadMore = () => {
        if (getScroll().top + windowHeight >= height + setTop + paddingBottom + marginBottom) {
          callback();
        }
    }
}


// 实现底部加载更多
export const isTouchBottom = (handler) => {
  // 文档显示区域高度【可视高度】
  const showHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  // 滚动条滚动的距离
  const scrollTopHeight = document.documentElement.scrollTop || document.body.scrollTop;

  // 所有内容的实际高度
  const allHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  // clientHeight + scrollTop >= scrollHeight 时，
  // 表示已经抵达内容的底部了，可以加载更多内容。
  if(showHeight + scrollTopHeight >= allHeight) {
    handler()
  }
}