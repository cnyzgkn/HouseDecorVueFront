<!--建筑图册卡片组件-->
<template>
  <div class="layoutCard">
    <div class="showbigImage">
      <a-button
        type="primary"
        class="bigBtn"
        @click="showBigLayoutModal"
      >
        查看大图
      </a-button>
    </div>
    <img
      v-if="type !='3'"
      class="imgInfo"
      :src="$ifAliyunImage(layoutCardInfo.layoutPlanImage)?layoutCardInfo.layoutPlanImage+'!original':layoutCardInfo.layoutPlanImage"
      onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAACCAQMAAABYTTeVAAAABlBMVEXx8fH7+/tUkfSPAAABwklEQVRYw+3WPU/CQBzH8X95CHSiMTGylYHEuJk4OIIPg6Nx0U0T34CjA7HV+ApwccNEfR3U6OaC8QXYl8BY8Nrzf9diiPK7bkxlKeE++QLXuwOS5seYClCAAhRgmUDkAb+DwHhVB8hF4M0vDaUMqIHAyHaoI4hqCNw+7N+cBgbg22RfkQFs0NFxyKAMCyuUkAI1AOzuINSgDEDL9kiDO1RYG2tgXQPQlZQCVBhEZC5IPwOPAGQBoncAghl4AWA2Tq+LQfILPhcDkY72iPaMgC/nRiANIMrAFgLqY1r8bdcBsEQGUMFKC2PaBqA8Ay6YKF0o8y2BQGggIKBLDZL5rfX/ZvGCzQW+EfCeCPJACDZO7OeAyQxEAAgNGhhEatFeuGrOQUGB2OMnqNBVt0o9MRT0UIAKZykQZAA1+eccnAfTlgYJIaAKPMSnUAeATQU4UAKn3ISBy6+Q+wUKjgI8F1Ow5KYn/O4caAQARE0uqN1bGQBwQFTnQOiAgmjqJRVXUUHe6wUT0iEopAdEr/IECwrUPhzqdgzA83fbfQOoyue6T0MAEjWT8ajd9zBQl+8d+Ms7vykXgsAr/sMUoAAFWCb4AaxTlPEjED5xAAAAAElFTkSuQmCC'"
    >
    <img
      v-else
      class="imgInfo"
      :src="$ifAliyunImage(layoutCardInfo.url)?layoutCardInfo.url+'!original':layoutCardInfo.url"
      onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAACCAQMAAABYTTeVAAAABlBMVEXx8fH7+/tUkfSPAAABwklEQVRYw+3WPU/CQBzH8X95CHSiMTGylYHEuJk4OIIPg6Nx0U0T34CjA7HV+ApwccNEfR3U6OaC8QXYl8BY8Nrzf9diiPK7bkxlKeE++QLXuwOS5seYClCAAhRgmUDkAb+DwHhVB8hF4M0vDaUMqIHAyHaoI4hqCNw+7N+cBgbg22RfkQFs0NFxyKAMCyuUkAI1AOzuINSgDEDL9kiDO1RYG2tgXQPQlZQCVBhEZC5IPwOPAGQBoncAghl4AWA2Tq+LQfILPhcDkY72iPaMgC/nRiANIMrAFgLqY1r8bdcBsEQGUMFKC2PaBqA8Ay6YKF0o8y2BQGggIKBLDZL5rfX/ZvGCzQW+EfCeCPJACDZO7OeAyQxEAAgNGhhEatFeuGrOQUGB2OMnqNBVt0o9MRT0UIAKZykQZAA1+eccnAfTlgYJIaAKPMSnUAeATQU4UAKn3ISBy6+Q+wUKjgI8F1Ow5KYn/O4caAQARE0uqN1bGQBwQFTnQOiAgmjqJRVXUUHe6wUT0iEopAdEr/IECwrUPhzqdgzA83fbfQOoyue6T0MAEjWT8ajd9zBQl+8d+Ms7vykXgsAr/sMUoAAFWCb4AaxTlPEjED5xAAAAAElFTkSuQmCC'"
    >
    <div
      v-if="type !='3'"
      class="operation"
    >
      <a-button
        v-if="type=='1'"
        class="button"
        type="primary"
        @click="resetRender"
      >
        重新生成
      </a-button>
      <a-button
        v-if="type=='2'"
        class="button"
        type="primary"
        @click="resetApartmentChange"
      >
        重新生成
      </a-button>
    </div>
  </div>
</template>
<script>
export default {
  'name': 'LayoutCard',
  components: {  },
  props: {
    layoutCardInfo: {
      type: Object,
      require: true,
      default: function () {
        return {}
      }
    },
    layoutAlbumList: {
      type: Array,
      require: true,
      default: function () {
        return []
      }
    },
    showBigLayoutModal:{
      type: Function,
      require: true,
      default: function () {
      }
    },
    type:{    //类型 1:平面布置图,2:户型拆改图 3 户型原始图
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
    }
  },
  created(){

  },
  mounted(){

  },
  methods: {
    //重新生成平面布置图
    resetRender(){
      // eslint-disable-next-line
      ue.webalbum.redrawbuildingplan().then()

    },
    //重新生成户型拆改图
    resetApartmentChange(){
      // eslint-disable-next-line
      ue.webalbum.onchangeimagecreate().then()
    }
  }
}

</script>
<style lang="less" scoped>
  .layoutCard {
    position: relative;
    width: 428px;
    min-height: 240px;
    .imgInfo {
      width: 100%;
      height: 240px;
      border-radius:8px;
    }
    .showbigImage {
      position: absolute;
      text-align: center;
      top: 103px;
      z-index: 100;
      display: none;
      .bigBtn {
        border: none;
        width:120px;
        height:36px;
        background:rgba(255,255,255,1);
        border-radius:18px;
        font-size: 12px;
        font-weight: 600;
        line-height: 36px;
        color: #5C5C5C;
        left: 155px;
        opacity: 1.5;
      }
    }
    .operation {
      display: none;
      text-align: right;
      padding-right: 20px;
      height:76px;
      line-height: 76px;
      width: 100%;
      border-radius: 0px 0px 8px 8px;
      background-color: #ffffff;
      .button {
        width: 110px;
        height: 36px;
        border-radius: 18px;
        color: #FFFFFF;
        font-weight: 600;
        font-size: 12px;
      }
    }
    &:hover {
      .imgInfo {
        opacity: 0.7;
        border-radius:8px 8px 0px 0px;
      }
      .showbigImage {
        display: inline-block;
      }
      .operation {
        display: block;
        transition: 350ms transform ease;
        -webkit-transition: 350ms transform ease;
      }
    }
  }
</style>
