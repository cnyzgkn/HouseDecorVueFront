/* eslint-disable no-param-reassign */
import axios from 'axios'
import Vue from 'vue'
import { getUserInfo } from '@/common/utils/baseFunc.js'
import {notification} from 'ant-design-vue'

const instance = axios.create({
  timeout: 30000,
  headers: {
    common: { Authorization: getUserInfo() && getUserInfo().token? getUserInfo().token : null }
  }
})
// production 环境 增加base url
if(process.env.NODE_ENV === 'production'){
  if(location.origin === 'http://dr-pre.ihomefnt.com'){ //pre环境
    instance.defaults.baseURL='http://dr-pre.ihomefnt.com'
  }else if(location.origin === 'https://dr.sit.ihomefnt.org'){ // sit环境
    instance.defaults.baseURL='https://dr.sit.ihomefnt.org'
  }else{ //生产环境
    instance.defaults.baseURL='https://dr.ihomefnt.com'
  } 
}

let vue = new Vue()
// 路由响应拦截:http request 拦截器
instance.interceptors.request.use(
  config => config,

  (error) => {
    // 请求错误时
    // 1. 判断请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      notification.error({
        message: '服务异常',
        description: '请求超时'
      })
    }
    vue.$gLoading.hide()
    return Promise.reject(error)
  }
)

// 路由响应拦截:http response 拦截器
instance.interceptors.response.use(
  response => {
    let data = response.data
    if(data.code === 112){
      notification.error({
        message: '登录过期（112）',
        description:data.msg || '登录过期,请重新登录'
      })
      vue.$gLoading.hide()
      return Promise.reject()
    }
    return data
  },
  (error) => {
    if (error) {
      if(!error.response){
        notification.error({
          message: '失败',
          description: error.message
        })
        vue.$gLoading.hide()
        return Promise.reject(error)
      }
      switch (error.response.status) {
        case 400:
          notification.error({
            message: '服务异常（400）',
            description: '请求错误'
          })
          vue.$gLoading.hide()
          break
        case 401:
          notification.error({
            message: '未登录（401）',
            description: '未登录，请重新登录'
          })
          vue.$gLoading.hide()
          //TODO:重定向到登录页面
          break
        case 403:
          notification.error({
            message: '未授权（403）',
            description: '未授权，请重新登录'
          })
          vue.$gLoading.hide()
          break
        case 404:
          notification.error({
            message: '请求错误（404）',
            description: error.message
          })
          vue.$gLoading.hide()
          break
        case 500:
          notification.error({
            message: '服务异常（500）',
            description: error.message
          })
          vue.$gLoading.hide()
          break
        case 502:
          notification.error({
            message: '网关错误（502）',
            description: error.message
          })
          vue.$gLoading.hide()
          break
        default:
          notification.error({
            message: '服务器异常（' + error.response.status + ')',
            description: error.message
          })
          vue.$gLoading.hide()
          break
      }
    }
    return Promise.reject(error)
  }
)

const install = () => {
  if (install.installed) { return }
  install.installed = true
  Vue.prototype.$http = instance
}
export default install
