<template>
  <div class="drtabs">
    <a-tabs
      v-model="activetab"
      v-bind="$attrs"
      v-on="inputListeners"
    >
      <slot />
    </a-tabs>
  </div>
</template>

<script>
export default {
  'name': 'DrTabs',
  inheritAttrs: false,
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: String
    }
  },
  data () {
    return {
      activetab: ''
    }
  },
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          change: function (activeKey) {
            vm.$emit('input', activeKey)
          }
        }
      )
    }
  },
  // mounted () {
  //   if (this.value != '') {
  //     this.activetab = this.value
  //   }
  // },
  // methods: {

  // },
  watch: {
    value (val) {
      this.activetab = val
    }
  },
  created () {
    this.activetab = this.value
  }
}
</script>
<style lang="less">
  .drtabs {
    .ant-tabs-bar {
      text-align: left;
      margin: 0px;
      .ant-tabs-nav-container {
        font-size: 14px;
        font-weight: 400;
        color: rgba(141, 141, 141, 1);

        .ant-tabs-nav {
          height: 36px;
          line-height: 36px;

          .ant-tabs-tab {
            margin: 0px 50px 0px 0px;
            padding: 0px;
          }

          .ant-tabs-tab-active {
            font-size: 14px;
            font-weight: 600;
            color: #5C5C5C;
          }
        }
      }
    }
    .ant-tabs-top .ant-tabs-ink-bar-animated, .ant-tabs-bottom .ant-tabs-ink-bar-animated {
      width: 20px !important;
      height: 4px;
      background: rgba(88, 98, 135, 1);
      border-radius: 2px;
    }
  }
</style>
