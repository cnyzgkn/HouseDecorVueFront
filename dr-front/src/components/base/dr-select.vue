<template>
  <div
    class="drselect"
    :class="{'drselect-foucs':isFoucs}"
  >
    <a-input-group compact>
      <a-select
        v-model="searchParam.selectedkey"
        @dropdownVisibleChange="onDropdownVisibleChange"
      >
        <a-select-option
          v-for="opt in drSelectArr"
          :key="opt.key"
          :value="opt.key"
        >
          {{ opt.name }}
        </a-select-option>
      </a-select>
      <a-input-search
        v-model="searchParam.searchcontent"
        placeholder="请输入关键字"
        enter-button
        class="selectInput"
        @search="search"
      />
    </a-input-group>
  </div>
</template>
<script>
export default {
  name: 'DrSelect',
  props: {
    value: {
      type: Object,
      default () {
        return {
          selectedkey: null,
          searchcontent: ''
        }
      }
    },
    drSelectArr: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      searchParam: {},
      isFoucs:false
    }
  },
  mounted () {
    if (this.value != '') {
      this.searchParam = this.value
    }
  },
  methods: {
    /**
       * tabschange
       * 切换面板的回调
       * @param index
       */
    search () {
      this.$emit('drSearch', this.searchParam)
    },
    onDropdownVisibleChange(open){
      this.isFoucs = open
    }
  }
}
</script>
<style lang="less" scoped>
  .drselect {
    width:400px;
    background:rgba(255,255,255,1);
    height: 38px;
    border-radius: 18px;
    .selectInput  {
      width: 306px;

    }
    /deep/.ant-input-group.ant-input-group-compact {
      width: 400px;
    }
    /deep/.ant-select {
      width: 95px;
      /deep/.ant-select-selection {
        border:none;
        box-shadow: none;
      }
    }
    /deep/.ant-select-selection__rendered {
      margin-right: 0px;
      text-align: center;
      margin-left: 20px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(92,92,92,1);
      margin-top: 3px;

    }
    /deep/.ant-select-selection--single  {
      background-color: transparent;
    }
    /deep/.ant-input-group.ant-input-group-compact .ant-input {
      width: 305px;
      background-color: transparent;
    }
    /deep/.ant-input {
      border:none;
      box-shadow: none;
    }
    /deep/.ant-btn-primary {
      margin-top: 2px;
      height: 40px;
    }
  }
  .drselect-foucs{
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0
  }
</style>
