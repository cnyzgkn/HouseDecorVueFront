
import { formatMobile,execQtFuncByChannel } from '@/common/utils/baseMethods.js'
import messageApi from './messagebox.api.js'
import { queryHouseByCondition,queryDesignTaskDetail } from '@/common/base.api.js'
import global from '@/common/config/global.js'
export default{
  methods:{
    /**
     *根据一个消息计算该消息的属性
     * @param {Object} message
     * @returns {Object} 状态信息 statusText（状态文本） statusColor（状态颜色）iconSvg（icon图标）
     */
    getInfos(message){
      let msgType = message.msgType
      let status = message.status
      let solutionType = message.solutionType
      let computedInfo = {
        statusText:'',
        statusColor:'orange',
        iconSvg:'',
        title:''
      }
      switch (msgType) {
        case 1:
          if (status === 1) {
            computedInfo.statusText = '新任务'
            computedInfo.statusColor = 'orange'
          } else if(status === 5){
            computedInfo.statusText = '审核通过'
            computedInfo.statusColor = 'green'
          }else if(status === 4){
            computedInfo.statusText = '审核不通过'
            computedInfo.statusColor = 'red'
          }
          computedInfo.iconSvg = 'iconMessageTask'
          computedInfo.title = '设计任务'
          break;
        case 2:
          if (status === 1) {
            computedInfo.statusText = '上线啦'
            computedInfo.statusColor = 'green'
          } else if(status === 0){
            computedInfo.statusText = '下线啦'
            computedInfo.statusColor = 'red'
          }
          computedInfo.iconSvg = 'iconMessageSolution'
          if(solutionType === 1){
            computedInfo.title = '产品设计方案'
          }else{
            computedInfo.title = 'DNA设计方案'
          }
          break;
        case 3:
          computedInfo.statusTex = '渲染完成'
          computedInfo.statusColor = 'green'
          computedInfo.iconSvg = 'iconMessageRender'
          computedInfo.title = '渲染任务'
          break;
        default:
          break;
      }
      return computedInfo
    },
    //获取任务详情
    getTaskDetail(taskId){
      const msg = '正在获取任务详情'
      this.$gLoading.show(msg)
      let param = {
        taskId:taskId
      }
      const _this = this
      return new Promise(function(resolve,reject){
        queryDesignTaskDetail(param).then(taskInfo => {
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
            houseId:taskInfo.houseId,
            id:taskInfo.id,
            solutionId:taskInfo.solutionId
          })
          //2.再拼接子任务
          _this.currentTask = infoList.concat(taskInfo.childTaskInfos)
          _this.taskDetailVisible = true
          resolve(true)
        }).catch(() => {
          reject(false)
        }).finally(() => {
          _this.$gLoading.hide()
        })
      })
    },
    // 获取方案详情
    getSchemeDetail(solutionId){
      const _this = this
      return new Promise(function(resolve,reject){
        _this.$refs.schemeDetailModal.getSchemeDetail(solutionId).then(() => {
          _this.schemeModalVisible = true
          resolve(true)
        }).catch( () => {
          reject(false)
        }).finally(() => {
          _this.$gLoading.hide()
        })
      })
    },
    //关闭任务详情弹窗
    onCancleTaskDetailModal(){ 
      this.taskDetailVisible = false
    },
    //关闭方案详情弹窗
    onCancleSchemeDetailModal(){
      this.schemeModalVisible = false
    },
    //确认拒绝任务
    doRefuseTask () {
      const _this = this
      return new Promise(function(resolve,reject){
        let userInfo = _this.$getUserInfo()
        let param = {
          'designerId': userInfo.user ? userInfo.user.userId : null,
          'rejectReason': '拒绝',
          'taskId': _this.currentMessage.msgId || _this.$route.query.msgId
        }
        _this.$gLoading.show('请稍等....')
        messageApi.rejectTask(param).then((data) => {
          _this.$notification.success({
            message: '成功',
            description: '任务拒绝成功'
          })
          _this.taskDetailVisible = false
          resolve(true)
        }).catch(data => {
          _this.$notification.error({
            message: '失败',
            description: data.msg || '任务拒绝失败，请稍后再试！'
          })
          reject(false)
        }).finally(() => {
          _this.$gLoading.hide()
        })
      })
    },
    // 进入任务前校验
    async enterTaskByQtChannel(taskInfo,QtChannel){
      console.log('=========进入任务：========')
      console.log(taskInfo)
      // 一个任务有多个子任务，默认第一个为主任务
      let info = taskInfo[0]
      console.log(info)
      console.log(info.drTaskStatus)
      //逻辑判断
      //新任务进入绘制户型: drTaskStatus:1 进入绘制户型  houseId
      if(info.drTaskStatus ===1){
        
        let houseId = info.houseId
        let result = await this.getHouseById(houseId)
        if(result && result.length < 1){
          this.$notification.error({
            message: '提示',
            description: '任务户型不存在，请在MR.Beta维护户型信息后重试！'
          })
        }else{
          let data = {
            HouseId:houseId,
            taskId:info.id
          }
          this.doEnterTaskByQtChannel(QtChannel,data)
        }
      }
      //其余进入3D,打开方案 soulutionId (2,3,4,5)
      else if(info.drTaskStatus ===2||info.drTaskStatus ===3||info.drTaskStatus ===4||info.drTaskStatus ===5){
        let id  = info.solutionId
        let data = {
          SolutionId:id,
          type:1, // 任务里面的方案都为产品方案
          taskId:info.id
        }
        this.doEnterTaskByQtChannel(QtChannel,data)
      }
      else {
        this.$message.error('任务信息无效！')
      }
    },
    // 获取户型
    getHouseById(id){
      let param = {
        housingId:id
      }
      return new Promise(function(resolve,reject){
        queryHouseByCondition(param).then( (data) => {
          resolve(data)
        }).catch( () => {
          reject()
        })
      })
    },
    // 进入任务
    doEnterTaskByQtChannel(QtChannel,data){
      if(QtChannel === global.qtChannel.commonModal){ // 在qt里面的任务详情弹窗进入页面时，需要弹窗提示

        data.NeedCloseExistingSolution = 1
        
        this.$confirm({
          title: '打开该任务可能会导致当前任务的操作丢失，请先保存当前任务后再打开该方案！',
          onOk () {
            execQtFuncByChannel(QtChannel,'onOpenSolution',data)
          },
          onCancel () {}
        })
      }else{
        execQtFuncByChannel(QtChannel,'onOpenSolution',data)
      }
    },
    //通知QT调整窗口大小
    // notifyQTResize(size,tag){
    //   let data = {
    //     width:size.width, // 宽度
    //     height:size.height,// 高度
    //     tag:tag // 增加、减少、固定
    //   }
    //   execQtFuncByChannel(global.qtChannel.messageBox,'onResizeRightCornerMsgBox',data)
    // },
    //通知QT关闭详情弹窗（任务、方案）
    notifyQTCloseDetail(data){
      execQtFuncByChannel(global.qtChannel.commonModal,'onCloseCommonMsgBox',data)
    },
    // 更新消息为已读状态
    async updateReaded(message){
      let userInfo = this.$getUserInfo()
      if (!userInfo || !userInfo.user || !userInfo.user.userId) {
        return false
      }
      let param = {
        msgId:message.msgId,
        msgType:message.msgType,
        userId:userInfo.user.userId,
      }
      // let key = message.msgType === 1?'task':message.msgType === 2?'solution':'render'
      let data = await messageApi.updateReaded(param)
      return data
    },
  }
}