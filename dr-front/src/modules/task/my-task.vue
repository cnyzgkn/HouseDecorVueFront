<template>
  <div
    class="mytask"
    :style="{width:wrapWidth + 'px'}"
  >
    <dr-tabs
      v-model="activetab"
      @tabClick="tabClick"
    >
      <a-tab-pane
        v-for="tab in tabs"
        :key="tab.status"
        :tab="tab.name"
      >
        <div
          v-if="taskList.list && taskList.list.length >0 "
          class="mytaskList"
        >
          <div class="sortline">
            <!-- <div class="sort">
              排序顺序
              <a-icon
                v-if="searchTaskParam.sortRule==0"
                type="sort-ascending"
                class="sortIcon"
                @click="searchList({sortRule:1})"
              />
              <a-icon
                v-if="searchTaskParam.sortRule==1"
                type="sort-descending"
                class="sortIcon"
                @click="searchList({sortRule:0})"
              />
            </div> -->
            <div
              :class="searchTaskParam.orderColumn === 3?'activesort':'sort'"
              @click="searchList({orderColumn:3,sortRule:searchTaskParam.sortRule === 0 ? 1:0})"
            >
              任务时间
              <a-icon
                v-show="taskSortIconShow"
                :type="taskSortIconType"
              />
            </div>
            <div
              :class="searchTaskParam.orderColumn === 2?'activesort':'sort'"
              @click="searchList({orderColumn:2,sortRule:searchTaskParam.sortRule === 0 ? 1:0})"
            >
              交房时间
              <a-icon
                v-show="handSortIconShow"
                :type="handSortIconType"
              />
            </div>
          </div>
          <div class="taskContainer">
            <div
              v-for="(task,index) in taskList.list"
              :key="index"
            >
              <task-card
                v-if="taskList && taskList.list"
                class="card"
                :task-info="task"
                :refresh-list="searchTaskList"
              />
            </div>
          </div>
        </div>
        <div
          v-if="$ifEmpty(taskList.list) || taskList.list.length ==0"
          class="nodata"
        >
          <dr-nodata v-if="showNodata" />
        </div>
      </a-tab-pane>
    </dr-tabs>
    <!--分页-->
    <dr-pagination
      v-model="searchTaskParam.pageNo"
      :page-size="searchTaskParam.pageSize"
      simple
      :total="total"
      @change="onPagesizeChange"
    />
    <div class="topSearch">
      <dr-select
        v-model="searchInfo"
        :dr-select-arr="drSelectArr"
        @drSearch="search"
      />
    </div>
  </div>
</template>

<script>
import DrTabs from '@/components/base/dr-tabs'
import DrSelect from '@/components/base/dr-select'
import { getUserInfo } from '@/common/utils/baseFunc.js'
import TaskCard from '@/components/task/taskCard'
import DrPagination from '@/components/base/dr-pagination.vue'
import DrNodata  from '@/components/base/dr-nodata'
import { calcWidth } from '@/common/utils/baseMethods.js'
import debounce from 'lodash/debounce'
export default {
  'name': 'MyTask',
  components: {
    DrNodata,
    DrTabs,
    DrSelect,
    TaskCard,
    DrPagination
  },
  data () {
    return {
      activetab: '0',
      tabs: [
        {
          status: '0',
          name: '全部任务'
        },
        {
          status: '1',
          name: '新任务'
        },
        {
          status: '2',
          name: '设计中'
        },
        {
          status: '3',
          name: '审核中'
        },
        {
          status: '4',
          name: '不通过'
        },
        {
          status: '5',
          name: '已完成'
        }
      ],
      drSelectArr: [{ key: '1', name: '客户姓名' }],
      userInfo: getUserInfo(),
      searchInfo: {
        selectedkey: '1',
        searchcontent: ''
      },
      searchTaskParam: {
        customerName:'', //客户姓名
        designerId: '', // 方案设计师id
        orderColumn: 3, // 排序字段，1:任务编号 2：交房时间 3:接收任务时间
        pageNo: 1,
        pageSize: 10,
        sortRule: 1, // 排序方式，0:升序 1:降序
        status: 0// 方案设计任务状态 0:全部任务,1:新任务,2:设计中,3:已提交审核,4:审核未通过,5:已完成,6:设计师驳回
      },
      taskList: {},
      total: 0,
      taskSortIconType:'',//任务排序icon类型：降序 or 生序
      taskSortIconShow:true,//是否隐藏任务排序icon
      handSortIconType:'',//交房排序icon类型：降序 or 生序
      handSortIconShow:false,//是否隐藏交房排序icon
      showNodata:false,
      wrapWidth:0 //根据卡片宽度计算的容器宽度，用于居中显示
    }
  },
  watch:{
    searchTaskParam:{
      deep: true,
      immediate: true,
      handler:function(val){
        if(val.orderColumn === 3){
          this.handSortIconShow = false
          this.taskSortIconShow = true
          if(val.sortRule === 0){ //升序
            this.taskSortIconType = 'sort-descending'
          }else{ //降序
            this.taskSortIconType = 'sort-ascending'
          }
        }else if(val.orderColumn === 2){
          this.taskSortIconShow = false
          this.handSortIconShow = true
          if(val.sortRule === 0){ //升序
            this.handSortIconType = 'sort-descending'
          }else{ //降序
            this.handSortIconType = 'sort-ascending'
          }
        }
      }
    }
  },
  created(){
    this.wrapWidth = calcWidth(307,30)
    this.calcWidthOnSizeChange = debounce(this.calcWidthOnSizeChange,500)
  },
  mounted () {
    // 检索设计任务
    this.searchTaskList()
    //监听窗口大小变化
    window.addEventListener('resize',this.calcWidthOnSizeChange)
  },
  beforeDestroy(){
    window.removeEventListener('resize',this.calcWidthOnSizeChange)
  },
  methods: {
    /**
     * tab click事件
     */
    tabClick (key) {
      this.searchTaskParam.status = key
      this.searchTaskParam.pageNo = 1
      this.searchTaskParam.orderColumn = 3 //重置为按任务时间排序
      this.searchTaskParam.sortRule = 1 //重置为按任务时间降序排序
      this.searchInfo.selectedkey = '1'
      this.searchInfo.searchcontent = ''
      this.search()
    },
    /**
     * 设计任务检索
     */
    searchTaskList () {
      const self = this
      self.showNodata=false
      self.taskList = []
      self.total = 0
      this.$gLoading.show()
      this.$http.post('/dr-web/solutionDesignTask/queryDesignTasksByPage', { ...this.searchTaskParam, designerId: this.userInfo.user.userId }).then(function (res) {
        self.$gLoading.hide()
        if (res.code == 1) {
          self.taskList = res.data
          self.total = self.taskList && self.taskList.count ? self.taskList.count : 0
          self.showNodata=true
        }else {
          self.taskList = []
          self.showNodata=true
          self.$notification.error({
            message: '失败',
            description: res.msg || '查询任务失败，请稍后再试！'
          })
        }
      })
    },
    /**
     * 集联检索
     * @param searchparam
     */
    search () {
      this.searchTaskParam = { ...this.searchTaskParam, customerName:this.searchInfo.searchcontent, pageNo: 1 }
      this.searchTaskList()
    },
    /**
     * 列表查询条件检索
     * @param searchparam
     */
    searchList (searchparam) {
      this.searchTaskParam = { ...this.searchTaskParam, pageNo: 1,  ...searchparam }
      this.searchTaskList()
    },
    /**
     * 分页
     */
    onPagesizeChange (page) {
      this.searchTaskParam.pageNo = page
      this.searchTaskList()
    },
    calcWidthOnSizeChange(){
      this.wrapWidth = calcWidth(307,30)
    }
  }
}
</script>
<style lang="less">
  .mytask {
    margin: auto;
    position: relative;
    .topSearch {
      position: absolute;
      top: -3px;
      right: 0;
    }
    .mytaskList {
      min-height: calc( 100vh - 220px );
      width: calc(100% + 32px);
      .sortline {
        height: 72px;
        line-height: 60px;
        display: flex;
        font-size:12px;
        font-weight:400;
        color:#8D8D8D;
        .sort {
          padding-right: 46px;
          cursor: pointer;
        }
        .activesort {
          cursor: pointer;
          padding-right: 46px;
          font-size:12px;
          font-weight:600;
          color: #586287;
        }
      }
      .taskContainer {
        display: -webkit-flex;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        align-content: center;
        margin-bottom: 42px;
        margin: 0 auto;
        width: 100%;
        .card {
          margin-right: 30px;
          margin-bottom: 30px;
        }
      }

    }
    .nodata {
      margin-top: 80px;
    }
  }
</style>
