<!--收藏详情弹窗-->
<template>
  <div
    ref="collection-info"
    class="collection-detail-wrap"
  >
    <img
      v-if="customType != 2"
      width="350"
      height="350"
      class="imgpng"
      :src="$ifAliyunImage(customInfo.image)?customInfo.image+'!thumc-350x350':customInfo.image+'?imageView2/2/w/350/h/350'"
      onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP0AAAD8AgMAAADBB0rKAAAADFBMVEX8/Pz////7+/vw8PAN5jRjAAAAAnRSTlPvELLCMn8AAAIVSURBVGje7dhBjqMwEAXQnHeOZkt4DxJ1HyPZeyxVDQEChjStfLKYxXxW3Yt6fBcUmDz+uK+Ox4MAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQOCnI3wJeFMYkNJW9WYwUMRM01ZvEQRCTrnPxdJabyMINGqlmKRp7XYLmBKYdMle9Tgg0hWdVm43gb4U1bydf2qoRCyBSc6tkx3oFUuQk8aq3jQkLMFz/VW9aWNgAneoN0MTxKkNh6NRcJhO9WiCt3qLWA/8ud4GLIG8A1gP6lKdlzP0CHBYQZz/K+k+MOcZFQRUduD554gmiFuK5ZrCCfZGLivS8QvAzfOMAdvDcH4lPB/RLXgfHBKEyzfDJXBMEOzq3fRLAl8BDk9gMXwFVMM0rtMd/y3gvwUcCPhwBsTGu0Bcn5EQEN4ADyYYXtVB3R0gDPscVDf350AzVHfhrR6cAW8Y0IzHfYk3EAhH4JeN3tVVaOtL6E79/CTB+lCPe/2IAUn2s56ux2dN1B2Qpd5jCfoNWOsd2IMS1rrX+S1jgKzAMlRTfVewHiwJ7FWv2QQCpsT7PDunuYAJXOerehM1BR/r+xZj2l6U0qWcbgLRS8piUvQeMD737TZ1oEcTbAPQpNJNPQBnYQXm2L7JmruuRQGpB6gtBn+5huuv1Q8/fT+q5w8QBAgQIECAAAECBAgQIECAAAECBAgQIECAwH8I/AV93/QDLc4abwAAAABJRU5ErkJggg=='"
    >
    <img 
      v-if="customType == 2"
      width="350"
      height="350"
      class="imgpng"
      :src="$ifAliyunImage(customInfo.mainUrl)?customInfo.mainUrl+'!thumc-350x350':customInfo.mainUrl+'?imageView2/2/w/350/h/350'"
      onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP0AAAD8AgMAAADBB0rKAAAADFBMVEX8/Pz////7+/vw8PAN5jRjAAAAAnRSTlPvELLCMn8AAAIVSURBVGje7dhBjqMwEAXQnHeOZkt4DxJ1HyPZeyxVDQEChjStfLKYxXxW3Yt6fBcUmDz+uK+Ox4MAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQOCnI3wJeFMYkNJW9WYwUMRM01ZvEQRCTrnPxdJabyMINGqlmKRp7XYLmBKYdMle9Tgg0hWdVm43gb4U1bydf2qoRCyBSc6tkx3oFUuQk8aq3jQkLMFz/VW9aWNgAneoN0MTxKkNh6NRcJhO9WiCt3qLWA/8ud4GLIG8A1gP6lKdlzP0CHBYQZz/K+k+MOcZFQRUduD554gmiFuK5ZrCCfZGLivS8QvAzfOMAdvDcH4lPB/RLXgfHBKEyzfDJXBMEOzq3fRLAl8BDk9gMXwFVMM0rtMd/y3gvwUcCPhwBsTGu0Bcn5EQEN4ADyYYXtVB3R0gDPscVDf350AzVHfhrR6cAW8Y0IzHfYk3EAhH4JeN3tVVaOtL6E79/CTB+lCPe/2IAUn2s56ux2dN1B2Qpd5jCfoNWOsd2IMS1rrX+S1jgKzAMlRTfVewHiwJ7FWv2QQCpsT7PDunuYAJXOerehM1BR/r+xZj2l6U0qWcbgLRS8piUvQeMD737TZ1oEcTbAPQpNJNPQBnYQXm2L7JmruuRQGpB6gtBn+5huuv1Q8/fT+q5w8QBAgQIECAAAECBAgQIECAAAECBAgQIECAwH8I/AV93/QDLc4abwAAAABJRU5ErkJggg=='"
    >
    <!-- 物料1 -->
    <div
      v-if="customType == 1"
      class="info-wrap"
    >
      <h6 class="info-wrap-title">
        {{ customInfo.name }}&nbsp;&nbsp;
      </h6>
      <p class="info-wrap-line">
        <span class="info-wrap-desc">物料ID</span><span class="info-wrap-content"> {{ customInfo.componentId }}</span>
      </p>
    </div>
    <!-- 模版2 -->
    <div
      v-if="customType == 2"
      class="info-wrap"
    >
      <h6 class="info-wrap-title">
        {{ customInfo.templateName }}&nbsp;&nbsp;
      </h6>
      <p class="info-wrap-line">
        <span class="info-wrap-desc">模版ID</span><span class="info-wrap-content"> {{ customInfo.templateId }}</span>
      </p>
    </div>
    <!-- 硬装3 -->
    <div
      v-if="customType == 3"
      class="info-wrap"
    >
      <h6 class="info-wrap-title">
        {{ customInfo.productName }}&nbsp;&nbsp;{{ customInfo.categoryName }}
      </h6>
      <p class="info-wrap-line">
        <span class="info-wrap-desc">价格</span><span class="info-wrap-content"> ¥ {{ customInfo.aijiaPrice }}</span>
      </p>
      <p class="info-wrap-line">
        <span class="info-wrap-desc">{{ customInfo.type !== 1? "长宽高":"宽高深" }}</span>
        <span class="info-wrap-content">{{ customInfo.length }} x {{ customInfo.width }} x {{ customInfo.height }} mm</span>
      </p>
      <p
        v-if="customInfo.skuId"
        class="info-wrap-line"
      >
        <span class="info-wrap-desc">SkuID</span><span class="info-wrap-content">{{ customInfo.skuId }}</span>
      </p>
      <p
        v-if="customInfo.modelCode && customInfo.modelCode !== '0'"
        class="info-wrap-line"
      >
        <span class="info-wrap-desc">ModelCode</span><span class="info-wrap-content">{{ customInfo.modelCode }}</span>
      </p>
      <p
        v-if="customInfo.spuId"
        class="info-wrap-line"
      >
        <span class="info-wrap-desc">SpuId</span><span class="info-wrap-content">{{ customInfo.spuId }}</span>
      </p>
      <p class="info-wrap-line">
        <span class="info-wrap-desc">厂家编号</span><span class="info-wrap-content">{{ customInfo.manufacturerModel }}</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  'name':'MyCustomDetail',
  props:{
    customInfo:{ // 详情
      type: Object,
      default:function(){
        return {}
      }
    },
    customType:{ // 类型1:物料 2:模版 3:硬装
      type: Number,
      default:function(){
        return 0
      },
      require: true
    }
  },
  data(){
    return {}
  },
  created(){
  },
}
</script>
<style lang="less" scoped>
.collection-detail-wrap{
  width: 350px;
  // background-color: #F9F9F9;
  border-radius: 5px;
  text-align: left;
}
.collection-detail-wrap img{
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.info-wrap{
  padding: 0 20px 15px 20px;
}
.info-wrap-title{
  padding: 18px 0;
  margin-bottom: 15px;
  font-size: 16px;
  color: #5c5c5c;
  font-weight: 600;
  line-height: 22px;
  text-align: left;
  border-bottom: 1px solid #e8e8ee;
}
.info-wrap-line{
  margin-bottom:2px; 
  display: flex;
  align-items: flex-start;
}
.info-wrap-desc{
  width: 64px;
  margin-right: 24px;
  font-size: 12px;
  color: #c7c7c7;
  text-align: left;
  flex-shrink: 0;
}
.info-wrap-content{
  font-size: 12px;
  color: #8d8d8d;
}
</style>
