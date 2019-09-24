<template>
  <div class="content">
    <div class="title">
      <div class="t1">
        <div class="pname">
          {{ schemeInfo.name }}
        </div>
        <div :class="['status',`status_${statusClassSuffix}`]">
          <a-icon
            type="check-circle"
            theme="twoTone"
            two-tone-color="#6BA469"
            :class="{hide:statusClassSuffix === 'online'?false:true}"
          />{{ statusText }}
        </div>
      </div>
    </div>
    <div class="detail">
      <div class="eachrow">
        <div class="t1">
          方案类型
        </div><div class="t2">
          {{ schemeInfo.solutionType === 1?'产品方案':'DNA方案' }}
        </div>
      </div>
      <div class="eachrow">
        <div class="t1">
          方案系列
        </div><div class="t2">
          {{ schemeInfo.seriesName?schemeInfo.seriesName:'无' }}
        </div>
      </div>
      <div class="eachrow">
        <div class="t1">
          风格
        </div><div class="t2">
          {{ schemeInfo.styleName?schemeInfo.styleName:'无' }}
        </div>
      </div>
      <div class="eachrow">
        <div class="t1">
          方案归属
        </div><div class="t2">
          {{ schemeInfo.addUserId }}
        </div>
      </div>
      <div class="eachrow">
        <div class="t1">
          方案ID
        </div><div class="t2">
          {{ schemeInfo.id }}
        </div>
      </div>
      <div class="eachrow">
        <div class="t1">
          方案户型
        </div><div class="t2">
          {{ `${schemeInfo.buildingName}-${schemeInfo.housingName}` }}
        </div>
      </div>
      <div class="eachrow">
        <div class="t1">
          户型ID
        </div><div class="t2">
          {{ schemeInfo.housingId?schemeInfo.housingId:'无' }}
        </div>
      </div>
      <div class="eachrow">
        <div class="t1">
          源方案
        </div><div class="t2">
          {{ schemeInfo.originalSolutionName?schemeInfo.originalSolutionName:'无' }}
        </div>
      </div>
      <div class="eachrow">
        <div class="t1">
          源方案ID
        </div><div class="t2">
          {{ schemeInfo.originalSolutionID?schemeInfo.originalSolutionID:'无' }}
        </div>
      </div>
      <div class="eachrow">
        <div class="t1">
          方案创建时间
        </div><div class="t2">
          {{ schemeInfo.createTimeStr }}
        </div>
      </div>
      <div class="eachrow">
        <div class="t1">
          方案最近修改时间
        </div><div class="t2">
          {{ schemeInfo.updateTimeStr }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import * as schemeBase from './scheme.base.js'
export default {
  'name': 'SchemeDetailModal',
  props: {
    hideCloseBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      schemeInfo: {},
      statusText: '', // 状态
      statusClassSuffix: '', // 状态样式后缀
    }
  },
  methods: {
    /**
       * 根据id获取方案详情
       */
    getSchemeDetail (id) {
      let _this = this
      return new Promise(function (resolve, reject) {
        _this.$gLoading.show('正努力加载...')
        _this.$http.post('/dr-web/solution/querySolutionDetailById', {
          id: id
        }).then(data => {
          _this.$gLoading.hide()
          if (data.code === 1) {
            _this.schemeInfo = data.data || {}
            // let statusTemp = this.schemeInfo.status === 99 ? 99:this.schemeInfo.betaStatus // status=99 表示为同步至beta系统
            // let obj = schemeBase.hanldeStatus(_this.schemeInfo.solutionType, _this.schemeInfo.betaStatus)
            let obj = this.hanldeStatus(_this.schemeInfo.solutionType, _this.schemeInfo.betaStatus)
            _this.statusText = obj.statusText
            _this.statusClassSuffix = obj.statusClassSuffix
            resolve()
          } else {
            _this.$notification.error({
              message: '获取方案详情失败',
              description: data.msg || '服务器异常，请稍后再试！'
            })
            reject()
          }
        }).catch(() => {
          reject()
        })
      })
    },
    /**
     *根据返回的方案类型和状态标识处理：
      *  1.展示不同的状态文本
      *  2.展示不同的状态样式后缀
      * @param {String} type 方案类型
      * @param {Number} tag  方案状态
      */
    hanldeStatus (type, tag) {
      let obj = {
        statusText: '',
        statusClassSuffix: ''
      }

      let status = global.myProjectSchemeStatus
      if (type === 2) {
        status = global.myDnaSchemeStatus
      }

      for (let i = 0, len = status.length; i < len; i++) {
        if (status[i].tag === tag.toString()) {
          obj.statusText = status[i].statusCn
          obj.statusClassSuffix = status[i].status
          break
        }
      }

      return obj
    }
  }
}
</script>

<style lang="less" scoped>
// .schemeDetailModal {
//   width: 800px !important;
//   .ant-modal-body {
//     padding: 40px 40px 0px 40px;
//   }
  .content {
    padding: 0 40px;
    .title {
      padding-bottom: 15px;
      border-bottom: 1px solid #E8E8E8;
      .t1 {
        display: -webkit-flex;
        display: flex;
        align-items: center;
        align-content: flex-start;
          .pname {
            max-width: 80%;
            font-size: 20px;
            font-weight: 600;
            color: #5C5C5C;
            margin-right: 10px;
            .newIcon {
              width:52px;
              height:24px;
              background:#E96C2E;
              border-radius:3px;
            }
          }
          .status {
            height:24px;
            line-height: 24px;
            padding-left: 8px;
            padding-right: 8px;
            font-size:12px;
            font-weight:600;
            text-align: center;
            color: #FFFFFF;
            border-radius:14px;
            opacity: .8;
          }
          .status_offline,
          .status_uncommitted,
          .status_draft{
            background-color: #8D8D8D;
          }
          .status_pass,
          .status_online{
            background-color: #6BA469;
            .anticon{
              margin-right: 2px;
              margin-top: -2px;
              font-size: 14px;
              vertical-align: middle;
            }
          }
          .status_checkPending{
            background-color: #7493D0;
          }
          .status_noPass{
            background-color: #C65050;
          }
        }
      }
    }
    .detail {
      overflow: auto;
      padding-top: 20px;
      .eachrow {
        min-height: 34px;
        display: flex;
        .t1 {
          color: #C7C7C7;
          font-size:14px;
          font-weight:400;
          width: 130px;
        }
        .t2 {
          width: 350px;
          font-size:14px;
          font-weight:400;
          color:#5C5C5C;
          display: flex;
          flex-wrap: wrap;
          display: -webkit-flex;
          .dnarow {
            height: 20px;
            line-height: 20px;
            margin-right: 20px;
          }
        }
      }
    }
  // }
</style>