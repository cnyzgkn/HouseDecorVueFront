<template>
  <a-pagination
    v-model="current"
    v-bind="$attrs"
    :hide-on-single-page="true"
    :item-render="itemRender"
    v-on="inputListeners"
  />
</template>
<script>
export default {
  'name': 'DrPagination',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      current: this.value
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
          change: function (page, pageSize) {
            // 修复当第二次输入超过总页数值时，输入框不能重置为当前最大页数的bug
            vm.$children[0].$children[0].$children[0].stateCurrentInputValue  = page
            vm.$emit('change', page)
          }
        }
      )
    }
  },
  watch: {
    value (val) {
      this.current = val
    }
  },
  methods: {
    itemRender (current, type, originalElement) {
      if (type === 'prev') {
        return <a>上一页</a>
      } else if (type === 'next') {
        return <a>下一页</a>
      }
      return originalElement
    }
  }
}
</script>
<style lang="less">
    .ant-pagination-simple .ant-pagination-simple-pager input {
      width: 60px;
      border: none;
      border-radius: 16px;
    }
    .ant-pagination-prev, .ant-pagination-jump-prev, .ant-pagination-jump-next {
      margin-right: 30px;
    }

    .ant-pagination-simple .ant-pagination-simple-pager {
      margin-right: 30px;
    }
</style>
