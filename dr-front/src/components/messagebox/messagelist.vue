<!--消息列表-->
<template>
  <div>
    <!--消息列表-->
    <div class="message-list-wrap">
      <dr-tabs
        v-model="selectedTab"
        @tabClick="onTabClick"
      >
        <a-tab-pane
          v-for="tab in tabs"
          :key="`message-tab-${tab.value}`"
        >
          <span slot="tab">
            {{ tab.name }}
            <a-badge
              v-if="tab.value === 1"
              :count="noReanNum.task"
              :overflow-count="99"
              :number-style="{backgroundColor: 'rgb(233, 108, 46)',fontWeight: '900',height: '18px',lineHeight: '18px',minWidth: '18px',marginTop: '-2px'}"
            />
            <a-badge
              v-else-if="tab.value === 2"
              :count="noReanNum.solution"
              :overflow-count="99"
              :number-style="{backgroundColor: 'rgb(233, 108, 46)',fontWeight: '900',height: '18px',lineHeight: '18px',minWidth: '18px',marginTop: '-2px'}"
            />
            <template v-else>
              <a-spin
                v-if="rendering"
                size="small"
              />
              <a-badge
                v-else
                :count="noReanNum.render"
                dot
                :number-style="{backgroundColor: 'rgb(233, 108, 46)'}"
              />
            </template>
          </span>
          <!--无数据展示-->
          <template v-if="messageList.length === 0 && !loading">
            <span
              class="message-empty iconfont iconMessageEmpty"
            />
            <h6 class="message-empty-tips">
              当前暂无消息
            </h6>
          </template>
          <!--详情展示-->
          <template v-else>
            <div
              v-for="(msg,index1) in messageList"
              :key="`message-list-${index1}`"
              class="list-wrap"
              @click="onClickToRead(msg)"
            >
              <!--消息内容 start-->
              <message-functinal :computed-info="getInfos(msg)">
                <template v-slot="{computedInfo:info}">
                  <!--左侧icon-->
                  <span
                    class="iconfont"
                    :class="info.iconSvg"
                  />
                  <!--左侧icon end-->
                  <div :class="['list-content-wrap',{'list-content-wrap-readed':!!msg.readed}]">
                    <!--任务状态、方案名称、消息时间-->
                    <p v-if="msg.msgType !== 3">
                      <span
                        v-show="msg.msgType === 2"
                        class="solution-name"
                      >
                        {{ msg.solutionName }}
                      </span>
                      <span :class="['status',`status_${info.statusColor}`]">
                        {{ info.statusText }}
                      </span>
                      <span class="create-time">
                        {{ msg.timeStr }}
                      </span>
                    </p>
                    <!--项目名称、方案信息、关联任务、未读消息-->
                    <p v-if="msg.msgType !== 3">
                      <span
                        v-show="msg.msgType === 1"
                        class="project"
                      >
                        {{ msg.projectName }}
                      </span>
                      <span
                        v-show="msg.msgType === 2"
                        class="solutin-info"
                      >
                        <template v-if="msg.solutionType === 2">
                          DNA&nbsp; 
                        </template>
                        {{ msg.msgId }}&nbsp;&nbsp;/&nbsp;&nbsp;
                        <template v-if="msg.taskId">
                          关联任务&nbsp;&nbsp;{{ msg.taskId }}&nbsp;&nbsp;/&nbsp;&nbsp;
                        </template>
                        {{ msg.seriesName }}&nbsp;&nbsp;/&nbsp;&nbsp;
                        {{ msg.styleName }}&nbsp;&nbsp;
                      </span>
                      <a-badge
                        :count="msg.unreadNum"
                        :number-style="{backgroundColor: '#E96C2E'} "
                      />
                    </p>
                    <!--客户名称、消息id-->
                    <p v-if="msg.msgType === 1">
                      <span class="custom-name">
                        {{ msg.customName }}
                        {{ msg.msgId }}
                      </span>
                    </p>
                    <!--渲染方案名称、渲染方案id、关联任务、未读标示-->
                    <p
                      v-if="msg.msgType === 3"
                      class="fs"
                    >
                      <span
                        class="solution-name"
                      >
                        {{ msg.solutionName }}
                      </span>
                      <span class="render-info">
                        <template v-if="msg.solutionType === 2">
                          &nbsp;&nbsp;DNA
                        </template>
                        &nbsp;{{ msg.msgId }}&nbsp;
                        <template v-if="msg.taskId">
                          /&nbsp;关联任务&nbsp;{{ msg.taskId }}
                        </template>
                      </span>
                      <a-badge
                        v-if="!msg.readed && msg.renderActiveNum === 0"
                        status="error"
                      />
                    </p>
                    <!--渲染数量-->
                    <p
                      v-if="msg.msgType === 3"
                      class="fs render-info"
                    >
                      渲染完成&nbsp;<span class="num">{{ msg.renderDoneNum }}</span>&nbsp;张
                      <template v-if="msg.renderActiveNum">
                        <a-badge
                          class="num-active"
                          status="error"
                        />
                        剩余渲染&nbsp;<span class="num">{{ msg.renderActiveNum }}</span>&nbsp;张
                      </template>
                    </p>
                  </div>
                </template>
              </message-functinal>
            <!--消息内容 end-->
            </div>
          </template>
          <!--加载展示-->
          <template v-if="loading">
            <a-icon type="loading" />
            <h6 class="loading">
              加载中...
            </h6>
          </template>
        </a-tab-pane>
      </dr-tabs>
    </div>
  </div>
</template>

<script>
import DrTabs from '@/components/base/dr-tabs.vue'
import messageApi from './messagebox.api.js'
import MessageBoxMixin from './messagebox.mixin.js'
import MessageFunctinal from './messageFunctinal.js'
import { getQtDataBytTag as getQtDataByTag, provideFunToQtByChannel, execQtFuncByChannel } from '@/common/utils/baseMethods.js'
import global from '@/common/config/global.js'
import { setUserInfo } from '@/common/utils/baseFunc.js'

export default {
  name:'MessageList',
  components:{DrTabs,MessageFunctinal},
  mixins:[MessageBoxMixin],
  data(){
    return{
      selectedTab:'message-tab-1',
      rendering: false,
      tabs:[
        {
          name:'设计任务',
          value:1
        },
        {
          name:'设计方案',
          value:2
        },
        {
          name:'渲染任务',
          value:3
        },
      ],
      messageList:[], // 消息列表
      noReanNum:{ // 未读数量
        task:0,
        solution:0,
        render:0
      },
      loading:false // 列表加载
    }
  },
  watch:{
    // 监听收到的新消息
    '$store.state.messageBoxItem':{
      handler: function(data){
        if(data){
          this.onmessage(data)
        }
      },
      deep: true
    },
    // 监听删除的任务
    '$store.state.deleteTask': {
      handler(taskId) {
        this.deleteNewTaskMessage(taskId)
      }
    },
  },
  created() {
    this.getInitData()

    this.provideAddNewMessageFuncToQT()

    this.getRenderStatus()
  },
  methods:{
    async getInitData() {
      if (typeof qt !== 'undefined') {
        let result = await getQtDataByTag(global.qtChannel.messageList, global.qtTag.getUserInfo)
        let { userId = '', token = '' } = JSON.parse(result) || {}
  
        let userInfo = this.$getUserInfo() || {}
        if (userId) {
          if (!userInfo.user) {
            userInfo.user = {}
          }
          userInfo.user.userId = userId
        }
        if (token) {
          userInfo.token = token
        }
        setUserInfo(userInfo)
      }

      this.getMessageUnreadNum()
      this.getMessageList(this.tabs[0].value)
    },
    
    // 提供增加消息方法给 QT
    provideAddNewMessageFuncToQT() {
      provideFunToQtByChannel('newMessageNotify', 'MESSAGEBOX_ITEM')
    },
    // 获取渲染状态
    getRenderStatus() {
      let userInfo = this.$getUserInfo()
      if (!userInfo || !userInfo.user || !userInfo.user.userId) {
        this.$message.error('未获取到用户信息无法接收消息推送，请重新登录！')
        return
      }
      let param = {
        userId:userInfo.user.userId,
      }
      messageApi.queryRenderMsgCount(param).then(data => {
        if(data > 0){
          this.rendering = true
        }else{
          this.rendering = false
        }
      })
    },
    onTabClick(key){
      key = key.split('-').pop()
      this.getMessageList(+key)
    },
    // 获取消息列表list
    getMessageList(msgType){
      this.loading = true
      let userInfo = this.$getUserInfo()
      if (!userInfo || !userInfo.user || !userInfo.user.userId) {
        this.$message.error('未获取到用户信息，请重新登录！')
        return
      }
      let param = {
        msgType,
        userId: userInfo.user.userId,
      }
      this.messageList.splice(0,this.messageList.length)
      const _this = this
      messageApi.getMessageList(param).then(data => {
        _this.messageList = data ? data.msgList : []
        let unreadNum = data ? data.unReadTotalCount:0
        if(param.msgType === 1){
          _this.noReanNum.task = unreadNum
        }else if(param.msgType === 2){
          _this.noReanNum.solution = unreadNum
        }else{
          _this.noReanNum.render = unreadNum
        }
        _this.loading = false
      })
    },
    // 初始化时获取设计任务、设计方案、渲染任务的未读数
    getMessageUnreadNum(){
      let userInfo = this.$getUserInfo()
      if (!userInfo || !userInfo.user || !userInfo.user.userId) {
        this.$message.error('未获取到用户信息，请重新登录！')
        return
      }
      let param = {
        userId: userInfo.user.userId,
      }
      messageApi.getMessageUnreadNum(param).then(data => {
        this.noReanNum.task = data.designTaskUnreadCount
        this.noReanNum.solution = data.solutionUnreadCount
        this.noReanNum.render = data.renderTaskUnreadCount
      })
    },
    // 点击阅读消息
    onClickToRead(message){
      console.log('click message: ', message)
      if (typeof qt !== 'undefined') {
        // execQtFuncByChannel(global.qtChannel.messageList, global.qtTag.onReduceUnreadCount, 5)
      }
      let unreadNum = message.unreadNum
      this.showMessage(message, unreadNum)
      if(message.readed === 0){
        //更新为已读状态
        this.updateReaded(message).then((data) => {
          if(!data){ // 更新状态失败
            return
          }
          let key = message.msgType === 1?'task':message.msgType === 2?'solution':'render'
          message.readed = 1 //置为已读
          this.noReanNum[key] = this.noReanNum[key] - data
          // if( message.msgType !== 3){ // 渲染的未读数量不计入总数，所以不需更新
          //   this.$emit('message-readed',data)
          // }  
          message.unreadNum = 0 // 清空未读数量
        })
      }
    },
    async showMessage(message, reduceUnreadCount){
      // if(this.inQt){
      if(typeof qt !== 'undefined'){
        let param = {
          msgId: message.msgId,
          status: message.status,
          msgType: message.msgType,
          reduceUnreadCount,           // 
        }
        if(message.msgType === 1){
          param.width = 800
          param.height = 600
        }else{
          param.width = 560
          param.height = 494
        }
        //通知DR打开窗口
        execQtFuncByChannel(global.qtChannel.messageList, global.qtTag.showMessageDetail, param)
      }else{
        if(message.msgType === 1){
          this.getTaskDetail(message.msgId)
        }else{
          this.getSchemeDetail(message.msgId)
        }
      }
    },
    //当打开消息列表的前提下，如果消息管道接收到新消息需要给当前消息列表增加消息
    addMessage(message){
      // 1.更新未读消息
      let key = message.msgType === 1?'task':message.msgType === 2?'solution':'render'
      this.noReanNum[key]++

      // 2.当前展示的列表为该消息所属的列表时，增加当前messageList
      if(+this.selectedTab.split('-').pop() === message.msgType){
        // this.messageList.unshift(message)
        this.mergeMessage(message)
      }
    },
    // 消息合并
    mergeMessage(message){
      console.log('messge: ', message)
      let msg = {...message}
      for (let index = 0; index < this.messageList.length; index++) {
        const element = this.messageList[index]
        if(msg.msgId !== element.msgId){
          continue
        }
        // 1.当msgId致时合并展示
        msg.unreadNum = element.unreadNum + 1  //未读数量加1
        this.messageList.splice(index,1)
        this.messageList.unshift(msg)
        return
      }
      // 2.没有相同id时，置于列表第一项展示
      this.messageList.unshift(msg)
    },
    // 删除新任务
    deleteNewTaskMessage(msgId){
      for (let index = 0; index < this.messageList.length; index++) {
        const element = this.messageList[index]
        if(+element.msgId !== +msgId){
          continue
        }
        this.messageList.splice(index,1)
        return
      }
    },
    // 当接收到消息推送时
    onmessage(data){
      let obj = JSON.parse(data)
      let msgType = obj.msgType
      //非目标消息不处理
      if(!obj || !msgType || ![1,2,3].includes(msgType)){
        return
      }

      //消息为渲染任务时，判断该用户名下是否还有渲染任务
      if(msgType === 3){
        if(obj.allActiveNum > 0){
          this.rendering = true
        }else{
          this.rendering = false
        }
      }
      
      // 通知消息列表增加消息
      obj.unreadNum = 1 // 新的消息默认为未读状态
      obj.readed = 0 // 新的消息默认未读数量为0
      this.addMessage(obj)
    }
  }
}
</script>
<style scoped>
.message-list-wrap{
  position: absolute;
  top: 0;
  left: 0;
  width:400px;
  height: 550px;
  background-color: #fff;
  overflow: auto;
}
.message-empty{
  font-size: 58px;
  margin-top: 37px;
  margin-bottom: 6px;
  color:#ececec;
}
.message-empty-tips{
  font-size: 12px;
  color: #8d8d8d;
}
.list-wrap{
  display: flex;
  padding: 15px 20px;
}
.list-wrap:hover{
  cursor: pointer;
  background-color: #f9f9f9;
}
.ant-tabs-tabpane{
  padding-top:15px; 
}
.message-list-wrap >>> .ant-tabs-nav-container{
  padding: 0 30px;
}
.message-list-wrap >>> .ant-tabs-tabpane{
  height: 495px;
  overflow-y: auto;
}
.list-wrap .iconfont{
  font-size: 16px;
  margin-right: 5px;
  flex: none;
  color:#dadada;
}
.list-content-wrap{
  flex: auto;
}
.list-content-wrap-readed span{
  color: #5c5c5c !important;
}
.list-content-wrap-readed >>> .ant-badge{
  display: none;
}
.list-content-wrap > p{
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-content-wrap > p.fs{
 justify-content: flex-start;
 align-items: baseline;
}
.list-content-wrap > p.fs > .ant-badge{
  flex: auto;
  text-align: right
}
.solution-name{
  flex: none;
  font-size: 14px;
  font-weight: 600;
  margin-right: 5px;
}
.status{
  flex: auto;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
}
.status_red{
  color: #C65050
}
.status_green{
  color: #6BA469
}
.status_orange{
  color: #E96C2E
}
.create-time{
  flex: none;
  font-size: 12px;
  color: #8d8d8d;
}
.project{
  width: 300px;
  text-align: left;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.custom-name{
  font-size: 12px;
}
.solutin-info{
  width: 300px;
  text-align: left;
  color: #8d8d8d;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.render-info,.loading{
  color: #8d8d8d;
  font-size: 12px;
}
.render-info .num{
  color: #5c5c5c;
}
@keyframes shinning
{
  from {opacity: 0;}
  to {opacity:1;}
}
.render-info .num-active{
  flex: none !important;
  margin-left:10px;
  transition: all 500ms;
  animation:shinning 1s ease-in-out infinite;
 }
.ant-spin-spinning{
  margin-top: 2px;
}
.drtabs >>> .ant-spin-dot i{
  background-color:#E96C2E
}
.drtabs >>> .ant-tabs-tab{
  margin-right: 35px !important;
}
</style>