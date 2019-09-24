// 全屏加载
<template>
  <div class="drFullLoading-layer">
    <div class="drFullLoading-content">
      <p class="drFullLoading-title">
        正在加载资源[135/183] 72%
      </p>
      <a-progress :percent="30" />
      <p class="drFullLoading-progress-text">
        在三维设计页面，频繁切换2D/3D视角需要一定的加载时间哦
      </p>
      <div class="drFullLoading-iconswraper">
        <p
          v-for="(tip,index) in tips"
          :key="`fulltips_${index}`"
          :class="['drFullLoading-icon',`drFullLoading-icon_${index%3}`]"
        >
          <span
            v-for="(keyboard,index1) in tip.keyboards"
            :key="`fulltips_keyboard_${index1}`"
          >
            <template v-if="index1 === 0">
              {{ keyboard }}
            </template>
            <template v-else>
              {{ `+ ${keyboard}` }}
            </template>          
          </span>
          <template v-if="tip.keycodes">
            <span
              v-for="(code,index2) in tip.keycodes"
              :key="`fulltips_keycode_${index2}`"
            >
              {{ `+ ${code}` }}
            </span>
          </template>
          <template v-else>
            <template v-for="(icon,index3) in tip.keyicons">
              <span :key="`fulltips_keyicon_${index3}`">
                +
                <a-icon :type="icon" />
              </span>
            </template>
          </template>
          <span class="drFullLoadig-icon-text">{{ tip.text }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import {Progress,Icon} from 'ant-design-vue'
import Vue from 'vue'
Vue.use(Progress)
Vue.use(Icon)
export default {
  'name': 'DrFullLoading',
  data () {
    return {
      tips:[
        {
          keyboards:['ctrl'],
          keycodes:['C'],
          text:'复制'
        },
        {
          keyboards:['alt'],
          keycodes:['9'],
          text:'选中的墙、顶、地过门石UV偏移Y-0.01'
        },
        {
          keyboards:['shift'],
          keyicons:['caret-left'],
          text:'选中的墙、顶、地过门石UV偏移Y-0.01'
        },
        {
          keyboards:['ctrl'],
          keycodes:['V'],
          text:'黏贴'
        },
        {
          keyboards:['alt'],
          keycodes:['O'],
          text:'选中的墙、顶、地过门石UV偏移Y+0.01'
        },
        {
          keyboards:['shift'],
          keyicons:['caret-right'],
          text:'选中模型右移 10 mm'
        },
        {
          keyboards:['shift'],
          keycodes:['X'],
          text:'隐藏墙体 / 门 /窗'
        },
        {
          keyboards:['alt'],
          keyicons:['caret-up'],
          text:'选中模型上移 1 mm'
        },
        {
          keyboards:['shift','alt'],
          keyicons:['caret-up'],
          text:'选中模型上移 10 mm'
        },
        {
          keyboards:['ctrl'],
          keycodes:['S'],
          text:'保存方案'
        },
        {
          keyboards:['alt'],
          keyicons:['caret-down'],
          text:'选中模型下移 1 mm'
        },
        {
          keyboards:['shift','alt'],
          keyicons:['caret-down'],
          text:'选中模型下移 10 mm'
        },
        {
          keyboards:['ctrl'],
          keycodes:['鼠标左键'],
          text:'多选'
        },
      ]
    }
  }
}
</script>
<style scoped>
.drFullLoading-layer{
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:rgba(88, 98, 135, 1)
}
.drFullLoading-content{
  position: absolute;
  top:50%;
  left: 50%;
  width: 80%;
  transform: translate(-50%,-50%)
}
.drFullLoading-title{
  color: white;
  margin-bottom: 0;
}
.drFullLoading-progress-text{
  margin-top: 20px;
  font-size: 20px;
  color: white
}
.drFullLoading-iconswraper{
  display: flex;
  width: 1000px;
  flex-flow: row wrap;
}
.drFullLoading-icon{
    margin-right: 30px;
    padding: 0 10px;
    line-height: 48px;
    word-spacing: inherit;
    white-space: nowrap;
    background: rgba(71, 82, 123, 1);
    border-radius: 8px;
    color: white;
    font-size: 12px;
}
.drFullLoading-icon_0{
  width: 200px;
}
.drFullLoading-icon_1{
  width: 310px;
}
.drFullLoading-icon_0{
  width: 264px;
}
.drFullLoading-icon-letter{
  font-size: 16px;
  margin-right: 20px;
}
.anticon{
  font-size: 16px;
}
.drFullLoadig-icon-text{
  color: rgba(255, 255, 255, 1)
}
</style>
