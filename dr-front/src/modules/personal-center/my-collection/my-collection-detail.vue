<!--收藏详情弹窗-->
<template>
  <div
    ref="collection-info"
    class="collection-detail-wrap"
  >
    <img
      width="350"
      height="350"
      class="imgpng"
      :src="$ifAliyunImage(collectionInfo.image)?collectionInfo.image+'!thumc-350x350':collectionInfo.image+'?imageView2/2/w/350/h/350'"
      onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP0AAAD8AgMAAADBB0rKAAAADFBMVEX8/Pz////7+/vw8PAN5jRjAAAAAnRSTlPvELLCMn8AAAIVSURBVGje7dhBjqMwEAXQnHeOZkt4DxJ1HyPZeyxVDQEChjStfLKYxXxW3Yt6fBcUmDz+uK+Ox4MAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQOCnI3wJeFMYkNJW9WYwUMRM01ZvEQRCTrnPxdJabyMINGqlmKRp7XYLmBKYdMle9Tgg0hWdVm43gb4U1bydf2qoRCyBSc6tkx3oFUuQk8aq3jQkLMFz/VW9aWNgAneoN0MTxKkNh6NRcJhO9WiCt3qLWA/8ud4GLIG8A1gP6lKdlzP0CHBYQZz/K+k+MOcZFQRUduD554gmiFuK5ZrCCfZGLivS8QvAzfOMAdvDcH4lPB/RLXgfHBKEyzfDJXBMEOzq3fRLAl8BDk9gMXwFVMM0rtMd/y3gvwUcCPhwBsTGu0Bcn5EQEN4ADyYYXtVB3R0gDPscVDf350AzVHfhrR6cAW8Y0IzHfYk3EAhH4JeN3tVVaOtL6E79/CTB+lCPe/2IAUn2s56ux2dN1B2Qpd5jCfoNWOsd2IMS1rrX+S1jgKzAMlRTfVewHiwJ7FWv2QQCpsT7PDunuYAJXOerehM1BR/r+xZj2l6U0qWcbgLRS8piUvQeMD737TZ1oEcTbAPQpNJNPQBnYQXm2L7JmruuRQGpB6gtBn+5huuv1Q8/fT+q5w8QBAgQIECAAAECBAgQIECAAAECBAgQIECAwH8I/AV93/QDLc4abwAAAABJRU5ErkJggg=='"
    >
    <div class="info-wrap">
      <h6 class="info-wrap-title">
        {{ collectionInfo.productName }}&nbsp;&nbsp;{{ collectionInfo.categoryName }}
      </h6>
      <p class="info-wrap-line">
        <span class="info-wrap-desc">价格</span><span class="info-wrap-content"> ¥ {{ collectionInfo.aijiaPrice }}</span>
      </p>
      <p class="info-wrap-line">
        <span class="info-wrap-desc">{{ collectionInfo.type !== 1? "长宽高":"宽高深" }}</span>
        <span class="info-wrap-content">{{ collectionInfo.length }} x {{ collectionInfo.width }} x {{ collectionInfo.height }} mm</span>
      </p>
      <p
        v-if="collectionInfo.skuId"
        class="info-wrap-line"
      >
        <span class="info-wrap-desc">SkuID</span><span class="info-wrap-content">{{ collectionInfo.skuId }}</span>
      </p>
      <p
        v-if="collectionInfo.modelCode && collectionInfo.modelCode !== '0'"
        class="info-wrap-line"
      >
        <span class="info-wrap-desc">ModelCode</span><span class="info-wrap-content">{{ collectionInfo.modelCode }}</span>
      </p>
      <p
        v-if="collectionInfo.spuId"
        class="info-wrap-line"
      >
        <span class="info-wrap-desc">SpuId</span><span class="info-wrap-content">{{ collectionInfo.spuId }}</span>
      </p>
      <p class="info-wrap-line">
        <span class="info-wrap-desc">厂家编号</span><span class="info-wrap-content">{{ collectionInfo.manufacturerModel }}</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  'name':'MyCollectionDetail',
  props:{
    collectionInfo:{ // 详情
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  data(){
    return {}
  }
}
</script>
<style lang="less" scoped>
.collection-detail-wrap{
  width: 350px;
  background-color: #F9F9F9;
  border-radius: 8px;
  text-align: left;
}
.collection-detail-wrap img{
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
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
