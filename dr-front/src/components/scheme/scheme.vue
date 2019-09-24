<!--方案卡片组件-->
<template>
  <div
    class="scheme-wrapper"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <!--基本信息-->
    <img
      width="252"
      height="130"
      :src="$ifAliyunImage(schemeInfo.previewUrl)?schemeInfo.previewUrl+'!thumc-252x130':schemeInfo.previewUrl+'?imageView2/2/w/252/h/130'"
      onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAACCAQMAAABYTTeVAAAABlBMVEXx8fH7+/tUkfSPAAABwklEQVRYw+3WPU/CQBzH8X95CHSiMTGylYHEuJk4OIIPg6Nx0U0T34CjA7HV+ApwccNEfR3U6OaC8QXYl8BY8Nrzf9diiPK7bkxlKeE++QLXuwOS5seYClCAAhRgmUDkAb+DwHhVB8hF4M0vDaUMqIHAyHaoI4hqCNw+7N+cBgbg22RfkQFs0NFxyKAMCyuUkAI1AOzuINSgDEDL9kiDO1RYG2tgXQPQlZQCVBhEZC5IPwOPAGQBoncAghl4AWA2Tq+LQfILPhcDkY72iPaMgC/nRiANIMrAFgLqY1r8bdcBsEQGUMFKC2PaBqA8Ay6YKF0o8y2BQGggIKBLDZL5rfX/ZvGCzQW+EfCeCPJACDZO7OeAyQxEAAgNGhhEatFeuGrOQUGB2OMnqNBVt0o9MRT0UIAKZykQZAA1+eccnAfTlgYJIaAKPMSnUAeATQU4UAKn3ISBy6+Q+wUKjgI8F1Ow5KYn/O4caAQARE0uqN1bGQBwQFTnQOiAgmjqJRVXUUHe6wUT0iEopAdEr/IECwrUPhzqdgzA83fbfQOoyue6T0MAEjWT8ajd9zBQl+8d+Ms7vykXgsAr/sMUoAAFWCb4AaxTlPEjED5xAAAAAElFTkSuQmCC'"
    >
    <p class="scheme-name">
      {{ schemeInfo.name }}
    </p>
    <p class="scheme-info">
      <span class="scheme-info-title">方案ID</span>
      <span class="scheme-info-text">{{ schemeInfo.id }}</span>
      <span
        :class="['scheme-info-text',{hide:isShowStyle?false:true}]"
      >  / {{ schemeInfo.seriesName }}</span>
      <span :class="['scheme-info-text',{hide:isShowSerie?false:true}]">  / {{ schemeInfo.styleName }}</span>
      <span :class="['scheme-info-title',{hide:isShowTask?false:true}]">  / 关联任务</span>
      <span :class="['scheme-info-text',{hide:isShowTask?false:true}]">
        <span
          v-for="taskId in schemeInfo.taskIds"
          :key="taskId"
          class="task-id"
        >{{ taskId }}</span>
      </span>
    </p>
    <p
      class="scheme-project"
      :class="{hide:isShowProject?false:true}"
    >
      {{ schemeInfo.buildingName || '暂无' }}
    </p>

    <p :class="['status',`status_${statusClassSuffix}`,{hide:schemeModule === 'TOP'?true:false}]">
      <a-icon
        type="check-circle"
        theme="twoTone"
        two-tone-color="#6BA469"
        :class="{hide:statusClassSuffix === 'online'?false:true}"
      />
      {{ statusText }}
    </p>
    <p
      v-if="schemeInfo.solutionMsgCount"
      class="status_noPass"
      :class="['statusDesc',`statusDesc_${statusClassSuffix}`,{hide:schemeModule === 'TOP'?true:false}]"
    >
      {{ schemeInfo.solutionMsgCount }}条修改意见
    </p>
    <!--鼠标移入悬浮-->
    <div :class="['scheme-layer',{hide:!isMouseenter}]">
      <div class="scheme-layer-buttons">
        <a-button
          v-if="schemeInfo.msgType"
          class="layerHandle"
          :size="handleButtons.length == 2 ? 'small' : 'default'"
          @click="seechangeDetail()"
        >
          查看修改意见
        </a-button>
        <a-button
          v-for="button in handleButtons"
          :key="`scheme-button-${button.tag}`"
          :type="button.type"
          :size="handleButtons.length > 2 ? 'small' : 'default'"
          @click="handleButton(button.tag)"
        >
          {{ button.text }}
        </a-button>
      </div>
      <div class="scheme-layer-icons">
        <a-button-group>
          <a-button
            v-for="icon in handleIcons"
            :key="icon.tag"
            size="small"
            @click="handleIcon(icon.tag)"
          >
            <a-icon :type="icon.type" />
            {{ icon.text }}
          </a-button>
        </a-button-group>
      </div>
    </div>
    <!--查看客户修改意见弹框-->
    <custom-opinion-modal
      v-if="customDetailModalVisible"
      ref="customOpinionModal"
      :scheme-info="schemeInfo"
      :cancel-render="onCancelCustomDetailModalVisible"
    />
    <!--复制方案弹窗-->
    <a-modal
      centered
      title="复制方案信息"
      :destroy-on-close="true"
      :visible="copyLayerVisible"
      class="copy-wrap"
      width="720"
      @cancel="onCopyCancel"
    >
      <a-form :form="form">
        <a-form-item
          label="名称"
          required
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'name',
              {rules: [{ required: true, message: '请输入方案名称！' }]}
            ]"
            placeholder="输入方案名称"
          />
        </a-form-item>
        <a-form-item
          label="系列"
          required
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-select
            v-decorator="[
              'serie',
              {rules: [{ required: true, message: '请选择系列！' }],initialValue:schemeInfo.seriesId}
            ]"
            placeholder="输入选择系列"
          >
            <a-select-option
              v-for="serie in series"
              :key="serie.id"
              :value="serie.id"
            >
              {{ serie.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="风格"
          required
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-select
            v-decorator="[
              'style',
              {rules: [{ required: true, message: '请选择风格！' }],initialValue:schemeInfo.styleId}
            ]"
            placeholder="输入选择风格"
          >
            <a-select-option
              v-for="style in styles"
              :key="style.styleId"
              :value="style.styleId"
            >
              {{ style.styleName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button
          key="cancel"
          @click="onCopyCancel"
        >
          取消
        </a-button>
        <a-button
          key="submit"
          html-type="submit"
          type="primary"
          :loading="copyLoading"
          @click="onCopySure"
        >
          确认复制
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script src='./scheme.js'></script>
<style lang="less" scoped>
.scheme-wrapper {
  position: relative;
  margin-bottom: 30px;
  margin-right: 30px;
  padding-bottom: 19px;
  border-radius: 8px;
  background-color: #fff;
  transition: 350ms transform ease;
  img {
    display: block;
    position: relative;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
}
.layerHandle {
  background-color: #ff660f;
  border-color: #ff660f;
  color: #fff;
}
.scheme-download::after{
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  content: '';
  width: 252px;
  height: 130px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: rgba(255, 255, 255, 0.75)
}
.scheme-wrapper:hover {
  // transform: scale(1.1,1.1);
  transform: translate(0, -20px);
  box-shadow: 0 0 30px 0 rgba(0,0,0,.1);
  z-index: 10;
}
.scheme-name {
  width: 252px;
  padding: 0 12px;
  margin: 10px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: rgba(92, 92, 92, 1);
  font-size: 14px;
  font-weight: 600;
}
.scheme-info {
  margin-bottom: 4px;
  font-size: 12px;
}
.scheme-info-title {
  margin: 0 2px;
  color: rgba(199, 199, 199, 1);
}
.scheme-info-text {
  color: rgba(141, 141, 141, 1);
  font-weight: 400;
}
.scheme-project {
  width: 252px;
  padding: 0 10px;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  word-wrap: none;
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 400;
  color: rgba(141, 141, 141, 1);
}
.scheme-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% + 40px);
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  z-index: 1;
}
.scheme-layer-buttons {
  position: absolute;
  width: 100%;
  height: calc(100% - 170px);
  bottom: 40px;
  left: 0;
  // display: flex;
  padding-top: 32px;
  background-color: rgba(251, 251, 251, 0.7);
  justify-content: center;
  text-align: center;
}
.scheme-layer-buttons >  .ant-btn:nth-child(1){
  margin-right: 15px;
}
.scheme-layer-icons {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-top: 1px solid #f4f4f4;
  background: rgba(251, 251, 251, 1);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  /deep/.ant-btn {
    border: none;
    color: rgba(141, 141, 141, 1);
    font-size: 12px;
    font-weight: 400;
    //  color: rgba(88,98,135,1);
    background: none;
    padding: 0 10px;
  }
  /deep/.ant-btn:hover {
    color: rgba(88, 98, 135, 1);
  }
  /deep/.ant-btn > span {
    margin-left: 4px;
  }
}
.statusDesc {
  position: absolute;
  top: 10px;
  background-color: #ff0001;
  // right: 10px;
  height: 20px;
  line-height: 20px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  color: #ffffff;
  border-radius: 10px;
  margin-left: 10px;
  // opacity: 0.8;
  z-index: 1;
}
.status {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 20px;
  line-height: 20px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 10px;
  letter-spacing: 1px;
  font-weight: 600;
  text-align: center;
  color: #ffffff;
  border-radius: 10px;
  opacity: 0.8;
  z-index: 1;
}
.status_offline,
.status_uncommitted,
.status_draft {
  background-color: #8d8d8d;
}
.status_pass,
.status_online {
  background-color: #6ba469;
}
.status_checkPending {
  background-color: #7493d0;
}
.status_noPass {
  background-color: #c65050;
}
.status_online > .anticon {
  margin-right: 2px;
  margin-top: -2px;
  font-size: 14px;
  vertical-align: middle;
}
.task-id {
  margin-right: 4px;
}
</style>
<style>
.copy-wrap .ant-form-item-control-wrapper{
  width: 592px;
}
.copy-wrap .ant-form-item-label{
  width: 60px;
}
</style>

