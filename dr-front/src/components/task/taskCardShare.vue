<!--任务共享-->
<template>
  <div>
    <a-modal
      :visible="showTaskShare"
      title="任务共享"
      v-bind="$attrs"
      centered
      :dropdown-match-select-width="true"
      :mask-closable="true"
      :destroy-on-close="true"
      :confirm-loading="confirmLoading"
      :footer="showFooter"
      v-on="$listeners"
      @cancel="onCancel"
    >
      <!--已共享-->
      <template v-if="shareInfo">
        当前任务已共享给:
        <a-tag
          closable
          color="#586287"
          style="font-size:14px;height:32px;line-height:32px;margin-bottom:20px;"
          @close="onCancelShare"
        >
          {{ shareInfo.username }}
        </a-tag>
      </template>
      <!--未共享-->
      <template v-else>
        <a-form :form="form">
          <a-form-item
            label="设计师"
          >
            <a-select
              v-decorator="[
                'selectedDesignerMobile',
                {rules: [{ required: true, message: '请选择设计师！' }]}
              ]"
              placeholder="搜索设计师"
              show-search
              :filter-option="filterOption"
              @change="handleSelectChange"
            >
              <a-select-option
                v-for="des in designers"
                :key="`task-card-share-${des.userId}`"
                :value="des.designerMobile"
              >
                {{ `${des.designerName}(${des.designerMobile})` }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
        <template
          slot="footer"
        >
          <a-button
            key="cancel"
            @click="onCancel"
          >
            取消
          </a-button>
          <a-button
            key="submit"
            html-type="submit"
            type="primary"
            :loading="confirmLoading"
            @click="onSure"
          >
            确认提交
          </a-button>
        </template>
      </template>
    </a-modal>
  </div>
</template>
<script>
export default {
  name:'TaskCardShare',
  props:{
    showTaskShare:{
      type:Boolean,
      default:false,
      required:true
    },
    taskId:{
      type:Number,
      default:-1,
      required:true
    }
  },
  data(){
    return{
      shareInfo:null, // 被共享设计师信息
      designers:[], // 可选择的设计师
      selectedDesignerMobile:'', // 已选中的设计师手机号码
      form: this.$form.createForm(this),
      confirmLoading:false
    }
  },
  computed:{
    // eslint-disable-next-line vue/return-in-computed-property
    showFooter:function(){ // 是否隐藏footer，当有共享信息时隐藏
      if(this.shareInfo){
        return null
      }
    }
  },
  created(){
    this.queryShareInfo()
    this.queryDesigners()
  },
  methods:{
    // 查询该任务被共享设计师信息
    queryShareInfo(){
      let data = {
        taskId:this.taskId
      }
      this.$gLoading.show('正查询共享信息...')
      this.$http.post('/dr-web/designTaskBelong/getShareDesigner ',data).then( data => {
        if(data.code === 1){
          this.shareInfo = data.data
        }else{
          this.$notification.error({
            message: '失败',
            description: data.msg || '查询共享信息失败，请稍后再试！'
          })
        }
      }).finally( () => {
        this.$gLoading.hide()
      })
    },
    //查询设计师
    queryDesigners(){
      if(this.designers.length > 0){
        return
      }
      this.$gLoading.show('正查询设计师...')
      let userInfo = this.$getUserInfo()
      let data = {
        sessionId:userInfo.sessionId,
        userId:userInfo.user.userId
      }
      this.$http.post('/dr-web/designTaskBelong/queryDesigners',data).then( data => {
        if(data.code === 1){
          this.designers = data.data.list
          this.filterDesigners(this.designers)
        }else{
          this.$notification.error({
            message: '失败',
            description: data.msg || '查询设计师，请稍后再试！'
          })
        }
      }).finally( () => {
        this.$gLoading.hide()
      })
    },
    // 确认
    onSure(){
      this.form.validateFields((err, values) => {
        if (!err) {
          this.doShare()
        }
      })
    },
    // 取消
    onCancel(){
      this.$emit('update:showTaskShare', false)
    },
    // 当选择设计师时
    handleSelectChange(value){
      this.selectedDesignerMobile = value
    },
    // 分享
    doShare(){
      this.confirmLoading = true
      let data = {
        mobile:this.selectedDesignerMobile,
        taskId:this.taskId
      }
      this.$http.post('/dr-web/designTaskBelong/shareDesigner',data).then( data => {
        if(data.code === 1){
          this.$notification.success({
            message: '成功',
            description: '共享成功！'
          })
          this.onCancel()
        }else{
          this.$notification.error({
            message: '失败',
            description: data.msg || '共享给设计师失败，请稍后再试！'
          })
        }
      }).finally( () => {
        this.confirmLoading = false
      })
    },
    // 模糊搜索
    filterOption(input,option){
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 取消共享
    onCancelShare(e){
      e.preventDefault()
      const _this = this
      this.$confirm({
        title:'确认',
        content:`确认取消共享给 ${_this.shareInfo.username} 吗？`,
        onOk:() => {
          _this.$gLoading.show('正取消共享...')
          _this.$http.post('/dr-web/designTaskBelong/cancelShare',{
            taskId:_this.taskId
          }).then( (data) => {
            if(data.code === 1){
              _this.$notification.success({
                message: '成功',
                description: '取消共享成功！'
              })
              _this.shareInfo = null
            }else{
              _this.$notification.error({
                message: '失败',
                description: data.msg || '取消共享失败，请稍后再试！'
              })
            }
          }).finally( () => {
            _this.$gLoading.hide()
          })
        },
        onCancel:() => {
        }
      })
    },
    // 过滤设计师（排除当前登录设计师）
    filterDesigners(allDesigners) {
      const userInfo = this.$getUserInfo()
      for(let i = 0;i<allDesigners.length;i++){
        // 手机号一致，则认为是同一个设计师
        if(allDesigners[i].designerMobile === userInfo.user.mobile){
          allDesigners.splice(i,1)
          return 
        }
      }
    }
  }
}
</script>
