import Vue from 'vue'
// babel-plugin-import 会帮助你加载 JS 和 CSS
import { Button, Tabs, Select,
  Input, Menu, Pagination,
  Icon, notification, message,
  Form, Modal, LocaleProvider,
  Dropdown, Avatar ,Upload ,Skeleton,
  Radio,Checkbox,Divider,Spin,Popover,Tag,Carousel,Progress, Badge,Row,Col,List} from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import baseFunc from './common/utils/baseFunc.js'
import axios from './common/utils/axios.js'
import './common/baseStyle.css'
// mock假数据
// import '../mock'

notification.config({
  placement: 'topRight',
  top: '20px',
  duration: 4.5,
});
Vue.config.productionTip = false

// ant-design-vue
Vue.use(Button)
Vue.use(Tabs)
Vue.use(Select)
Vue.use(Input)
Vue.use(Menu)
Vue.use(Pagination)
Vue.use(Icon)
Vue.use(Form)
Vue.use(Modal)
Vue.use(LocaleProvider)
Vue.use(Dropdown)
Vue.use(Avatar)
Vue.use(Upload)
Vue.use(Skeleton)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(Divider)
Vue.use(Spin)
Vue.use(Popover)
Vue.use(Tag)
Vue.use(Carousel)
Vue.use(Progress)
Vue.use(Badge)
Vue.use(Row)
Vue.use(Col)
Vue.use(List)
Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$confirm = Modal.confirm

if(location.origin !== 'https://dr.ihomefnt.com'){
  console.log(process.env.VUE_APP_ENV)

  var Vconsole = require('vconsole')
  // eslint-disable-next-line no-unused-vars
  var vConsole = new Vconsole()
}

Vue.use(baseFunc)
Vue.use(axios)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

