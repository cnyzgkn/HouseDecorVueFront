<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <dr-header v-if="showheader" />
      <div :class="{'maincontent':showheader}">
        <router-view />
      </div>
    </div>
  </a-locale-provider>
</template>

<script>
import DrHeader from '@/components/header.vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  'name': 'App',
  components: { DrHeader },
  data () {
    return {
      locale: zhCN,
      showheader:false
    }
  },
  watch: {
    '$route' (to, from) {
      if(to.meta.hideHeader){
        this.showheader=false
      }else{
        this.showheader=true
      }
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  }
}
</script>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
  .maincontent {
    min-width: 1204px;
    margin-top: 66px;
    background: #F5F5F5;
    padding: 29px 60px 20px 60px;
    overflow: auto;
  }
</style>
