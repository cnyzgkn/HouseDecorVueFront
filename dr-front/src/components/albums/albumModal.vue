<!--图册弹出框-->
<template>
  <div>
    <a-modal
      :visible="visible"
      title=""
      class="albumModal"
      :closable="closable"
      @cancel="close"
    >
      <div class="container">
        <div class="content">
          <div class="iconContent">
            <img
              v-show="currentAlubmIndex > 0"
              src="../../assets/images/prePage-Icon.png"
              class="IconInfo"
              @click="getUpAlubm"
            >
          </div>
          <div class="mainInfo">
            <div class="header">
              <div class="roomName">
                {{ currentRoomName }}
              </div>
              <div class="imageNum">
                本图集
                <span class="num">&nbsp;{{ currentImageIndex }}&nbsp;<span>/</span>&nbsp;{{ allImagesList.length }}&nbsp;</span>
                张图
              </div>
              <a-upload
                v-if="albumsJurisdiction.UpLoadButton"
                name="file"
                :multiple="true"
                :before-upload="beforeUpload"
                :show-upload-list="showUploadList"
                style="float: right;margin-right: 10px"
                @change="uploadImage"
              >
                <a-button
                  v-if="activekey==1"
                  type="primary"
                  size="small"
                >
                  上传自定义图片
                </a-button>
              </a-upload>
              <div
                class="closeIcon"
                @click="close"
              >
                x
              </div>
            </div>
            <div>
              <div
                v-show="imageLoading"
                class="spainImage"
              >
                <a-spin size="large" />
              </div>
              <div v-show="!imageLoading">
                <div>
                  <img
                    v-if="allImagesList[currentImageIndex-1].source==1"
                    class="tagIcon"
                    src="../../assets/images/Album/small/local.png"
                  >
                  <img
                    v-if="allImagesList[currentImageIndex-1].source==2 && allImagesList[currentImageIndex-1].resolution=='3'"
                    class="tagIcon"
                    src="../../assets/images/Album/small/2K.png"
                  >
                  <img
                    v-if="allImagesList[currentImageIndex-1].source==2 && allImagesList[currentImageIndex-1].resolution=='4'"
                    class="tagIcon"
                    src="../../assets/images/Album/small/4K.png"
                  >
                  <img
                    v-if="allImagesList[currentImageIndex-1].source==3"
                    class="tagIcon"
                    src="../../assets/images/Album/small/self-definition.png"
                  >
                </div>
                <div class="currentImage">
                  <img
                    class="highlightImage"
                    :src="$ifAliyunImage(allImagesList[currentImageIndex-1].url)?allImagesList[currentImageIndex-1].url+'!original':allImagesList[currentImageIndex-1].url"
                  >
                  <div
                    v-if="allImagesList[currentImageIndex-1].process!==100"
                    class="highlightImagehover"
                  />
                  <!--渲染进度条展示，如果是非编辑的hover状态不显示此效果-->
                  <div
                    v-if="allImagesList[currentImageIndex-1].process!==100"
                    class="processContent"
                  >
                    <div class="text">
                      <div class="textInfo1">
                        {{ allImagesList[currentImageIndex-1].renderingName }}
                      </div>
                      <div class="textInfo2">
                        {{ allImagesList[currentImageIndex-1].processName }}...
                      </div>
                    </div>
                    <a-progress
                      :percent="allImagesList[currentImageIndex-1].process"
                      size="small"
                      :show-info="false"
                    />
                  </div>
                  <div
                    class="operationDiv"
                  />
                  <div
                    class="operationContent"
                  >
                    <div class="description">
                      <div>{{ allImagesList[currentImageIndex-1].taskId }} &nbsp;</div>
                      <div>{{ allImagesList[currentImageIndex-1].createTimeStr }}</div>
                    </div>
                    <div
                      v-if="allImagesList[currentImageIndex-1].process==100"
                      class="operatecontent"
                    >
                      <a-button
                        v-if="!allImagesList[currentImageIndex-1].ifDowned"
                        class="downPicBtn"
                        type="default"
                        @click="()=>downLoadPic(allImagesList[currentImageIndex-1].url)"
                      >
                        下载本图
                      </a-button>
                      <a-button
                        v-if="allImagesList[currentImageIndex-1].ifDowned"
                        class="openPicBtn"
                        type="default"
                        @click="()=>openImage(allImagesList[currentImageIndex-1].url)"
                      >
                        打开图片
                      </a-button>
                      <!--只有source==2的图片有删除按钮,自定义上传也可删除3-->
                      <a-button
                        v-if="(allImagesList[currentImageIndex-1].source==2 || allImagesList[currentImageIndex-1].source==3) && activekey==1"
                        class="delBtn"
                        type="default"
                        @click="()=>onDelImage(allImagesList[currentImageIndex-1].jobId)"
                      >
                        <img
                          src="../../assets/images/delIcon.png"
                          style="margin-right: 8px;"
                        >
                        删除本图
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="footerImageList">
              <!-- 以上一页的最后一个图片作为分页图标-->
              <div
                v-if="currentPage>1"
                class="pagePreImage"
              >
                <img
                  :src="$ifAliyunImage(prePageImage)?prePageImage+'!original':prePageImage"
                  @click="getPrePageImageList"
                >
              </div>
              <transition name="slide-fade">
                <div
                  v-if="transitionFlag"
                  class="imagesList"
                >
                  <div
                    v-for="(img,index) in allImagesList"
                    v-show="imageShow(index)"
                    :key="'image_'+index"
                    class="eachImage"
                    :class="{'activeImage':index+1==currentImageIndex}"
                    @click="()=>showCurrentImage(index)"
                  >
                    <div style="position: relative;">
                      <div class="tagInfo">
                        <img
                          v-if="img.source==1"
                          class="tagIcon2"
                          src="../../assets/images/Album/small/local.png"
                        >
                        <img
                          v-if="img.source==2 && img.resolution=='3'"
                          class="tagIcon2"
                          src="../../assets/images/Album/small/2K.png"
                        >
                        <img
                          v-if="img.source==2 && img.resolution=='4'"
                          class="tagIcon2"
                          src="../../assets/images/Album/small/4K.png"
                        >
                        <img
                          v-if="img.source==3"
                          class="tagIcon2"
                          src="../../assets/images/Album/small/self-definition.png"
                        >
                      </div>
                      <img
                        class="image"
                        :src="$ifAliyunImage(img.url)?img.url+'!thumc-134x80':img.url"
                      >
                      <div
                        v-if="img.process!==100"
                        class="highlightImagehover"
                      />
                      <!--渲染进度条展示，如果是非编辑的hover状态不显示此效果-->
                      <div
                        v-if="img.process!==100"
                        class="processContent"
                      >
                        <div class="text">
                          <div class="textInfo2">
                            {{ img.processName }}...
                          </div>
                        </div>
                        <a-progress
                          :percent="img.process"
                          size="small"
                          :show-info="false"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </transition>

              <!-- 以下一页的第一个图片作为分页图标-->
              <div class="pageNextImage">
                <img
                  v-if="currentPage!==totalPage"
                  :src="$ifAliyunImage(nextPageImage)?nextPageImage+'!original':nextPageImage"
                  @click="getNextPageImageList"
                >
              </div>
            </div>
          </div>
          <div
            class="iconContent"
            style="text-align: right"
          >
            <img
              v-show="currentAlubmIndex < allRomeAlbum.length -1"
              src="../../assets/images/nextPage-Icon.png"
              @click="getNextAlumb"
            >
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  'name': 'AlbumModal',
  components: {},
  props: {
    roomId: {  //当前显示的空间Id
      type: Number,
      require: true,
      default: function () {
        return {}
      }
    },
    viewId: {     //当前显示的图册Id
      type: Number,
      require: true,
      default: function () {
        return {}
      }
    },
    allAlbumList: { //所有空间图册
      type: Array,
      require: true,
      default: function () {
        return []
      }
    },
    click: {
      type: Function,
      default: function () {
        console.log('显示大图集')
      }
    },
    close: {
      type: Function,
      default: function () {
        console.log('关闭')
      }
    },
    refreshList:{
      type: Function,
      default: function () {
        console.log('刷新')
      }
    },
    activekey:{     //当前显示的单张图册或者批量图册
      type: Number,
      require: true,
      default: function () {
        return 0
      }
    },
    albumsJurisdiction:{ //权限
      type: Object,
      default: function () {
        return {}
      }
    },
    solutionId:{ //方案ID
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data() {
    return {
      closable: false,
      visible: true,
      currentRoomId: null, //当前显示的roomId图集
      allRomeAlbum: [],    //所有空间相册信息
      currentViewId: null,  //当前高亮的图册ID
      allImagesList:[],     //当前图集的所有图片
      currentImages: [],     //当前展示图册所有图片信息
      currentImageIndex: 0,  //当前高亮大图序号
      currentRoomName: null,  //当前高亮图集空间Name
      imageLoading: false,
      prePageImage:null,      //上一页分页图片
      nextPageImage:null,   ////下一页分页图片
      currentAlubmIndex: 1,  //当前图集序号
      currentPage:1,         //当前页数
      pageSize:6,            //一页显示6个
      totalPage:0,            //总页数
      transitionFlag:true,   //动画效果控制
      validateUpload:false,
      showUploadList:false
    }
  },
  watch: {
    'currentImageIndex' (to, from) {
      this.gethighlightImageInfo(this.currentImageIndex)
    }
  },
  created() {
    this.initModalInfo()
  },
  mounted() {
    //将下载方法设置为全局的
    window.finishDownLoad=this.finishDownLoad
  },
  methods: {
    //获取当前高亮图渲染信息
    gethighlightImageInfo(currentImageIndex){
      this.imageLoading = true
      setTimeout(() => {
        this.imageLoading = false
      }, 2000)
      this.checkimageisexists(currentImageIndex)
    },
    //获取渲染状态
    /* 任务在构建——构建排队中状态，前端显示“排队中”，进度显示“—”；
      任务在构建——构建中状态，前端显示“构建中”，进度显示“1%-49%”；
      任务在构建——构建成功状态，前端显示“构建中”，进度显示“50%”；
      任务在渲染——渲染排队中状态，前端显示“渲染中”，进度显示“51%”；
      任务在渲染——正在渲染状态，前端显示“渲染中”，进度显示“52%-99%”；
      任务在渲染——渲染成功状态，直接显示已完成的效果图
    */
    //'enqueue':等待构建 ，'build_active':"构建中', 'build_success':构建成功 ，'waiting'：'等待渲染' ，'active':'渲染中'，'done' :'渲染完成'
    getImagesStatus(currentImage){
      if(currentImage) {
        const taskStatus = currentImage.taskStatus
        const source = currentImage.source
        const resolution = currentImage.resolution
        if (source == 2 && resolution == '3') {
          currentImage.renderingName = '2K渲染'
        }
        if (source == 2 && resolution == '4') {
          currentImage.renderingName = '4K渲染'
        }
        if (source == 2 && (resolution == '1' || resolution == '2')) {
          currentImage.renderingName = '自定义'
        }
        //本地渲染状态默认100%
        if (source == 1) {
          currentImage.process = 100
        }
        //自动移状态默认100%
        if (source == 3) {
          currentImage.process = 100
        }
        if (source == 2 && taskStatus == 'enqueue') {
          currentImage.process = 5
          currentImage.processName = '排队中'
        }
        if (source == 2 && taskStatus == 'build_active') {
          currentImage.process = 30
          currentImage.processName = '构建中'
        }
        if (source == 2 && taskStatus == 'build_success') {
          currentImage.process = 50
          currentImage.processName = '构建中'
        }
        if (source == 2 && taskStatus == 'waiting') {
          currentImage.process = 51
          currentImage.processName = '渲染中'
        }
        if (source == 2 && taskStatus == 'active') {
          currentImage.process = 75
          currentImage.processName = '渲染中'
        }
        if (source == 2 && taskStatus == 'done') {
          currentImage.process = 100
        }
      }
    },
    //初始化图片信息
    initModalInfo() {
      this.currentRoomId = this.roomId
      this.currentViewId = this.viewId
      this.currentPage=1         //当前页数
      this.pageSize=6           //一页显示6个
      this.totalPage=0            //总页数
      this.getAllImagesInfo()
      this.getCurrentImagesInfo()
      //默认高亮第一张图
      this.currentImageIndex = 1
      //获取当前图集序号
      const nextIndex = this.allRomeAlbum.findIndex(item => item.viewId == this.currentViewId)
      this.currentAlubmIndex = nextIndex
      this.$forceUpdate()
    },
    //获取所有空间图册信息
    getAllImagesInfo(){
      this.allRomeAlbum=[]
      this.allAlbumList.map(item => {
        const viewImagesList = item.viewImagesList ? item.viewImagesList : []
        const roomId = item.roomId
        const roomName = item.roomName
        const usageName = item.usageName
        //将数组转化，添加roomId和roomName，重新转化成新数组，便于展示
        viewImagesList.map(item => {
          const imageInfo = {...item, roomId, roomName,usageName}
          this.allRomeAlbum.push(imageInfo)
        })
      })
    },
    //根据roomId获取当前高亮的图册信息
    getCurrentImagesInfo() {
      const curentRoomeAlbum = this.allRomeAlbum.filter(item => item.viewId == this.currentViewId)[0]
      this.currentRoomName = curentRoomeAlbum.usageName
      this.allImagesList=curentRoomeAlbum.imageList
      if(this.allImagesList && this.allImagesList.length>0){
        this.allImagesList.map(item=>{
          this.getImagesStatus(item)
        })
      }
      //计算总页数
      const totalRecord=this.allImagesList.length
      this.totalPage=Math.ceil(totalRecord /this.pageSize)
      this.initPageIconImage()
    },
    //获取分页图片
    initPageIconImage(){
      //当前页大于1，获取上一页分页图片（上一页最后一个图片）
      if(this.currentPage>1){
        this.prePageImage=this.allImagesList[(this.currentPage-1)*this.pageSize-1].url
      }
      //当前页小于最大页数，获取下一页分页图片（下一页第一个图片）
      if(this.currentPage!==this.totalPage){
        this.nextPageImage=this.allImagesList[(this.currentPage*this.pageSize)].url
      }
    },
    //获取当前高亮图片
    showCurrentImage(index) {
      this.currentImageIndex=index+1
    },
    //获取上一个图集
    getUpAlubm() {
      //获取当前图集序号
      const upIndex = this.allRomeAlbum.findIndex(item => item.viewId == this.currentViewId) - 1
      this.currentAlubmIndex = upIndex
      //检查图片下载按钮
      //this.gethighlightImageInfo()
      if (upIndex !== -1) {
        this.currentViewId = this.allRomeAlbum[upIndex].viewId
        this.getCurrentImagesInfo()
      }
      //默认高亮图集的第一张图
      this.currentImageIndex=1
      this.gethighlightImageInfo(this.currentImageIndex)
    },
    //获取下一个图集
    getNextAlumb() {
      //获取当前图集序号
      const nextIndex = this.allRomeAlbum.findIndex(item => item.viewId == this.currentViewId) + 1
      this.currentAlubmIndex = nextIndex
      if (nextIndex !== this.allRomeAlbum.length) {
        this.currentViewId = this.allRomeAlbum[nextIndex].viewId
        this.getCurrentImagesInfo()
      }
      //默认高亮图集的第一张图
      this.currentImageIndex=1
      this.gethighlightImageInfo(this.currentImageIndex)
    },
    //假分页显示图集
    imageShow(index){
      const currentImageIndex=index+1
      const currentMinIndex=((this.currentPage-1)*(this.pageSize))+1
      const currentMaxIndex=this.currentPage*this.pageSize
      if((currentImageIndex==currentMinIndex|| currentImageIndex> currentMinIndex ) && (currentImageIndex==currentMaxIndex|| currentImageIndex< currentMaxIndex )){
        return true
      }
      else {
        return false
      }
    },
    //获取上一页图集的图片List
    getPrePageImageList(){
      const self=this
      this.transitionFlag=false
      setTimeout(() => {
        //取消弹出框
        self.transitionFlag=true
      }, 500)
      this.currentPage=this.currentPage-1
      this.currentImageIndex=this.currentPage*this.pageSize
      this.initPageIconImage()
    },
    //获取下一页图集的图片List
    getNextPageImageList(){
      const self=this
      this.transitionFlag=false
      setTimeout(() => {
        //取消弹出框
        self.transitionFlag=true
      }, 500)
      this.currentPage=this.currentPage+1
      this.currentImageIndex=(this.currentPage-1)*this.pageSize+1
      this.initPageIconImage()
    },
    onDelImage(jobId){
      console.log(this.allImagesList[this.currentImageIndex-1])
      const self=this
      self.$confirm({
        title: '确认删除图片吗?',
        onOk () {
          self.delImage(jobId)
        },
        onCancel () {}
      })
    },
    //删除图集下的单张图片
    delImage(jobId){
      const self=this
      self.$gLoading.show('正在删除..')
      let param = {}
      let url = ''
      if (this.allImagesList[this.currentImageIndex-1].source == 3) {
        // 删除自定义图片source == 3
        url = '/dr-web/solution/delRoomFile'
        param = {
          fileId:this.allImagesList[this.currentImageIndex-1].fileId,
          usgeID: self.roomId,
          usgeName: self.currentRoomName
        }
      } else {
        // 删除其他source 1、2
        url = '/dr-web/render/delRenderTask'
        param = {
          jobIds:[jobId],
          usgeID: self.roomId,
          usgeName: self.currentRoomName
        }
      }
      let paramString = JSON.stringify(param)
      this.$http.post(url, param).then(function(res){
        self.$gLoading.hide()
        if(res.success) {
          // eslint-disable-next-line
          ue.webalbum.delsinglepic(paramString)
          self.refreshAfterDelete(self.currentImageIndex)
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
    //删除之后刷新图集列表
    refreshAfterDelete(){
      this.refreshList()
    },
    //下载图集
    downLoadPic(url){
      this.$gLoading.show('正在下载图片..')
      //调用下载
      // eslint-disable-next-line
      ue.webalbum.downloadimage(url)
    },
    //下载完成之后回调
    finishDownLoad(result){
      this.$gLoading.hide()
      if(result==true) {
        this.checkimageisexists(this.currentImageIndex)
      }
      else {
        this.$message.error('下载失败！')
      }
    },
    //打开图片
    openImage(url){
      let fileName=''
      if(url){
        const urls=url.split('/')
        fileName=urls[urls.length-1]
      }
      // eslint-disable-next-line
      ue.webalbum.openpicturesfolder(fileName)
    },
    //检查该图片是否存在
    checkimageisexists(index){
      const self=this
      let fileName=''
      const url=self.allImagesList[index-1].url
      if(url){
        const urls=url.split('/')
        fileName=urls[urls.length-1]
      }
      if(fileName) {
        if(process.env.VUE_APP_ENV !== 'LOCAL') {
          // eslint-disable-next-line
         ue.webalbum.checkimageisexists(fileName).then(function (ReturnValue) {
            if(self.allImagesList[index - 1]){
              self.allImagesList[index - 1].ifDowned = ReturnValue
              self.$forceUpdate()
            }
          })
        }
      }
    },
    beforeUpload(file) {
      this.file = file
      if(file.type!=='image/png' && file.type!=='image/jpeg' && file.type!=='image/jpg' && file.type!=='image/gif'){
        this.$message.error('请上传图片类型的文件！')
        this.validateUpload=false
      }
      else {
        this.validateUpload=true
      }
      return false;
    },
    /**
     * 上传自定义图片
     */
    uploadImage() {
      const uploadBaseurl=process.env.VUE_APP_UPLOADURL
      if (this.validateUpload) {
        const self=this
        self.$gLoading.show('正在上传....')
        const uploadUrl = uploadBaseurl + '/unifyfile/file/drGeneralUpload'
        let formData = new FormData()
        formData.append('file', this.file)
        this.$http.post(uploadUrl, formData).then(function (res) {
          self.$gLoading.hide()
          if (res) {
            if (res.code == 200 && res.data) {
              //头像上传完之后，重置头像信息，保存
              const imageUrl = res.data
              self.addSelfImage(imageUrl)
            }
          } else {
            self.$notification.error({
              message: res.msg || '上传失败，请稍后再试！'
            })
          }
        }).catch(function (res) {
          self.$gLoading.hide()
          self.$notification.error({
            message: res.msg || '上传失败，请稍后再试！'
          })
        });
      }
    },
    /**
     * 图片上传完之后新增图片
     */
    addSelfImage(url){
      const self=this
      const param={
        fileUrl: url,
        roomId: this.currentRoomId,
        solutionId: this.solutionId,
        source: 1,
        type: 3,
        viewId: this.currentViewId,
      }
      self.$gLoading.show('正在保存....')
      this.$http.post('/dr-web/solution/addRoomFile', param).then(function (res) {
        if (res) {
          if (res.success) {
            self.refreshList()
          }
        } else {
          self.$notification.error({
            message: res.msg || '自定义图片保存失败！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        self.$notification.error({
          message: res.msg || '自定义图片保存失败！'
        })
      });
    }
  }
}
</script>
<style lang="less">
  .albumModal {
    width: 1280px !important;
    /deep/.ant-modal-body {
      padding: 0px;
      background-color: transparent;
      box-shadow: none;
    }
    /deep/.ant-modal-content  {
      box-shadow: none;
      -webkit-box-shadow:none;
      background: transparent;
    }
    /deep/.ant-modal-footer {
      display: none;
    }
    /deep/.container {
      .content {
        display: flex;
        .iconContent {
          width:126px;
          padding-top: 350px;
        }
        .mainInfo {
          position: relative;
          width: 1068px;
          .header {
            padding-top: 30px;
            padding-left: 30px;
            border-top-left-radius:8px;
            border-top-right-radius:8px;
            height: 94px;
            background-color: #ffffff;
            .closeIcon {
              position: absolute;
              top: 5px;
              right: 14px;
              padding: 20px;
              font-size: 32px;
              color: #989898;
              cursor: pointer;
              .icon {
                color: #333333;
                font-weight: 600;
                font-size: 20px;
              }
            }
            .roomName {
              width: 300px;
              font-size:20px;
              font-weight:600;
              color: #5C5C5C;
            }
            .imageNum {
              font-size:14px;
              font-weight:400;
              color:rgba(141,141,141,1);
              float: left;
              .num {
                color: #5C5C5C;
                font-weight:600;
              }
            }
            .uploadBtn {

            }
          }
          .tagIcon {
            position: absolute;
            right: 0px;
            z-index: 100;
            border-bottom-left-radius: 8px;
          }
          .currentImage {
            position: relative;
            width: 100%;
            background-color: #ffffff;
            text-align: center;
            .highlightImage {
              max-width: 100%;
              max-height: 601px;
            }
            .highlightImagehover {
              position: absolute;
              top:0px;
              width: 1068px;
              height: 601px;
              background: #000;
              opacity: 0.5;
            }
            .processContent {
              position: absolute;
              width: 100%;
              bottom: -7px;
              .text {
                text-align: left;
                padding-left: 30px;
                margin-bottom: 40px;
                .textInfo1 {
                  height: 30px;
                  font-size: 12px;
                  font-weight: 400;
                  color: rgba(255, 255, 255, 1);
                }
                .textInfo2 {
                  height: 30px;
                  line-height: 30px;
                  font-size: 20px;
                  font-weight: 600;
                  color: rgba(255, 255, 255, 1);
                }
              }
              /deep/ .ant-progress-inner {
                background-color: #ffffff;
                height: 8px;
              }

              /deep/ .ant-progress-bg {
                background-color: #586287;
              }
            }
          }
          .spainImage {
            background-color: #ffffff;
            text-align: center;
            padding-top: 200px;
            width: 1068px;
            height: 601px;
          }
          .operationDiv {
            position: absolute;
            bottom: 0px;
            text-align: right;
            width: 100%;
            height:76px;
            background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);
            opacity:0.6;
          }
          .operationContent {
            position: absolute;
            bottom: 0px;
            text-align: right;
            width: 100%;
            height:76px;
            .description {
              display: flex;
              float: left;
              margin-top: 30px;
              margin-left: 30px;
              font-size:14px;
              font-weight:600;
              color:#fff;
            }
            .operatecontent {
              margin-top: 20px;
              margin-right: 20px;
              z-index: 100;
              .downPicBtn {
                width: 94px;
                height: 36px;
                background-color: #ffffff;
                font-size: 12px;
                color: #5C5C5C;
                font-weight: 600;
                border:none;
              }
              .openPicBtn {
                width: 94px;
                height: 36px;
                background-color: #586287;
                font-size: 12px;
                color: #ffffff;
                font-weight: 600;
                border:none;
              }
              .delBtn {
                background-color: #E96C2E;
                font-size:12px;
                font-weight:600;
                color:rgba(255,255,255,1);
                margin-left:10px ;
                width: 100px;
                height: 36px;
                border:none;
              }
            }
          }
          .footerImageList {
            width: 1068px;
            display: flex;
            background-color: #ffffff;
            border-bottom-left-radius:8px;
            border-bottom-right-radius:8px;
            padding: 20px;
            .changeIcon {
              padding-top: 40px;
              font-size: 20px;
              cursor: pointer;
            }
            .imagesList {
              imagesList: 978px;
              display: flex;
              overflow: hidden;
              flex-direction: row;
              flex-wrap: wrap;
              .tagInfo {
                .tagIcon2 {
                  position: absolute;
                  top: 3px;
                  right: 3px;
                  border-top-right-radius: 6px;
                }
              }
              .eachImage {
                position: relative;
                cursor: pointer;
                width: 134px;
                height: 80px;
                margin-right: 10px;
                .image {
                  width: 100%;
                  height: 80px;
                  border-radius: 6px;
                  padding: 3px;
                }
                .highlightImagehover {
                  position: absolute;
                  top: 0px;
                  width: 100%;
                  height: 79px;
                  opacity: 0.5;
                  border-radius: 6px;
                  padding: 9px;
                  margin: 0 auto;
                  background-color: #000;
                }
                .processContent {
                  position: absolute;
                  width: calc(100% - 6px);
                  bottom: -3px;
                  margin-left: 3px;
                  .text {
                    text-align: left;
                    padding-left: 20px;
                    .textInfo2 {
                      font-size: 16px;
                      font-weight: 600;
                      color: rgba(255, 255, 255, 1);
                    }
                  }
                  /deep/ .ant-progress-inner {
                    background-color: #ffffff;
                    height: 6px;
                    border-top-left-radius: 0px !important;
                    border-top-right-radius: 0px !important;
                    border-bottom-left-radius: 8px !important;
                    border-bottom-right-radius: 8px !important;
                  }

                  /deep/ .ant-progress-bg {
                    background-color: #586287;
                    border-top-left-radius: 0px !important;
                    border-top-right-radius: 0px !important;
                    border-bottom-left-radius: 8px !important;
                    border-bottom-right-radius: 8px !important;

                  }
                }
              }
            }
            .pagePreImage {
              cursor: pointer;
              width: 60px;
              height: 83px;
              margin-right: 20px;
              opacity: 0.4;
              overflow: hidden;
              img {
                width: 120px;
                height: 79px;
                border-radius: 6px;
              }
            }
            .pageNextImage {
              cursor: pointer;
              width: 60px;
              height: 83px;
              margin-left: 20px;
              opacity: 0.4;
              overflow: hidden;
              img {
                width: 120px;
                height: 79px;
                border-radius: 6px;
              }
            }
            .activeImage {
              border-radius:8px;
              background:rgba(88,98,135,1) ;
              //border:2px solid rgba(88,98,135,1);
            }
          }
        }
      }
    }
  }
</style>
<style>
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
