<!--图册卡片组件-->
<template>
  <div>
    <div
      class="albumCardWrap"
      @mouseenter="onMouseenter"
      @mouseleave="onMouseleave"
    >
      <!--操作按钮和图标展示-->
      <div>
        <img
          v-if="alubmInfo.topImage.source==1"
          class="tagIcon"
          src="../../assets/images/Album/small/local.png"
        >
        <img
          v-if="alubmInfo.topImage.source==2 && alubmInfo.topImage.resolution=='3'"
          class="tagIcon"
          src="../../assets/images/Album/small/2K.png"
        >
        <img
          v-if="alubmInfo.topImage.source==2 && alubmInfo.topImage.resolution=='4'"
          class="tagIcon"
          src="../../assets/images/Album/small/4K.png"
        >
        <img
          v-if="alubmInfo.topImage.source==3"
          class="tagIcon"
          src="../../assets/images/Album/small/self-definition.png"
        >
        <!-- 头图图标-->
        <div class="topIcon">
          <div
            v-if="alubmInfo.mainViewFlag && activekey==1"
            class="mainViewFlag"
          >
            头图
          </div>
          <div
            v-if="alubmInfo.visiable && activekey==2"
            class="mainViewFlag"
          >
            可视化
          </div>
        </div>
        <!--查看大图图标-->
        <div
          v-if="hoverStatus && !editModel"
          class="showbigImage"
        >
          <a-button
            type="primary"
            class="bigBtn"
            @click="showBigAlbumModal"
          >
            查看大图
          </a-button>
        </div>
      </div>
      <div>
        <img
          :class="[{'imagehover':hoverStatus && !editModel},{ 'picImage':!hoverStatus},{'picImage':hoverStatus && editModel}]"
          :src="$ifAliyunImage(alubmInfo.topImage.url)?alubmInfo.topImage.url+'!thumc-408x230':alubmInfo.topImage.url+'?imageView2/2/w/408/h/230'"
        >
        <div
          v-if="!(hoverStatus && !editModel) && process!==100"
          class="statusBack"
        />
      </div>
      <!--渲染进度条展示，如果是非编辑的hover状态不显示此效果-->
      <div
        v-if="!(hoverStatus && !editModel) && process!==100"
        class="processContent"
      >
        <div class="text">
          <div class="textInfo1">
            {{ renderingName }}
          </div>
          <div class="textInfo2">
            {{ processName }}...
          </div>
        </div>
        <a-progress
          :percent="process"
          size="small"
          :show-info="false"
        />
      </div>
      <div
        v-if="editModel"
        class="editOption"
      >
        <a-button
          v-if="!alubmInfo.mainViewFlag && activekey==1"
          type="primary"
          class="toutuOption"
          @click="settoutuImage"
        >
          设为头图
        </a-button>
        <a-button
          v-if="process==100 && !alubmInfo.visiable"
          type="primary"
          class="delAlbum"
          @click="onDeleteAlbum"
        >
          <img
            src="../../assets/images/delIcon.png"
            style="margin-right: 8px;margin-top: -3px;"
          >
          删除图集
        </a-button>
      </div>
      <!-- 1.单张图册 进度100%显示操作按钮  2. 批量图册 显示操作按钮-->
      <div
        v-if="hoverStatus && !editModel && ((activekey==1 && process==100) || activekey==2)"
        class="operationContent"
      >
        <a-button
          type="primary"
          class="btn1"
          @click="adjustMentcameraangle"
        >
          <img src="../../assets/images/Album/small/adjust.png">
          <span style="margin-left:5px;">调整相机</span>
        </a-button>
        <a-button
          v-if="if2KBtnShow && process==100"
          type="primary"
          class="btn2"
          :disabled="ifBtnDisabled()"
          @click="towRender"
        >
          {{ twoBtnText }}
        </a-button>
        <a-button
          v-if="if4KBtnShow && process==100"
          :disabled="ifBtnDisabled()"
          type="primary"
          class="btn3"
          @click="fourRender"
        >
          {{ fourBtnText }}
        </a-button>
      </div>
      <!--1.单张图册，进度不等于100%，显示取消任务按钮 -->
      <div
        v-if="hoverStatus && !editModel && (activekey==1 && process!==100)"
        class="operationContent"
      >
        <a-button
          type="primary"
          class="btn3"
          @click="onCancelTask"
        >
          取消任务
        </a-button>
      </div>
    </div>
    <!--批量渲染任务数-->
    <single-render-modal
      v-if="showRenderModal"
      :solution-id="solutionId"
      :current-albums="alubmInfo"
      :cancel-render="cancelRender"
      :refresh-list="refreshList"
      :room-name="roomName"
      :room-id="roomId"
      :quality="quality"
    />
  </div>
</template>
<script>
import SingleRenderModal from '@/components/albums/singleRenderModal'
export default {
  'name': 'AlbumCard',
  components: { SingleRenderModal },
  props: {
    alubmInfo: {
      type: Object,
      require: true,
      default: function () {
        return {}
      }
    },
    showBigAlbumModal: {
      type: Function,
      default: function () {
        console.info('显示图册')
      }
    },
    solutionType:{ //方案类型
      type: Number,
      default: function () {
      }
    },
    solutionStatus:{ //方案状态
      type: Number,
      default: function () {
      }
    },
    editModel:{    //当前是否是编辑模式
      type: Boolean,
      default: function () {
        return false
      }
    },
    solutionId:{    //方案Id
      type: String,
      default: function () {
        return ''
      }
    },
    refreshList:{
      type: Function,
      default: function () {
        console.log('刷新列表')
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
    },
    activekey:{   ////1:单张图册，2:批量图册，3:建筑图册
      type:Number,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      if2KBtnShow:false, //2k按钮是否显示
      twoBtnText:'2K渲染', //2k渲染显示text
      if4KBtnShow:false, //4k按钮是否显示
      fourBtnText:'4K渲染', //4k渲染显示text
      hoverStatus:false,
      process:100,         //进度条
      processName:'',        //渲染任务进度名称
      renderingName:'',       //渲染任务名称
      quality:null,          //2k渲染 4k渲染标识   效果渲染清晰度 3：2k，4：4k
      showRenderModal:false
    }
  },
  watch: {
    alubmInfo: {
      deep: true,
      immediate: true,
      handler: function (val) {
        this.twoBtnText='2K渲染'
        this.fourBtnText='4K渲染'
        this.getBtnStatus()
        this.getAlbumStatus()
      }
    }
  },
  created(){
    console.log(this.alubmInfo, '6666')
  },
  mounted(){
    //获取操作按钮
    this.getBtnStatus()
    //获取图集渲染状态
    this.getAlbumStatus()
  },
  methods: {
    //获取图集渲染状态
    /* 任务在构建——构建排队中状态，前端显示“排队中”，进度显示“—”；
      任务在构建——构建中状态，前端显示“构建中”，进度显示“1%-49%”；
      任务在构建——构建成功状态，前端显示“构建中”，进度显示“50%”；
      任务在渲染——渲染排队中状态，前端显示“渲染中”，进度显示“51%”；
      任务在渲染——正在渲染状态，前端显示“渲染中”，进度显示“52%-99%”；
      任务在渲染——渲染成功状态，直接显示已完成的效果图
    */
    //'enqueue':等待构建 ，'build_active':"构建中', 'build_success':构建成功 ，'waiting'：'等待渲染' ，'active':'渲染中'，'done' :'渲染完成'
    getAlbumStatus(){
      const taskStatus=this.alubmInfo.topImage.taskStatus
      const source=this.alubmInfo.topImage.source
      const resolution=this.alubmInfo.topImage.resolution
      if(source==2 && resolution=='3'){
        this.renderingName='2K渲染'
      }
      if(source==2 && resolution=='4'){
        this.renderingName='4K渲染'
      }
      if(source==3){
        this.renderingName='自定义'
      }
      //本地渲染状态默认100%
      if(source==1){
        this.process=100
      }
      if(source == 3){
        this.process=100
      }
      if(source==2 && taskStatus=='enqueue'){
        this.process=5
        this.processName='排队中'
      }
      if(source==2 && taskStatus=='build_active'){
        this.process=30
        this.processName='构建中'
      }
      if(source==2 && taskStatus=='build_success'){
        this.process=50
        this.processName='构建中'
      }
      if(source==2 && taskStatus=='waiting'){
        this.process=51
        this.processName='渲染中'
      }
      if(source==2 && taskStatus=='active'){
        this.process=75
        this.processName='渲染中'
      }
      if(source==2 && taskStatus=='done'){
        this.process=100
      }
    },
    //显示4k,2k按钮状态
    getBtnStatus(){
      let exitLocal=false
      let exit2k=false
      let exit4k=false
      const imageList=this.alubmInfo.imageList ?this.alubmInfo.imageList:[]
      const filerOnlyLocal=imageList.filter(item=>item.source==1)
      const filter2K=imageList.filter(item=>(item.source==2 && item.resolution==3))
      const filter4K=imageList.filter(item=>(item.source==2 && item.resolution==4))
      if(filerOnlyLocal.length>0){
        exitLocal=true
      }
      if(filter2K.length>0){
        exit2k=true
      }
      if(filter4K.length>0){
        exit4k=true
      }
      //图集只有本地效果图，则图集下方显示【2k渲染】、【4k渲染】按钮
      if(exitLocal && !exit2k && !exit4k){
        this.if2KBtnShow=true
        this.if4KBtnShow=true
      }
      //图集只有本地效果图和云端2k效果图，则图集下方显示【4k渲染】【重新2k渲染】按钮
      if(exitLocal && exit2k && !exit4k){
        this.if4KBtnShow=true
        this.fourBtnText='4K渲染'
        this.if2KBtnShow=true
        this.twoBtnText='重新2K渲染'
      }
      //图集只有本地效果图和云端4k效果图，则图集下方显示【2k渲染】【重新4k渲染】按钮
      if(exitLocal && exit4k && !exit2k){
        this.if2KBtnShow=true
        this.twoBtnText='2K渲染'
        this.if4KBtnShow=true
        this.fourBtnText='重新4K渲染'
      }
      //图集有本地效果图和云端4k效果图和云端2k效果图，则图集下方显示【重新2k渲染】【重新4k渲染】按钮
      if(exitLocal && exit4k && exit2k){
        this.if2KBtnShow=true
        this.twoBtnText='重新2K渲染'
        this.if4KBtnShow=true
        this.fourBtnText='重新4K渲染'
      }
    },
    //根据状态控制按钮是否disabled
    ifBtnDisabled(){
      let result=false
      const activekey=this.activekey //1:单张图册，2:批量图册，3:建筑图册
      const solutionType=this.solutionType  //方案类型 1：普通方案 2：DNA方案
      const solutionStatus=this.solutionStatus  //方案状态，普通方案:(0.未提交|1.待审核|2.审核通过|3.审核不通过|4.已上线|其它.错误状态) DNA方案:(0.下线|1.上线)
      if(activekey==1){ //单张图册已上线的方案设置为disabled
        if(solutionType==1){ //普通方案
          if(solutionStatus==4){
            result=true
          }
        }
        if(solutionType==2){ //DNA方案
          if(solutionStatus==1){
            result=true
          }
        }
      }
      if(activekey==2){//批量图册未上架的方案设置为disabled
        //普通方案
        if(solutionType==1){
          if(solutionStatus!==4){
            result=true
          }
        }
        //DNA方案
        if(solutionType==2){
          if(solutionStatus!==1){
            result=true
          }
        }
      }
      return result
    },
    //2k渲染，重新2k渲染
    towRender(){
      this.hoverStatus = false
      this.quality=3
      //单张图册，直接渲染
      if(this.activekey==1){
        //直接调用渲染操作
        this.confirmRender()
      }
      //批量图册，渲染弹出框渲染
      else {
        this.showRenderModal=true
      }
    },
    //4k渲染，重新4k渲染
    fourRender(){
      this.hoverStatus = false
      this.quality=4
      //单张图册，直接渲染
      if(this.activekey==1){
        //直接调用渲染操作
        this.confirmRender()
      }
      //批量图册，渲染弹出框渲染
      else {
        this.showRenderModal=true
      }
    },
    cancelRender(){
      this.showRenderModal=false
    },
    onMouseenter(){
      this.hoverStatus=true
    },
    onMouseleave(){
      this.hoverStatus=false
    },
    //设为头图操作
    settoutuImage(){
      const self=this
      self.$gLoading.show('正在设置头图..')
      const param={viewId:this.alubmInfo.viewId}
      this.$http.post('/dr-web/solution/setRoomMainConfig',param).then(function(res){
        self.$gLoading.hide()
        if(res.success) {
          self.$notification.success({
            message: '成功',
            description: res.msg || '头图设置成功！'
          })
          setTimeout(() => {
            //刷新列表
            self.refreshList()
          }, 1000)
        } else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '头图设置失败！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        self.$notification.error({
          message: '失败',
          description: res.msg || '头图设置失败！'
        })
      })
    },
    onDeleteAlbum(){
      const self=this
      const imageList=this.alubmInfo.imageList ?this.alubmInfo.imageList:[]
      this.$confirm({
        title: '确认删除该图集下的'+imageList.length+'张图片？',
        onOk () {
          self.deleteAlbum()
        },
        onCancel () {}
      })
    },
    //删除图集操作
    deleteAlbum(){
      console.log(this.alubmInfo, 'alubmInfo')
      const self=this
      self.$gLoading.show('正在删除..')
      const jobId = self.alubmInfo.topImage.jobId
      const param = {
        viewId:self.alubmInfo.viewId,
        jobIds:jobId ? [jobId] : [],
        usgeID: self.roomId,
        usgeName: self.roomName
      }
      let paramString = JSON.stringify(param)
      this.$http.post('/dr-web/solution/delSolutionConfig',param).then(function(res){
        self.$gLoading.hide()
        if(res.code==1) {
          // eslint-disable-next-line
          ue.webalbum.delview(paramString)
          if(res && res.data){
            self.$notification.success({
              message: '成功',
              description:  '图集删除成功！'
            })
            setTimeout(() => {
              self.refreshList()
            }, 1000)
          }
        } else {
          self.$notification.error({
            message: '失败',
            description:  res.msg || '图集删除失败！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        self.$notification.error({
          message: '失败',
          description: res.msg || '图集删除失败！'
        })
      })
    },
    //调整相机
    adjustMentcameraangle(){
      const param1=this.alubmInfo.viewId
      const param2=this.alubmInfo.roomId
      // eslint-disable-next-line
      ue.webalbum.adjustmentcameraangle(param1,param2).then()
    },
    //
    onCancelTask(){
      const self=this
      this.$confirm({
        title: '请确认是否要删除任务?',
        onOk () {
          self.cancelTask()
        },
        onCancel () {}
      })
    },
    //取消任务
    cancelTask(){
      const self=this
      self.$gLoading.show('正在删除..')
      const jobId = self.alubmInfo.topImage.jobId
      const param={
        jobIds:[jobId],
        usgeID: self.roomId,
        usgeName: self.roomName
      }
      let paramString = JSON.stringify(param)
      this.$http.post('/dr-web/render/delRenderTask',param).then(function(res){
        self.$gLoading.hide()
        if(res.success) {
          // eslint-disable-next-line
          ue.webalbum.delsinglepic(paramString)
          self.refreshList()
        } else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '该图删除失败！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        self.$notification.error({
          message: '失败',
          description: res.msg || '该图删除失败！'
        })
      })
    },
    //确认渲染
    confirmRender(){
      const self=this
      let userInfo = this.$getUserInfo();
      self.$gLoading.show('正在渲染..')
      const param={
        env: "day",
        userId:userInfo.user.userId || 2978,
        roomId:self.roomId,
        quality:self.quality,
        solutionId:self.solutionId,
        viewId: self.alubmInfo.viewId,
        usgeID: self.roomId,
        usgeName: self.roomName,
        renderTaskType: self.quality == 4 ? 2 : 1, // 1代表2k 2代表4k
        gradeIndex: 0, // 批量的个数
        isBatchRender: false // 是否是批量的
      }
      const ratio=self.alubmInfo.ratio
      //获取viewX 和 viewY
      //2K
      if(this.quality==3){
        if(ratio =='3:4'){
          param.viewx=1080
          param.viewy=1440
        }
        if(ratio =='4:3'){
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
      let paramString = JSON.stringify(param)
      let url=''
      url='/dr-web/render/createSimpleRenderTask'
      this.$http.post(url,param).then(function(res){
        self.$gLoading.hide()
        if(res.success) {
          // eslint-disable-next-line
          ue.webalbum.render2dstarttask(paramString)
          self.$notification.success({
            message: '成功',
            description: (self.quality==3?'2K':'4K')+'渲染成功！'
          })
          self.process = 5
          self.processName = '排队中'
          setTimeout(() => {
            //刷新列表
            self.refreshList()
          }, 1000)
        } else {
          self.$notification.error({
            message: '失败',
            description: res.msg || (self.quality==3?'2K':'4K')+'渲染失败！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        self.$notification.error({
          message: '失败',
          description: res.msg || (self.quality==3?'2K':'4K')+'渲染失败！'
        })
      })
    }
  }
}

</script>
<style lang="less" scoped>
  .albumCardWrap {
    position: relative;
    margin-top: 40px;
    margin-right: 56px;
    width: 413px;
    min-height: 236px;
    .showbigImage {
      position: absolute;
      text-align: center;
      top: 103px;
      z-index: 100;
      display: block;
      .bigBtn {
        border: none;
        width:120px;
        height:36px;
        background:rgba(255,255,255,1);
        border-radius:18px;
        font-size: 12px;
        font-weight: 600;
        line-height: 36px;
        color: #5C5C5C;
        left: 155px;
        opacity: 1.5;
      }
    }
    .tagIcon {
      position: absolute;
      right: 0px;
      border-top-right-radius:6px;
    }
    .topIcon {
      position: absolute;
      top: 10px;
      display: flex;
      .mainViewFlag {
        width: 48px;
        height: 24px;
        line-height: 24px;
        background: #586287;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        margin-left: 10px;
      }
    }
    .picImage {
      border-radius: 6px;
      width: 100%;
      height: 230px;
    }
    .imagehover {
      border-radius: 6px 6px 0px 0px;
      width: 100%;
      height: 230px;
      opacity: 0.7;
    }
    .statusBack {
      position: absolute;
      top:0px;
      border-radius: 6px;
      width: 100%;
      height: 230px;
      opacity: 0.5;
      background: #000;
    }
    .operationContent {
      border-radius: 0px 0px 6px 6px;
      position: absolute;
      width: 100%;
      height: 76px;
      line-height: 76px;
      background-color: #ffffff;
      text-align: right;
      padding-right: 20px;
      z-index: 100;
      .btn1 {
        line-height: 36px;
        background:#ffffff;
        border-radius:18px;
        color: #5C5C5C;
        font-weight: 600;
        font-size: 12px;
        border:none;
        margin-right: 10px;
        box-shadow: none;
        float: left;
        margin-top: 22px;
        margin-left: 10px;
      }
      .btn2{
        width:110px;
        height:36px;
        line-height: 36px;
        background:rgba(245,245,245,1);
        border-radius:18px;
        color: #5C5C5C;
        font-weight: 600;
        font-size: 12px;
        border:none;
        margin-right: 10px;
      }
      .btn3 {
        width:110px;
        height:36px;
        line-height: 36px;
        background:#586287;
        border-radius:18px;
        color: #ffffff;
        font-weight: 600;
        font-size: 12px;
        border:none;
      }
    }
    .processContent {
      position: absolute;
      width: 100%;
      bottom: 0px;
      .text {
        text-align: left;
        padding-left: 20px;
        .textInfo1 {
          height: 34px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }

        .textInfo2 {
          height: 36px;
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
        }
      }
      /deep/.ant-progress-inner {
        background-color: #ffffff;
        height: 6px;
      }
      /deep/ .ant-progress-bg {
        background-color: #586287;
      }
    }
    .editOption {
      position: absolute;
      bottom: 20px;
      right: 20px;
      .toutuOption {
        width: 94px;
        height: 36px;
        background-color: #ffffff;
        color: #5C5C5C;
        margin-right: 10px;
         border:none;
        font-size:12px;
        font-weight:600;
      }
      .delAlbum {
        width: 110px;
        height: 36px;
        background-color: #E96C2E;
        color: #ffffff;
        border:none;
        font-size:12px;
        font-weight:600;

      }

    }
  }
  /deep/.ant-btn-primary.disabled, .ant-btn-primary[disabled], .ant-btn-primary.disabled:hover, .ant-btn-primary[disabled]:hover, .ant-btn-primary.disabled:focus, .ant-btn-primary[disabled]:focus, .ant-btn-primary.disabled:active, .ant-btn-primary[disabled]:active, .ant-btn-primary.disabled.active, .ant-btn-primary[disabled].active {
    color: rgba(0, 0, 0, 0.25) !important;
    background-color: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
    text-shadow: none !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }
</style>
