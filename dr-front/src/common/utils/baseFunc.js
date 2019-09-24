/**
 * 公用方法
 */
import * as localStorage from './localStorage'
import DrSpin from '@/components/base/dr-spin.vue'
import DrFullLoading from '@/components/base/dr-full-loading.vue'
import Vue from 'vue'

/**
 * 存储用户信息至localstorage
 * @param {*} userInfo  Object
 */
export function setUserInfo (userInfo) {
  localStorage.removeStore('dr2.0-user')
  localStorage.setJSONStore('dr2.0-user', userInfo)
  //重置挂载在vue原型链上的axios实例（$htpp）的默认Authorization字段
  Vue.prototype.$http.defaults.headers.common.Authorization = userInfo.token
}

/**
 * 获取用户信息
 */
export function getUserInfo () {
  if(localStorage.getJSONStore('dr2.0-user')){
    return localStorage.getJSONStore('dr2.0-user')
  }
  else {
    return {user:{username:'',userId:""}}
  }
}

/**
 *
 * @type {ExtendedVue<Vue, any, any, any, Record<never, any>>}
 */
export function ifEmpty (value) {
  if (value === '' || value == null || value === undefined || value === 'null') {
    return true
  } else {
    return
    // eslint-disable-next-line no-unreachable
    false
  }
}

// 普通loading
const Spin = Vue.extend(DrSpin)
let currentspin = new Spin()
let vm = currentspin.$mount()
let el = vm.$el
document.body.appendChild(el) // 把生成的提示的dom插入body中
// loading
const gLoading = {
  show: (msg) => {
    return currentspin.showSpin(msg)
  },
  hide: () => {
    return currentspin.hideSpin()
  }
}

//全屏loading
// 普通loading
const drFullLoading = Vue.extend(DrFullLoading)
let currentLoading = new drFullLoading()
let currentLoadingVm = currentLoading.$mount()
let currentLoadingEl = currentLoadingVm.$el
document.body.appendChild(currentLoadingEl) // 把生成的提示的dom插入body中
// loading
const fullLoading = {
  show: () => {
    currentLoadingEl.style.display ='block'
  },
  hide: () => {
    currentLoadingEl.style.display ='none'
  }
}
/**
 * 阿里云，七牛图片匹配
 * @param url   图片路径
 * @returns {boolean}
 */
const ifAliyunImage = function (url) {
  // 判断是否是图片
  let result = false
  const ifimgreg = /\.(png|jpeg|jpg|gif|svg)(\?.*)?$/
  const reImg = new RegExp(ifimgreg)
  if (reImg.test(url)) {
    const reg = /(\w+)?img\d+\.ihomefnt\.com/
    const re = new RegExp(reg)
    if (re.test(url) || url.indexOf('aliyuncs') > -1 || url.indexOf('common.ihomefnt.com') > -1 || url.indexOf('static.ihomefnt.com ') > -1) {
      result = true
    }
  }
  return result
}

const allfunc = { gLoading, getUserInfo, ifEmpty, fullLoading ,ifAliyunImage }
const install = () => {
  if (install.installed) { return }
  install.installed = true
  for (let key in allfunc) {
    Vue.prototype['$' + key] = allfunc[key]
  }
}
export default install
