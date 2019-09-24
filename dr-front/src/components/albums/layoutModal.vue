<!--建筑图册大图弹出框-->
<template>
  <div>
    <a-modal
      :visible="visible"
      title=""
      class="layoutModal"
      :closable="closable"
    >
      <div class="container">
        <div class="mainInfo">
          <div class="header">
            <div
              class="closeIcon"
              @click="close"
            >
              <a-icon
                class="icon"
                type="close"
              />
            </div>
            <div class="roomName">
              {{ type ==1 ? '平面布置图': (type == 2 ? '户型拆改图' : '户型原始图') }}
            </div>
            <div
              v-if="type !=3"
              class="imageNum"
            >
              本图集
              <span class="num">&nbsp;{{ currentImageIndex }}&nbsp;/&nbsp;{{ layoutList.length }}&nbsp;</span>
              张图
            </div>
          </div>
          <div class="currentImage">
            <img
              v-if="layoutList[currentImageIndex-1] && type != 3"
              class="highlightImage"
              :src="$ifAliyunImage(layoutList[currentImageIndex-1].layoutPlanImage)?layoutList[currentImageIndex-1].layoutPlanImage+'!original':layoutList[currentImageIndex-1].layoutPlanImage"
              onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAACCAQMAAABYTTeVAAAABlBMVEXx8fH7+/tUkfSPAAABwklEQVRYw+3WPU/CQBzH8X95CHSiMTGylYHEuJk4OIIPg6Nx0U0T34CjA7HV+ApwccNEfR3U6OaC8QXYl8BY8Nrzf9diiPK7bkxlKeE++QLXuwOS5seYClCAAhRgmUDkAb+DwHhVB8hF4M0vDaUMqIHAyHaoI4hqCNw+7N+cBgbg22RfkQFs0NFxyKAMCyuUkAI1AOzuINSgDEDL9kiDO1RYG2tgXQPQlZQCVBhEZC5IPwOPAGQBoncAghl4AWA2Tq+LQfILPhcDkY72iPaMgC/nRiANIMrAFgLqY1r8bdcBsEQGUMFKC2PaBqA8Ay6YKF0o8y2BQGggIKBLDZL5rfX/ZvGCzQW+EfCeCPJACDZO7OeAyQxEAAgNGhhEatFeuGrOQUGB2OMnqNBVt0o9MRT0UIAKZykQZAA1+eccnAfTlgYJIaAKPMSnUAeATQU4UAKn3ISBy6+Q+wUKjgI8F1Ow5KYn/O4caAQARE0uqN1bGQBwQFTnQOiAgmjqJRVXUUHe6wUT0iEopAdEr/IECwrUPhzqdgzA83fbfQOoyue6T0MAEjWT8ajd9zBQl+8d+Ms7vykXgsAr/sMUoAAFWCb4AaxTlPEjED5xAAAAAElFTkSuQmCC'"
            >
            <img
              v-if="layoutList[currentImageIndex-1].url && type == 3"
              class="highlightImage"
              :src="$ifAliyunImage(layoutList[currentImageIndex-1].url)?layoutList[currentImageIndex-1].url+'!original':layoutList[currentImageIndex-1].url"
              onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAACCAQMAAABYTTeVAAAABlBMVEXx8fH7+/tUkfSPAAABwklEQVRYw+3WPU/CQBzH8X95CHSiMTGylYHEuJk4OIIPg6Nx0U0T34CjA7HV+ApwccNEfR3U6OaC8QXYl8BY8Nrzf9diiPK7bkxlKeE++QLXuwOS5seYClCAAhRgmUDkAb+DwHhVB8hF4M0vDaUMqIHAyHaoI4hqCNw+7N+cBgbg22RfkQFs0NFxyKAMCyuUkAI1AOzuINSgDEDL9kiDO1RYG2tgXQPQlZQCVBhEZC5IPwOPAGQBoncAghl4AWA2Tq+LQfILPhcDkY72iPaMgC/nRiANIMrAFgLqY1r8bdcBsEQGUMFKC2PaBqA8Ay6YKF0o8y2BQGggIKBLDZL5rfX/ZvGCzQW+EfCeCPJACDZO7OeAyQxEAAgNGhhEatFeuGrOQUGB2OMnqNBVt0o9MRT0UIAKZykQZAA1+eccnAfTlgYJIaAKPMSnUAeATQU4UAKn3ISBy6+Q+wUKjgI8F1Ow5KYn/O4caAQARE0uqN1bGQBwQFTnQOiAgmjqJRVXUUHe6wUT0iEopAdEr/IECwrUPhzqdgzA83fbfQOoyue6T0MAEjWT8ajd9zBQl+8d+Ms7vykXgsAr/sMUoAAFWCb4AaxTlPEjED5xAAAAAElFTkSuQmCC'"
            >
            <div
              class="operationDiv"
            />
            <div
              class="operationContent"
            >
              <div class="description">
                <div>{{ layoutList[currentImageIndex-1].solutionId }} &nbsp;</div>
                <div>{{ layoutList[currentImageIndex-1].createTime || layoutList[currentImageIndex-1].date }}</div>
              </div>
              <div
                v-if="layoutList[currentImageIndex-1]"
                class="operatecontent"
              >
                <a-button
                  v-if="!layoutList[currentImageIndex-1].ifDowned && type != 3"
                  class="downPicBtn"
                  type="default"
                  @click="()=>downLoadPic(layoutList[currentImageIndex-1].layoutPlanImage)"
                >
                  下载本图
                </a-button>
                <a-button
                  v-if="!layoutList[currentImageIndex-1].ifDowned && type == 3"
                  class="downPicBtn"
                  type="default"
                  @click="()=>downLoadPic(layoutList[currentImageIndex-1].url)"
                >
                  下载本图
                </a-button>
                <a-button
                  v-if="layoutList[currentImageIndex-1].ifDowned"
                  class="openPicBtn"
                  type="default"
                  @click="()=>openImage(layoutList[currentImageIndex-1].layoutPlanImage)"
                >
                  打开图片
                </a-button>
                <a-button
                  v-if="type != 3"
                  class="delBtn"
                  type="default"
                  @click="delImage"
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
          <div
            v-if="type !=3"
            class="footerImageList"
          >
            <!-- 以上一页的最后一个图片作为分页图标-->
            <div class="pagePreImage">
              <img
                v-if="currentPage>1"
                :src="$ifAliyunImage(prePageImage)?prePageImage+'!original':prePageImage"
                onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAACCAQMAAABYTTeVAAAABlBMVEXx8fH7+/tUkfSPAAABwklEQVRYw+3WPU/CQBzH8X95CHSiMTGylYHEuJk4OIIPg6Nx0U0T34CjA7HV+ApwccNEfR3U6OaC8QXYl8BY8Nrzf9diiPK7bkxlKeE++QLXuwOS5seYClCAAhRgmUDkAb+DwHhVB8hF4M0vDaUMqIHAyHaoI4hqCNw+7N+cBgbg22RfkQFs0NFxyKAMCyuUkAI1AOzuINSgDEDL9kiDO1RYG2tgXQPQlZQCVBhEZC5IPwOPAGQBoncAghl4AWA2Tq+LQfILPhcDkY72iPaMgC/nRiANIMrAFgLqY1r8bdcBsEQGUMFKC2PaBqA8Ay6YKF0o8y2BQGggIKBLDZL5rfX/ZvGCzQW+EfCeCPJACDZO7OeAyQxEAAgNGhhEatFeuGrOQUGB2OMnqNBVt0o9MRT0UIAKZykQZAA1+eccnAfTlgYJIaAKPMSnUAeATQU4UAKn3ISBy6+Q+wUKjgI8F1Ow5KYn/O4caAQARE0uqN1bGQBwQFTnQOiAgmjqJRVXUUHe6wUT0iEopAdEr/IECwrUPhzqdgzA83fbfQOoyue6T0MAEjWT8ajd9zBQl+8d+Ms7vykXgsAr/sMUoAAFWCb4AaxTlPEjED5xAAAAAElFTkSuQmCC'"
                @click="getPrePageImageList"
              >
            </div>
            <transition name="slide-fade">
              <div
                v-if="transitionFlag"
                class="imagesList"
              >
                <div
                  v-for="(img,index) in layoutList"
                  v-show="imageShow(index)"
                  :key="'image_'+index"
                  class="eachImage"
                  :class="{'activeImage':index+1==currentImageIndex}"
                  @click="()=>showCurrentImage(index)"
                >
                  <div style="position: relative;">
                    <img 
                      :src="$ifAliyunImage(img.layoutPlanImage)?img.layoutPlanImage+'!original':img.layoutPlanImage" 
                      onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAACCAQMAAABYTTeVAAAABlBMVEXx8fH7+/tUkfSPAAABwklEQVRYw+3WPU/CQBzH8X95CHSiMTGylYHEuJk4OIIPg6Nx0U0T34CjA7HV+ApwccNEfR3U6OaC8QXYl8BY8Nrzf9diiPK7bkxlKeE++QLXuwOS5seYClCAAhRgmUDkAb+DwHhVB8hF4M0vDaUMqIHAyHaoI4hqCNw+7N+cBgbg22RfkQFs0NFxyKAMCyuUkAI1AOzuINSgDEDL9kiDO1RYG2tgXQPQlZQCVBhEZC5IPwOPAGQBoncAghl4AWA2Tq+LQfILPhcDkY72iPaMgC/nRiANIMrAFgLqY1r8bdcBsEQGUMFKC2PaBqA8Ay6YKF0o8y2BQGggIKBLDZL5rfX/ZvGCzQW+EfCeCPJACDZO7OeAyQxEAAgNGhhEatFeuGrOQUGB2OMnqNBVt0o9MRT0UIAKZykQZAA1+eccnAfTlgYJIaAKPMSnUAeATQU4UAKn3ISBy6+Q+wUKjgI8F1Ow5KYn/O4caAQARE0uqN1bGQBwQFTnQOiAgmjqJRVXUUHe6wUT0iEopAdEr/IECwrUPhzqdgzA83fbfQOoyue6T0MAEjWT8ajd9zBQl+8d+Ms7vykXgsAr/sMUoAAFWCb4AaxTlPEjED5xAAAAAElFTkSuQmCC'"
                    >
                  </div>
                </div>
              </div>
            </transition>
            <!-- 以下一页的第一个图片作为分页图标-->
            <div class="pageNextImage">
              <img
                v-if="currentPage!==totalPage"
                :src="$ifAliyunImage(nextPageImage)?nextPageImage+'!original':nextPageImage"
                onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAACCAQMAAABYTTeVAAAABlBMVEXx8fH7+/tUkfSPAAABwklEQVRYw+3WPU/CQBzH8X95CHSiMTGylYHEuJk4OIIPg6Nx0U0T34CjA7HV+ApwccNEfR3U6OaC8QXYl8BY8Nrzf9diiPK7bkxlKeE++QLXuwOS5seYClCAAhRgmUDkAb+DwHhVB8hF4M0vDaUMqIHAyHaoI4hqCNw+7N+cBgbg22RfkQFs0NFxyKAMCyuUkAI1AOzuINSgDEDL9kiDO1RYG2tgXQPQlZQCVBhEZC5IPwOPAGQBoncAghl4AWA2Tq+LQfILPhcDkY72iPaMgC/nRiANIMrAFgLqY1r8bdcBsEQGUMFKC2PaBqA8Ay6YKF0o8y2BQGggIKBLDZL5rfX/ZvGCzQW+EfCeCPJACDZO7OeAyQxEAAgNGhhEatFeuGrOQUGB2OMnqNBVt0o9MRT0UIAKZykQZAA1+eccnAfTlgYJIaAKPMSnUAeATQU4UAKn3ISBy6+Q+wUKjgI8F1Ow5KYn/O4caAQARE0uqN1bGQBwQFTnQOiAgmjqJRVXUUHe6wUT0iEopAdEr/IECwrUPhzqdgzA83fbfQOoyue6T0MAEjWT8ajd9zBQl+8d+Ms7vykXgsAr/sMUoAAFWCb4AaxTlPEjED5xAAAAAElFTkSuQmCC'"
                @click="getNextPageImageList"
              >
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  'name': 'LayoutModal',
  components: {},
  props: {
    layoutList: {  //当前建筑图册列表
      type: Array,
      require: true,
      default: function () {
        return {}
      }
    },
    close:{
      type: Function,
      require: true,
      default: function () {
      }
    },
    type:{    //类型 1:平面布置图,2:户型拆改图 3户型原始图
      type: String,
      default: function () {
        return ''
      }
    },
    refreshList:{
      type:Function,
      default: function () {
      }
    }
  },
  data() {
    return {
      visible:true,
      closable:false,
      prePageImage:null,      //上一页分页图片
      nextPageImage:null,   ////下一页分页图片
      currentImageIndex: 0,  //当前图集序号
      currentPage:1,         //当前页数
      pageSize:6,            //一页显示6个
      totalPage:0,            //总页数
      transitionFlag:true       //动画效果控制
    }
  },
  watch: {
    layoutList: {
      deep: true,
      immediate: true,
      handler: function (val) {
        //计算总页数
        this.getPageTotalInfo()
        if(this.totalPage>0) {
          //获取分页图片
          this.initPageIconImage()
          this.showCurrentImage(0)
        }
      }
    }
  },
  created() {
    //计算总页数
    this.getPageTotalInfo()
    //获取分页图片
    this.initPageIconImage()
    this.showCurrentImage(0)
  },
  mounted() {
    window.finishApartmentDown=this.finishApartmentDown
  },
  methods: {
    //获取总页数和分页信息
    getPageTotalInfo(){
      const totalRecord=this.layoutList.length
      //如果当前获取的总数为0，则关闭弹出框
      if(totalRecord==0){
        this.close()
      }
      this.totalPage=Math.ceil(totalRecord /this.pageSize)
    },
    //假分页显示图集
    imageShow(index){
      const currentImageIndex=index+1
      const currentMinIndex=((this.currentPage-1)*(this.pageSize))+1
      const currentMaxIndex=this.currentPage*this.pageSize
      if((currentImageIndex==currentMinIndex|| currentImageIndex > currentMinIndex ) && (currentImageIndex==currentMaxIndex|| currentImageIndex< currentMaxIndex )){
        return true
      }
      else {
        return false
      }
    },
    //获取上一页图集
    getPrePageImageList(){
      const self=this
      this.transitionFlag=false
      setTimeout(() => {
        //取消弹出框
        self.transitionFlag=true
      }, 500)
      this.currentPage=this.currentPage-1
      this.currentImageIndex=this.currentPage*this.pageSize
    },
    //获取下一页图集
    getNextPageImageList(){
      const self=this
      this.transitionFlag=false
      setTimeout(() => {
        //取消弹出框
        self.transitionFlag=true
      }, 500)
      this.currentPage=this.currentPage+1
      this.currentImageIndex=(this.currentPage-1)*this.pageSize+1
      //获取分页图片
      this.initPageIconImage()
    },
    //获取分页图片
    initPageIconImage(){
      //当前页大于1，获取上一页分页图片（上一页最后一个图片）
      if(this.currentPage > 1){
        this.prePageImage=this.layoutList[(this.currentPage-1)*this.pageSize-1].layoutPlanImage
      }
      //当前页小于最大页数，获取下一页分页图片（下一页第一个图片）
      if(this.currentPage!==this.totalPage){
        this.nextPageImage=this.layoutList[(this.currentPage*this.pageSize)].layoutPlanImage
      }
    },
    //获取当前高亮图片
    showCurrentImage(index) {
      this.currentImageIndex=index+1
      this.checkimageisexists(this.currentImageIndex)
    },
    //下载图集
    downLoadPic(url){
      this.$gLoading.show('正在下载图片..')
      // eslint-disable-next-line
       ue.webalbum.downchangeimageex(url)
    },
    //下载完成之后回调
    finishApartmentDown(result){
      this.$gLoading.hide()
      if(result==true) {
        this.checkimageisexists(this.currentImageIndex)
      }
      else {
        this.$message.error('下载失败！')
      }
    },
    //检查当前图片是否已下载
    checkimageisexists(index){
      const self=this
      let fileName=''
      const url=self.layoutList[index-1].layoutPlanImage
      if(url){
        const urls=url.split('/')
        fileName=urls[urls.length-1]
      }
      if(fileName) {
        if(process.env.VUE_APP_ENV !== 'LOCAL') {
          // eslint-disable-next-line
          ue.webalbum.checkchangetexture(fileName).then(function (ReturnValue) {
            if(self.layoutList[index - 1]){
              self.layoutList[index - 1].ifDowned = ReturnValue
              self.$forceUpdate()
            }
          })
        }
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
      ue.webalbum.openchangeiamge(fileName)
    },
    //删除本图
    delImage(){
      const self=this
      const index=this.currentImageIndex
      self.$gLoading.show('正在删除')
      const param={id:self.layoutList[index-1].id}
      this.$http.post('/dr-web/solution/delLayoutPlanImage', param).then(function (res) {
        self.$gLoading.hide()
        if (res.success) {
          //刷新列表
          self.refreshList()
          self.$notification.success({
            message:  '删除成功！'
          })
        } else {
          self.$notification.error({
            message: res.msg || '删除失败！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        self.$notification.error({
          message: res.msg || '删除失败！'
        })
      })
    }
  }
}

</script>
<style lang="less">
  .layoutModal {
    width: 1068px !important;
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
    .container {
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
            float: right;
            margin-right: 14px;
            margin-top: 0px;
            cursor: pointer;
            .icon {
              color: #333333;
              font-weight: 600;
              font-size: 20px;
            }
          }
          .roomName {
            font-size:20px;
            font-weight:600;
            color: #5C5C5C;
          }
          .imageNum {
            font-size:14px;
            font-weight:400;
            color:rgba(141,141,141,1);
            .num {
              color: #5C5C5C;
              font-weight:600;
            }
          }
        }
        .footerTime {
          position: relative;
          width: 100%;
          color: #5C5C5C;
          // padding: 10px 10px 0px 25px;
          // background-color: #ffffff;
          .pd10 {
             padding-bottom: 10px;
          }
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
            width: 1068px;
            position: absolute;
            top:0px;
            height: 518px;
            background: #000;
            opacity: 0.5;
          }
          .operationDiv {
            position: absolute;
            bottom: 0px;
            text-align: right;
            width: 100%;
            height:76px;
            background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);
            opacity:0.4;
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
                background-color: #FFFFFF;
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
            width: 830px;
            display: flex;
            overflow: hidden;
            .tagInfo {
              .tagIcon {
                position: absolute;
                right: 0px;
                width: 65px;
                height: 24px;
              }
            }
            .eachImage {
              position: relative;
              cursor: pointer;
              width: 134px;
              height: 80px;
              margin-right: 20px;
              img {
                width: 100%;
                height: 80px;
                border-radius: 6px;
                padding: 3px;
              }
              .highlightImagehover {
                position: absolute;
                top: 0px;
                width: 95%;
                height: 79px;
                opacity: 0.5;
                border-radius: 6px;
                padding: 9px;
                margin: 0 auto;
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
