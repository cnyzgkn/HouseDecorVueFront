import { getHouseStyle, getHouseSeries } from '@/common/base.api.js'
import * as schemeBase from './scheme.base.js'
import { execQtFuncByChannel } from '@/common/utils/baseMethods.js'
import global from '@/common/config/global.js'
import CustomOpinionModal from '@/components/scheme/custom-opinion-modal.vue'
export default {
  'name': 'DrScheme',
  components:{ CustomOpinionModal },
  props: {
    schemeInfo: { // 方案列表信息
      type: Object,
      require: true
    },
    schemeModule: { // 方案所属模块(MY:我的方案 TOP：精品方案)
      type: String,
      require: true
    }
  },
  computed: {
    //  根据条件
    //    1.方案所属模块（我的方案（MY） 精品方案（TOP））
    //    2.方案类型（普通方案（1） DNA方案（2）
    //    3.方案状态 普通方案:(99.草稿中 0.未提交|1.待审核|2.审核通过|3.审核不通过|4.已上线|其它.错误状态)  DNA方案:(0.下线|1.上线)
    // 控制不同的操作button
    handleButtons: function () {
      let buttons = [{
        type: 'primary',
        text: '打开方案',
        tag: 'open'
      }]

      // 精品DNA模块：打开方案
      if (this.schemeModule === 'TOP') {
        return buttons
      }
      // 我的DNA：打开方案
      if (this.schemeInfo.solutionType !== 1) {
        return buttons
      }
      //草稿中状态：打开方案
      // if(this.schemeInfo.status === 99){
      //   return buttons
      // }
      //已同步至beta系统的方案按betaStatus状态来控制操作
      switch (this.schemeInfo.betaStatus) {
        case 99: // 草稿
          // buttons.push({
          //   text: '提交审核',
          //   tag: 'submit'
          // })
          break
        case 0: // 未提交
          buttons.push({
            text: '提交审核',
            tag: 'submit'
          })
          break
        case 1: // 待审核
          // buttons.push({
          //   text: '提交审核',
          //   tag: 'submit'
          // })
          // buttons.push({
          //   text: '查看进程',
          //   tag: 'process'
          // })
          break
        // case 2: // 审核通过
          // buttons.push({
          //   text: '查看进程',
          //   tag: 'process'
          // })
          // break
        case 3: // 审核不通过
          buttons.push({
            text: '重新提交审核',
            tag: 'submit'
          })
          break
        case 4: // 已上线
          // buttons.push({
          //   text: '查看进程',
          //   tag: 'process'
          // })
          break
        case 5: // 渲染中
          // buttons.push({
          //   text: '提交审核',
          //   tag: 'submit'
          // })
          // buttons.push({
          //   text: '查看进程',
          //   tag: 'process'
          // })
          break
        case 6: // 已下线
          buttons.push({
            text: '提交审核',
            tag: 'submit'
          })
          // buttons.push({
          //   text: '查看进程',
          //   tag: 'process'
          // })
          break
        default:
          break
      }
      return buttons
    },
    //  根据条件
    //    1.方案所属模块（我的方案（MY） 精品方案（TOP））
    //    2.方案类型（普通方案（1） DNA方案（2）
    //    3.方案状态 普通方案:(99.草稿中 0.未提交|1.待审核|2.审核通过|3.审核不通过|4.已上线|其它.错误状态)  DNA方案:(0.下线|1.上线)
    // 控制不同的操作icon
    handleIcons: function () {
      let icons = [{
        text: '信息',
        type: 'info-circle',
        tag: 'Info'
      }]
      if (this.schemeModule === 'TOP') {
        return icons
      }
      /*if(this.schemeInfo.betaStatus === 3){
        icons.push({
          text: '进程',
          type: 'file-text',
          tag: 'Process'
        })
      }*/
      icons.unshift({
        text: '复制',
        type: 'copy',
        tag: 'Copy'
      }, {
        text: '删除',
        type: 'delete',
        tag: 'Delete'
      })
      return icons
    },
    // 卡片是否展示风格
    isShowStyle: function () {
      let isShow = false
      if (this.schemeModule === 'TOP') {
        isShow = true
      } else if (this.schemeInfo.solutionType === 2) {
        isShow = true
      }
      return isShow
    },
    // 卡片是否展示系列
    isShowSerie: function () {
      let isShow = false
      if (this.schemeModule === 'TOP') {
        isShow = true
      } else if (this.schemeInfo.solutionType === 2) {
        isShow = true
      }
      return isShow
    },
    // 卡片是否关联任务
    isShowTask: function () {
      let isShow = false
      if (this.schemeModule === 'MY' && this.schemeInfo.solutionType === 1 && this.schemeInfo.taskIds.length > 0) {
        isShow = true
      }
      return isShow
    },
    // 卡片是否展示项目名称
    isShowProject: function () {
      let isShow = false
      if (this.schemeModule === 'MY' && this.schemeInfo.solutionType === 1) {
        isShow = true
      }
      return isShow
    },
    // 状态角标文本：
    statusText:function(){
      return this.handelStatus().statusText
    },
    // 状态角标后缀样式
    statusClassSuffix:function(){
      return this.handelStatus().statusClassSuffix
    }
  },
  data () {
    return {
      customDetailModalVisible: false,
      isMouseenter: false, // 鼠标是否移入卡片
      copyLayerVisible: false, // 复制方案弹窗
      copyLoading: false, // 确认复制时加载等待
      styles: [], // 方案风格
      defaultstyle: '', // 默认风格
      series: [], // 方案系列
      defaultserie: '', // 默认系列
      form: this.$form.createForm(this),
      copyInfo: {
        name: '', // 复制名称
        styleId: '', // 风格id
        serieId: '' // 系列id
      }
    }
  },
  methods: {
    // 鼠标移入卡片时
    onMouseenter () {
      this.isMouseenter = true
    },
    // 鼠标移出卡片时
    onMouseleave () {
      this.isMouseenter = false
    },
    handleIcon (tag) {
      switch (tag) {
        case 'Copy':
          this.onCopy()
          break
        case 'Delete':
          this.onDelete()
          break
        case 'Info':
          this.onShowInfo()
          break
        case 'Process':
          this.onShowProcess()
          break
        default:
          break
      }
    },
    // 复制
    onCopy () {
      this.copyLayerVisible = true
      this.getSchemeHouseStyle()
      this.getSchemeHouseSeries()
    },
    // 确认复制
    onCopySure () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.doCopy()
        }
      })
    },
    // 复制取消
    onCopyCancel () {
      this.copyLayerVisible = false
    },
    // 复制方案
    doCopy () {
      let userInfo = this.$getUserInfo()
      if (!userInfo || !userInfo.user || !userInfo.user.userId) {
        return
      }
      let data = {
        addUserId: userInfo.user.userId, // 用户id
        name: this.form.getFieldValue('name'), // 名称
        seriesId: this.form.getFieldValue('serie'), // 系列id
        styleId: this.form.getFieldValue('style'), // 风格id
        solutionId: this.schemeInfo.id, // 方案id
        type: this.schemeInfo.solutionType // 方案类型
      }
      this.copyLoading = true
      let type = data.type
      this.$http.post('/dr-web/solution/cloneSolution', data).then(data => {
        if (data.code === 1) {
          this.copyLoading = false
          this.copyLayerVisible = false
          this.$notification.success({
            message: '成功',
            description: '方案复制成功！'
          })
          this.$emit('refreshSchemeList',type)
        } else {
          this.$notification.error({
            message: '失败',
            description: data.msg|| '方案复制失败！'
          })
          this.copyLoading = false
        }
      }).catch(() => {
        this.copyLoading = false
      })
    },
    // 删除
    onDelete () {
      let _this = this
      this.$confirm({
        title: '确认删除该方案吗?',
        onOk () {
          _this.doDelet()
        },
        onCancel () {}
      })
    },
    // 确认删除
    doDelet () {
      let userInfo = this.$getUserInfo()
      if (!userInfo || !userInfo.user || !userInfo.user.userId) {
        this.$message.error('未获取到用户信息，请重新登录！')
        return
      }
      let type = this.schemeInfo.solutionType
      this.$http.post('/dr-web/solution/delSolution', {
        id: this.schemeInfo.id,
        type: type,
        updUserId: userInfo.user.userId
      }).then(data => {
        if (data.code === 1) {
          this.$notification.success({
            message: '成功',
            description: '方案删除成功！'
          })
          this.$emit('refreshSchemeList',type)
        } else {
          this.$notification.error({
            message: '失败',
            description: data.msg || '方案删除失败！'
          })
        }
      })
    },
    // 通知父组件展示该id的详情
    onShowInfo () {
      this.$emit('showSchemeDetailModel', this.schemeInfo.id)
    },
    // 通知父组件展示该id的进程信息
    onShowProcess () {
      this.$emit('showSchemeProcessModel', this.schemeInfo.betaSolutionId)
    },
    // 获取方案户型风格
    getSchemeHouseStyle () {
      if (this.styles.length > 0) {
        // this.form.setFieldsValue('style',this.styles[0].styleId)
        return
      }
      getHouseStyle().then(data => {
        if (data.code === 1) {
          this.styles = data.data
          // this.$nextTick(() => {
          //   this.form.setFieldsValue('style',this.styles[0].styleId)
          // })
          // this.copyInfo.styleId = this.styles[0].styleId
          // this.defaultstyle = this.styles[0].styleId
        } else {
          this.$notification.error({
            message: '获取户型失败',
            description: data.msg || '服务器异常，请稍后再试！'
          })
        }
      })
    },
    // 获取方案户型系列
    getSchemeHouseSeries () {
      if (this.series.length > 0) {
        // this.form.setFieldsValue('serie',this.series[0].id)
        return
      }
      getHouseSeries().then(data => {
        if (data.code === 1) {
          this.series = data.data
          // this.$nextTick(() => {
          //   this.form.setFieldsValue('serie',this.styles[0].styleId)
          // })
          // this.copyInfo.serieId = this.series[0].id
          // this.defaultserie = this.series[0].id
        } else {
          this.$notification.error({
            message: '获取系列失败',
            description: data.msg || '服务器异常，请稍后再试！'
          })
        }
      })
    },
    handleButton (tag) {
      switch (tag) {
        case 'open':
          this.doOpenScheme()
          break
        case 'submit':
          this.doSubmitScheme()
          break
        case 'process':
          this.onShowProcess()
          break
        default:
          break
      }
    },
    // 打开方案
    doOpenScheme () {
      let id  = this.schemeInfo.id
      let type = this.schemeInfo.solutionType
      let dnatype = this.schemeModule === 'MY' ? 1:2
      let data = {
        SolutionId:id,
        type:type,
        dnatype:dnatype
      }
      execQtFuncByChannel(global.qtChannel.main,'onOpenSolution',data)
    },
    // 提交方案
    doSubmitScheme () {
      let _this = this
      this.$http.post('/dr-web/productSolution/applySolution',{
        solutionId:this.schemeInfo.betaSolutionId,
        userId:this.$getUserInfo().user.userId
      }).then(data => {
        if(data.code === 1){
          _this.$notification.success({
            message: '成功',
            description: '方案提交成功！'
          })
          _this.$emit('refreshSchemeList',this.schemeInfo.solutionType)
        }else{
          _this.$notification.error({
            message: '失败',
            description: data.msg || '方案提交失败，请稍后再试！'
          })
        }
      })
    },
    //查看修改意见
    seechangeDetail () {
      this.customDetailModalVisible = true
      console.log('查看意见')
    },
    // 关闭方案详情
    onCancelCustomDetailModalVisible () {
      this.customDetailModalVisible = false
    },
    //处理状态角标文本及样式
    handelStatus(){
      return schemeBase.hanldeStatus(this.schemeInfo.solutionType, this.schemeInfo.betaStatus)
    }
  }
}
