<template>
  <div>
    <div
      v-if="taskDetail.length > 0"
      class="content"
    >
      <div class="title">
        <div class="t1">
          <div class="pname">
            {{ taskDetail[0].projectName }}
          </div>
          <div
            v-show="taskDetail[0].drTaskStatus==1"
            class="newtask"
          >
            新任务
          </div>
          <div
            v-show="taskDetail[0].drTaskStatus==2"
            class="designing"
          >
            设计中
          </div>
          <div
            v-show="taskDetail[0].drTaskStatus==3"
            class="auditing"
          >
            审核中
          </div>
          <div
            v-show="taskDetail[0].drTaskStatus==4"
            class="unaudit"
          >
            不通过
          </div>
          <div
            v-show="taskDetail[0].drTaskStatus==5"
            class="finished"
          >
            已完成
          </div>
        </div>
        <div class="housename">
          {{ taskDetail[0].houseName }}
        </div>
      </div>
      <div class="detail">
        <dr-tabs
          v-model="selectedTask"
          @click="tabClick"
        >
          <a-tab-pane
            v-for="(task,index) in taskDetail"
            :key="`task_detail_tab_${index}`"
            :tab="`任务${index + 1}`"
          >
            <div class="eachrow eachrow__1">
              <span class="t1">
                客户信息
              </span>
              <span class="t2">
                {{ task.userName || '无' }}&nbsp;&nbsp;{{ task.mobile }}
              </span>
            </div>
            <div class="eachrow">
              <span class="t1">
                置家顾问
              </span>
              <span class="t2">
                {{ task.adviser || '无' }}
              </span>
            </div>
            <div class="eachrow">
              <span class="t1">
                已选DNA
              </span>
              <template v-if="taskDetail[0].dnaRoomDtoList && taskDetail[0].dnaRoomDtoList.length > 0">
                <div class="column-wrap">
                  <span
                    v-for="(dna,index1) in taskDetail[0].dnaRoomDtoList"
                    :key="`task-detail-dnaroom-${index1}`"
                    :class="{span__bg:index1%2 === 0 ? false:true}"
                  >
                    <span>{{ dna.roomFlagStr }}</span>
                    <span>{{ dna.dnaRoomUsageDesc }}</span>
                    <span>{{ dna.dnaName }}</span>
                  </span>
                </div>
              </template>
              <template v-else>
                <span class="t2">
                  {{ taskDetail[0].dnaName }}
                </span>
              </template>
            </div>
            <div class="eachrow">
              <span class="t1">
                预算区间
              </span>
              <span class="t2">
                {{ task.budget || '无' }}
              </span>
            </div>
            <div class="eachrow">
              <span class="t1">
                用户标签
              </span>
              <span class="t2">
                {{ task.userTags || '无' }}
              </span>
            </div>
            <div class="eachrow">
              <span class="t1">
                备注内容
              </span>
              <div class="column-wrap">
                <template
                  v-for="(remark,index2) in taskDetail[0].remarkObjectList"
                >
                  <span :key="`task-detail-remark-question-${index2}`"> {{ `问题${index2+1}: ${remark.question}` }}</span>
                  <span
                    :key="`task-detail-remark-answer-${index2}`"
                    class="span__bg"
                  >
                    {{ `答案${index2+1}:` }}
                    <template v-for="answer in remark.answers">
                      {{ answer?answer:'无' }}
                    </template>
                  </span>
                </template>
              </div>
            </div>
            <div class="eachrow">
              <span class="t1">
                需求提交时间
              </span>
              <span class="t2">
                {{ task.createTimeStr || '无' }}
              </span>
            </div>
            <div class="eachrow">
              <span class="t1">
                时间节点
              </span>
              <template v-if="taskDetail[0].eventList.length > 0">
                <div class="column-wrap">
                  <template
                    v-for="(event,index4) in taskDetail[0].eventList"
                  >
                    <span
                      :key="`task-detail-event-${index4}`"
                      :class="{span__bg:index4%2 === 0 ? false:true}"
                    >
                      <span class="eventDesc">{{ event.eventDesc }}</span>
                      <span>{{ event.eventDate }}</span>
                    </span>
                  </template>
                </div>
              </template>
              <template v-else>
                <span class="t2">
                  {{ '无' }}
                </span>
              </template>
            </div>
          </a-tab-pane>
        </dr-tabs>
      </div>
    </div>
    <div slot="footer">
      <a-button
        v-if="true || taskDetail[0] && (taskDetail[0].drTaskStatus==1 || taskDetail[0].drTaskStatus==2) && !taskDetail[0].shared"
        size="large"
        type="danger"
        @click="refuseTask"
      >
        <a-icon
          type="close-circle"
          class="refuseIcon"
          theme="filled"
        />拒绝
      </a-button>
      <a-button
        type="primary"
        size="large"
        @click="enterTask"
      >
        进入任务
      </a-button>
    </div>
  </div>
</template>

<script>
import DrTabs from '@/components/base/dr-tabs.vue'
export default {
  'name': 'TaskDetailModal',
  components:{ DrTabs },
  props: {
    taskDetail: {
      type: Array,
      default:function(){
        return []
      }
    },
    hideCloseBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedTask:'task_detail_tab_0', // 默认选中的tab
    }
  },
  methods: {
    tabClick(key){

    },
    getContainer(){
      return this.$el
    },
    enterTask(){
      console.log('this.parent: ', this.$parent.enterTask)
      this.$parent.enterTask(this.$parent.taskInfo)
    },
    refuseTask(){
      console.log('refuseTask...')
      this.$parent.onRefuseTask()
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  overflow: scroll;
  padding: 0 40px;
  height: 480px;
  .title {
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
      .newtask {
        font-size:12px;
        font-weight:600;
        width:52px;
        height:24px;
        line-height: 24px;
        border-radius:3px;
        text-align: center;
        background-color: #E96C2E;
        color: #FFFFFF;
        display: inline-block;
      }
      .designing {
        font-size:12px;
        font-weight:600;
        width:52px;
        height:24px;
        line-height: 24px;
        border-radius:3px;
        text-align: center;
        background-color: #c7c1c1;
        color: #FFFFFF;
        display: inline-block;
      }
      .auditing {
        font-size:12px;
        font-weight:600;
        color:#ffff;
        width:52px;
        height:24px;
        line-height: 24px;
        border-radius:3px;
        text-align: center;
        background-color: #7493D0;
        display: inline-block;
      }
      .unaudit {
        font-size:12px;
        font-weight:600;
        color:#C65050;
        width:52px;
        height:24px;
        line-height: 24px;
        border-radius:3px;
        text-align: center;
        background-color: #FFFFFF;
        display: inline-block;
      }
      .finished {
        font-size:12px;
        font-weight:600;
        color:#ffff;
        width:52px;
        height:24px;
        line-height: 24px;
        border-radius:3px;
        text-align: center;
        background-color: #6BA469;
        display: inline-block;
      }
    }
    .housename {
      font-size:14px;
      font-weight:400;
      color:#8D8D8D;
      text-align: left;
    }
  }
  .detail {
    padding-top: 4px;
    padding-bottom: 10px;
    overflow: auto;
    // max-height: calc(100vh - 300px);
    .eachrow {
      margin-top: 12px;
      display: flex;
      .t1 {
        color: #C7C7C7;
        font-size:14px;
        font-weight:400;
        width: 100px;
        text-align: left;
      }
      .t2 {
        width: 600px;
        font-size:14px;
        font-weight:400;
        color:#5C5C5C;
        display: flex;
        flex-flow: column;
        flex-wrap: wrap;
        display: -webkit-flex;
        text-align: left;
      }
      .column-wrap{
        display: flex;
        flex-flow: column;
        span{
          display: flex;
          line-height: 26px;
          min-width: 390px;
          max-width: 550px;
          border-radius: 4px;
          span{
            min-width: 110px;
            max-width: 180px;
          }
        }
        .span__bg{
          margin-left: -10px;
          padding: 0 10px;
          background-color: #F0F0F0
        }
      }
    }
    .eachrow__1{
      margin-top: 16px;
    }
  }
}
.mr-30{
  margin-right: 30px;
}
.room-flag-str{
  width: 100px;
  
}
</style>