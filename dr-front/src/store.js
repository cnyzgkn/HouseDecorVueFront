import Vue from 'vue'
import Vuex from 'vuex'
import createWebSocket from '@/common/utils/websocket.js'
import message from 'ant-design-vue/lib/message'

let vue = new Vue()
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    websocket:null, // 消息管道
    repalceResult:null, 
    repalceFullHouse: null, // 全屋定制替换结果
    adjustDistanceToFloor: null, // 离地距离
    // replaceModel: null, // 物料替换
    replaceTemplateModel: null, // 物料-模版替换
    // restoreData: null,
    templateParam: null,
    finishReplace: null, // 完成定制结果
    messageBoxItem: null,    // qt 发送的新消息
    deleteTask: null          // qt 通知删除任务
  },
  mutations: {
    SAVE_WEBSOCKET(state,ws){ // 打开消息管道
      if(state.websocket !== null){
        return
      }
      state.websocket = ws
      state.websocket.addEventListener('close',(event) => {
        state.websocket = null
        // 3500：自定义关闭状态码 1006：断网时关闭状态码
        if(event.code === 3500 || event.code === 1006){
          console.info(`%cstore:连接非正常关闭！(${event.code})`,'color:blue')
          console.info('%cstore:5s后重新发起链接！','color:blue')
          setTimeout(() => {
            this.dispatch('OPEN_WEBSOCKET')
          }, 5000);
        }
      })
    },
    CLOSE_WEBSOCKET(state){ // 主动关闭消息管道：只有用户主动退出时才可调用！！！！！
      if(state.websocket !== null){
        state.websocket.close()
        console.info('%cstore:连接正常关闭，不在接收消息推送！','color:blue')
      }
    },
    SAVE_QT_REPALCERESULT(state,data){
      state.repalceResult = data
    },
    SAVE_QT_REPLACEFULLHOUSE: (state,data) => {
      state.repalceFullHouse = data
    },
    SAVE_QT_ADJUSTDISTANCETOFLOOR: (state,data) => {
      state.adjustDistanceToFloor = data
    },
    // SAVE_QT_REPLACEMODEL: (state,data) => {
    //   state.replaceModel = data
    // },
    SAVE_QT_REPLACETEMPLATEMODEL: (state,data) => {
      state.replaceTemplateModel = data
    },
    // SAVE_QT_RESTOREDATA: (state,data) => {
    //   state.restoreData = data
    // },
    SAVE_QT_TEMPLATEPARAM: (state,data) => {
      state.templateParam = data
    },
    SAVE_QT_FINISHREPLACE: (state,data) => {
      state.finishReplace = data
    },
    SAVE_QT_MESSAGEBOX_ITEM: (state, data) => {
      state.messageBoxItem = data
    },
    SAVE_QT_DELETETASK: (state, data) => {
      state.deleteTask = data
    }
  },
  actions: {
    OPEN_WEBSOCKET({commit,state}){
      let userInfo = vue.$getUserInfo()
      if (!userInfo || !userInfo.user || !userInfo.user.userId) {
        message.error('未获取到用户信息无法接收消息推送，请重新登录！')
        return
      }
      console.info('%cstore:正发起链接！','color:blue')
      if(state.websocket === null){
        const WS_URL = `${process.env.VUE_APP_WEBSOCKET}${userInfo.user.userId}`
        createWebSocket(WS_URL).then( ws => {
          commit('SAVE_WEBSOCKET',ws)
        })
      }
    }      
  }
})