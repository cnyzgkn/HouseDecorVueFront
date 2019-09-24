import DrPagination from '@/components/base/dr-pagination.vue'
import  DrNodata from '@/components/base/dr-nodata.vue'
import global from '@/common/config/global.js'
import MyCollectionDetail from './my-collection-detail.vue'
export default {
  'name': 'MyCollection',
  components:{DrPagination,DrNodata,MyCollectionDetail},
  data () {
    return {
      topCategorys:global.topCategory,
      activeTopCategoryId:'my-collection-top-category-' + global.topCategory[0].id,// 当前选中的一级分类（模型 1 材质 2）
      categoryTypeDict:[], // 分类名称列表
      choosedTypeDict:[], //用于修改分类下拉选择分类
      activeCategorytype:'', // 当前分类ID
      searchParam:{ 
        "categoryId": null,
        "modelOrMaterial":global.topCategory[0].id,
        "pageNo": 1,
        "pageSize": 10,
        "userId": 0,
        "sortBy":1 //排序方式：1 降序 2 生序  默认降序
      },
      myCollectionList:[],
      total:0,
      addvisible:false,
      newCategoryForm:this.$form.createForm(this),
      updateVisible:false,
      updateCategoryId:null, //更新分类名称
      updateId:null,//需要修改的收藏id
      isNodata:true,//是否无数据，默认无数据
      currentCollection:{} //当前鼠标悬浮的收藏
    }
  },
  created () {
    //获取我的收藏分类数据字典
    this.getFavoriteCategoryDist()
  },
  methods:{
    /**
     * 获取我的收藏分类数据字典
     */
    getFavoriteCategoryDist(){
      const self=this
      let userInfo = this.$getUserInfo()
      this.$http.post('/dr-web/favoriteCategory/queryFavoriteCategory',{userId: userInfo.user.userId}).then(function(res){
        if(res.code==1) {
          if(res &&res.data &&res.data.length>0){
            self.categoryTypeDict=res.data?res.data:[]
            self.choosedTypeDict=self.categoryTypeDict.filter(item=>item.id!=='all')
            self.categoryTypeDict.unshift({ //增加全部分类
              id:'all',
              name:'全部分类'
            })
            const param={categoryId:self.categoryTypeDict[0].id,pageNo: 1}
            self.activeCategorytype=self.categoryTypeDict[0].id
            self.queryList(param)
          }
          else {
            self.categoryTypeDict=[]
            self.categoryTypeDict=null
            self.myCollectionList=[]
            self.total=0
          }
        }else {
          self.categoryTypeDict=[]
          self.$notification.error({
            message:'失败',
            description:res.msg || '获取我的收藏分类失败，请稍后再试！'
          })
        }
      })
    },
    /**
     * 查询收藏列表根据分类Id
     * @param key
     */
    categorychange(key){
      const param={categoryId:key,pageNo:1}
      this.activeCategorytype=param.categoryId
      this.searchParam.sortBy = 1
      this.queryList(param)
    },
    /**
     * 收藏查询
     * @param pageNo
     */
    queryList(param){
      const self=this
      self.myCollectionList=[]
      self.total=0
      let userInfo = this.$getUserInfo()
      this.$gLoading.show('正努力加载...')
      this.searchParam={...this.searchParam,userId:userInfo.user.userId,...param}
      if(this.searchParam.categoryId === 'all'){
        this.searchParam.categoryId = null
      }
      this.$http.post('/dr-web/modelES/queryFavoriteFromES',this.searchParam).then(function(res){
        self.$gLoading.hide()
        if(res.code==1) {
          if(res && res.data && res.data.list && res.data.list.length >0 ){
            self.myCollectionList=res.data.list
          }
          self.total=res.data && res.data.count ?res.data.count:0
          self.isNodata = (res.data && res.data.count)?false:true
        }else {
          self.$notification.error({
            message:'失败',
            description:res.msg || '获取我的收藏失败，请稍后再试！'
          })
        }
      })
    },
    /**
     * 分页查询
     * @param pageNo
     */
    onPagesizeChange(pageNo){
      const param={pageNo}
      this.queryList(param)
    },
    /**
     * 新增分类
     */
    addCategory(){
      this.addvisible=true
      this.$nextTick(() => {
        this.newCategoryForm.setFieldsValue({addCategoryName:''})
      })
    },
    /**
     * 新增分类提交
     */
    addCategorysubmit(){
      this.newCategoryForm.validateFields((err, values) => {
        if (err) {
          return
        } 
        this.doAddCategorysubmit()
      })
    },
    doAddCategorysubmit(){
      let self = this
      self.$gLoading.show('正在添加分类....')
      let userInfo = this.$getUserInfo()
      const param={
        "name": this.newCategoryForm.getFieldValue('addCategoryName'),
        "userId": userInfo.user.userId
      }
      this.$http.post('/dr-web/favoriteCategory/addFavoriteCategory',param).then(function(res){
        self.$gLoading.hide()
        if(res.code==1) {
          self.$notification.success({
            message:'成功',
            description:'添加分类成功'
          })
          //重新获取分类数据字典
          self.getFavoriteCategoryDist()
          self.addvisible=false
        }
        else {
          self.$notification.error({
            message:'失败',
            description:res.msg || '新增分类失败，请稍后再试！'
          })
        }
      })
    },
    /**
     * 取消新增分类
     */
    canceladdcategory(){
      this.addvisible=false
    },
    /**
     * 显示新增分类按钮
     */
    showEditCategory(index,event){
      const myCollectionList=Object.assign([],this.myCollectionList)
      myCollectionList[index].editCategoryFlag=true
      this.myCollectionList=myCollectionList
      this.currentCollection =  myCollectionList[index]
    },
    /**
     * 隐藏新增分类按钮
     */
    hideEditCategory(index){
      const myCollectionList=Object.assign([],this.myCollectionList)
      myCollectionList[index].editCategoryFlag=false
      this.myCollectionList=myCollectionList
    },
    /**
     * 修改分类
     */
    updateCategory(collection){
      this.updateId=collection.favoriteModelId
      this.updateCategoryId=null
      this.updateVisible=true
    },
    /**
     * 修改分类提交
     */
    updateCategorysubmit(){
      const self=this
      if(this.$ifEmpty(this.updateCategoryId)){
        this.$message.error('请选择分类')
      }
      else {
        self.$gLoading.show('正在更新分类....')
        let userInfo = this.$getUserInfo()
        const param={
          'favoriteId':this.updateId,
          "categoryId": this.updateCategoryId,
          "userId": userInfo.user.userId
        }
        this.$http.post('/dr-web/favoriteModel/move',param).then(function(res){
          self.$gLoading.hide()
          if(res.code==1) {
            self.$notification.success({
              message:'成功',
              description:'更新分类成功'
            })
            //重新刷新收藏列表
            self.searchParam.pageNo = 1
            self.queryList(self.searchParam)
            self.updateVisible=false
          }else {
            self.$notification.error({
              message:'失败',
              description:res.msg || '更新分类失败，请稍后再试！'
            })
          }
        })
      }

    },
    /**
     * 取消修改分类
     */
    cancelupdatecategory(){
      this.updateVisible=false

    },
    /**
     * 返回到首页
     */
    backhome() {
      this.$router.push('/home')
    },
    //点击取消收藏时，二次弹窗确认
    onCancelCollection(id){
      let _this = this
      this.$confirm({
        title: '确认取消收藏吗?',
        onOk () {
          _this.doCancelCollection(id)
        },
        onCancel () {}
      })
    },
    //取消收藏
    doCancelCollection(id){
      let userInfo = this.$getUserInfo()
      if (!userInfo || !userInfo.user || !userInfo.user.userId) {
        this.$message.error('未获取到用户信息，请重新登录！')
        return
      }
      this.$http.post('/dr-web/favoriteModel/cancel',{
        modelId:id,
        userId:userInfo.user.userId
      }).then( data => {
        if(data.code === 1){
          this.$notification.success({
            message: '成功',
            description: '取消收藏成功！'
          })
          this.queryList({pageNo:1})
        }else{
          this.$notification.error({
            message: '失败',
            description: data.msg || '取消收藏失败！'
          })
        }
      })
    },
    // 点击一级分类（切换模型和材质时）
    topCategorychange(key){
      let modelOrMaterial = Number(key.substr(-1,1))
      this.searchParam.sortBy = 1
      const param={modelOrMaterial:modelOrMaterial,pageNo:1,categoryId:'all'}
      this.activeCategorytype='all'
      this.queryList(param)
    },
    //改变排序方式
    changeSort(tag){
      this.searchParam.sortBy = tag
      this.queryList({pageNo:1})
    },
    // 浮层渲染节点
    getPopupContainer(){
      return document.getElementById('my-collection-wrap')
    }
  }
}
