import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "dr2.0" */ './modules/home/home.vue')
    },
    {
      path: '/my-task',
      name: 'myTask',
      component: () => import(/* webpackChunkName: "dr2.0" */ './modules/task/my-task.vue')
    },
    {
      path: '/my-product-scheme',
      name: 'myProductScheme',
      component: () => import(/* webpackChunkName: "dr2.0" */ './modules/scheme/my-project-scheme.vue')
    },
    {
      path: '/my-dna-scheme',
      name: 'myDnaScheme',
      component: () => import(/* webpackChunkName: "dr2.0" */ './modules/scheme/my-dna-scheme.vue')
    },
    {
      path: '/top-dna-scheme',
      name: 'topDnaScheme',
      component: () => import(/* webpackChunkName: "dr2.0" */ './modules/dna/top-dna-scheme.vue')
    },
    {
      path: '/project-household',
      name: 'projectHousehold',
      component: () => import(/* webpackChunkName: "dr2.0" */ './modules/household/project-household.vue')
    },
    {
      path: '/my-collection',
      name: 'MyCollection',
      meta:{
        hideHeader:true
      },
      component: () => import(/* webpackChunkName: "dr2.0" */ './modules/personal-center/my-collection/my-collection.vue')
    },
    {
      path: '/my-info',
      name: 'MyInfo',
      meta:{
        hideHeader:true
      },
      component: () => import(/* webpackChunkName: "dr2.0" */ './modules/personal-center/my-info.vue')
    },
    {
      path: '/about',
      name: 'About',
      meta:{
        hideHeader:true
      },
      component: () => import(/* webpackChunkName: "dr2.0" */ './modules/personal-center/about.vue')
    },
    {
      path: '/login',
      name: 'Login',
      meta:{
        hideHeader:true
      },
      component: () => import(/* webpackChunkName: "dr2.0" */ './Login.vue')
    },
    {
      path: '/albumsListLocal/:id',
      name: 'albumsList',
      meta:{
        hideHeader:true,
        hideMessageBox:true,
        inQt:true
      },
      component: () => import(/* webpackChunkName: "dr2.0" */ './modules/albums/albumsList.vue')
    },
    {
      path: '/albumsList',
      name: 'albumsList',
      meta:{
        hideHeader:true,
        hideMessageBox:true,
        inQt:true
      },
      component: () => import(/* webpackChunkName: "dr2.0" */ './modules/albums/albumsList.vue')
    },
    {
      path: '/house-custom',
      name: 'HouseCustom',
      meta:{
        hideHeader:true
      },
      component: () => import(/* webpackChunkName: "dr2.0" */ './modules/houseCustom/HouseCustom.vue')
    },
    {
      path: '/message-qt',
      name: 'MessageBox',
      meta: {
        hideHeader: true
      },
      component: () => import(/* webpackChunkName: "dr2.0" */ './components/messagebox/messagebox.vue')
    }
  ]
})
