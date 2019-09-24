/**
 * 消息管道api
 */
import Vue from 'vue'
import notification from 'ant-design-vue/lib/notification'
const httpVue = new Vue()

/**
 *获取消息列表
 * @param {Object} param
 * @returns
 */
function getMessageList(param){
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/msgBox/queryMsgList',param).then(data => {
      if(data.code === 1){
        resolve(data.data)
      }else{
        notification.error({
          message: '获取消息列表失败',
          description: data.msg || '服务器异常，请稍后再试！'
        })
        reject()
      }
    })
  })
}

/**
 *获取消息未读数
 * @param {Object} param
 * @returns
 */
function getMessageUnreadNum(param){
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/msgBox/queryMsgUnreadCount',param).then(data => {
      if(data.code === 1){
        resolve(data.data)
      }else{
        notification.error({
          message: '获取消息未读数失败',
          description: data.msg || '服务器异常，请稍后再试！'
        })
        reject()
      }
    })
  })
}

/**
 *更新消息为已读状态
 * @param {Object} param
 * @returns
 */
function updateReaded(param){
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/msgBox/updateReaded',param).then(data => {
      if(data.code === 1){
        resolve(data.data)
      }else{
        reject()
      }
    })
  })
}

/**
 *拒绝任务
 * @param {Object} param
 * @returns
 */
function rejectTask(param){
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/solutionDesignTask/rejectSolutionDesignTask',param).then(data => {
      if(data.code === 1){
        resolve(data)
      }else{
        notification.error({
          message: '拒绝任务',
          description: data.msg || '服务器异常，请稍后再试！'
        })
        reject(data)
      }
    })
  })
}


/**
 *获取未渲染张数
 * @param {Object} param
 * @returns
 */
function queryRenderMsgCount(param){
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/msgBox/queryRenderMsgCount',param).then(data => {
      if(data.code === 1){
        resolve(data.data)
      }else{
        notification.error({
          message: '获取未渲染张数失败',
          description: data.msg || '服务器异常，请稍后再试！'
        })
        reject()
      }
    })
  })
}

const messageApi = {
  getMessageList:getMessageList,
  getMessageUnreadNum:getMessageUnreadNum,
  updateReaded:updateReaded,
  rejectTask:rejectTask,
  queryRenderMsgCount:queryRenderMsgCount
}

export default messageApi