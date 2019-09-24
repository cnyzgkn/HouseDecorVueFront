<template>
  <div class="house-custom-wrap">
    <div class="house-custom-header">
      <!-- <h6>父组件：全屋定制主页面</h6> -->
      <a-row class="top-row">
        <div style="margin-top:30px;">
          <a-col
            style="text-align: left; width: 100px"
            :span="2"
          >
            <div class="titleName">
              {{ categoryTitleName }}定制
            </div>
          </a-col>
          <a-col
            :span="14"
          >
            <a-button-group>
              <a-dropdown
                :trigger="['click']"
              >
                <a-menu slot="overlay">
                  <a-menu-item key="0">
                    <a-button
                      type="dashed"
                      @click="onButtonClick('empty', 2)"
                    >
                      清空{{ categoryTitleName }}
                    </a-button>
                  </a-menu-item>
                  <a-menu-item key="1">
                    <a-button
                      type="dashed"
                      @click="onButtonClick('empty', 1)"
                    >
                      清空全部
                    </a-button>
                  </a-menu-item>
                </a-menu>
                <a-button
                  type="dashed"
                >
                  <a-icon type="delete" />清空
                </a-button>
              </a-dropdown>
              <a-button
                type="dashed"
                @click="onButtonClick('showOrHideDoor')"
              >
                <a-icon type="clock-circle" />{{ showName }}柜门
              </a-button>
              <a-button
                v-if="showGlobal"
                type="dashed"
                @click="onButtonClick('globalReplace')"
              >
                <a-icon type="sync" />全局替换
              </a-button>
              <a-button
                type="dashed"
                @click="onButtonClick('editLayout')"
              >
                <a-icon type="layout" />编辑布局偏好
              </a-button>
              <!-- <a-button
                type="dashed"
                @click="onButtonClick('modelReplace')"
              >
                <a-icon type="layout" />模版替换入口（模拟）
              </a-button> -->
              <!-- <a-button
            type="dashed"
            :loading="btnLoading"
            @click="onButtonClick('testQt')"
          >
            <a-icon type="layout" />QT执行web端方法（演示代码逻辑）
          </a-button> -->
            </a-button-group>
          </a-col>
          <a-col
            :span="2"
            :offset="2"
          >
            <a-button 
              class="buttonFinish"
              @click="onButtonClick('fullSuccess')"
            >
              <a-icon type="check-circle" />
              完成定制
            </a-button>
          </a-col>
          <a-col
            :span="1"
            :offset="1"
            class="exitButton"
            style="margin-left: 44px; margin-top: 5px"
          >
            <div
              style="display: flex;justify-content: center;align-items: center;align-content: center;"
              @click="exitFull()"
            >
              <img
                :src="exitImg"
                alt=""
                style="width: 16px; height: 16px"
              >
              <div style="color: #5C5C5C;font-weight:600;">
                退出
              </div>
            </div>
          </a-col>
        </div>
      </a-row>
    </div>
    <!--全局替换-->
    <house-custom-global-replace
      v-if="showGlobalPart"
      :tab-list="tabList"
    />
    <!--模版替换-->
    <house-custom-model-replace
      v-if="showModelPart"
      class="showModelStyle"
      :template-param="templateParam"
      :category-id="categoryId"
    />
    <!-- 其他 -->
    <div
      v-if="!showGlobalPart && !showModelPart"
      style="display: flex; justify-content: center;align-items: center;align-content: center; height: 90%"
    >
      <div>
        <img
          class="otherImg"
          :src="$ifAliyunImage(otherImg)?otherImg+'!thumc-252x252':otherImg+'?imageView2/2/w/83/h/83'"
        >
        <div style="font-weight:400; color:#8D8D8D; margin-top: 10px">
          在左侧窗口中，选择模型进行编辑
        </div>
      </div>
    </div>
    <!-- 清空Modal -->
    <a-modal
      v-model="visible"
      title=""
      :width="446"
      centered
      class="fullCustomsized"
      @ok="handleOk"
    >
      <a-icon
        type="question-circle"
        class="questionStyle"
      />
      确定清空当前空间中{{ clearType == 1 ? '所有' : categoryTitleName }}定制家具吗？
    </a-modal>
    <!-- 退出Modal -->
    <a-modal
      v-model="exitFlag"
      title=""
      :width="446"
      centered
      class="fullCustomsized"
      @ok="exitOk"
    >
      <a-icon
        type="question-circle"
        class="questionStyle"
      />
      确定退出定制工具吗？退出将不会保存数据！
    </a-modal>
  </div>
</template>
<script>
import global from '@/common/config/global.js'
import { execQtFuncByChannel,provideFunToQtByChannel } from '@/common/utils/baseMethods.js'
import houseCustomApi from './HouseCustom.api'
import HouseCustomGlobalReplace from './HouseCustomGlobalReplace.vue'
import HouseCustomModelReplace from './HouseCustomModelReplace.vue'
// import { type } from 'os';
export default {
  name:'HouseCustom',
  provide:{
    houseCustomApi:houseCustomApi
  },
  components:{HouseCustomGlobalReplace,HouseCustomModelReplace},
  data(){
    return{
      templateParam: {},
      categoryId:'', //定制类目id
      styleId:'',//风格id
      showDoor:0, // 是否隐藏柜门
      showGlobal:false, // 是否显示全局替换按钮
      showModel:false, // 是否显示模版替换按钮
      showGlobalPart: false, // 是否显示全局替换
      showModelPart: false, // 是否显示全局替换
      btnLoading:false,
      categoryTitleName: null,
      showFullFlag: false, // 只有橱柜定制的时候才展示全局替换
      tabList: [], //根据模版带出子集
      showName: '',
      showNameFlag: null,
      visible: false,
      clearType: null,
      otherImg: require('../../assets/images/otherFurniture@2x.png'),
      exitImg: require('../../assets/images/iconExit@2x.png'),
      exitFlag: false
    }
  },
  computed:{
    categoryTitle:function(){
      let title = '全屋定制'
      switch (this.categoryId) {
        case 1:
          title = '橱柜定制'
          break;
        default:
          break;
      }
      return title
    }
  },
  watch:{
    '$store.state.templateParam':{
      handler:function(val){
        this.$gLoading.show('正努力加载...')
        this.showModel = false
        const param = JSON.parse(val)
        console.log(param, 229)
        if(val == null){
          this.$gLoading.hide()
          return
        }
        if (param.templateId && param.actorId) {
          this.$gLoading.hide()
          this.templateParam = param
          this.showModel = true
          this.showModelPart = true
          this.showGlobal = false
          this.showGlobalPart = false
          if (this.categoryTitleName == '橱柜') {
            this.showGlobal = true
          }
        }
      },
      deep:true,
      immediate: true
    },
    '$store.state.repalceResult':{
      handler:function(val){
        if(val === null){
          return
        }
        this.btnLoading = false
        if(val){
          this.$message.success('替换成功！')
        }else{
          this.$message.error('替换失败！')
        }
      },
      deep:true
    },
    '$store.state.finishReplace':{
      handler:function(val){
        if(val === null){
          return
        }
        this.btnLoading = false
        if (JSON.parse(val).success == 0) {
          this.$message.error(JSON.parse(val).msg)
        }
      },
      deep:true
    }
  },
  beforeCreate () {
  },
  mounted () {
    this.provideTemplateId()
    houseCustomApi.geCategoryList({id: this.$route.query.categoryId}).then((data) => {
      this.categoryTitleName = data.categoryDto.name ? data.categoryDto.name: ''
      this.showFullFlag = data.categoryDto.name == '橱柜'
      this.showGlobal = this.showFullFlag
      this.showGlobalPart = this.showFullFlag
      this.showModel = data.categoryDto.name != '橱柜'
      this.showModelPart = false
      this.tabList = data.categoryTreeNodeDtos.filter(item => item.categoryDto.name != '高柜')
    })
  },
  created(){
    this.initPage()
    this.provideTemplateId()
  },
  methods:{
    provideTemplateId () {
      console.log(1111111)
      let dataTag = 'templateParam'
      this.$store.commit('SAVE_QT_TEMPLATEPARAM', null)
      provideFunToQtByChannel('onNotifyH5SelectTemplateId',dataTag)
    },
    // 初始化页面参数
    initPage(){
      this.categoryId = this.$route.query.categoryId
      this.styleId = this.$route.query.styleId
      this.showDoor = this.$route.query.showDoor
      this.showName = this.showDoor == 1 ? '隐藏' : '显示'
      this.showNameFlag = this.showDoor == 1
    },
    // 点击操作按钮时
    onButtonClick(tag, clearType){
      switch (tag) {
        case 'empty':
          this.clearType = clearType
          this.doEmpty()
          break;
        case 'showOrHideDoor':
          this.doShowOrHideDoor()
          break; 
        case 'globalReplace':
          this.showGlobalReplace()
          break; 
        case 'editLayout':
          this.notifyQtSwithWindow(1)
          break;
        case 'modelReplace':
          this.showModelReplace()
          break;
        case 'testQt':
          this.testQt()
          break;
        case 'fullSuccess':
          this.notifyQtSwithWindow(2)
          break;
        default:
          break;
      }
    },

    // 通知QT执行清空操作
    doEmpty(){
      this.visible = true
    },
    handleOk () {
      let data = {
        houseCustomMsgType: 'clearCurCategory',
        clearType: this.clearType
      }
      execQtFuncByChannel(global.qtChannel.houseCustom,'onNotifyQtClearCurCategory', data)
      this.visible = false
    },
    // 通知QT执行隐藏或显示柜门操作
    doShowOrHideDoor(){
      let data = {
        showDoor: this.showNameFlag ? 0 : 1
      }
      execQtFuncByChannel(global.qtChannel.houseCustom,'onNotifyQtShowOrHideCurDoor',data)
      this.showNameFlag = !this.showNameFlag
      this.showName = this.showNameFlag ? '隐藏' : '显示'
    },
    /*
    * 通知QT切换窗口
    * @param {number} tag 窗口标示（1:布局偏好 2:完成定制）
    */
    notifyQtSwithWindow(tag){
      let data = {
        typeId:tag  
      }
      execQtFuncByChannel(global.qtChannel.houseCustom,'onNotifyQtSwitchWindow',data)
      if (tag == 2) {
        // 重置
        let dataTag = 'finishReplace'
        this.$store.commit(`SAVE_QT_${dataTag.toUpperCase()}`,null)
        provideFunToQtByChannel('onNotifyH5CustomResult',dataTag)
      }
    },
    // 显示全局替换
    showGlobalReplace(){
      this.showGlobal = true
      this.showGlobalPart = true
      this.showModel = false
      this.showModelPart = false
    },
    // 显示模版替换
    showModelReplace(){
      this.showGlobal = false
      this.showGlobalPart = false
      if (this.categoryTitleName == '橱柜') {
        this.showGlobal = true
      }
      this.showModel = true
      this.showModelPart = true
    },
    // 演示代码逻辑：QT执行web端定义的方法
    testQt(){
      this.btnLoading = true
      let dataTag = 'repalceResult'
      // 重置
      this.$store.commit(`SAVE_QT_${dataTag.toUpperCase()}`,null)
      provideFunToQtByChannel('onNotifyQtReplaceDataResult',dataTag)
    },
    // 退出
    exitFull () {
      this.exitFlag = true
    },
    exitOk () {
      this.exitFlag = false
      execQtFuncByChannel(global.qtChannel.houseCustom,'onNotifyQtExitToDRPage', {})
    }
  }
}
</script>

<style lang="less" scoped>
// /deep/ .house-custom-wrap ::-webkit-scrollbar {
//   width: 10px;
//   max-height:  calc(100vh);
// }
// /deep/ .house-custom-wrap ::-webkit-scrollbar-thumb {
//   border-radius: 10px;
//   -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
//   background: #535353;
// }
// /deep/ .house-custom-wrap ::-webkit-scrollbar-track  {
//   -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
//   border-radius: 10px;
//   background: #EDEDED;
// }
.house-custom-wrap{
  padding: 0 20px;
  overflow: auto;
  // overflow-x: auto;
  // overflow-y: hidden;
  width: 1152px !important;
  height: 100vh;
  .top-row {
    position: fixed;
    // top: 30px;
    left: 30px;
    right: 100px;
    z-index: 999;
    width: 1150px;
    background-color: #f5f5f5;
  }
  .house-custom-header {

  }
  .titleName {
    color: #5C5C5C;
    font-size: 16px;
    line-height: 30px;
    height:22px;
    margin: 0 auto
  }
  .buttonFinish{
    background:rgba(88,98,135,1);
    color: #FFF;
    font-size: 16px;
    font-weight: 600;
    height:48px;
    width:124px;
    border-radius:26px;
    margin-top: -5px;
    line-height:16px;
  }
}
.questionStyle{
  background-color: #586287;
  color: #FFF;
  border-radius: 50%;
}
.otherImg{
  width: 150px;
  height: 150px;
  margin: 0 auto;
}
.exitButton:hover {
  cursor: pointer;
}

</style>
<style lang="less">
.fullCustomsized{
  margin: 0 auto;

.ant-modal{
    width: 446px !important;
    height: 150px !important;
    background: rgba(245,245,245,1);
  }
  .ant-modal-content{
    width: 446px !important;
    height: 150px !important;
    background: rgba(245,245,245,1);
    margin-top: 10%;
  }
  .ant-modal-body{
    padding-top: 40px;
    color:rgba(92,92,92,1);
    font-weight:600;
  }
  .ant-modal-footer{
    border-top: 0;
    background: rgba(245,245,245,1);
    margin-top: 6%
  }
}
</style>


