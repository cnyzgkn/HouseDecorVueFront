<!--查看进程-->
<template>
  <a-modal
    centered
    class="schemeProcessModal"
    title="审批流转进程"
    v-bind="$attrs"
    :footer="null"
    v-on="$listeners"
  >
    <template v-if="processInfo.length === 0">
      <dr-nodata />
    </template>
    <template
      v-else
    >
      <p
        v-for="process in processInfo"
        :key="process.applicantTime"
        class="process"
        :class="getClassInfo(process).className"
      >
        <span class="process_info_name">{{ process.applicantName }}</span>
        <span class="process_info_role">{{ process.applicantRole }}</span>
        <span class="process_info_time">{{ process.applicantTimeStr }}</span>
        <span class="process_info_status">
          {{ process.passStr }}
          <a-icon
            class="process_info_icon"
            theme="twoTone"
            :two-tone-color="getClassInfo(process).themeColor"
            :type="getClassInfo(process).iconType"
          />
        </span>
      </p>
    </template>
  </a-modal>
</template>

<script>
import  DrNodata from '@/components/base/dr-nodata.vue'
export default {
  'name':'SchemeProcessModal',
  components:{DrNodata},
  data(){
    return{
      processInfo:  [],
    }
  },
  methods:{
    getProcessInfo(id){
      let _this = this
      return new Promise(function (resolve, reject) {
        _this.$gLoading.show('正努力加载...')
        _this.$http.post('/dr-web/productSolution/showSolutionProcess', {
          solutionId: id,
          userId: _this.$getUserInfo().user.userId
        }).then(data => {
          _this.$gLoading.hide()
          if (data.code === 1) {
            _this.processInfo = data.data
            resolve()
          } else {
            _this.$notification.error({
              message: '获取进程信息失败',
              description: data.msg || '服务器异常，请稍后再试！'
            })
            reject()
          }
        }).catch(() => {
          reject()
        })
      })
    },
    getClassInfo(process){
      let suffix = ''
      let type = ''
      let themeColor = ''
      switch (process.pass) {
        case "0":
          suffix='reject'
          type = 'close-circle'
          themeColor = '#DA3F27'
          break;
        case "1":
          suffix='pass'
          type = 'check-circle'
          themeColor = '#6BA469'
          break;
        case "2":
          suffix='launch'
          type='clock-circle'
          themeColor = '#7493D0'
          break;
        default:
          break;
      } 
      let obj =  {
        className:'process_' + suffix,
        iconType:type,
        themeColor:themeColor
      }
      return obj
    }
  }
}
</script>

<style>
.schemeProcessModal{
  width: 560px !important;
}
 .schemeProcessModal .ant-modal-content{
   background-color: rgba(245,245,245,1)
 }
 .schemeProcessModal .process{
   width: calc(100% - 20px);
   padding-bottom: 10px;
   font-size:14px;
   font-weight:500;
   border-bottom: 1px solid #DFDFDF;
 }
 .schemeProcessModal .process > span{
   display: inline-block;
 }
 .schemeProcessModal .process_reject > span{
   color: #C65050;
 }
 .schemeProcessModal .process_pass> span{
   color: #6BA469;
 }
 .schemeProcessModal .process_launch> span{
   color: #5C5C5C;
 }
 .process_info_role{
   width:140px; 
 }
 .process_info_status{
   float: right;
   margin-right: -20px;
   text-align: right;
 }
 .process_info_icon{
   font-size: 18px;
   margin-left: 8px;
 }
</style>
