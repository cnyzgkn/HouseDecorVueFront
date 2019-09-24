
// 公用组件文本输入框
<template>
  <div class="dr-input-aera">
    <a-textarea
      v-model="text"
      v-bind="$attrs"
      type="textarea"
      v-on="listeners"
    />
    <span class="counter">{{ current }}&nbsp;&nbsp;/&nbsp;&nbsp;300</span>
  </div>
</template>
<script>
export default {
  'name':'DrInputArea',
  inheritAttrs:false,
  model:{
    prop: 'questionDesc',
    event: 'change'
  },
  props:{
    questionDesc:{
      type:String,
      default:''
    }
  },
  data(){
    return{
      text:this.questionDesc
    }
  },
  computed:{
    listeners:function (){
      let vm = this
      return Object.assign({},vm.$listeners,{
        change:function(){
          if(vm.text.length > 300){
            vm.text = vm.text.substring(0,300)
          }
          vm.$emit('change',vm.text)
        }
      })
    },
    current:function(){
      return this.text.length
    }
  }
}
</script>
<style  lang="less" scoped>
.dr-input-aera{
  position: relative;
}
/deep/textarea{
  height: 136px !important;
  border-radius: 4px;
}
.counter{
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #C7C7C7;
  font-size: 12px;
  line-height: 1.5;
}
</style>

