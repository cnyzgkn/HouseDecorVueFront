<template>
  <div
    class="top-dna"
    :style="{width:wrapWidth + 'px'}"
  >
    <!--搜索条件-->
    <div>
      <a-select
        v-model="search.styleId"
        class="top-dna-select mr-20"
        @change="handleStyeChange"
      >
        <a-select-option
          v-for="style in styles"
          :key="style.styleId"
          :value="style.styleId"
        >
          {{ style.styleName }}
        </a-select-option>
      </a-select>
      <a-select
        v-model="search.serieId"
        class="top-dna-select"
        @change="handleSerieChange"
      >
        <a-select-option
          v-for="serie in series"
          :key="serie.id"
          :value="serie.id"
        >
          {{ serie.name }}
        </a-select-option>
      </a-select>
      <dr-select
        v-model="search.searchInfo"
        :dr-select-arr="searchOption"
        @drSearch="onDrSearchChange"
      />
      <a-button
        class="fr"
        type="primary"
        @click="onNew"
      >
        <a-icon type="plus" />新建DNA
      </a-button>
    </div>
    <!--卡片展示-->
    <div class="tablist">
      <div class="scheme-list">
        <template v-for="scheme in schemeList">
          <dr-scheme
            :key="scheme.id"
            :scheme-info="scheme"
            scheme-module="TOP"
            @showSchemeDetailModel="onShowSchemeDetailModel"
          />
        </template>
        <dr-nodata
          v-show="isnoData"
          class="nodata"
        />
      </div>
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
    <!--方案详情-->
    <scheme-detail-modal
      ref="schemeDetailModal"
      :visible="detailModalVisible"
      @cancel="onCancelSchemeDetailModal"
    />
    <a-modal
      :visible="showchooseType"
      title="请选择DNA的户型类型"
      :destroy-on-close="true"
      :width="720"
      centered
      @cancel="cancelChoose"
      @ok="onNewSubmit"
    >
      <div>
        <a-radio-group
          v-model="DNAHouseType"
        >
          <a-radio
            :style="radioStyle"
            :value="1"
          >
            标准户型
          </a-radio>
          <a-radio
            :style="radioStyle"
            :value="2"
          >
            小户型
          </a-radio>
        </a-radio-group>
        <div
          v-if="showErrorMessage"
          class="errorMsg"
        >
          请先选择户型类型
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getHouseStyle, getHouseSeries } from '@/common/base.api.js'
import DrScheme from '@/components/scheme/scheme.vue'
import DrSelect from '@/components/base/dr-select'
import DrPagination from '@/components/base/dr-pagination.vue'
import SchemeDetailModal from '@/components/scheme/scheme-detail-modal.vue'
import  DrNodata from '@/components/base/dr-nodata.vue'
import * as topDnaApi from './top-dna.api.js'
import { getQtDataBytTag,calcWidth,execQtFuncByChannel } from '@/common/utils/baseMethods.js'
import debounce from 'lodash/debounce'
import global from '@/common/config/global.js'

export default {
  'name': 'TopDnaScheme',
  components: { DrScheme, DrSelect, DrPagination, SchemeDetailModal, DrNodata },
  data () {
    return {
      schemeList: [], // 方案列表
      styles: [], // 风格
      series: [], // 系列
      pageNo: 1, // 当前分页
      total: 0, // 总页数
      pageSize: 18, // 分页大小
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
      search: { // 搜索信息
        searchInfo: {
          selectedkey: '1',
          searchcontent: ''
        },
        styleId: 0,
        serieId: 0
      },
      detailModalVisible: false, // 是否展示方案详情
      isnoData: false,// 是否展示无数据图文
      showchooseType:false,
      DNAHouseType:null,
      radioStyle: {
        display: 'block',
        height: '40px',
        lineHeight: '40px',
      },
      showErrorMessage:false,
      wrapWidth:0 //根据卡片宽度计算的容器宽度，用于居中显示
    }
  },
  created () {
    this.wrapWidth = calcWidth(252,58)


    this.getDnasByContions()
    this.getStyles()
    this.getSeries()
    
    this.calcWidthOnSizeChange = debounce(this.calcWidthOnSizeChange,500)
    //监听窗口大小变化
    window.addEventListener('resize',this.calcWidthOnSizeChange)
  },
  beforeDestroy(){
    window.removeEventListener('resize',this.calcWidthOnSizeChange)
  },
  methods: {
    // 点击分页时
    onPagesizeChange (page) {
      this.pageNo = page
      this.getDnasByContions()
    },
    // 根据搜索条件搜索dna方案
    async getDnasByContions () {
      let solutionId
      if (this.search.searchInfo.selectedkey === '2') {
        if (isNaN(Number(this.search.searchInfo.searchcontent))) {
          this.$message.error('方案id必须为数字！')
          return
        } else {
          solutionId = this.search.searchInfo.searchcontent === '' ? undefined : Number(this.search.searchInfo.searchcontent)
        }
      }
      let styleId = this.search.styleId
      let serieId = this.search.serieId
      let name = this.search.searchInfo.selectedkey === '1' ? this.search.searchInfo.searchcontent : ''

      let data1 = await this.doGetDnaSchemes(styleId,serieId,name,this.pageNo,this.pageSize,solutionId)
      let data2 = await getQtDataBytTag(global.qtChannel.cppObject,global.qtTag.savedDNASolutionNameStr)

      this.total = data1.count
      this.isnoData = this.total < 1
      let tempList = data1.list
      if(data2){
        for(let i =0,len = tempList.length; i<len;i++){
          let current =  tempList[i]
          if(data2.indexOf(current.id) > -1){
            current.download = true
          }
        }
      }
      this.schemeList = tempList
      // let _this = this
      // Promise.all([p1,p2]).then( (vaules) => {
      //   for(let i =0,len = _this.schemeList.length; i<len;i++){
      //     let current =  _this.schemeList[i]
      //     if(vaules[1].indexOf(current.id) > -1){
      //       current.download = true
      //     }
      //   }
      // })
    },
    //掉用接口获取dna方案列表
    doGetDnaSchemes(styleId,serieId,name,pageNo,pageSize,solutionId){
      let _this = this
      return new Promise(function(resolve,reject){
        _this.$gLoading.show('正努力加载中...')
        topDnaApi.getDnaByContions(styleId, serieId, name, pageNo, pageSize, solutionId).then(data => {
          _this.$gLoading.hide()
          _this.schemeList.splice(0, _this.schemeList.length)
          if (data.code === 1) {
            // _this.schemeList = data.data.list
            // _this.total = data.data.count
            // _this.isnoData = _this.total < 1
            resolve(data.data)
          } else {
            _this.$notification.error({
              message: '获取方案失败',
              description: data.msg || '服务器异常，请稍后再试！'
            })
            reject()
          }
        })
      })
    },
    // 获取风格
    getStyles () {
      getHouseStyle().then(data => {
        if (data.code === 1) {
          data.data.unshift({
            styleId: 0,
            styleName: '全部风格'
          })
          this.styles = data.data
        } else {
          this.$notification.error({
            message: '获取风格失败',
            description: data.msg || '服务器异常，请稍后再试！'
          })
        }
      })
    },
    // 获取系列
    getSeries () {
      getHouseSeries().then(data => {
        if (data.code === 1) {
          data.data.unshift({
            id: 0,
            name: '全部系列'
          })
          this.series = data.data
        } else {
          this.$notification.error({
            message: '获取系列失败',
            description: data.msg || '服务器异常，请稍后再试！'
          })
        }
      })
    },
    // 选择样式时
    handleStyeChange (key) {
      this.search.styleId = key
      this.pageNo = 1
      this.getDnasByContions()
    },
    // 选择系列时
    handleSerieChange (key) {
      this.search.serieId = key
      this.pageNo = 1
      this.getDnasByContions()
    },
    // 极联搜索条件变化时
    onDrSearchChange () {
      this.pageNo = 1
      this.getDnasByContions()
    },
    // 展示方案详情
    onShowSchemeDetailModel (id) {
      this.$refs.schemeDetailModal.getSchemeDetail(id).then(() => {
        this.detailModalVisible = true
      })
    },
    onCancelSchemeDetailModal () {
      this.detailModalVisible = false
    },
    // 新建dna
    onNew () {
      this.DNAHouseType =null
      this.showchooseType = true
    },
    onNewSubmit(){
      const self=this
      if(this.DNAHouseType == null ||this.DNAHouseType==''||this.DNAHouseType==undefined){
        self.showErrorMessage=true
      }
      else {
        self.showErrorMessage = false
        self.showchooseType = false
        // eslint-disable-next-line
        setTimeout(() => {
          let data = {
            NewDNA: 0,
            DNAHouseType: self.DNAHouseType
          }
          execQtFuncByChannel(global.qtChannel.main,'onOpenSolution',data)
        }, 1000)
      }
    },
    //取消选择
    cancelChoose(){
      this.showchooseType=false
    },
    calcWidthOnSizeChange(){
      this.wrapWidth = calcWidth(252,58)
    }
  }
}
</script>
<style lang="less" scoped>
.top-dna{
  margin: auto;
}
.top-dna-select {
  width: 120px;
  font-size: 12px;
  float: left;
  /deep/.ant-select-selection--single {
    border:none;
  }
}
.tablist {
  min-height: calc(100vh - 220px);
  width: calc(100% + 58px);
  .scheme-list {
    display: flex;
    margin-top: 30px;
    flex-flow: row wrap;
    justify-content: flex-start;
    width: calc(100% + 58px);
  }
}
.scheme-wrapper{
  flex: none;
  margin-right: 58px;
}
.mr-20{
  margin-right:20px;
}
.fr{
  float: right;
}
.drselect{
  display:  inline-block;
  vertical-align: middle;
}
.nodata{
  margin-top: 80px;
}
.errorMsg {
    color: #E96C2E;
    font-size: 12px;
  margin-top: 10px;
  }
</style>
