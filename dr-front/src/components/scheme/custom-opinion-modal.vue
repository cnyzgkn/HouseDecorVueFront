<!--方案信息弹出框-->
<template>
  <div
    id="containerModel"
    class="containerModel"
  >
    <a-modal
      :visible="visible"
      title="客户修改意见"
      :width="700"
      class="container"
      @ok="cancelModal"
      @cancel="cancelModal"
    >
      <div>
        <p class="tips">
          您的方案完成后，经客户查看提出如下修改意见！
        </p>
        <div
          v-for="(n, i) in opinionInfo"
          :key="i"
          class="content"
        >
          <div>
            <div>
              <span class="itemName">
                {{ n.msg.userName }}
              </span>
              <span class="itemTime">
                {{ n.msg.submissionTime }}
              </span>
              <span
                class="itemStatus"
                :class="n.status == 0 ? 'colorOrange' : 'colorGreen'"
              >
                ({{ n.statusAttr }})
              </span>
            </div>
            <div
              v-for="(m, index) in n.msg.reviseOpinionContent.reviseOpinionList"
              :key="`revise_opinion_${index}`"
              class=""
            >
              <p
                v-if="(m.tagList && m.tagList.length > 0) || m.remarks"
                class="remarkLine"
              >
                <span class="roomName">
                  {{ m.roomUsageName }}
                </span>
                <span
                  v-for="(tag,index1) in m.tagList"
                  :key="`tag_${index1}`"
                  class="tagName"
                >
                  {{ tag.tagName }}
                </span>
              </p>
              <p class="remarks">
                {{ m.remarks }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
// import * as schemeBase from './scheme.base.js'
export default {
  'name': 'CustomOpinionModal',
  props: {
    schemeInfo: {  //信息
      type: Object,
      default: function () {
        return {}
      }
    },
    cancelRender:{  //取消渲染
      type: Function,
      default: function () {
      }
    }
  },
  data () {
    return {
      visible: true,
      opinionInfo: {},
      statusText: '', // 状态
      statusClassSuffix: '', // 状态样式后缀
    }
  },
  created () {
    this.initRenderInfo()
    // this.getSchemeDetail()
    console.log(this.schemeInfo, 'schemeInfo')
  },
  methods: {
    //初始化渲染信息
    initRenderInfo() {
      //获取批量渲染任务数量
      this.getTaskNum()
    },
    //取消批量渲染
    cancelModal(){
      this.cancelRender()
    },
    // 浮层渲染节点
    // getContainer(){
    //   return document.getElementById('containerModel')
    // },
    /**
       * 根据id获取方案详情
       */
    getTaskNum () {
      let _this = this
      return new Promise(function (resolve, reject) {
        _this.$gLoading.show('正努力加载...')
        _this.$http.post('/dr-web/solutionMsg/queryMsgListBySolutionId', {
          solutionId: _this.schemeInfo.id
        }).then(data => {
          _this.$gLoading.hide()
          if (data.code === 1) {
            _this.opinionInfo = data.data
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
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  width: 600px;
  .ant-modal-body {
    width: 600px;
    height: 500px;
    overflow-y: auto;
  }
  .itemName {
    padding: 10px 5px 10px 0px;
    font-size: 16px;
    font-weight: 600;
  }
  .itemTime{
    font-size: 14px;
    color: #8d8d8d;
    margin-right: 5px;
  }
  .tagName{
    padding: 0 12px;
    margin-right: 5px;
    font-size: 12px;
    background-color: #fff;
    border: 1px solid #586286;
    color: #586286;
    height: 26px;
    line-height: 26px;
    border-radius: 16px;
    display: inline-block;
  }
  .itemStatus {
    font-size: 12px;
  }
}
.content{
  margin-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
}
.container .content:last-child{
  border-bottom:none;
}
.colorOrange {
  color: #E96C2E;
}
.colorGreen {
  color: #6ba469;
}
.remarkLine{
  margin: 10px 20px;
}
.roomName{
  position: relative;
  margin-right: 10px;
}
.roomName::after{
  position: absolute;
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: #c7c7c7;
  content:'';
  top:5px;
  left: -10px;
}
.remarks{
  margin: 10px 20px 20px 20px;
  color: #8d8d8d;
}
.tips{
  font-size: 12px;
  color: #c7c7c7;
}
</style>