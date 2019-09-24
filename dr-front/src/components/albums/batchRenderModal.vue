<!--批量渲染Modal-->
<template>
  <div>
    <a-modal
      :visible="visible"
      title="批量渲染任务数"
      width="600px"
      class="container"
      @ok="confirmRender"
      @cancel="cancelModal"
    >
      <div>
        <div>
          <div
            v-for="(item,index) in allRoomeAlbumsList"
            v-show="(item.roomName!=='厨房') && (item.roomName!=='主卫') && (item.roomName!=='主阳台')"
            :key="'roome'+index"
            class="eachRow"
          >
            <div class="col1">
              {{ item.roomName }}
            </div>
            <div class="imgCount">
              {{ item.taskCount }}条
            </div>
          </div>
          <div class="eachRow">
            <div class="col1">
              总任务数
            </div>
            <div
              class="imgCount"
              style="color: #586287"
            >
              {{ totalCount }}条
            </div>
          </div>
          <div class="eachRow">
            <div class="col1">
              分辨率
            </div>
            <div>
              <a-select
                v-model="submitForm.quality"
                class="top-dna-select mr-20"
              >
                <a-select-option
                  v-for="q in qualityList"
                  :key="q.code"
                  :value="q.code"
                >
                  {{ q.name }}
                </a-select-option>
              </a-select>
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
        <div class="t1">
          有未完成的渲染任务，请确认是否提交？
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  'name': 'BatchRenderModal',
  components: {},
  props: {
    /*allRoomeAlbumsList: {  //空间图册信息
      type: Array,
      default: function () {
        return []
      }
    },*/
    cancelRender:{  //取消渲染
      type: Function,
      default: function () {
      }
    },
    solutionId:{  //方案Id
      type: Number,
      default: function () {
        return 0
      },
      require: true
    },
    roomId:{ //方案Id
      type: String,
      default:function(){
        return ''
      },
      require: true
    },
    refreshList:{
      type: Function,
      default: function () {
      }
    }
  },
  data() {
    return {
      visible: true,
      totalCount:0,
      qualityList:[{code:3,name:'2K渲染'},{code:4,name:'4K渲染'}], //分辨率数据字典
      priorityList:[{code:11,name:'最高'},{code:12,name:'较高'},{code:13,name:'高'},{code:14,name:'中'},{code:15,name:'低'}],
      submitForm:{
        createType:3,//任务发起类型 1：自动 2：手动 3:客户端
        priority:15,  //批量渲染任务优先级（11：最高、12：较高、13：高、14：中、15：低）
        quality:3   //效果图清晰度 1：720P，2：1080P，3：2k，4：4k
      },
      allRoomeAlbumsList:[]
    }
  },
  created() {
    console.log(this.roomId, '999')
    //初始化渲染信息
    this.initRenderInfo()

  },
  mounted() {
  },
  methods: {
    //初始化渲染信息
    initRenderInfo() {
      //获取批量渲染任务数量
      this.getTaskNum()
    },
    //批量渲染货物任务数
    getTaskNum(){
      const self=this
      self.totalCount=0
      self.$gLoading.show('获取批量任务数..')
      this.$http.post('/dr-web/render/countBatchRenderTaskNum',{roomId:null,solutionId:self.solutionId}).then(function(res){
        self.$gLoading.hide()
        if(res.success) {
          self.allRoomeAlbumsList=res.data && res.data.roomList ? res.data.roomList:[]
          // self.totalCount=0
          self.allRoomeAlbumsList.map(item=>{
            if(item.roomName!=='厨房' && item.roomName!=='主卫' && item.roomName!=='主阳台'){
              self.totalCount += Number(item.taskCount)
            }
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
    //取消批量渲染
    cancelModal(){
      this.cancelRender()
    },
    //确认渲染
    confirmRender(){
      const self=this
      let totalCount = 0
      self.allRoomeAlbumsList.map(item=>{
        if(item.roomName!=='厨房' && item.roomName!=='主卫' && item.roomName!=='主阳台'){
          totalCount+=item.taskCount
        }
      })
      self.$gLoading.show('正在渲染..')
      const param={
        ...self.submitForm,
        usgeID: 0,
        usgeName: 'all',
        solutionId:self.solutionId,
        renderTaskType: self.submitForm.quality == 4 ? 2 : 1, // 1代表2k 2代表4k
        gradeIndex: totalCount, // 批量的个数
        isBatchRender: true // 是否是批量的
      }
      // 传参给ue4统计
      let paramString = {
        usgeID: 0,
        usgeName: 'all',
        solutionId:self.solutionId,
        renderTaskType: self.submitForm.quality == 4 ? 2 : 1, // 1代表2k 2代表4k
        gradeIndex: totalCount, // 批量的个数
        isBatchRender: true // 是否是批量的
      }
      paramString = JSON.stringify(paramString)
      this.$http.post('/dr-web/render/autoCreateBatchRenderTask',param).then(function(res){
        if(res.success) {
          // eslint-disable-next-line
          ue.webalbum.render2Dstarttask(paramString)
          console.log('paramString') 
          setTimeout(() => {
            self.$gLoading.hide()
            //取消弹出框
            self.cancelModal()
            self.$notification.success({
              message: '成功',
              description: res.msg || '一键渲染成功！'
            })
            //刷新列表
            self.refreshList()
          }, 5000)
        } else {
          self.$gLoading.hide()
          self.$notification.error({
            message: '失败',
            description: res.msg || '一键渲染失败！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        self.$notification.error({
          message: '失败',
          description: res.msg || '一键渲染失败！'
        })
      })
    }
  }
}
</script>
<style lang="less">
  .container {
    .eachRow {
      display: flex;
      height: 34px;
      .col1 {
        color: #8D8D8D;
        font-size:14px;
        font-weight:400;
        width: 80px;
        margin-right: 20px;
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
