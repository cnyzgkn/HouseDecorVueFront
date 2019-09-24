
<!--项目卡片组件-->
<template>
  <div>
    <div
      class="projectCard"
      @mouseenter="showOpt"
      @mouseleave="hideOpt"
    >
      <img
        v-if="projectInfo.normalPic"
        class="pimg"
        :src="$ifAliyunImage(projectInfo.normalPic)?projectInfo.normalPic+'!thumc-252x252':projectInfo.normalPic+'?imageView2/2/w/252/h/252'"
        :onerror="defaultImg"
      >
      <div class="ptitle">
        {{ `${projectInfo.buildingName}-${projectInfo.houseName}` }}
      </div>
      <div class="pinfo">
        <span>{{ projectInfo.housingSize }}m<sup>2</sup></span>
        <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
        <span>{{ projectInfo.apartmentPattern }}</span>
      </div>
      <div class="pinfo">
        <label>户型ID&nbsp;</label>{{ projectInfo.houseId }}
      </div>
      <div
        v-show="optflag"
        class="optContent"
      >
        <a-button
          type="primary"
          class="surebtn"
          @click="enterhose"
        >
          绘制户型
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { execQtFuncByChannel } from '@/common/utils/baseMethods.js';
import global from '@/common/config/global.js'
export default {
  'name': 'ProjectCard',
  components: {},
  props: {
    // eslint-disable-next-line vue/require-default-prop
    projectInfo: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      optflag: false,
      defaultImg: 'this.src="' + require('../../assets/images/project-none.png') + '"'
    }
  },
  methods: {
    showOpt () {
      this.optflag = true
    },
    hideOpt () {
      this.optflag = false
    },
    /**
     *
     */
    enterhose (){
      // this.$message.error('进入DR绘制户型')
      let id = this.projectInfo.houseId
      let data = {
        HouseId:id
      }
      execQtFuncByChannel(global.qtChannel.main,'onOpenSolution',data)
    }
  }
}

</script>
<style lang="less" scoped>
  .projectCard {
    position: relative;
    width: 250px;
    height: 347px;
    background-color: #FFFFFF;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    transition: 350ms transform ease;
    .pimg {
      width: 252px;
      height: 252px;
      margin-left: -1px;
    }
    .ptitle {
      padding: 0 20px;
      font-size:14px;
      font-weight:600;
      color:#5C5C5C;
      margin-top: 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pinfo {
      margin-top: 5px;
      font-size:12px;
      font-weight:400;
      color:#8D8D8D;
      padding: 0 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      >label{
        color: #c7c7c7;
      }
      sup{
        top: -3px;
      }
    }
    .optContent {
      position: absolute;
      height: 95px;
      line-height: 95px;
      width: 100%;
      background-color: #FFFFFF;
      opacity: .9;
      bottom: 2px;
      .surebtn {
        width:94px;
        height:36px;
        font-size:12px;
        font-weight:600;
        color:#FFFFFF;
        margin-right: 10px;
      }
    }
  }
  /*.projectCard__download::after{
    position: absolute;
    width: 252px;
    height: 252px;
    top:0;
    left: 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    content: "";
    background: rgba(255,255,255,.75)
  }*/
  .projectCard:hover{
    box-shadow: 0 0 30px 0 rgba(0,0,0,.1);
    transform: translate(0, -10px);
  }
</style>
