<template>
  <div
    class="myproject"
    :style="{width:wrapWidth + 'px'}"
  >
    <div class="header">
      <div class="select">
        <a-select
          v-model="searchParam.companyId"
          class="dr-select"
          :dropdown-match-select-width="false"
          @change="filterbuildingbyCompany"
        >
          <a-select-option value="0">
            全部公司
          </a-select-option>
          <a-select-option
            v-for="company in allcompanyList"
            :key="company.companyCode"
            :value="company.companyCode"
          >
            {{ company.companyName }}
          </a-select-option>
        </a-select>
        <a-select
          v-model="searchParam.buildingId"
          class="dr-select"
          :dropdown-match-select-width="false"
          @change="searchListByBuilding"
        >
          <a-select-option value="0">
            全部楼盘
          </a-select-option>
          <a-select-option
            v-for="building in filterbulidingList"
            :key="building.buildingId"
            :value="building.buildingId"
          >
            {{ building.buildingName }}
          </a-select-option>
        </a-select>
      </div>
      <dr-select
        v-model="searchInfo"
        :dr-select-arr="drSelectArr"
        @drSearch="search"
      />
    </div>
    <div
      v-if="$ifEmpty(projectList) || projectList.length ==0"
      class="nodata"
    >
      <dr-nodata />
    </div>
    <div
      v-if="!$ifEmpty(projectList) && projectList.length >0"
      class="projectList"
    >
      <project-card
        v-for="project in projectList"
        :key="project.houseId"
        class="eachItem"
        :project-info="project"
      />
    </div>
    <dr-pagination
      v-model="searchParam.pageNo"
      simple
      :page-size="searchParam.pageSize"
      :total="total"
      @change="onPagesizeChange"
    />
  </div>
</template>
<script>
import DrSelect from '@/components/base/dr-select'
import ProjectCard from '@/components/project/projectCard'
import DrPagination from '@/components/base/dr-pagination.vue'
import DrNodata  from '@/components/base/dr-nodata'
/*import { getQtDataBytTag } from '@/common/utils/baseMethods.js'*/
import { calcWidth } from '@/common/utils/baseMethods.js'
import debounce from 'lodash/debounce'
export default {
  'name': 'ProjectHousehold',
  components: { DrSelect, ProjectCard, DrPagination,DrNodata },
  data () {
    return {
      searchParam: {
        'buildingId': '0', // 楼盘Id
        'buildingName': null,
        'cityName': null,
        'companyId': '0', // 所属公司Id
        'housingId': null,
        'housingName': null, // 户型名称
        'orderBy': null,
        'pageNo': 1,
        'pageSize': 10,
        'province': null,
        'startIndex': 0
      },
      allcompanyList: [], // 所有公司数据字典
      filterbulidingList: [], // 根据公司筛选的楼盘信息
      allbuildingList: [], // 全部楼盘数据字典
      searchInfo: {
        selectedkey: '1',
        searchcontent: ''
      },
      drSelectArr: [{ key: '1', name: '户型名称' },{ key: '2', name: '户型ID' }],
      projectList: [],
      total: 0,// 总数
      wrapWidth:0 //根据卡片宽度计算的容器宽度，用于居中显示
    }
  },
  created(){
    this.wrapWidth = calcWidth(252,58)
    this.calcWidthOnSizeChange = debounce(this.calcWidthOnSizeChange,500)
    //监听窗口大小变化
    window.addEventListener('resize',this.calcWidthOnSizeChange)
  },
  beforeDestroy(){
    window.removeEventListener('resize',this.calcWidthOnSizeChange)
  },
  mounted () {
    // 获取项目户型列表
    this.getProjectList()
    // 获取全部公司数据字典
    this.getAllCompanyList()
    // 获取全部楼盘数据字典
    this.getAllhoseList()
  },
  methods: {
    /**
     * 获取项目户型列表
     */
    async getProjectList () {
      let data = await this.doGetProjectList()
      /*let downloadIds = await getQtDataBytTag(global.qtChannel.cppObject,global.qtTag.savedHouse1NameStr)
      if(downloadIds){
        for(let i =0,len = data.list.length; i<len;i++){
          let current =  data.list[i]
          if(downloadIds.indexOf(current.houseId) > -1){
            current.download = true
          }
        }
      }*/
      this.total = data.count
      this.projectList = data.list
    },
    doGetProjectList(){
      const self = this
      let userInfo = this.$getUserInfo()
      this.$gLoading.show('正努力加载...')
      return new Promise(function(resolve,reject){
        self.$http.post('/dr-web/house/queryHouseByCondition', { ...self.searchParam,addUserId: userInfo.user.userId }).then(function (res) {
          self.$gLoading.hide()
          if (res.code === 1) {
            resolve(res.data)
          }else{
            self.$notification.error({
              message: '失败',
              description: res.msg || '获取项目户型列表失败，请稍后再试！'
            })
          }
        })
      })
    },
    /**
     * 分页
     */
    onPagesizeChange (page) {
      this.searchParam.pageNo = page
      this.getProjectList()
    },
    /**
     * 获取全部公司数据字典
     */
    getAllCompanyList () {
      const self = this
      this.$http.post('/dr-web/house/queryCompany', {}).then(function (res) {
        if (res) {
          if (res.code == 1) {
            self.allcompanyList = res.data && res.data.length > 0 ? res.data : []
          }
        } else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '获取公司信息列表失败，请稍后再试！'
          })
        }
      }).catch(function (res) {
        self.$notification.error({
          message: '失败',
          description: res.msg || '获取公司信息列表失败，请稍后再试！'
        })
      })
    },
    /***
     * 获取全部楼盘数据字典
     */
    getAllhoseList () {
      const self = this
      const param = {
        'buildingId': 0,
        'companyCode': 0,
        'companyId': 0
      }
      this.$http.post('/dr-web/house/queryBuildingList', param).then(function (res) {
        if (res) {
          if (res.code == 1) {
            self.allbuildingList = res.data && res.data.length > 0 ? res.data : []
            self.filterbulidingList = res.data
          }
        } else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '获取全部楼盘列表信息失败，请稍后再试！'
          })
        }
      }).catch(function (res) {
        self.$notification.error({
          message: '失败',
          description: res.msg || '获取全部楼盘列表信息失败，请稍后再试！'
        })
      })
    },
    /**
     * search,集联选择检索
     */
    search () {
      let param={}
      if(this.searchInfo.selectedkey==='1'){
        const housingName = this.searchInfo.searchcontent
        param = {housingName, pageNo: 1 ,housingId:null}
      }
      if(this.searchInfo.selectedkey==='2'){
        const housingId = this.searchInfo.searchcontent
        param = {housingId, pageNo: 1 ,housingName:null}
      }
      this.searchParam = { ...this.searchParam, ...param }
      this.getProjectList()
    },
    /**
     * 根据楼盘Id检索数据
     */
    searchListByBuilding (buildingId) {
      const param = { buildingId, pageNo: 1 }
      this.searchParam = { ...this.searchParam, ...param }
      this.getProjectList()
    },
    /***
     * 根据公司筛选全部户型
     * 户型列表筛选
     */
    filterbuildingbyCompany (companyId) {
      const buildingId = '0'
      if(companyId=='0'){
        this.filterbulidingList=this.allbuildingList
      }
      else {
        this.filterbulidingList = this.allbuildingList.filter(item => item.companyCode == companyId)
      }
      const param = { buildingId, pageNo: 1 }
      this.searchParam = { ...this.searchParam, ...param }
      this.getProjectList()
    },
    calcWidthOnSizeChange(){
      this.wrapWidth = calcWidth(252,58)
    }
  }
}
</script>
<style lang="less">
  .myproject {
    margin: auto;
    position: relative;
    .header {
      display: -webkit-flex;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      height: 68px;
      position: relative;
      .select {
        float: left;
        position: absolute;
        left: 0px;
        .dr-select {
          margin-right: 20px;
          .ant-select-selection--single {
            border:none !important;
          }
        }
      }
    }
    .projectList {
      min-height: calc(100vh - 220px);
      width: calc(100% + 58px);
      display: -webkit-flex;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      align-content: flex-start;
      .eachItem {
        margin-right: 58px;
        margin-bottom: 40px;

      }
    }
    .nodata{
      margin: 80px auto 0;
    }
  }

</style>
