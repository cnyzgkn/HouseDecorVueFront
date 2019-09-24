<template>
  <div class="nodata">
    <img src="../../assets/images/noData.png">
    <div class="nodatatext">
      暂无数据
    </div>
  </div>
</template>
<script>
export default {
  'name': 'DrNodata',
  data () {
    return {}
  },
  watch: {

  },
  mounted () {

  },
  methods: {
  }
}
</script>
<style lang="less">
  .nodata {
    width: 340px;
    margin:  0 auto;
    .nodatatext {
      margin-top: 20px;
      font-size:16px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(213,213,213,1);
      text-align: center;
    }
  }

</style>
