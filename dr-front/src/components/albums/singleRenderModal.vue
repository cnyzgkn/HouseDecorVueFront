<!--单个渲染Modal-->
<template>
  <div>
    <a-modal
      :visible="visible"
      title="批量渲染任务数"
      width="600px"
      class="singleRenderModal"
      @ok="confirmRender"
      @cancel="cancelModal"
    >
      <div>
        <div>
          <div class="eachRow">
            <div class="col1">
              {{ roomName }}渲染将生成任务
            </div>
            <div class="imgCount">
              {{ totalCount }}&nbsp;条
            </div>
          </div>
          <div
            class="eachRow"
            style="margin-top: 10px;"
          >
            <div class="col1">
              优先级
            </div>
            <div>
              <a-select
                v-model="submitForm.priority"
                class="top-dna-select mr-20"
              >
                <a-select-option
                  v-for="q in priorityList"
                  :key="q.code"
                  :value="q.code"
                >
                  {{ q.name }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  'name': 'SingleRenderModal',
  components: {},
  props: {
    currentAlbums: {  //当前渲染图册
      type: Object,
      default: function () {
        return {}
      }
    },
    cancelRender:{  //取消渲染
      type: Function,
      default: function () {
      }
    },
    solutionId:{  //方案Id
      type: String,
      default: function () {
        return ''
      }
    },
    refreshList:{
      type: Function,
      default: function () {
      }
    },
    quality:{     // 效果渲染清晰度 3：2k，4：4k
      type: Number,
      default: function () {
        return 0
      }
    },
    roomName:{
      type: String,
      default: function () {
        return ''
      }
    },
    roomId:{
      type: Number,
      default: function () {
        return ''
      }
    }

  },
  data() {
    return {
      visible: true,
      priorityList:[{code:11,name:'最高'},{code:12,name:'较高'},{code:13,name:'高'},{code:14,name:'中'},{code:15,name:'低'}],
      submitForm:{
        priority:15,  //批量渲染任务优先级（11：最高、12：较高、13：高、14：中、15：低）
      },
      totalCount:0
    }
  },
  created() {
  },
  mounted() {
    this.getTaskNum()
  },
  methods: {
    //取消批量渲染
    cancelModal(){
      this.cancelRender()
    },
    //批量渲染货物任务数
    getTaskNum(){
      const self=this
      self.$gLoading.show('获取批量任务数..')
      this.$http.post('/dr-web/render/countBatchRenderTaskNum',{roomId:this.roomId,solutionId:self.solutionId}).then(function(res){
        self.$gLoading.hide()
        if(res.success) {
          self.allRoomeAlbumsList=res.data && res.data.roomList ? res.data.roomList:[]
          self.totalCount=0
          self.allRoomeAlbumsList.map(item=>{
            self.totalCount+=item.taskCount
          })
        } else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '获取批量渲染任务数失败！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        self.$notification.error({
          message: '失败',
          description: res.msg || '获取批量渲染任务数失败！'
        })
      })
    },
    //确认渲染
    confirmRender(){
      const self=this
      let userInfo = this.$getUserInfo();
      let totalCount = 0
      self.allRoomeAlbumsList.map(item=>{
        if(item.roomName!=='厨房' && item.roomName!=='主卫' && item.roomName!=='主阳台'){
          totalCount+=item.taskCount
        }
      })
      self.$gLoading.show('正在渲染..')
      const param={
        env: "day",
        priority:self.submitForm.priority,
        userId:userInfo.user.userId,
        roomId:this.roomId,
        quality:this.quality,
        solutionId:self.solutionId,
        viewId: this.currentAlbums.viewId,
        usgeID: this.roomId,
        usgeName: this.roomName,
        renderTaskType: this.quality == 4 ? 2 : 1, // 1代表2k 2代表4k
        gradeIndex: totalCount, // 批量的个数
        isBatchRender: true // 是否是批量的
      }
      let paramString = JSON.stringify(param)
      const ratio=this.currentAlbums.ratio
      //获取viewX 和 viewY
      //2K
      if(this.quality==3){
        if(ratio=='3:4'){
          param.viewx=1080
          param.viewy=1440
        }
        if(ratio=='4:3'){
          param.viewx=1920
          param.viewy=1440
        }
        if(ratio =='16:9'){
          param.viewx=2560
          param.viewy=1440
        }
      }
      //4K
      if(this.quality==4){
        if(ratio=='3:4'){
          param.viewx=1620
          param.viewy=2160
        }
        if(ratio=='4:3'){
          param.viewx=2880
          param.viewy=2160
        }
        if(ratio =='16:9'){
          param.viewx=3840
          param.viewy=2160
        }
      }
      self.$gLoading.hide()
      this.$http.post('/dr-web/render/createBatchRenderTask',param).then(function(res){
        self.$gLoading.hide()
        if(res.success) {
          // eslint-disable-next-line
          ue.webalbum.render2dstarttask(paramString)
          self.$notification.success({
            message: '成功',
            description: (self.quality==3?'2K':'4K')+'渲染成功！'
          })
          setTimeout(() => {
            //取消弹出框
            self.cancelModal()
            //刷新列表
            self.refreshList()
          }, 3000)
        } else {
          self.$notification.error({
            message: '失败',
            description: res.msg || (self.quality==3?'2K':'4K')+'渲染失败！'
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
  .singleRenderModal {
    .eachRow {
      display: flex;
      height: 34px;
      .col1 {
        color: #8D8D8D;
        font-size:14px;
        font-weight:400;
        margin-right: 20px;
        width: 128px;
      }
      .imgCount {
        color: #5C5C5C;
        font-weight:600;
        font-size:14px;
      }
    }
    .t1 {
      margin-top: 20px;
      color: #E96C2E;
      font-size:12px;
      font-weight:400;
    }
    /deep/.ant-modal-footer {
      height: 88px;
      padding-top: 20px;
      padding-right: 20px;
     /deep/ .ant-btn {
       width: 124px;
       height: 48px;
       line-height: 48px;
       font-size:16px;
       font-weight:600;
       border-radius: 26px;
     }
    }
  }
</style>
