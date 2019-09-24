/**
 * 公用方法,和baseFunc不同的是不会挂载到Vue原型上，可按需引入
 */

import global from '@/common/config/global.js'
import notification from 'ant-design-vue/lib/notification'
import message from 'ant-design-vue/lib/message'
import QWebChannel from '@/common/utils/qwebchannel.js'
import store from '@/store.js'
import Vue from 'vue'
const vue = new Vue({
  store
})
/**
 * 
 * @param {String} mobile  手机号 18670755942
 * @return {String} 手机号 186 7075 5942
 */
export function formatMobile (mobile) {
  if(typeof(mobile) !== 'string' || !mobile){
    return mobile 
  }
  let arr = mobile.split('')
  arr.splice(3,0,' ')
  arr.splice(8,0,' ')
  return arr.join('')
}

/**
 * 主动获取qt本地数据 【发起方web】
 * @param {String} qtChannel qt管道标示 cppObject
 * @param {String} qtTag qt接口标示
 * @return {String} result qt返回的信息
 */
export function getQtDataBytTag(qtChannel,qtTag){
  if(!qtChannel){
    message.warning('无法打开QT：消息管道标识为空！');
    return
  }
  if(!qtTag){
    message.warning('无法打开QT：名为空！');
    return
  }
  return new Promise(function(resolve,reject){
    //本地环境返回模拟的假数据
    if(process.env.VUE_APP_ENV === 'LOCAL'){
      if(qtTag !== 'userInfoStr'){
        console.log(`获取模拟数据(${qtTag}):${global[qtTag]}`)
        resolve(global[qtTag])
      }else{
        let user = vue.$getUserInfo()
        console.log(`获取模拟用户信息数据(${qtTag}):`)
        console.log(user)
        resolve(JSON.stringify(user))
      }
    }

    new QWebChannel(qt.webChannelTransport, function (channel) {
      
      let result
      if(channel.objects[qtChannel]){
        result = channel.objects[qtChannel][qtTag]
      }

      console.log(`进入QT(${qtTag})，获取结果:${result}`)

      let isSuccess = false //是否成功
      
      if(result || result === '' || result === 0){
        isSuccess = true
      }

      if(isSuccess){
        resolve(result)
      }else{
        if(qtTag !== global.qtTag.userInfoStr){ // 由于用户信息需要依次取，所以去掉报错信息
          notification.error({
            message: `获取本地资源出错`,
            description:`QT接口：${qtTag},结果:${result}`
          })
        }
        resolve(null)
      }
    })
  })
}
/**
 *执行QT Chanel 管道里的方法 【发起方web】
 * @export
 * @param {string} qtChannel channel管道标示
 * @param {string} funcName 方法名
 * @param {object} data 参数 
 */
export function execQtFuncByChannel(qtChannel,funcName,data){
  if(!qtChannel){
    message.warning('无法打开QT：消息管道标识为空！');
    return
  }
  if(!funcName){
    message.warning('无法打开QT：方法名为空！');
    return
  }
  console.group('执行QT方法：' + funcName, 11111)
  console.log("方法名：" + funcName)
  let dataStr = data ? JSON.stringify(data) : '未定义'
  console.log("入参：" + dataStr)
  console.log("channel：" + qtChannel)
  console.groupEnd()
  //本地环境返回模拟的假数据
  if(process.env.VUE_APP_ENV === 'LOCAL'){
    console.log(`%c本地环境未执行上述方法:${funcName}`,"color: red; font-size: 14px")
    return
  }
  new QWebChannel(qt.webChannelTransport, function (channel) {
    let qt = channel.objects[qtChannel]
    if(data){
      qt[funcName](JSON.stringify(data))
    }else{
      qt[funcName]()
    }
  })
}

/**
 * 
 * @param {Number} 卡片宽度  
 * @param {Number} 卡片右边距 
 * @return {Number} 容器宽度
 */
export function calcWidth (cardWidth,cardMr) {
  const mainContentPd = 60  // 主内容区左右内边距
  const innerWidth = window.innerWidth < 1205 ? 1204 : window.innerWidth
  let wrapWh = innerWidth - mainContentPd
  let numInter = parseInt(wrapWh/(cardWidth + cardMr))
  return numInter*cardWidth + (numInter-1) * cardMr
}

/**
 *提供方法给QT调用，通过函数入参得到QT数据，存入store 【发起方QT】
 * @export
 * @param {*} funcName
 * @param {*} dataTag
 */
export function provideFunToQtByChannel(funcName,dataTag){
  let fn = function(data){
    vue.$store.commit(`SAVE_QT_${dataTag.toUpperCase()}`,data)
  }
  window[funcName] = fn // 挂载到window对象上供QT调用
}  

