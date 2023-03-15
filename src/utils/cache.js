/**
 * 数据缓存
 */

/* 会话缓存 */
const sessionCache = {
  set(key,value) {
    if(!window.sessionStorage) return
    if(key != null && value != null) {
      window.sessionStorage.setItem(key,value)
    }
  },
  get(key) {
    if(!window.sessionStorage) return
    if(key == null) return null
    return window.sessionStorage.getItem(key)
  },
  setJSON(key,jsonVal) {
    if(jsonVal != null) {
      this.set(key,JSON.stringify(jsonVal))
    }
  },
  getJSON(key) {
    const value = this.get(key)
    if(value != null) {
      return JSON.parse(value)
    }
  },
  remove(key) {
    window.sessionStorage.removeItem(key)
  }
}


/* 本地缓存 */
const localCache = {
  set(key,value) {
    if(!window.localStorage) return
    if(key != null && value != null) {
      window.localStorage.setItem(key,value)
    }
  },
  get(key) {
    if(!window.localStorage) return
    if(key == null) return null
    return window.localStorage.getItem(key)
  },
  setJSON(key,jsonVal) {
    if(jsonVal != null) {
      this.set(key,JSON.stringify(jsonVal))
    }
  },
  getJSON(key) {
    const value = this.get(key)
    if(value != null) {
      return JSON.parse(value)
    }
  },
  remove(key) {
    window.localStorage.removeItem(key)
  }
}

export default {
  session: sessionCache,
  local: localCache
}