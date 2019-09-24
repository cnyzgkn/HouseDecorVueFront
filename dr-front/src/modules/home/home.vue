<template>
  <div class="homeContainer">
    <div class="container">
      <div>
        <div class="title">
          我的任务
        </div>
        <div v-if="showtaskskeleton">
          <a-skeleton active />
        </div>
        <div
          v-if="!showtaskskeleton"
          class="content"
        >
          <template v-if="showTaskList">
            <task-card
              v-for="task in showTaskList"
              :key="`task_${task.id}`"
              class="card"
              :task-info="task"
              :refresh-list="searchTaskList"
            />
          </template>
          <div
            class="showall"
            @click="$router.push('/my-task')"
          >
            <img
              class="imgInfo"
              src="../../assets/images/moreTask.png"
            >
            <div
              v-if="taskList && taskList.length>0"
              class="titleInfo"
            >
              全部任务
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="title">
          我的产品方案
        </div>
        <div v-if="showmyschemeskeleton">
          <a-skeleton active />
        </div>
        <div
          v-if="!showmyschemeskeleton"
          class="content"
        >
          <dr-scheme
            v-for="scheme in showProductSchemeList"
            :key="scheme.id"
            :scheme-info="scheme"
            scheme-module="MY"
            @refreshSchemeList="onRefreshSchemeList"
            @showSchemeDetailModel="onShowSchemeDetailModel"
            @showSchemeProcessModel="onShowSchemeProcessModel"
          />
          <div
            class="showall showall-productscheme"
            @click="$router.push('/my-product-scheme')"
          >
            <img
              class="imgInfo"
              src="../../assets/images/morescheme.png"
            >
            <div class="titleInfo">
              全部产品方案
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="title">
          我的DNA方案
        </div>
        <div v-if="showdnaskeleton">
          <a-skeleton active />
        </div>
        <div
          v-if="!showdnaskeleton"
          class="content"
        >
          <dr-scheme
            v-for="scheme in showDnaSchemeList"
            :key="scheme.id"
            :scheme-info="scheme"
            scheme-module="MY"
            @refreshSchemeList="onRefreshSchemeList"
            @showSchemeDetailModel="onShowSchemeDetailModel"
            @showSchemeProcessModel="onShowSchemeProcessModel"
          />
          <div
            class="showall showall-dnascheme"
            @click="$router.push('/my-dna-scheme')"
          >
            <img
              class="imgInfo"
              src="../../assets/images/morescheme.png"
            >
            <div class="titleInfo">
              全部DNA方案
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--方案详情-->
    <scheme-detail-modal
      ref="schemeDetailModal"
      :visible="detailModalVisible"
      @cancel="onCancelSchemeDetailModal"
    />
    <!--方案进程-->
    <scheme-process-modal
      ref="schemeProcessModal"
      :visible="processModalVisible"
      @cancel="onCancleSchemeProcessModal"
    />
  </div>
</template>
<script>
import TaskCard from '@/components/task/taskCard'
import DrScheme from '@/components/scheme/scheme.vue'
import SchemeDetailModal from '@/components/scheme/scheme-detail-modal.vue'
import SchemeProcessModal from '@/components/scheme/schemne-process-modal.vue'
// import { getQtDataBytTag } from '@/common/utils/baseMethods.js'
// import global from '@/common/config/global.js'
// import debounce from 'lodash/debounce'
export default {
  'name': 'DrHome',
  components: {
    TaskCard,
    SchemeDetailModal,
    DrScheme,
    SchemeProcessModal
  },
  data () {
    return {
      // 设计任务检索入参
      searchTaskParam: {
        designerId: '', // 方案设计师id
        orderColumn: 3, // 排序字段，1:任务编号 2：交房时间 3:接收任务时间
        pageNo: 1,
        pageSize: 10,
        sortRule: 1, // 排序方式，0:升序 1:降序
        status: 0// 方案设计任务状态 0:全部任务,1:新任务,2:设计中,3:已提交审核,4:审核未通过,5:已完成,6:设计师驳回
      },
      taskList: [],//我的任务列表，默认获取的10条数据
      showTaskList:[], // 展示在界面上的列表
      userInfo: this.$getUserInfo(),
      myProductSchemeList: [], // 我的产品方案列表，默认获取的10条数据
      showProductSchemeList:[], // 展示在界面上的列表
      myDnaSchemeList: [], // 我的DNA方案列表，默认获取的10条数据
      showDnaSchemeList:[], // 展示在界面上的列表
      searchMyProductSchemeParam: {
        type: 1,
        pageNo: 1,
        pageSize: 10
      },
      searchMyDnaSchemeParam: {
        type: 2,
        pageNo: 1,
        pageSize: 10
      },
      detailModalVisible: false, // 是否展示方案详情弹窗
      processModalVisible:false, // 是否展示方案进程弹窗
      showtaskskeleton:false,   //显示任务骨架屏
      showmyschemeskeleton:false,   //显示我的产品方案骨架屏
      showdnaskeleton:false,   //显示DNA方案骨架屏
      cardSpaceWidth:{ // 卡片之间的距离
        scheme:30,
        task:30
      },
      showCardNumber:{ //展示的卡片数量
        scheme:10,
        task:10
      }
    }
  },
  created(){
    // this.calculateCardNumbers = debounce(this.calculateCardNumbers,500)
  },
  mounted () {
    //监听窗口大小变化
    window.addEventListener('resize',this.calculateCardNumbers)

    //如果缓存中无登录信息直接跳转登录页面
    const  userInfo = this.$getUserInfo()
    if(userInfo.user && this.$ifEmpty(userInfo.user.userId)){
      this.$router.push('/login')

    }
    const self=this
    if(!self.$ifEmpty(this.$getUserInfo().user.username)){
      // 检索设计任务
      self.searchTaskList()
      // self.getMyProductScheme()
      // self.getMyDnaScheme()
      // 初始化卡片个数和间距
      this.calculateCardNumbers()
      //初始化方案
      self.innitScheme()
    }
  },
  beforeDestroy(){
    // window.removeEventListener('resize',this.calculateCardNumbers)
  },
  methods: {
    /**
     * 设计任务检索
     */
    searchTaskList () {
      const self = this
      self.taskList = []
      self.showtaskskeleton=true
      this.$http.post('/dr-web/solutionDesignTask/queryDesignTasksByPage', { ...this.searchTaskParam, designerId: self.userInfo.user.userId }).then(function (res) {
        self.showtaskskeleton=false
        if (res.code === 1) {
          const list = res.data && res.data.list ? res.data.list : []
          self.taskList = list
          self.renderCards('TASK')
        }else {
          self.taskList = []
          self.$notification.error({
            message: '失败',
            description: res.msg || '查询任务失败，请稍后再试！'
          })
        }
      })
    },
    async innitScheme(){
      await this.getMyProductScheme()
      this.getMyDnaScheme()
    },
    async getMyProductScheme () {
      let schemeList = await this.searchMyScheme(1)
      // let downloadIds = await getQtDataBytTag(global.qtChannel.cppObject,global.qtTag.savedProductSolutionNameStr)
      // if(downloadIds){
      //   for(let i = 0 ,len = schemeList.length;i < len;i++){
      //     let current = schemeList[i]
      //     if(downloadIds.indexOf(current.id) > -1){
      //       current.download = true
      //     }
      //   }
      // }
      this.myProductSchemeList = schemeList
      this.renderCards('PRODUCT')
      Promise.resolve()
    },
    async getMyDnaScheme () {
      let schemeList = await this.searchMyScheme(2)
      // let downloadIds = await getQtDataBytTag(global.qtChannel.cppObject,global.qtTag.savedDNASolutionNameStr)
      // if(downloadIds){
      //   for(let i = 0 ,len = schemeList.length;i < len;i++){
      //     let current = schemeList[i]
      //     if(downloadIds.indexOf(current.id) > -1){
      //       current.download = true
      //     }
      //   }
      // }
      this.myDnaSchemeList = schemeList
      this.renderCards('DNA')
    },
    /**
     * @param {Number} type 1普通方案  2DNA方案
     */
    searchMyScheme (type) {
      let self = this
      let param = this.searchMyProductSchemeParam
      if (type === 2) {
        self.showdnaskeleton=true
        param = this.searchMyDnaSchemeParam
        this.myDnaSchemeList.splice(0, this.myDnaSchemeList.length)
      } else {
        self.showmyschemeskeleton=true
        this.myProductSchemeList.splice(0, this.myProductSchemeList.length)
      }
      return new Promise(function(resolve,reject){
        self.$http.post('/dr-web/solution/queryByUserId', {
          ...param,
          addUserId: self.userInfo.user.userId
        }).then(data => {
          if(type==1){
            self.showmyschemeskeleton=false
          }
          else {
            self.showdnaskeleton=false
          }
          if (data.code === 1) {
            resolve(data.data.list)
          } else {
            self.$notification.error({
              message: type === 1 ? '获取我的产品方案失败' : '获取我的DNA方案失败',
              description: data.msg || '服务器异常，请稍后再试！'
            })
            reject()
          }
        })
      })
    },
    // 展示方案详情
    onShowSchemeDetailModel (id) {
      this.$refs.schemeDetailModal.getSchemeDetail(id).then(() => {
        this.detailModalVisible = true
      })
    },
    // 关闭方案详情弹窗
    onCancelSchemeDetailModal () {
      this.detailModalVisible = false
    },
    // 展示进程详情
    onShowSchemeProcessModel(betaSolutionId){
      this.$refs.schemeProcessModal.getProcessInfo(betaSolutionId).then(() => {
        this.processModalVisible = true
      }).catch(() => {
        
      })
    },
    // 关闭展示进程详情
    onCancleSchemeProcessModal(){
      this.processModalVisible = false
    },
    /**
     * @param {Number} data 1普通方案  2DNA方案
     */
    onRefreshSchemeList(data){
      if(data === 1){
        this.getMyProductScheme()
      }else{
        this.getMyDnaScheme()
      }
    },
    //根据屏幕宽度计算卡片（方案、任务）一行可以展示的宽度及其间距
    calculateCardNumbers(){
      let screen_wh = window.screen.availWidth
      let content_wh = screen_wh - 60 - 170 - 10// 60:内容左内边距 230：右侧更多图片宽度 10 右边间隙
      let min_spece_wh = 30 // 卡片之间最小间距

      // 计算方案卡片个数
      let card_wh = 252 // 方案卡片宽度
      let unit_wh = card_wh + min_spece_wh
      let remain = content_wh%unit_wh
      let number = Math.floor(content_wh/unit_wh) //卡片个数
      let spece_wh = min_spece_wh //卡片间距
      if(remain){
        spece_wh = Math.floor((content_wh -(number*card_wh))/number)
      }
      this.showCardNumber.scheme = number
      this.cardSpaceWidth.scheme = spece_wh
      this.renderCards('PRODUCT')
      this.renderCards('DNA')

      //计算任务卡片个数
      card_wh = 308 //任务卡片宽度
      unit_wh = card_wh + min_spece_wh
      remain = content_wh%unit_wh
      number = Math.floor(content_wh/unit_wh) //卡片个数
      spece_wh = min_spece_wh //卡片间距
      if(remain){
        spece_wh = Math.floor((content_wh -(number*card_wh))/number)
      }
      this.showCardNumber.task = number
      this.cardSpaceWidth.task = spece_wh
      this.renderCards('TASK')
    },
    // 渲染卡片
    renderCards(type){
      switch (type) {
        case 'TASK':
          this.showTaskList = this.taskList.slice(0,this.showCardNumber.task)
          break;
        case 'PRODUCT':
          this.showProductSchemeList= this.myProductSchemeList.slice(0,this.showCardNumber.scheme)
          break;
        case 'DNA':
          this.showDnaSchemeList = this.myDnaSchemeList.slice(0,this.showCardNumber.scheme)
          break;
        default:
          break;
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .homeContainer {
    width: calc(100% + 60px);
    .container {
      padding: 6px 0px 40px 0px;
      .title {
        display: -webkit-flex;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: flex-start;
        font-size:20px;
        font-weight:600;
        color:#5C5C5C;
        padding-bottom: 30px;
      }
      .content {
        display: -webkit-flex;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: flex-start;
        .card {
          margin-right: 30px;
          margin-bottom: 30px;
        }
        .showall {
          width: 170px;
          height: 223px;
          background: linear-gradient(90deg,rgba(251,251,251,1) 0%,rgba(245,245,245,1) 100%);
          border-radius: 8px 0px 0px 8px;
          padding: 61px 0px 0px 0px;
          text-align: center;
          transition: 350ms transform ease;
          cursor: pointer;
          &:hover{
            transform: translate(0, -10px);
            -webkit-transform: translate(0, -10px);
            z-index: 10;
          }
          .imgInfo {
            width:48px;
            height:60px;
          }
          .titleInfo {
            font-size:14px;
            font-weight:600;
            color:#C7C7C7;
            margin-top: 17px;
          }
        }
        .showall-productscheme{
          height: auto;
          padding: 66px 0;
          .imgInfo{
            width:74px;
            height:60px;
          }
        }
        .showall-dnascheme{
          padding: 57px 0;
          height: auto;
          .imgInfo{
            width:74px;
            height:60px;
          }
        }
      }
    }
  }

</style>
