<template>
  <div>
    <div
      v-if="show"
      class="zh-load-mark"
    >
      <div class="zh-load-box">
        <div class="zh-loading">
          <div class="loading_leaf loading_leaf_0" />
          <div class="loading_leaf loading_leaf_1" />
          <div class="loading_leaf loading_leaf_2" />
          <div class="loading_leaf loading_leaf_3" />
          <div class="loading_leaf loading_leaf_4" />
          <div class="loading_leaf loading_leaf_5" />
          <div class="loading_leaf loading_leaf_6" />
          <div class="loading_leaf loading_leaf_7" />
          <div class="loading_leaf loading_leaf_8" />
          <div class="loading_leaf loading_leaf_9" />
          <div class="loading_leaf loading_leaf_10" />
          <div class="loading_leaf loading_leaf_11" />
        </div>
        <div class="zh-load-content">
          {{ msg }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  'name': 'DrSpin',
  data () {
    return {
      show: false,
      msg: ''
    }
  },
  watch: {

  },
  mounted () {

  },
  methods: {
    showSpin (msg) {
      if (msg !== null && msg !== undefined && msg !== '') {
        this.msg = msg
      } else {
        this.msg = '加载中....'
      }
      this.show = true
    },
    hideSpin () {
      this.show = false
    }

  }
}
</script>
<style lang="less">
  .zh-load-mark {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }
  .zh-load-box {
    position: fixed;
    z-index: 3;
    width: 7.6em;
    min-height: 7.6em;
    top: 250px;
    left: 50%;
    margin-left: -3.8em;
    background: #FFFFFF;
    text-align: center;
    border-radius: 5px;
    color: #586287;
  }
  .zh-load-content {
    margin-top: 64%;
    font-size: 14px;
  }
  .zh-loading {
    position: absolute;
    width: 0px;
    left: 50%;
    top: 38%;
  }
  .loading_leaf {
    position: absolute;
    top: -1px;
    opacity: 0.25;
  }
  .loading_leaf:before {
    content: " ";
    position: absolute;
    width: 9.14px;
    height: 3.08px;
    background: #d1d1d5;
    box-shadow: rgba(0, 0, 0, 0.0980392) 0px 0px 1px;
    border-radius: 1px;
    -webkit-transform-origin: left 50% 0px;
    transform-origin: left 50% 0px;
  }
  .loading_leaf_0 {
    -webkit-animation: opacity-0 1.25s linear infinite;
    animation: opacity-0 1.25s linear infinite;
  }
  .loading_leaf_0:before {
    -webkit-transform: rotate(0deg) translate(7.92px, 0px);
    transform: rotate(0deg) translate(7.92px, 0px);
  }
  .loading_leaf_1 {
    -webkit-animation: opacity-1 1.25s linear infinite;
    animation: opacity-1 1.25s linear infinite;
  }
  .loading_leaf_1:before {
    -webkit-transform: rotate(30deg) translate(7.92px, 0px);
    transform: rotate(30deg) translate(7.92px, 0px);
  }
  .loading_leaf_2 {
    -webkit-animation: opacity-2 1.25s linear infinite;
    animation: opacity-2 1.25s linear infinite;
  }
  .loading_leaf_2:before {
    -webkit-transform: rotate(60deg) translate(7.92px, 0px);
    transform: rotate(60deg) translate(7.92px, 0px);
  }
  .loading_leaf_3 {
    -webkit-animation: opacity-3 1.25s linear infinite;
    animation: opacity-3 1.25s linear infinite;
  }
  .loading_leaf_3:before {
    -webkit-transform: rotate(90deg) translate(7.92px, 0px);
    transform: rotate(90deg) translate(7.92px, 0px);
  }
  .loading_leaf_4 {
    -webkit-animation: opacity-4 1.25s linear infinite;
    animation: opacity-4 1.25s linear infinite;
  }
  .loading_leaf_4:before {
    -webkit-transform: rotate(120deg) translate(7.92px, 0px);
    transform: rotate(120deg) translate(7.92px, 0px);
  }
  .loading_leaf_5 {
    -webkit-animation: opacity-5 1.25s linear infinite;
    animation: opacity-5 1.25s linear infinite;
  }
  .loading_leaf_5:before {
    -webkit-transform: rotate(150deg) translate(7.92px, 0px);
    transform: rotate(150deg) translate(7.92px, 0px);
  }
  .loading_leaf_6 {
    -webkit-animation: opacity-6 1.25s linear infinite;
    animation: opacity-6 1.25s linear infinite;
  }
  .loading_leaf_6:before {
    -webkit-transform: rotate(180deg) translate(7.92px, 0px);
    transform: rotate(180deg) translate(7.92px, 0px);
  }
  .loading_leaf_7 {
    -webkit-animation: opacity-7 1.25s linear infinite;
    animation: opacity-7 1.25s linear infinite;
  }
  .loading_leaf_7:before {
    -webkit-transform: rotate(210deg) translate(7.92px, 0px);
    transform: rotate(210deg) translate(7.92px, 0px);
  }
  .loading_leaf_8 {
    -webkit-animation: opacity-8 1.25s linear infinite;
    animation: opacity-8 1.25s linear infinite;
  }
  .loading_leaf_8:before {
    -webkit-transform: rotate(240deg) translate(7.92px, 0px);
    transform: rotate(240deg) translate(7.92px, 0px);
  }
  .loading_leaf_9 {
    -webkit-animation: opacity-9 1.25s linear infinite;
    animation: opacity-9 1.25s linear infinite;
  }
  .loading_leaf_9:before {
    -webkit-transform: rotate(270deg) translate(7.92px, 0px);
    transform: rotate(270deg) translate(7.92px, 0px);
  }
  .loading_leaf_10 {
    -webkit-animation: opacity-10 1.25s linear infinite;
    animation: opacity-10 1.25s linear infinite;
  }
  .loading_leaf_10:before {
    -webkit-transform: rotate(300deg) translate(7.92px, 0px);
    transform: rotate(300deg) translate(7.92px, 0px);
  }
  .loading_leaf_11 {
    -webkit-animation: opacity-11 1.25s linear infinite;
    animation: opacity-11 1.25s linear infinite;
  }
  .loading_leaf_11:before {
    -webkit-transform: rotate(330deg) translate(7.92px, 0px);
    transform: rotate(330deg) translate(7.92px, 0px);
  }
  @-webkit-keyframes opacity-0 {
    0% {
      opacity: 0.25;
    }
    0.01% {
      opacity: 0.25;
    }
    0.02% {
      opacity: 1;
    }
    60.01% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.25;
    }
  }
  @-webkit-keyframes opacity-1 {
    0% {
      opacity: 0.25;
    }
    8.34333% {
      opacity: 0.25;
    }
    8.35333% {
      opacity: 1;
    }
    68.3433% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.25;
    }
  }
  @-webkit-keyframes opacity-2 {
    0% {
      opacity: 0.25;
    }
    16.6767% {
      opacity: 0.25;
    }
    16.6867% {
      opacity: 1;
    }
    76.6767% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.25;
    }
  }
  @-webkit-keyframes opacity-3 {
    0% {
      opacity: 0.25;
    }
    25.01% {
      opacity: 0.25;
    }
    25.02% {
      opacity: 1;
    }
    85.01% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.25;
    }
  }
  @-webkit-keyframes opacity-4 {
    0% {
      opacity: 0.25;
    }
    33.3433% {
      opacity: 0.25;
    }
    33.3533% {
      opacity: 1;
    }
    93.3433% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.25;
    }
  }
  @-webkit-keyframes opacity-5 {
    0% {
      opacity: 0.270958333333333;
    }
    41.6767% {
      opacity: 0.25;
    }
    41.6867% {
      opacity: 1;
    }
    1.67667% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.270958333333333;
    }
  }
  @-webkit-keyframes opacity-6 {
    0% {
      opacity: 0.375125;
    }
    50.01% {
      opacity: 0.25;
    }
    50.02% {
      opacity: 1;
    }
    10.01% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.375125;
    }
  }
  @-webkit-keyframes opacity-7 {
    0% {
      opacity: 0.479291666666667;
    }
    58.3433% {
      opacity: 0.25;
    }
    58.3533% {
      opacity: 1;
    }
    18.3433% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.479291666666667;
    }
  }
  @-webkit-keyframes opacity-8 {
    0% {
      opacity: 0.583458333333333;
    }
    66.6767% {
      opacity: 0.25;
    }
    66.6867% {
      opacity: 1;
    }
    26.6767% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.583458333333333;
    }
  }
  @-webkit-keyframes opacity-9 {
    0% {
      opacity: 0.687625;
    }
    75.01% {
      opacity: 0.25;
    }
    75.02% {
      opacity: 1;
    }
    35.01% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.687625;
    }
  }
  @-webkit-keyframes opacity-10 {
    0% {
      opacity: 0.791791666666667;
    }
    83.3433% {
      opacity: 0.25;
    }
    83.3533% {
      opacity: 1;
    }
    43.3433% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.791791666666667;
    }
  }
  @-webkit-keyframes opacity-11 {
    0% {
      opacity: 0.895958333333333;
    }
    91.6767% {
      opacity: 0.25;
    }
    91.6867% {
      opacity: 1;
    }
    51.6767% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.895958333333333;
    }
  }

</style>
