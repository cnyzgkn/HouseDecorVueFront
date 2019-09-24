<!--任务卡片组件-->
<template>
  <div class="taskCardWrap">
    <div
      class="taskCard"
      :class="taskInfo.drTaskStatus==5?'finishedcard':''"
      @mouseenter="showOpt"
      @mouseleave="hideOpt"
    >
      <img
        v-show="taskInfo.drTaskStatus==1"
        class="statustag"
        src="../../assets/images/newTask.png"
      >
      <img
        v-show="taskInfo.drTaskStatus==3"
        class="statustag"
        src="../../assets/images/taskAuditing.png"
      >
      <img
        v-show="taskInfo.drTaskStatus==4"
        class="statustag"
        src="../../assets/images/taskunAudit.png"
      >
      <img
        v-show="taskInfo.drTaskStatus==5"
        class="statustag"
        src="../../assets/images/taskFinished.png"
      >
      <div
        class="title"
        :class="{'newtask':taskInfo.drTaskStatus==1,'designing':taskInfo.drTaskStatus==2,'auditing':taskInfo.drTaskStatus==3,'unaudited':taskInfo.drTaskStatus==4,'finished':taskInfo.drTaskStatus==5}"
      >
        <div class="thead">
          <div class="username">
            {{ taskInfo.userName }}
          </div>
          <div class="taskId">
            {{ taskInfo.id }}
          </div>
          <span
            v-if="taskInfo.shared"
            class="share-info"
          >
            {{ taskInfo.fromShareDesigner }}共享
          </span>
        </div>
        <div
          class="pname"
          :title="taskInfo.projectName"
        >
          {{ taskInfo.projectName }}
        </div>
      </div>
      <div class="taskInfo">
        <div class="eachtask">
          <span class="et">任务时间：</span><span class="ec">{{ taskInfo.drcreateTime }}</span>
        </div>
        <div class="eachtask">
          <span class="et">交房时间：</span><span class="ec">{{ taskInfo.expectTimeStr }}</span>
        </div>
        <div class="eachtask">
          <span class="et">户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：</span><span class="ec">{{ taskInfo.houseName }}</span>
        </div>
        <div class="eachtask">
          <span class="et">订单状态：</span><span class="ecstatus">{{ taskInfo.orderStatusStr }}</span>
        </div>
        <div
          v-show="taskOptFlag"
          class="btnrow"
        >
          <a-button
            type="primary"
            class="startbtn"
            @click="enterTask(taskInfo)"
          >
            进入任务
          </a-button>
          <a-button
            v-if="!taskInfo.shared"
            class="taskdetailBtn"
            size="small"
            @click="shareTask(taskInfo)"
          >
            共享
          </a-button>
          <a-button
            class="taskdetailBtn"
            size="small"
            @click="showTaskdetal(taskInfo)"
          >
            详情
          </a-button>
          <a-button
            v-if="(taskInfo.drTaskStatus==1 || taskInfo.drTaskStatus==2) && !taskInfo.shared"
            class="refuseBtn"
            size="small"
            @click="onRefuseTask"
          >
            <a-icon
              type="close-circle"
              class="refuseIcon"
              theme="filled"
            /><span>拒绝</span>
          </a-button>
        </div>
      </div>
    </div>
    <task-detail-modal
      :task-detail="taskDetail"
      :visible="taskdetalFlag"
      @cancel="handleCancel"
    />
    <!--共享-->
    <task-card-share
      v-if="showTaskShare"
      :show-task-share.sync="showTaskShare"
      :task-id="taskInfo.id"
    />
  </div>
</template>
<script>
import TaskDetailModal from '@/components/task/taskDetailModal'
import { formatMobile,execQtFuncByChannel } from '@/common/utils/baseMethods.js'
import TaskCardShare from './taskCardShare.vue'
import global from '@/common/config/global.js'
export default {
  'name': 'TaskCard',
  components: { TaskDetailModal,TaskCardShare },
  props: {
    taskInfo: {
      type: Object,
      require: true,
      default: function () {
        return {}
      }
    },
    refreshList: {
      type: Function,
      default: function () {
      }
    }
  },
  data () {
    return {
      taskOptFlag: false, // 设计按钮显示隐藏控制
      taskdetalFlag: false, // 控制设计任务详情弹出框
      taskDetail: [],
      showTaskShare:false // 是否展示共享弹窗
    }
  },
  methods: {
    showOpt () {
      this.taskOptFlag = true
    },
    hideOpt () {
      this.taskOptFlag = true
    },
    /**
    * 显示任务详情弹出框
    */
    showTaskdetal (taskInfo) {
      const msg = '正在获取任务详情'
      this.$gLoading.show(msg)
      const self = this
      //获取任务详情分两种情况：1 没有solutionId或solutionId为0时，直接组装taskInfo里的任务信息
      if(!taskInfo.solutionId){
        self.handleNewTaskDetail(taskInfo)
        self.$gLoading.hide()
        self.taskdetalFlag =  true
        return
      }
      //获取任务详情分两种情况：2 有solutionId时，掉用接口获取详情
      this.getDatailById(taskInfo.solutionId,this.$getUserInfo().user.userId).then(() => {
        self.$gLoading.hide()
        self.taskdetalFlag =  true
      }).catch(() => {
        self.$gLoading.hide()
      })
    },
    /**
     * 根据taskInfo拼接新任务的详情
     */
    handleNewTaskDetail(taskInfo){
      let infoList = []
      //1.先拼接主任务
      infoList.push({
        projectName:taskInfo.projectName, // 项目名称
        drTaskStatus:taskInfo.drTaskStatus, // 任务状态标示
        houseName:taskInfo.houseName,// 户型名称
        userName:taskInfo.userName, // 姓名 会随着选择的任务不同而切换显示
        mobile:formatMobile(taskInfo.mobile), // 手机号 会随着选择的任务不同而切换显示
        adviser:taskInfo.adviser, // 置家顾问 会随着选择的任务不同而切换显示
        dnaName:taskInfo.dnaName, // 已选择dna名称，当dnaRoomDtoList为空时，展示该字段 始终显示主任务的dnaRoomDtoList
        dnaRoomDtoList:taskInfo.dnaRoomDtoList,// 已选择DNA  始终显示主任务的dnaRoomDtoList
        budget:taskInfo.budget,// 预算区间  会随着选择的任务不同而切换显示
        userTags:taskInfo.userTags, // 用户标签  会随着选择的任务不同而切换显示
        remarkObjectList:taskInfo.remarkObjectList, // 备注内容 始终显示主任务的remarkObjectList
        createTimeStr:taskInfo.createTimeStr, // 需求提交时间 会随着选择的任务不同而切换显示
        eventList:taskInfo.eventList, // 任务时间节点
        shared:taskInfo.shared, // 是否由别人分享
        fromShareDesigner:taskInfo.fromShareDesigner // 分享者
      })
      //2.再拼接子任务
      this.taskDetail = infoList.concat(taskInfo.childTaskInfos)
    },
    /**
     *对于非新任务，根据id查询任务详情
     */
    getDatailById(solutionId,userId){
      let _this = this
      return new Promise(function(resolve,reject){
        _this.$http.post('/dr-web/solutionDesignTask/queryDesignTaskDetail', { 
          solutionId:solutionId,
          designerId:userId
        }).then(data => {
          if(data.code === 1){
            _this.handleNewTaskDetail(data.data)
            resolve()
          }else{
            _this.$notification.error({
              message: '失败',
              description: data.msg || '获取任务详情失败，请稍后再试！'
            })
            reject()
          }
        })
      })
    },
    /**
    * 关闭任务详情弹出框
    * @param e
    */
    handleCancel (e) {
      this.taskdetalFlag = false
    },
    //拒绝任务
    onRefuseTask () {
      let _this = this
      this.$confirm({
        title: '确认拒绝该任务吗?',
        onOk () {
          _this.doRefuseTask()
        },
        onCancel () {}
      })
    },
    //共享任务
    shareTask(taskInfo){
      this.showTaskShare = true
    },
    /**
    * 设计任务驳回确认
    */
    doRefuseTask () {
      const self = this
      let userInfo = this.$getUserInfo()
      const param = {
        'designerId': userInfo.user ? userInfo.user.userId : null,
        'rejectReason': '拒绝',
        'taskId': this.taskInfo.id
      }
      this.$gLoading.show('请稍等....')
      // 获取任务详情数据
      this.$http.post('/dr-web/solutionDesignTask/rejectSolutionDesignTask', { ...param }).then(function (res) {
        self.$gLoading.hide()
        if (res) {
          if (res.code == 1) {
            self.$notification.success({
              message: '成功',
              description: '任务拒绝成功'
            })
            // 刷新任务列表
            self.refreshList()
          } else {
            self.$notification.error({
              message: '失败',
              description: res.msg || '任务拒绝失败，请稍后再试！'
            })
          }
        } else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '任务拒绝失败，请稍后再试！'
          })
          self.$gLoading.hide()
        }
      }).catch(function (res) {
        self.$gLoading.hide()
      })
    },
    /**
       * 进入任务
       */
    async enterTask(taskInfo){
      //逻辑判断
      //新任务进入绘制户型: drTaskStatus:1 进入绘制户型    houseId
      if(taskInfo.drTaskStatus ===1){
        
        let houseId = taskInfo.houseId
        let result = await this.getHouseById(houseId)
        if(result && result.length < 1){
          this.$notification.error({
            message: '提示',
            description: '任务户型不存在，请在MR.Beta维护户型信息后重试！'
          })
        }else{
          let data = {
            HouseId:houseId,
            taskId:taskInfo.id
          }
          execQtFuncByChannel(global.qtChannel.main,'onOpenSolution',data)
        }
      }
      //其余进入3D,打开方案 soulutionId (2,3,4,5)
      else if(taskInfo.drTaskStatus ===2||taskInfo.drTaskStatus ===3||taskInfo.drTaskStatus ===4||taskInfo.drTaskStatus ===5){
        let id  = taskInfo.solutionId
        let data = {
          SolutionId:id,
          type:1, // 任务里面的方案都为产品方案
          taskId:taskInfo.id
        }
        execQtFuncByChannel(global.qtChannel.main,'onOpenSolution',data)
      }
      else {
        this.$message.error('任务信息无效！')
      }
    },
    getHouseById(id){
      let _this = this
      return  new Promise(function(resolve,reject){
        _this.$http.post('/dr-web/house/queryHouseByCondition',{
          housingId:id
        }).then( (data) => {
          if(data.code === 1){
            resolve(data.data.list)
          }else{
            _this.$$notification.error({
              message: '失败',
              description: data.msg || '获取户型任务详情失败，请稍后再试！'
            })
            reject()
          }
        })
      })
    }
  }
}

</script>
<style lang="less">
  .taskCardWrap {
    width:307px;
    height: 223px;
    position: relative;
    cursor: pointer;
    .taskCard {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:#FFFFFF;
      border-radius:8px;
      transition: 350ms transform ease;
      -webkit-transition: 350ms transform ease;
      .statustag {
        position: absolute;
        right: 18px;
        top:-3px;
        z-index: 2;
      }
      .title {
        height: 95px;
        padding: 30px 30px 20px 30px;
        border-radius:8px 8px 0px 0px;
        .thead {
          display: flex;
          .username {
            font-size:14px;
            font-weight:400;
            color:#5C5C5C;
            margin-right: 10px;
            line-height: 14px;
          }
          .taskId {
            font-size:12px;
            font-weight:400;
            color:#C7C7C7;
            line-height: 14px;
          }
          .share-info{
            margin-left:5px;
            font-size:12px;
            font-weight:400;
            color:#586287;
            line-height: 14px;
          }
        }
        .pname {
          font-size:16px;
          font-weight:600;
          color:#5C5C5C;
          line-height:16px;
          margin-top: 15px;
          text-align: left;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .newtask {
        background-color: #FBFBFB;
      }
      .designing {
        background-color: #FBFBFB;
      }
      .auditing {
        background-color: #E0EFFA;
      }
      .unaudited {
        background-color: #C65050;
      }
      .finished{
        background: transparent;
        border-bottom: 1px solid #EFEFEF;
      }
      .taskInfo {
        font-size:12px;
        font-weight:400;
        height: 128px;
        padding: 20px 30px 20px 30px;
        border-radius:0px 0px 0px 0px;
        text-align: left;
        .eachtask {
          height: 22px;
          line-height: 22px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          .et {
            color: #C7C7C7;
          }
          .ec {
            color: #8D8D8D
          }
          .ecstatus {
            font-size:12px;
            font-weight:600;
            color:#586287;
          }
        }
        .btnrow {
          margin-top: 15px;
          width: calc(100% + 40px);
          margin-left: -20px;
          height: 46px;
          border-radius: 0px 0px 8px 8px;
          .startbtn {
            // width:80px;
            // height:36px;
            // font-size:12px;
            // font-weight:600;
            // color:#FFFFFF;
            margin-right: 5px;
          }
          .taskdetailBtn {
            // width:72px;
            // height:36px;
            // background:#F5F5F5;
            // font-size:12px;
            // font-weight:600;
            // color:#5C5C5C;
            // padding:0px;
            // border:none;
            margin-right: 5px;
          }
          .refuseBtn {
            // width:72px;
            // height:36px;
            // background:#F5F5F5;
            // border:none;
            // font-size: 12px;
            .refuseIcon {
              color: #DA3F27;
            }
          }
        }
      }
      .btnrow{
        display: none;
        transition: 350ms transform ease;
        -webkit-transition: 350ms transform ease;
      }
    }
    .taskCard:hover {
      height: 120%;
      box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
      transform: translate(0, -30px);
      z-index: 1;
      .btnrow{
        display: block;
      }
    }
    .finishedcard {
      background: transparent;
      border: 1px solid #e1e1e1;
    }
  }
  .refuseDialog {
    .info {
      margin: 20px;
      display: flex;
      .refusetitle {
        font-size:15px;
        font-weight:600;
        color:#5C5C5C;
      }
    }
    .footer {
      text-align: right;
      .surebtn {
        width:94px;
        height:36px;
        font-size:12px;
        font-weight:600;
        color:#FFFFFF;
        margin-right: 10px;
      }
      .cancelbtn {
        width:72px;
        height:36px;
        background:#F5F5F5;
        border:none;
        font-size: 12px;
      }
    }
  }
</style>
