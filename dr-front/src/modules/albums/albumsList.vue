<template>
  <div class="pictureContainer">
    <div class="operationcontent">
      <div v-if="roomTabs && roomTabs.length>0">
        <a-button
          v-if="activekey=='2'"
          class="operationBtn"
          :disabled="ifBtnDisabled"
          @click="copySimpleTaskView"
        >
          复制视角
        </a-button>
        <a-button
          v-if="activekey=='2'"
          class="operationBtn"
          :disabled="ifBtnDisabled"
          @click="onBatchRender"
        >
          一键渲染
        </a-button>
        <a-button
          v-if="(activekey=='1' || activekey=='2')&& !editModel"
          class="operationBtn"
          :disabled="solutionStatus==4 && activekey=='1'"
          @click="changeEditModel"
        >
          编辑模式
        </a-button>
        <a-button
          v-if="(activekey=='1'|| activekey=='2') && editModel"
          class="finishBtn"
          type="primary"
          @click="finishEdit"
        >
          <a-icon type="check-circle" />
          编辑完成
        </a-button>
      </div>
    </div>
    <div class="header">
      <div
        class="eachtab"
        :class="{'avtivetab':activekey == '1'}"
        @click="alubmsTabChange(1)"
      >
        单张图册
      </div>
      <div
        v-show="AlbumsJurisdiction.BatchImageAtlas"
        class="eachtab"
        :class="{'avtivetab':activekey == '2'}"
        @click="alubmsTabChange(2)"
      >
        批量图册
      </div>
      <div
        class="eachtab"
        :class="{'avtivetab':activekey == '3'}"
        @click="alubmsTabChange(3)"
      >
        建筑图册
      </div>
      <div
        class="closeIcon"
        @click="closeWebAlbum"
      >
        <a-icon
          type="close"
          class="icon"
        />
      </div>
    </div>
    <div class="roomAlumbsContainer">
      <!-- 单张图册，批量图册容器-->
      <div v-if="(activekey=='1' || activekey=='2')&&(roomTabs && roomTabs.length>0)">
        <dr-tabs
          v-model="activeRoomId"
          @tabClick="roomtabClick"
        >
          <a-tab-pane
            v-for="room in roomTabs"
            :key="room.roomId+''"
            :tab="room.usageName"
          >
            <div
              v-if="(currentRoomAlumb.viewImagesList && currentRoomAlumb.viewImagesList.length>0)"
              class="albumList"
            >
              <AlbumCard
                v-for="(roomAlunm,index) in currentRoomAlumb.viewImagesList"
                v-show="ifshowAlbumCard(roomAlunm.topImage)"
                :key="'room'+index"
                :alubm-info="roomAlunm"
                :solution-status="solutionStatus"
                :show-big-album-modal="()=>showAlbumModal(roomAlunm.viewId,currentRoomAlumb.roomId)"
                :edit-model="editModel"
                :refresh-list="refreshList"
                :solution-id="solutionId"
                :room-name="room.roomName"
                :room-id="room.roomId"
                :activekey="activekey"
                :solution-type="solutionType"
              />
            </div>
            <div
              v-if="!currentRoomAlumb.viewImagesList || currentRoomAlumb.viewImagesList.length==0"
              class="nodata"
            >
              <dr-nodata />
            </div>
          </a-tab-pane>
        </dr-tabs>
      </div>
      <!-- 建筑图册容器-->
      <div v-if="activekey=='3'">
        <dr-tabs
          v-model="activeLayout"
          class="tabBorder"
          @tabClick="layoutChange"
        >
          <a-tab-pane
            v-for="l in layoutTypes"
            :key="l.code+''"
            :tab="l.name"
          >
            <div style="padding-top: 30px">
              <div
                v-for="(item,index) in layoutPlanImageList"
                v-show="index==0"
                :key="'layout_'+index"
              >
                <layout-card
                  :layout-card-info="item"
                  :layout-album-list="layoutPlanImageList"
                  :show-big-layout-modal="showLayoutModal"
                  :type="activeLayout"
                />
              </div>
            </div>
          </a-tab-pane>
        </dr-tabs>
      </div>
      <div
        v-if="(layoutPlanImageList && layoutPlanImageList.length==0) && (activekey=='3')"
        class="nolayoutContainer"
      >
        <div class="noContent">
          <div class="noInfo">
            <img src="../../assets/images/noLayout.png">
            <div class="text">
              图册为空
            </div>
          </div>
          <div
            v-if="activeLayout !='3'"
            class="btnContent"
          >
            <a-button
              v-if="activeLayout=='1'"
              class="button"
              type="primary"
              @click="resetRender"
            >
              生成平面布置图
            </a-button>
            <a-button
              v-if="activeLayout=='2'"
              class="button"
              type="primary"
              @click="resetApartmentChange"
            >
              生成户型拆改图
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <!--单张图册或者批量图册大图相册显示-->
    <album-modal
      v-if="showBigAlubmModal"
      ref="albumModal"
      :activekey="activekey"
      :all-album-list="allRoomeAlbumsList"
      :room-id="currentBigRoomId"
      :view-id="currentBigAlbumId"
      :close="closeBigAlubmModal"
      :refresh-list="refreshByDelete"
      :albums-jurisdiction="AlbumsJurisdiction"
      :solution-id="solutionId"
    />
    <!--批量渲染任务数-->
    <batch-render-modal
      v-if="batchRender"
      :solution-id="solutionId"
      :all-roome-albums-list="allRoomeAlbumsList"
      :cancel-render="cancelRender"
      :refresh-list="refreshList"
      :room-id="activeRoomId"
    />
    <!--建筑图册大图相册显示-->
    <layout-modal
      v-if="showBigLayoutModal"
      :layout-list="layoutPlanImageList"
      :close="closeBigLayoutModal"
      :refresh-list="queryLayoutPlanImage"
      :type="activeLayout"
    />
  </div>
</template>
<script>
import DrTabs from '@/components/base/dr-tabs'
import AlbumCard  from '@/components/albums/albumCard'
import LayoutCard  from '@/components/albums/layoutCard'
import AlbumModal from '@/components/albums/albumModal'
import DrNodata  from '@/components/base/dr-nodata'
import BatchRenderModal from '@/components/albums/batchRenderModal'
import LayoutModal from '@/components/albums/layoutModal'
import { setUserInfo } from '@/common/utils/baseFunc.js'
export default {
  'name': 'albumsList',
  components:{ DrTabs,AlbumCard, AlbumModal,LayoutCard ,DrNodata ,BatchRenderModal , LayoutModal },
  data() {
    return {
      activekey: '1',            //1:单张图册，2:批量图册，3:建筑图册
      solutionId:null,
      roomTabs:[],               //空间tab信息
      activeRoomId:null,         //当前active空间tab
      roomListDist:[],            //所有空间集合数据字典
      allRoomeAlbumsList:[],     //空间图册集合
      currentRoomAlumb:{},      //当前空间下图册信息
      currentBigRoomId:null,     //显示大图册roomId
      currentBigAlbumId:null,    //显示图册Id
      showBigAlubmModal:false,   //显示大图册弹出框
      showBigLayoutModal:false,   //显示建筑图册弹出框
      ifEdit:false,          //是否是
      showStatusList:['enqueue','build_active','build_success','waiting','active','done'],//'enqueue':等待构建 ，'build_active':"构建中', 'build_success':构建成功 ，'waiting'：'等待渲染' ，'active':'渲染中'，'done' :'渲染完成'  //对客列表显示的状态
      solutionStatus:null,       //方案状态
      solutionType:null,        //方案类型
      layoutPlanImageList:null,      //平面布置图集合
      editModel:false,             //当前是否是编辑模式
      batchRender:false,            //批量渲染
      ifBtnDisabled:false,
      ifrefresh:false,               //是否重新渲染当前tab
      /*前端排序........*/
      //1:客厅  2:餐厅 13:第三厅 14:第四厅 3:主卧 4:次卧 5:第三房 6:第四房 7:第五房 15:第六房 16:第七房  22:储藏室 23:第二储藏室
      //24:衣帽间 25:第二衣帽间 10:厨房 17:第二厨房 8:主卫 9:客卫 18:第三卫 19:第四卫 11:主阳台 12:第二阳台 20:第三阳台 21:第四阳台
      roomSortList:[1,2,13,14,3,4,5,6,7,15,16,22,23,24,25,10,17,8,9,18,19,11,12,20,21],
      layoutTypes:[{code:'1',name:'平面布置图'},{code:'2',name:'户型拆改图'},{code:'3',name:'户型原始图'}],       //2:户型拆改图 1 平面布置图
      activeLayout:'1',
      ifdelrefresh:false,
      //图册权限控制
      //BatchRenderSetting：批量渲染权限(无使用)
      //BatchRenderTaskListButton：批量任务权限(无使用)
      //BatchImageAtlas：批量图册权限
      //UpLoadButton：上传按钮权限
      AlbumsJurisdiction:{//图册权限
        'BatchRenderSetting':null,
        'BatchRenderTaskListButton':null,
        'BatchImageAtlas':null,
        'UpLoadButton':null
      },
      currentAllJobs:null,
      housingVersion:0  //户型拆改版本号
    }
  },
  watch:{
    '$store.state.websocket':{
      handler:function(ws){
        if(ws){
          ws.addEventListener('message',(event) => {
            this.getSocketInfo(event.data)
          })
        }
      },
      deep:true
    }
  },
  created(){
    //暴露刷新建筑图册的方法给UE4
    window.getLayoutList=this.queryLayoutPlanImage
  },
  mounted () {
    const self=this
    if(process.env.VUE_APP_ENV === 'LOCAL') {
      const solutionId=self.$route.params.id
      self.solutionId=solutionId
      //获取单张图册列表
      self.alubmsTabChange(1)
      //获取用户权限
      this.queryUserPromission()
      //获取户型拆改版本号
      this.querySolutionHousingVersion()
      //建立socket链接通道，实时获取渲染任务渲染状态
      this.$store.dispatch('OPEN_WEBSOCKET')
    }
    else {
      //获取solutionId
      // eslint-disable-next-line
      ue.webalbum.getsolutionid().then(function (ReturnValue) {
        self.solutionId = ReturnValue
        //设置缓存
        self.setStorageInfo()
        //获取单张图册列表
        self.alubmsTabChange(1)
        //获取户型拆改版本号
        self.querySolutionHousingVersion()
      })
    }
  },
  methods: {
    //qt浏览器打开，缓存消失，重新获取用户信息放进缓存中
    setStorageInfo() {
      const self=this
      // eslint-disable-next-line
      ue.webalbum.getauthorityinfo().then(function (ReturnValue) {
        if(ReturnValue){
          const ue4User = JSON.parse(ReturnValue)
          setUserInfo({
            token:ue4User.token,
            user:{
              userId:ue4User.userId
            }
          })
          // 建立socket链接通道，实时获取渲染任务渲染状态
          self.$store.dispatch('OPEN_WEBSOCKET')
          //获取用户权限
          self.queryUserPromission()
        }
      })
    },
    //根据方案ID获取户型拆改版本号
    querySolutionHousingVersion(){
      const self=this
      this.$http.post('/dr-web/solution/querySolutionHousingVersion', {"solutionId":this.solutionId}).then(function (res) {
        if (res) {
          if(res && res.data  && res.data.housingVersion){
            self.housingVersion=res.data.housingVersion
          }
        }
      })
    },
    queryUserPromission(){
      const self =this
      const userInfo = this.$getUserInfo()
      const searchParam = {userId: userInfo.user.userId}
      this.$http.post('/dr-web/queryDesigner', searchParam).then(function (res) {
        if (res) {
          if (res.code == 1 && res.data) {
            const data=res.data
            if(data.permissions && data.permissions.length>0){
              const permissions=data.permissions
              const mainRenders=permissions.filter(item=>item.category=='UMG_MainRenders')
              const child=mainRenders.length==1?mainRenders[0].child:[]
              child.map(item=>{
                self.AlbumsJurisdiction[item['authorityId']]=item["visibility"]
              })
            }
          }
        }
        else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '查询用户信息失败，请稍后再试！'
          })
        }
      }).catch(function (res) {
        self.$notification.error({
          message: '失败',
          description: res.msg || '查询用户信息失败，请稍后再试！'
        })
      });
    },
    /***
     *
     * @param code
     * code ==1 单张图册
     * code ==2 批量图册
     * code ==3 建筑图册
     * tab图册切换
     */
    alubmsTabChange(code) {
      this.activekey = code
      //获取单张图册
      if (code == 1) {
        this.getSimpleAlbum()
      }
      //获取批量图册
      if (code == 2) {
        this.getBatchTaskAlbum()
      }
      //获取建筑图册
      if (code == 3) {
        this.queryLayoutPlanImage()
      }
      //图册切换的时候切换到非编辑状态
      this.editModel = false
    },
    //获取单张图册列表
    getSimpleAlbum() {
      const self = this
      self.$gLoading.show('正在加载..')
      const param = {solutionId: this.solutionId}
      this.$http.post('/dr-web/render/querySimpleTaskAlbum', param).then(function (res) {
        self.$gLoading.hide()
        if (res.code == 1) {
          if (res && res.data)
            self.getAllRoomeInfo(res.data)
        } else {
          const empty = []
          self.getAllRoomeInfo(empty)
          self.$notification.error({
            message: '失败',
            description: res.msg || '图册信息获取失败！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        const empty = []
        self.getAllRoomeInfo(empty)
        self.$notification.error({
          message: '失败',
          description: res.msg || '图册信息获取失败！'
        })
      })
    },
    //获取批量图册信息
    getBatchTaskAlbum() {
      const self = this
      self.$gLoading.show('正在加载..')
      const param = {solutionId: this.solutionId}
      this.$http.post('/dr-web/render/queryBatchTaskAlbum', param).then(function (res) {
        self.$gLoading.hide()

        if (res.code == 1) {
          if (res && res.data)
            self.getAllRoomeInfo(res.data)
        } else {
          const empty = []
          self.getAllRoomeInfo(empty)
          self.$notification.error({
            message: '失败',
            description: res.msg || '图册信息获取失败！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        const empty = []
        self.getAllRoomeInfo(empty)
        self.$notification.error({
          message: '失败',
          description: res.msg || '图册信息获取失败！'
        })
      })
    },
    //获取建筑图册
    queryLayoutPlanImage() {
      const self = this
      self.layoutPlanImageList = []
      self.$gLoading.show('正在加载..')
      const params = {
        "orderBy": "",
        "pageNo": 1,
        "pageSize": 1000,
        "solutionId": this.solutionId,
        "startIndex": 1,
        "type":this.activeLayout,
        "source":1
      }
      if(params.type==2){
        params.housingVersion=self.housingVersion
      }
      this.$http.post('/dr-web/solution/queryLayoutPlanImage', params).then(function (res) {
        self.$gLoading.hide()
        if (res.code == 1) {
          if (res && res.data) {
            self.layoutPlanImageList = res.data && res.data.list && res.data.list.length > 0 ? res.data.list : []
            self.$forceUpdate()
          }
        } else {
          const empty = []
          self.getAllRoomeInfo(empty)
          self.$notification.error({
            message: '失败',
            description: res.msg || '图册信息获取失败！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        self.$notification.error({
          message: '失败',
          description: res.msg || '图册信息获取失败！'
        })
      })
    },
    // 获取户型原始图
    queryOneByHouseId() {
      const self = this
      self.layoutPlanImageList = []
      self.$gLoading.show('正在加载..')
      const params = {
        solutionId: this.solutionId
      }
      this.$http.post('/dr-web/houseOriginal/queryOneByHouseId', params).then(function (res) {
        self.$gLoading.hide()
        if (res.code == 1) {
          if (res && res.data) {
            let list = []
            list.push(res.data)
            self.layoutPlanImageList = list && list.length > 0 ? list : []
            self.$forceUpdate()
          }
        } else {
          const empty = []
          self.getAllRoomeInfo(empty)
          self.$notification.error({
            message: '失败',
            description: res.msg || '图册信息获取失败！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        self.$notification.error({
          message: '失败',
          description: res.msg || '图册信息获取失败！'
        })
      })
    },
    //layoutChange
    layoutChange(code){
      this.activeLayout=code
      if (this.activeLayout != 3) {
        this.queryLayoutPlanImage()
      } else {
        this.queryOneByHouseId()
      }
    },
    //获取空间图册信息
    getAllRoomeInfo(data) {
      const self = this
      let roomAlbumList = data.roomAlbumList ? data.roomAlbumList : []
      //获取该方案下所有的空间数组
      this.$http.post('/dr-web/solution/queryRoomListBySolutionId', {solutionId: this.solutionId}).then(function (res) {
        if (res.code == 1) {
          if (res && res.data) {
            self.roomListDist = res.data
            self.solutionStatus = data.solutionStatus
            self.solutionType = data.solutionType
            self.allRoomeAlbumsList=[]
            self.allRoomeAlbumsList = self.changeRoomAlbumList(roomAlbumList, self.roomListDist)
            const roomTabs = []
            self.allRoomeAlbumsList.map((item, index) => {
              const room = {roomId: item.roomId, roomName: item.roomName,usageName:item.usageName}
              roomTabs.push(room)
              if (index == 0 && !self.ifrefresh) {
                self.activeRoomId = item.roomId ? item.roomId.toString() : item.roomId
                self.currentRoomAlumb = item
              } else {
                self.ifrefresh = false
                self.roomtabClick(self.activeRoomId)
              }
            })
            self.roomTabs = roomTabs
            //批量图册一键渲染按钮，复制视角按钮状态控制
            if (self.activekey == 2) {
              //普通方案
              if (self.solutionType == 1) {
                if (self.solutionStatus !== 4) {
                  self.ifBtnDisabled = true
                }
              }
              if (self.solutionType == 2) {
                if (self.solutionStatus !== 1) {
                  self.ifBtnDisabled = true
                }
              }
            }
            if(self.ifdelrefresh){
              self.$refs.albumModal.allAlbumList=self.allRoomeAlbumsList
              self.$refs.albumModal.initModalInfo()
            }
          }
        } else {
          self.roomListDist = []
        }
      })
      //获取方案下的所有jobIds,订阅,用于soctek信息
      this.subscribeJobsInfo(roomAlbumList)
    },
    //获取方案下的所有jobIds,订阅,用于soctek信息
    subscribeJobsInfo(roomAlbumList){
      //获取所有任务号
      const allJobs=[]
      roomAlbumList.map(item=>{
        const viewImagesList=item.viewImagesList ?item.viewImagesList:[]
        viewImagesList.map(v=>{
          const imageList=v.imageList ?v.imageList:[]
          imageList.map(i=>{
            const jobId=i.jobId
            if(jobId!==null && jobId!=='' && jobId!==undefined && i.taskStatus!=='done'){
              allJobs.push(jobId)
            }
          })
        })
      })
      this.currentAllJobs=allJobs
      const userInfo = this.$getUserInfo()
      const userId=userInfo.user.userId
      const baseNotify=process.env.VUE_APP_NOTIFY
      //订阅任务
      this.$http.post(baseNotify+'/dr-notify/dr-client/subscribe', {"uid":userId,"jobIds":allJobs}).then(function (res) {})
    },
    /*根据固定'roomMark'值排序
    当前空间返回值和方案下全量空间返回值对比，缺省空间补充*/
    changeRoomAlbumList(currentRoomList, allRoomList) {
      const roomSortList = this.roomSortList
      //对当前空间排序
      const sortedRoomList = []
      const realRoomList = [] //当前方案下所有空间信息
      roomSortList.map(item => {
        const filterItem = allRoomList.filter(i => i.roomMark == item)
        if (filterItem.length > 0) {
          sortedRoomList.push(filterItem[0])
        }
      })
      sortedRoomList.map(item => {
        const f = currentRoomList.filter(info => info.roomId == item.roomId)
        if (f.length > 0) {
          realRoomList.push(f[0])
        }
      })
      return realRoomList
    },
    //空间切换
    roomtabClick(roomId) {
      this.activeRoomId=roomId
      this.currentRoomAlumb=this.allRoomeAlbumsList.find(item=>item.roomId==roomId)
    },
    //图册预览
    showAlbumModal(viewId, roomId) {
      this.currentBigRoomId = roomId
      this.currentBigAlbumId = viewId
      this.showBigAlubmModal = true
    },
    //建筑图册预览
    showLayoutModal() {
      this.showBigLayoutModal = true
    },
    closeBigAlubmModal() {
      this.showBigAlubmModal = false
    },
    //关闭建筑图册弹出框
    closeBigLayoutModal() {
      this.showBigLayoutModal = false
    },
    //判断是否显示图册
    ifshowAlbumCard(topImage) {
      //本地
      if (topImage.source == 1) {
        return true
      }
      //自定义
      if (topImage.source == 3) {
        return true
      }
      //渲染图
      if (topImage.source == 2) {
        const taskStatus = topImage.taskStatus
        if (this.showStatusList.indexOf(taskStatus) > -1) {
          return true
        }
      }
      return false
    },
    //切换编辑模式
    changeEditModel() {
      this.editModel = true
    },
    finishEdit() {
      this.editModel = false
    },
    //刷新列表
    refreshList() {
      this.ifrefresh=true
      const code = this.activekey
      //获取单张图册
      if (code == 1) {
        this.getSimpleAlbum()
      }
      //获取批量图册
      if (code == 2) {
        this.getBatchTaskAlbum()
      }
      //获取建筑图册
      if (code == 3) {
        this.queryLayoutPlanImage()
      }
    },
    //刷新列表
    refreshByDelete() {
      this.ifdelrefresh=true
      this.ifrefresh=true
      this.getSimpleAlbum()

    },
    //复制视角
    copySimpleTaskView() {
      const self = this
      self.$gLoading.show('正在复制..')
      const param = {solutionId: this.solutionId}
      this.$http.post('/dr-web/render/copySimpleTaskView', param).then(function (res) {
        self.$gLoading.hide()
        if (res.success) {
          self.$notification.success({
            message: '成功',
            description: '视角复制成功！'
          })
          self.refreshList()
        } else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '复制视角失败！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        self.$notification.error({
          message: '失败',
          description: res.msg || '复制视角失败！'
        })
      })
    },
    //批量渲染
    onBatchRender() {
      this.batchRender = true
    },
    //取消批量渲染
    cancelRender() {
      this.batchRender = false
    },
    //关闭图册
    closeWebAlbum() {
      // eslint-disable-next-line
      ue.webalbum.closewebalbum()
    },
    //websocket及时获取渲染状态
    /*socketGetRenderStatus() {
      const self=this
      const userInfo = self.$getUserInfo()
      const userId=userInfo.user.userId
      this.$store.commit('openWebsockt',userId)
      this.$store.state.websockt.onmessage = (data) => {

      }
    },*/
    getSocketInfo(data){
      const jsonData=JSON.parse(data)
      const type=jsonData.type
      if(type==5){
        //刷新tab列表
        this.refreshListBySocketList(jsonData)
      }
    },
    //socket获取到数据状态之后，实时刷新
    refreshListBySocketList(jsonData) {
      const self =this
      const jobId = jsonData.jobId
      const status = jsonData.status
      const currentRoomAlumb = this.currentRoomAlumb
      const viewImagesList = currentRoomAlumb.viewImagesList ? currentRoomAlumb.viewImagesList : []
      viewImagesList.map(item => {
        if (item.topImage.jobId == jobId) {
          item.topImage.source = 2
          item.topImage.taskStatus = status
        }
      })
      currentRoomAlumb.viewImagesList = viewImagesList?viewImagesList:[]
      this.allRoomeAlbumsList.map(item=>{
        const viewImagesList=item.viewImagesList ?item.viewImagesList:[]
        viewImagesList.map(info=>{
          const imageList=info.imageList && info.imageList.length>0 ?info.imageList:[]
          imageList.map(i=>{
            if(i.jobId==jobId){
              i.source = 2
              i.taskStatus = status
            }
          })
        })
      })
      //如果当前大图显示的弹出框是打开的,重新渲染弹出框数据
      if(this.showBigAlubmModal){
        self.$refs.albumModal.allAlbumList=self.allRoomeAlbumsList
        self.$refs.albumModal.getAllImagesInfo()
        self.$refs.albumModal.getCurrentImagesInfo()
      }
    },
    //重新渲染列表数据
    //重新生成
    resetRender(){
      // eslint-disable-next-line
      ue.webalbum.redrawbuildingplan().then()
    },
    //生成户型拆改图
    resetApartmentChange(){
      // eslint-disable-next-line
      ue.webalbum.onchangeimagecreate().then()
    }
  },
  //路由离开之后取消订阅
  beforeRouteLeave () {
    const self=this
    const active=this.activekey
    const currentAllJobs=this.currentAllJobs?this.currentAllJobs:[]
    let url=''
    //当前高亮单张图册，请求批量图册所有jobs
    if(active==1){
      url='/dr-web/render/queryBatchTaskAlbum'
    }
    //当前高亮批量图册，请求单张图册所有jobs
    if(active==2 && this.AlbumsJurisdiction.BatchImageAtlas){
      url='/dr-web/render/querySimpleTaskAlbum'
    }
    const param = {solutionId: this.solutionId}
    if(url!=='') {
      this.$http.post(url, param).then(function (res) {
        if (res.code == 1) {
          const roomAlbumList = res.data && res.data.roomAlbumList ? res.data.roomAlbumList : []
          //获取所有任务号
          roomAlbumList.map(item => {
            const viewImagesList = item.viewImagesList ? item.viewImagesList : []
            viewImagesList.map(v => {
              const imageList = v.imageList ? v.imageList : []
              imageList.map(i => {
                const jobId = i.jobId
                if (jobId !== null && jobId !== '' && jobId !== undefined && i.taskStatus !== 'done') {
                  currentAllJobs.push(jobId)
                }
              })
            })
          })
          const baseNotify = process.env.VUE_APP_NOTIFY
          const userInfo = self.$getUserInfo()
          const userId = userInfo.user.userId
          //取消订阅任务
          self.$http.post(baseNotify + '/dr-notify/dr-client/unsubscribe', {
            "uid": userId,
            "jobIds": currentAllJobs
          }).then(function (res) {
          })
        }
      })
    }
  },

}
</script>
<style lang="less" scoped>
  .pictureContainer {
    position: relative;
    .operationcontent {
      z-index: 100;
      position: absolute;
      top: 87px;
      right: 0px;
      background: #F5F5F5;
      width: 500px;
      text-align: right;
      padding-right: 60px;
      .operationBtn {
        width: 124px;
        height: 48px;
        line-height: 48px;
        background: #ffffff;
        border-radius: 26px;
        font-size: 16px;
        font-weight: 600;
        color: #5c5c5c;
        border: none;
        margin-left: 10px;
      }
      .finishBtn {
        width: 124px;
        height: 48px;
        line-height: 48px;
        background: #586287;
        border-radius: 26px;
        font-size: 16px;
        font-weight: 600;
        color: #FFFFFF;
        border: none;
        margin-left: 10px;
      }
    }
    .header {
      height: 70px;
      width: 100%;
      background-color: #ffffff;
      padding-left: 60px;
      display: flex;
      padding-top: 20px;
      position: relative;
      .eachtab {
        width: 150px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #8D8D8D;
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
      }
      .avtivetab {
        width: 150px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
        background-color: #586287;
      }
      .closeIcon {
        position: absolute;
        right: 23px;
        bottom: 11px;
        cursor: pointer;
        .icon {
          font-size: 20px;
          font-weight: 600;
        }
      }
    }
    .roomAlumbsContainer {
      padding-left: 60px;
      padding-top: 30px;

    }
    .albumList {
      display: -webkit-flex;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      align-content: flex-start;
      margin-bottom: 42px;
      width: calc(100% + 45px );
      min-height: 400px;
      padding-bottom: 50px;
    }
    .nodata {
      margin-top: 50px;
    }
    .nolayoutContainer {
      .noContent {
        .noInfo {
          padding-top: 60px;
          width:428px;
          height:241px;
          background:rgba(0,0,0,1);
          border-radius:8px 8px 0px 0px;
          opacity:0.2;
          .text {
            font-size:14px;
            font-weight:400;
            color:#C5C5C5;
            line-height:20px;
          }
        }
        position: relative;
        width:428px;
        height:317px;
        background:rgba(255,255,255,1);
        border-radius:8px;
        .btnContent {
          text-align: right;
          padding-right: 20px;
          height:76px;
          line-height: 76px;
          width: 100%;
          border-radius: 0px 0px 8px 8px;
          background-color: #ffffff;
          position: absolute;
          bottom: 0px;
          .button {
            width: 120px;
            height: 36px;
            border-radius: 18px;
            color: #FFFFFF;
            font-weight: 600;
            font-size: 12px;
          }
        }
      }
    }
    /deep/.drtabs .ant-tabs-bar {
      width: calc(100% - 500px);
    }
    /deep/.ant-btn.disabled, .ant-btn[disabled], .ant-btn.disabled:hover {
      color: rgba(0, 0, 0, 0.25);
      border-color: #d9d9d9;
      text-shadow: none;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
    /deep/.tabBorder .ant-tabs-top .ant-tabs-ink-bar-animated {
      width: 30px !important;
      margin-left: 20px;
    }
}

</style>
