<!--收藏详情弹窗-->
<template>
  <div>
    <div
      v-if="customType == 1"
      style="display:flex;"
    >
      <a-col
        :span="10"
      >
        <img
          v-if="customInfo.mainUrl"
          class="imgLine"
          :src="$ifAliyunImage(customInfo.mainUrl)?customInfo.mainUrl+'!thumc-252x252':customInfo.mainUrl+'?imageView2/2/w/83/h/83'"
          :onerror="defaultImg"
        >
        <img
          v-else
          :src="noImg"
          class="imgLine"
        >
      </a-col>
      <a-col
        :span="12"
        class="desTitle pd15"
      >
        <div>
          <div
            class="desTitle1"
          >
            {{ customInfo.categoryName }}
          </div>
          <div
            class="desTitle3"
          >
            {{ customInfo.name }}
          </div>
        </div>
      </a-col>
    </div>
    <div
      v-if="customType== 2"
      style="position:relative"
      :style="{color: customInfo.categoryName == '拉手' && !customInfo.disabled ? '#e6e6e6' : ''}"
    >
      <a-icon
        v-if="customInfo.selectFlag"
        type="check-circle"
        class="checkCircle"
        theme="filled"
      />
      <a-popover
        :get-popup-container="getPopupContainer"
      >
        <!-- <template slot="content">
          <my-custom-detail
            :custom-info="customInfo"
            :custom-type="1"
          />
        </template> -->
        <div class="imgList">
          <img
            v-if="customInfo.image"
            class="img2"
            :src="$ifAliyunImage(customInfo.image)?customInfo.image+'!thumc-252x252':customInfo.image+'?imageView2/2/w/83/h/83'"
            onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP0AAAD8AgMAAADBB0rKAAAADFBMVEX8/Pz////7+/vw8PAN5jRjAAAAAnRSTlPvELLCMn8AAAIVSURBVGje7dhBjqMwEAXQnHeOZkt4DxJ1HyPZeyxVDQEChjStfLKYxXxW3Yt6fBcUmDz+uK+Ox4MAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQOCnI3wJeFMYkNJW9WYwUMRM01ZvEQRCTrnPxdJabyMINGqlmKRp7XYLmBKYdMle9Tgg0hWdVm43gb4U1bydf2qoRCyBSc6tkx3oFUuQk8aq3jQkLMFz/VW9aWNgAneoN0MTxKkNh6NRcJhO9WiCt3qLWA/8ud4GLIG8A1gP6lKdlzP0CHBYQZz/K+k+MOcZFQRUduD554gmiFuK5ZrCCfZGLivS8QvAzfOMAdvDcH4lPB/RLXgfHBKEyzfDJXBMEOzq3fRLAl8BDk9gMXwFVMM0rtMd/y3gvwUcCPhwBsTGu0Bcn5EQEN4ADyYYXtVB3R0gDPscVDf350AzVHfhrR6cAW8Y0IzHfYk3EAhH4JeN3tVVaOtL6E79/CTB+lCPe/2IAUn2s56ux2dN1B2Qpd5jCfoNWOsd2IMS1rrX+S1jgKzAMlRTfVewHiwJ7FWv2QQCpsT7PDunuYAJXOerehM1BR/r+xZj2l6U0qWcbgLRS8piUvQeMD737TZ1oEcTbAPQpNJNPQBnYQXm2L7JmruuRQGpB6gtBn+5huuv1Q8/fT+q5w8QBAgQIECAAAECBAgQIECAAAECBAgQIECAwH8I/AV93/QDLc4abwAAAABJRU5ErkJggg=='"
          >
          <img
            v-else
            :src="noImg"
            class="imgLine"
          >
        </div>
      </a-popover>
      <div class="imgTitle">
        {{ customInfo.name }}
      </div>
    </div>
    <div v-if="customType== 3">
      <a-icon
        v-if="customInfo.selectFlag"
        type="check-circle"
        class="checkCircle"
        theme="filled"
      />
      <div class="imgList">
        <img
          v-if="customInfo.propertyValueUrl"
          class="img2"
          :src="$ifAliyunImage(customInfo.propertyValueUrl)?customInfo.propertyValueUrl+'!thumc-252x252':customInfo.propertyValueUrl+'?imageView2/2/w/83/h/83'"
          onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP0AAAD8AgMAAADBB0rKAAAADFBMVEX8/Pz////7+/vw8PAN5jRjAAAAAnRSTlPvELLCMn8AAAIVSURBVGje7dhBjqMwEAXQnHeOZkt4DxJ1HyPZeyxVDQEChjStfLKYxXxW3Yt6fBcUmDz+uK+Ox4MAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQOCnI3wJeFMYkNJW9WYwUMRM01ZvEQRCTrnPxdJabyMINGqlmKRp7XYLmBKYdMle9Tgg0hWdVm43gb4U1bydf2qoRCyBSc6tkx3oFUuQk8aq3jQkLMFz/VW9aWNgAneoN0MTxKkNh6NRcJhO9WiCt3qLWA/8ud4GLIG8A1gP6lKdlzP0CHBYQZz/K+k+MOcZFQRUduD554gmiFuK5ZrCCfZGLivS8QvAzfOMAdvDcH4lPB/RLXgfHBKEyzfDJXBMEOzq3fRLAl8BDk9gMXwFVMM0rtMd/y3gvwUcCPhwBsTGu0Bcn5EQEN4ADyYYXtVB3R0gDPscVDf350AzVHfhrR6cAW8Y0IzHfYk3EAhH4JeN3tVVaOtL6E79/CTB+lCPe/2IAUn2s56ux2dN1B2Qpd5jCfoNWOsd2IMS1rrX+S1jgKzAMlRTfVewHiwJ7FWv2QQCpsT7PDunuYAJXOerehM1BR/r+xZj2l6U0qWcbgLRS8piUvQeMD737TZ1oEcTbAPQpNJNPQBnYQXm2L7JmruuRQGpB6gtBn+5huuv1Q8/fT+q5w8QBAgQIECAAAECBAgQIECAAAECBAgQIECAwH8I/AV93/QDLc4abwAAAABJRU5ErkJggg=='"
        >
        <img
          v-else
          :src="noImg"
          class="imgLine"
        >
      </div>
      <div class="imgTitle">
        {{ customInfo.propertyValue }}
      </div>
    </div>
    <div v-if="customType== 4">
      <a-icon
        v-if="customInfo.selected"
        type="check-circle"
        class="checkCircle"
        theme="filled"
      />
      <a-popover
        :get-popup-container="getPopupContainer"
      >
        <template slot="content">
          <my-custom-detail
            :custom-info="customInfo"
            :custom-type="2"
          />
        </template>
        <div class="imgList">
          <img
            v-if="customInfo.mainUrl"
            class="img2"
            :src="$ifAliyunImage(customInfo.mainUrl)?customInfo.mainUrl+'!thumc-252x252':customInfo.mainUrl+'?imageView2/2/w/83/h/83'"
            onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP0AAAD8AgMAAADBB0rKAAAADFBMVEX8/Pz////7+/vw8PAN5jRjAAAAAnRSTlPvELLCMn8AAAIVSURBVGje7dhBjqMwEAXQnHeOZkt4DxJ1HyPZeyxVDQEChjStfLKYxXxW3Yt6fBcUmDz+uK+Ox4MAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQOCnI3wJeFMYkNJW9WYwUMRM01ZvEQRCTrnPxdJabyMINGqlmKRp7XYLmBKYdMle9Tgg0hWdVm43gb4U1bydf2qoRCyBSc6tkx3oFUuQk8aq3jQkLMFz/VW9aWNgAneoN0MTxKkNh6NRcJhO9WiCt3qLWA/8ud4GLIG8A1gP6lKdlzP0CHBYQZz/K+k+MOcZFQRUduD554gmiFuK5ZrCCfZGLivS8QvAzfOMAdvDcH4lPB/RLXgfHBKEyzfDJXBMEOzq3fRLAl8BDk9gMXwFVMM0rtMd/y3gvwUcCPhwBsTGu0Bcn5EQEN4ADyYYXtVB3R0gDPscVDf350AzVHfhrR6cAW8Y0IzHfYk3EAhH4JeN3tVVaOtL6E79/CTB+lCPe/2IAUn2s56ux2dN1B2Qpd5jCfoNWOsd2IMS1rrX+S1jgKzAMlRTfVewHiwJ7FWv2QQCpsT7PDunuYAJXOerehM1BR/r+xZj2l6U0qWcbgLRS8piUvQeMD737TZ1oEcTbAPQpNJNPQBnYQXm2L7JmruuRQGpB6gtBn+5huuv1Q8/fT+q5w8QBAgQIECAAAECBAgQIECAAAECBAgQIECAwH8I/AV93/QDLc4abwAAAABJRU5ErkJggg=='"
          >
          <img
            v-else
            :src="noImg"
            class="imgLine"
          >
        </div>
        <!-- <my-custom-detail
          v-show="customInfo.seled"
          :custom-info="customInfo"
          :custom-type="4"
        /> -->
      </a-popover>
      <div class="imgTitle">
        {{ customInfo.templateName }}
      </div>
    </div>
    <div v-if="customType== 5">
      <a-icon
        v-if="customInfo.selected"
        type="check-circle"
        class="checkCircle"
        theme="filled"
      />
      <a-popover
        :get-popup-container="getPopupContainer"
      >
        <!-- <template slot="content">
          <my-custom-detail
            :custom-info="customInfo"
            :custom-type="3"
          />
        </template> -->
        <div class="imgList">
          <img
            v-if="customInfo.image"
            class="img2"
            :src="$ifAliyunImage(customInfo.image)?customInfo.image+'!thumc-252x252':customInfo.image+'?imageView2/2/w/83/h/83'"
            onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP0AAAD8AgMAAADBB0rKAAAADFBMVEX8/Pz////7+/vw8PAN5jRjAAAAAnRSTlPvELLCMn8AAAIVSURBVGje7dhBjqMwEAXQnHeOZkt4DxJ1HyPZeyxVDQEChjStfLKYxXxW3Yt6fBcUmDz+uK+Ox4MAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQOCnI3wJeFMYkNJW9WYwUMRM01ZvEQRCTrnPxdJabyMINGqlmKRp7XYLmBKYdMle9Tgg0hWdVm43gb4U1bydf2qoRCyBSc6tkx3oFUuQk8aq3jQkLMFz/VW9aWNgAneoN0MTxKkNh6NRcJhO9WiCt3qLWA/8ud4GLIG8A1gP6lKdlzP0CHBYQZz/K+k+MOcZFQRUduD554gmiFuK5ZrCCfZGLivS8QvAzfOMAdvDcH4lPB/RLXgfHBKEyzfDJXBMEOzq3fRLAl8BDk9gMXwFVMM0rtMd/y3gvwUcCPhwBsTGu0Bcn5EQEN4ADyYYXtVB3R0gDPscVDf350AzVHfhrR6cAW8Y0IzHfYk3EAhH4JeN3tVVaOtL6E79/CTB+lCPe/2IAUn2s56ux2dN1B2Qpd5jCfoNWOsd2IMS1rrX+S1jgKzAMlRTfVewHiwJ7FWv2QQCpsT7PDunuYAJXOerehM1BR/r+xZj2l6U0qWcbgLRS8piUvQeMD737TZ1oEcTbAPQpNJNPQBnYQXm2L7JmruuRQGpB6gtBn+5huuv1Q8/fT+q5w8QBAgQIECAAAECBAgQIECAAAECBAgQIECAwH8I/AV93/QDLc4abwAAAABJRU5ErkJggg=='"
          >
          <img
            v-else
            :src="noImg"
            class="imgLine"
          >
        </div>
        <!-- <my-custom-detail
          v-show="customInfo.seled"
          :custom-info="customInfo"
          :custom-type="3"
        /> -->
      </a-popover>
      <div class="imgTitle">
        {{ customInfo.categoryName }}
      </div>
    </div>
  </div>
</template>
<script>
import MyCustomDetail from '@/components/houseCustom/houseCustomPops.vue'
export default {
  'name':'HouseCustomCard',
  components: { MyCustomDetail },
  props:{
    customInfo:{ // 详情
      type: Object,
      default:function(){
        return {}
      }
    },
    customType:{ // 类型1:最外层图片 2:物料 3:颜色 4模版 5硬装
      type: Number,
      default:function(){
        return 0
      },
      require: true
    }
  },
  data(){
    return {
      defaultImg: 'this.src="' + require('../../assets/images/project-none.png') + '"',
      noImg: require('../../assets/images/noImg.png')
    }
  },
  created(){
    // console.log(this.customInfo, '88')
  },
  methods: {
    // 浮层渲染节点
    getPopupContainer(){
      return document.getElementById('my-custom-wrap')
    }
  }
}
</script>
<style lang="less" scoped>
.cardbar {
  display: flex;
  height: 92px;
}
.checkedCard {
  display: flex;
  height: 92px;
  margin-bottom: 10px;
  background-color: #FFFFFF;
  border-right:3px solid #586287;
}
.imgLine {
  margin-left: 10px;
  margin-top: 5px;
  border-radius: 10px;
  width: 72px;
  height: 72px;
}
.desTitle {
  height:83px;
  width: 135px;
  /* margin-left: 10px; */
}
.pd15 {
  padding-top: 15px;
}
.desTitle1 {
  font-size:16px;
  font-weight:600;
  color:#5C5C5C;
}
.desTitle2 {
  font-size:16px;
  font-weight:400;
  color:#5C5C5C;
  padding: 20px 0px;
  margin-top: 5px;
}
.desTitle3 {
  font-size:12px;
  font-weight:400;
  margin-top: 5px;
  color:#8D8D8D;
}
.font600{
  font-weight: 600 !important
}
.imgTitle {
  color: #5C5C5C;
  font-size: 14px;
}
.checkCircle {
    position: absolute;
    margin-left: 30px;
    margin-top: 100px;
    color: #586287;
    font-size: 24px;
}
.imgList {
  padding: 10px;
}
.img2 {
  border-radius: 10px;
  width: 120px;
  height: 120px;
}
.imgTitle {
  color: #5C5C5C;
  font-size: 16px;
}
/deep/.ant-popover-inner-content {
  padding: 0px;
}
</style>
