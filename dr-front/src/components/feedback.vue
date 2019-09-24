<template>
  <a-modal
    :visible="showFeedback"
    title="问题反馈"
    :confirm-loading="confirmLoading"
    :destroy-on-close="true"
    :width="720"
    centered
    @cancel="onCancel"
  >
    <a-form :form="form">
      <a-form-item
        label="问题分类"
      >
        <a-radio-group
          v-decorator="[
            'questionClassify',
            {rules: [{ required: true, message: '请选择问题分类!' }]}
          ]"
          button-style="solid"
        >
          <a-radio-button value="0">
            模型
          </a-radio-button>
          <a-radio-button
            value="1"
          >
            材质
          </a-radio-button>
          <a-radio-button value="2">
            崩溃
          </a-radio-button>
          <a-radio-button value="3">
            建议
          </a-radio-button>
          <a-radio-button value="4">
            其他
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="问题描述"
      >
        <dr-input-aera
          v-decorator="[
            'questionDescribe',
            {rules: [{ required: true, message: '请输入问题描述!' }]}
          ]"
          placeholder="请输入问题描述，三百字以内。"
        />
      </a-form-item>
    </a-form>
    <template slot="footer">
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
  </a-modal>
</template>

<script>
import DrInputAera from '@/components/base/dr-input-aera.vue'
export default {
  'name':'FeedBack',
  components:{ DrInputAera },
  props:{
    showFeedback:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      questionClassify:'',// 问题分类
      questionDescribe:'', // 问题描述
      confirmLoading:false,
      form: this.$form.createForm(this),
    }
  },
  methods:{
    onCancel(){
      this.$emit('update:showFeedback', false)
    },
    onSure(){
      this.form.validateFields((err, values) => {
        if (!err) {
          this.doFeed()
        }
      })
    },
    doFeed(){
      let userInfo = this.$getUserInfo()
      if (!userInfo || !userInfo.user || !userInfo.user.userId) {
        this.$message.error('未获取到用户信息，请重新登录！')
        return
      }
      let data = {
        addUserId:userInfo.user.userId,
        phone:userInfo.user.mobile,
        questionClassify:Number(this.form.getFieldValue('questionClassify')), //问题分类
        questionDescribe:this.form.getFieldValue('questionDescribe') // 问题描述
      }
      this.confirmLoading = true
      this.$http.post('/dr-web/question/addQuestionFeedback',data).then( data => {
        if(data.code === 1){
          this.$notification.success({
            message: '成功',
            description: '问题反馈成功！'
          })
          this.confirmLoading = false
          this.onCancel()
        }else{
          this.$notification.error({
            message: '失败',
            description: data.msg || '问题提交失败，请稍后再试！'
          })
          this.confirmLoading = false
        }
      }).catch( () => {
        this.confirmLoading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-radio-button-wrapper{
  height: 36px;
  line-height: 36px;
  padding: 0 22px;
  background-color: #ffffff;
  border:none;
  border-radius: 3px;
  margin-right: 20px;
  border-left:1px solid #ffffff;
}
/deep/.ant-radio-button-wrapper:not(:first-child)::before{
  display: none;
}
/deep/.ant-form-item{
  // margin-bottom: 6px;
}
</style>
