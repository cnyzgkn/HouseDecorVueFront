/**
 * 公用api
 */
import Vue from 'vue'
import notification from 'ant-design-vue/lib/notification'

let httpVue = new Vue()

// 密码登录
export async function passLogin (loginInfo) {
  let user = await httpVue.$http.post('/dr-web/login', loginInfo)
  return user
}
//短信登录
export async function messageLogin (loginInfo) {
  let user = await httpVue.$http.post('/dr-web/loginBySmsCode', loginInfo)
  return user
}

// 获取户型风格
export function getHouseStyle () {
  return httpVue.$http.post('/dr-web/house/queryHouseStyle', {})
}

// 获取户型系列
export function getHouseSeries () {
  return httpVue.$http.post('/dr-web/house/queryHouseSeries', {})
}
//校验验证码
export function checkeMessage (param) {
  return httpVue.$http.post('/dr-web/verification/checkSmsCode', param)
}
//重置密码
export function resetpassword (param) {
  return httpVue.$http.post('/dr-web/designer/password/reset', param)
}
//注册新用户
export function addUser (param) {
  return httpVue.$http.post('/dr-web/signup', param)
}

// 获取户型
export function queryHouseByCondition(param){
  return  new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/house/queryHouseByCondition',param).then( (data) => {
      if(data.code === 1){
        resolve(data.data.list)
      }else{
        notification.error({
          message: '失败',
          description: data.msg || '获取户型任务详情失败，请稍后再试！'
        })
        reject()
      }
    })
  })
}

/**
 *根据任务id获取任务详情
 * @param {Object} param
 * @returns
 */
export function queryDesignTaskDetail(param){
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/solutionDesignTask/queryDesignTaskDetail',param).then(data => {
      if(data.code === 1){
        resolve(data.data)
      }else{
        notification.error({
          message: '获取任务详情失败',
          description: data.msg || '服务器异常，请稍后再试！'
        })
        reject()
      }
    })
  })
}