<!-- 消息盒子入口 -->
<template>
  <div
    class="message-box-wrap"
    :style="{width:width + 'px',height:height + 'px'}"
  >
    <div
      class="message-box"
    >
      <!--消息列表-->
      <message-list
        v-if="msgType === '0'"
        ref="messageList"
      />
      <!--任务详情-->
      <task-detail
        v-if="msgType === '1'"
        :visible="true"
        :hide-close-btn="false"
        :task-detail="currentTask"
        @cancel="onCancleTaskDetailModal"
      />
      <!--方案详情-->
      <scheme-detail
        v-if="msgType === '2' || msgType === '3'"
        ref="schemeDetailModal"
        :visible="true"
        @cancel="onCancleSchemeDetailModal"
      />
    </div>
  </div>
</template>
<script>
import MessageList from './messagelist.vue'
import TaskDetail from '@/modules/qt/taskDetail.vue'
import SchemeDetail from '@/modules/qt/schemeDetail.vue'
import MessageBoxMixin from './messagebox.mixin.js'
import global from '@/common/config/global.js'
import { provideFunToQtByChannel, execQtFuncByChannel } from '@/common/utils/baseMethods.js'
export default {
  name:'MessageBox',
  components:{MessageList,TaskDetail,SchemeDetail},
  mixins:[MessageBoxMixin],
  props:{
    inQt:{ //标记消息盒子是在否在QT页面
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      msgType: '',
      width:122, // 消息盒子-宽
      height:104, // 消息盒子-高
      taskDetailVisible:false, // 是否展示任务详情弹窗
      schemeModalVisible:false, // 是否展示方案详情弹窗
      currentTask:[], // 当前消息关联的任务详情
      size:{ // 尺寸
        icon:{ // 入口图标
          width:122,
          height:104
        },
        list:{ // 列表
          width:516,
          height:686
        },
        max:{ // 极限高度
          width:516,
          height:2000
        },
      }
    }
  },
  mounted(){
    // 提供删除任务方法给 QT
    provideFunToQtByChannel('deleteTask','DELETETASK')

    let msgType = this.$route.query.msgType
    console.log('msgType: ', msgType)
    if (msgType) {
      this.msgType = msgType
      switch(msgType) {
        case '1':
          this.getTaskDetail(this.$route.query.msgId)
          break;
        case '2':
        case '3':
          this.$nextTick(function() {
            this.getSchemeDetail(this.$route.query.msgId)
          })
          break;
      }
    } else {
      this.msgType = '0'
    }
  },
  methods:{
    // 进入任务
    enterTask(taskInfo=this.currentTask){
      //  不同的页面调用的QT Channel 不同
      // this.enterTaskByQtChannel(taskInfo,global.qtChannel.main)
      this.enterTaskByQtChannel(taskInfo,global.qtChannel.messageDetail)
    },
    //拒绝任务
    onRefuseTask () {
      let _this = this
      this.$confirm({
        title: '确认拒绝该任务吗?',
        async onOk () {
          let result = await _this.doRefuseTask() // 拒绝任务结果
          // let currentTabType = +_this.$refs.messageList.selectedTab.split('-').pop() //当前消息列表中选中的tab
          let messageStatus = _this.$route.query.status // 当前点击的消息状态
          let msgId = _this.$route.query.msgId
          // 拒绝任务成果后
          // 当前消息列表展开
          // 当前选中消息列表选中的“设计任务”
          // 拒绝任务的状态未新任务
          //   在以上条件满足时，需要手动删除该新任务（因新任务拒绝后，不再有任务详情）
          // if(result && currentTabType === 1 && messageStatus === 1){
          // if(result && messageStatus === 1){
          if(result){
            _this.deleteNewTaskMessageAfterRefuse(msgId,messageStatus)

          }
        },
        onCancel () {}
      })
    },
    /**
    * 页面拒绝任务之后，需要删除新任务（因新任务拒绝后，不再有任务详情）
    * @param {number} msgId 消息id
    * @param {number} msgStatus 消息状态
    */
    deleteNewTaskMessageAfterRefuse(msgId,msgStatus){
      console.log('msgStatus: ', msgStatus)
      if(+msgStatus === 1){ // 新任务
        // provideFunToQtByChannel('deleteTask','DELETETASK')

        execQtFuncByChannel(global.qtChannel.messageDetail, global.qtTag.rejectTask)

        // this.$refs.messageList.deleteNewTaskMessage(msgId)
      }
    }
  }
}
</script>
<style scoped>
.message-box-wrap{
  position: absolute;
  left: 0;
  top: 0;
}
.message-box-wrap-qt{
  background-color: #28292B
}
.message-box{
  position: absolute;
  left: 0;
  top: 0;
  transition: all 500ms;
}
.popver-enter,.popver-leave-to{
  opacity: 0;
  transform: translateX(500px);
}
.popver-enter-to{
  opacity: 1;
  transform: translateX(0);
}
.popver-enter-active,
.popver-leave-active {
  transition: all 500ms;
}
.popver-move {
  transition: all 1s;
}
.tips-group{
  position: absolute;
  bottom: 74px;
  right: 0px;
  transition: all 500ms;
}
</style>

