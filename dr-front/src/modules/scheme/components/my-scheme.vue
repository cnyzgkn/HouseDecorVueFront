<template>
  <div
    class="mySchemeWrap"
    :style="{width:wrapWidth + 'px'}"
  >
    <h1 class="subTitle">
      {{ title }}
    </h1>
    <div
      class="schemetab"
      :style="{width:wrapWidth + 'px'}"
    >
      <dr-tabs
        v-model="status"
        @tabClick="tabClick"
      >
        <a-tab-pane
          v-for="tab in tabs"
          :key="`${tab.status}_${tab.tag}`"
        >
          <span slot="tab">
            {{ tab.statusCn }}
            <a-badge
              v-if="schemeType === 1 && tab.statusCn == '已上线'"
              :count="messageInfo.onLineCount"
              :number-style="{backgroundColor: 'rgb(233, 108, 46)'}"
              class="message-icon-wrap"
              :overflow-count="99"
            />
            <a-badge
              v-if="schemeType === 1 && tab.statusCn == '已下线'"
              :count="messageInfo.offLineCount"
              class="message-icon-wrap"
              :number-style="{backgroundColor: 'rgb(233, 108, 46)'}"
              :overflow-count="99"
            />
          </span>
          <!--卡片展示-->
          <div
            v-if="schemeList && schemeList.length >0"
            class="scheme-list"
          >
            <template v-for="scheme in schemeList">
              <dr-scheme
                :key="scheme.id"
                :scheme-info="scheme"
                scheme-module="MY"
                @refreshSchemeList="onRefreshSchemeList"
                @showSchemeDetailModel="onShowSchemeDetailModel"
                @showSchemeProcessModel="onShowSchemeProcessModel"
              />
            </template>
          </div>
          <div
            v-else
            class="noscheme"
          >
            <dr-nodata />
          </div>
        </a-tab-pane>
      </dr-tabs>
    </div>

    <!--分页-->
    <dr-pagination
      v-model="pageNo"
      simple
      :default-current="1"
      :total="total"
      :page-size="pageSize"
      @change="onPagesizeChange"
    />
    <!--搜索-->
    <div class="topSearch">
      <dr-select
        v-model="searchInfo"
        :dr-select-arr="searchOption"
        @drSearch="onDrSearchChange"
      />
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
import DrScheme from '@/components/scheme/scheme.vue'
import DrTabs from '@/components/base/dr-tabs.vue'
import DrSelect from '@/components/base/dr-select'
import DrPagination from '@/components/base/dr-pagination.vue'
import SchemeDetailModal from '@/components/scheme/scheme-detail-modal.vue'
import SchemeProcessModal from '@/components/scheme/schemne-process-modal.vue'
import  DrNodata from '@/components/base/dr-nodata.vue'
import { getUserInfo } from '@/common/utils/baseFunc.js'
import * as schemeApi from '.././scheme.api.js'
import global from '@/common/config/global.js'
import { getQtDataBytTag,calcWidth } from '@/common/utils/baseMethods.js'
import debounce from 'lodash/debounce'
export default {
  'name': 'MyScheme',
  components: { DrScheme, DrPagination, DrTabs, DrSelect, SchemeDetailModal,SchemeProcessModal,DrNodata },
  props: {
    schemeType: { // 我的方案类型 1：普通  2：DNA
      type: Number,
      required: true
    }
  },
  data () {
    return {
      messageInfo: {},
      title: '我的产品方案',
      schemeList: [], // 方案列表
      pageNo: 1, // 当前分页
      total: 0, // 总页数
      pageSize: 18, // 分页大小
      userInfo: getUserInfo(), // 用户信息
      tabs: [], // tab标签
      searchOption: [ // 搜索选项
        {
          key: '1',
          name: '方案名称'
        },
        {
          key: '2',
          name: '方案ID'
        }
      ],
      searchInfo: {// 搜索信息
        selectedkey: '1',
        searchcontent: ''
      },
      status: '', // 当前状态,默认全部
      detailModalVisible: false, // 方案详情弹窗是否展示
      isnoData: false, // 是否展示无数据
      processModalVisible: false, // 查看进程框是否展示
      wrapWidth:0 //根据卡片宽度计算的容器宽度，用于居中显示
      // schemeListWh:0
    }
  },
  created () {
    this.wrapWidth = calcWidth(252,58)
    // this.schemeListWh = this.wrapWidth  + 58
    this.calcWidthOnSizeChange = debounce(this.calcWidthOnSizeChange,500)

    if (this.schemeType === 1) {
      this.title = '我的产品方案'
      this.tabs = global.myProjectSchemeStatus
    } else {
      this.title = '我的DNA方案'
      this.tabs = global.myDnaSchemeStatus
    }
    this.status = this.tabs[0].status + '_' + this.tabs[0].tag
    this.getMySchemesByContion()
    // this.searchMessage()

    //监听窗口大小变化
    window.addEventListener('resize',this.calcWidthOnSizeChange)
  },
  beforeDestroy(){
    window.removeEventListener('resize',this.calcWidthOnSizeChange)
  },
  methods: {
    //获取我的方案
    async getMySchemesByContion () {
      this.schemeList=[]
      this.total=0
      let userId = this.userInfo.user.userId
      if (!userId) {
        return
      }
      let solutionId
      if (this.searchInfo.selectedkey === '2') {
        if (isNaN(Number(this.searchInfo.searchcontent))) {
          this.$message.error('方案id必须为数字！')
          return
        } else {
          solutionId = this.searchInfo.searchcontent === '' ? undefined : Number(this.searchInfo.searchcontent)
        }
      }
      let name = this.searchInfo.selectedkey === '1' ? this.searchInfo.searchcontent : ''
      let status = this.status.split('_')[1]

      let data = {
        userId: userId,
        type: this.schemeType,
        status: status,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        name: name,
        solutionId: solutionId
      }

      let schemesData = await this.doGetMySchemes(data)
      this.messageInfo.onLineCount = schemesData.list[0].onLineCount
      this.messageInfo.offLineCount = schemesData.list[0].offLineCount
      this.solutionCount = schemesData.list[0].onLineCount + schemesData.list[0].offLineCount
      console.log(this.solutionCount, 'this.solutionCount')
      //let downloadIds = await this.getHasDownloadIds()
      this.total = schemesData.count
      this.isnoData = this.total < 1
      let tempList = schemesData.list
      /*if(downloadIds){
        for(let i =0,len = tempList.length; i<len;i++){
          let current =  tempList[i]
          if(downloadIds.indexOf(current.id) > -1){
            current.download = true
          }
        }
      }*/
      this.schemeList = tempList
    },
    // 据用户查询方案实时上架与下架意见信息
    // searchMessage () {
    //   const self = this
    //   let userInfo = this.$getUserInfo()
    //   let userId = userInfo.user.userId
    //   this.$http.post('/dr-web/solutionMsg/queryMsgByUser', {userId: userId}).then(function (res) {
    //     if (res) {
    //       if (res.code == 1 && res.data) {
    //         self.messageInfo = res.data
    //       }
    //     }
    //     else {
    //       self.$notification.error({
    //         message: '失败',
    //         description: res.msg || '查询方案实时上架与下架意见信息失败'
    //       })
    //     }
    //   }).catch(function (res) {
    //     self.$notification.error({
    //       message: '失败',
    //       description: res.msg || '查询方案实时上架与下架意见信息失败'
    //     })
    //   });
    // },
    // 接口获取我的方案
    doGetMySchemes(data){
      let _this= this
      return new Promise(function(resolve,reject){
        _this.$gLoading.show('正努力加载...')
        schemeApi.getMySchemesByContion(data).then(data => {
          _this.schemeList.splice(0, _this.schemeList.length)
          _this.$gLoading.hide()
          if (data.code === 1) {
            // _this.schemeList = data.data.list
            // _this.total = data.data.count
            // _this.isnoData = _this.total < 1
            resolve(data.data)
          } else {
            _this.$notification.error({
              message: '获取方案失败',
              description: data.msg || '服务异常，请稍后再试！'
            })
            reject()
          }
        })

      })
    },
    //获取本地以下载的方案id集合
    getHasDownloadIds(){
      let qtTag = this.schemeType === 1? global.qtTag.savedProductSolutionNameStr:global.qtTag.savedDNASolutionNameStr
      return getQtDataBytTag(global.qtChannel.cppObject,qtTag)
    },
    // 点击分页时
    onPagesizeChange (page) {
      this.pageNo = page
      this.getMySchemesByContion()
    },
    tabClick (key) {
      this.pageNo = 1
      this.status = key 
      this.searchInfo.searchcontent = '' // 重置搜索关键字
      this.getMySchemesByContion()
    },
    // 展示方案详情
    onShowSchemeDetailModel (id) {
      this.$refs.schemeDetailModal.getSchemeDetail(id).then(() => {
        this.detailModalVisible = true
      }).catch(() => {
        
      })
    },
    // 关闭方案详情
    onCancelSchemeDetailModal () {
      this.detailModalVisible = false
    },
    //展示进程详情
    onShowSchemeProcessModel(betaSolutionId){
      this.$refs.schemeProcessModal.getProcessInfo(betaSolutionId).then(() => {
        this.processModalVisible = true
      }).catch(() => {
        
      })
    },
    //关闭展示进程详情
    onCancleSchemeProcessModal(){
      this.processModalVisible = false
    },
    onDrSearchChange () {
      this.pageNo = 1
      this.getMySchemesByContion()
    },
    //复制、删除方案后，刷新列表
    onRefreshSchemeList(){
      this.pageNo = 1
      this.searchInfo.selectedkey = '1'
      this.searchInfo.searchcontent = ''
      this.getMySchemesByContion()
    },
    calcWidthOnSizeChange(){
      this.wrapWidth = calcWidth(252,58)
      // this.schemeListWh = this.wrapWidth  + 58
    }
  }
}
</script>
<style lang="less" scoped>
.message-icon-wrap{
  position: absolute;
  // bottom: 0;
  // right: 0;
  z-index: 1;
}
.mySchemeWrap{
  margin: auto;
  position:relative;
}
.subTitle{
  text-align: left;
  color: #5C5C5C;
  font-size: 20px;
  line-height: 28px;
}
.schemetab {
  min-height: calc(100vh - 220px);
  .scheme-list {
    display: flex;
    width: calc(100% + 58px);
    margin-top: 30px;
    flex-flow: row wrap;
    justify-content: flex-start;
    .scheme-wrapper {
      flex: none;
      margin-right: 58px;
    }
  }
}
.noscheme {
  margin-top: 80px;
}
.topSearch {
  position: absolute;
  top: 34px;
  right: 0;
}
.noData{
  margin-top: 80px;
}
</style>
