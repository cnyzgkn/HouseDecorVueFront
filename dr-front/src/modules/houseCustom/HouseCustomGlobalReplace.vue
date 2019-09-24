<template>
  <div
    id="my-custom-wrap"
    class="houseCustomGlobal"
  >
    <div style="display: flex;justify-content: center;font-size:20px;font-weight:600;color:rgba(92,92,92,1);">
      全局替换
    </div>
    <!-- 地柜/吊柜 -->
    <div>
      <dr-tabs
        v-model="firstTab"
        style="height: calc(100% - 28px)"
        @tabClick="tabClick"
      >
        <a-tab-pane 
          v-for="tab in tabList"
          :key="tab.categoryDto.id + ''"
          :tab="tab.categoryDto.name"
        >
          <div class="componentBody">
            <template v-if="!templateList.length">
              <dr-nodata />
            </template>
            <template
              v-else
            >
              <div
                v-for="(childNode, index) in templateList"
                :key="childNode.templateId "
              >
                <!-- 第一层 -->
                <div class="firstDiv">
                  <div class="firstRe">
                    <div
                      class="firstImg pimg"
                    >
                      <img
                        v-if="childNode.mainUrl"
                        style="width: 100%; height: auto"
                        :src="$ifAliyunImage(childNode.mainUrl)?childNode.mainUrl+'!thumc-252x252':childNode.mainUrl+'?imageView2/2/w/83/h/83'"
                        :onerror="defaultImg"
                      >
                      <img
                        v-else
                        :src="noImg"
                        style="width: 100%; height: auto"
                      >
                    </div>
                    <div class="childNodePosition">
                      {{ childNode.templateName }}
                    </div>
                    <div class="childCategoryName">
                      {{ childNode.categoryName }}
                    </div>
                  </div>
                  <div class="showButton">
                    <a-button @click.native="getStyle(index, childNode)">
                      {{ childNode.showExpand ? '收起' : '展开' }}
                    </a-button>
                  </div>
                </div>
                <!-- 选中显示 -->
                <div
                  v-if="childNode.showExpand"
                  class="checkedItem"
                >
                  <!-- 第二层选择/第三层选择 -->
                  <div style="display: flex">
                    <div
                      v-if="childNode.fashionList.length"
                      style="font-size:16px;margin-top: 33px;margin-left:13px;text-align: left"
                    >
                      {{ childNode.attrJson.fashion.propertyName }}
                    </div>
                    <div
                      v-if="childNode.fashionList.length"
                      style="margin-left: 20px; position: relative"
                    >
                      <a-select
                        v-model="childNode.fashionId"
                        class="dr-select"
                        size="large"
                        :allow-clear="true"
                        :dropdown-match-select-width="false"
                        :get-popup-container="trigger => trigger.parentNode"
                        style="width:280px !important; margin-top: 20px;position:relative;"
                        @change="checkStyle(index, 'fashion', childNode.fashionId)"
                      >
                        <a-select-option
                          v-for="childNodeFashion in childNode.fashionList"
                          :key="childNodeFashion.propertyValueId"
                          :value="childNodeFashion.propertyValueId"
                        >
                          {{ childNodeFashion.propertyValue }}
                        </a-select-option>
                      </a-select>
                    </div>
                    <div
                      v-if="childNode.textureMaterialList.length"
                      style="font-size:16px;margin-top: 33px;margin-left:13px;text-align: left"
                      :style="{marginLeft: childNode.fashionList.length ? '50px' : '13px'}"
                    >
                      {{ childNode.attrJson.textureMaterial.propertyName }}
                    </div>
                    <div
                      v-if="childNode.textureMaterialList.length"
                      style="margin-left: 20px; position: relative;"
                    >
                      <a-select
                        v-model="childNode.textureMaterialId"
                        class="dr-select"
                        size="large"
                        :allow-clear="true"
                        :dropdown-match-select-width="false"
                        style="width:280px !important; margin-top: 20px"
                        :get-popup-container="trigger => trigger.parentNode"
                        @change="checkStyle(index, 'textureMaterial', childNode.textureMaterialId)"
                      >
                        <a-select-option
                          v-for="childNodeTexture in childNode.textureMaterialList"
                          :key="childNodeTexture.propertyValueId"
                          :value="childNodeTexture.propertyValueId"
                        >
                          {{ childNodeTexture.propertyValue }}
                        </a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <!-- 第三层物料 -->
                  <div
                    v-if="childNode.childTemplateList && childNode.childTemplateList.length"
                    style="display: flex;margin-top: 10px;"
                  >
                    <div
                      v-for="(model, modelKey) in childNode.childTemplateList"
                      :key="model.modelId"
                      @click="checkStyle(index, 'template', model, modelKey)"
                    >
                      <house-custom-card
                        :custom-info="model"
                        :custom-type="2"
                      />
                    </div>
                  </div>
                  <!-- 颜色 -->
                  <div v-if="childNode.colorList && childNode.colorList.length">
                    <div
                      style="display: flex"
                    >
                      <div
                        style="font-size:16px;margin-top: 33px;margin-left:13px;text-align: left"
                      >
                        颜色
                      </div>
                      <div style="margin-left: 20px; position: relative;">
                        <a-select
                          v-model="childNode.colorId"
                          class="dr-select"
                          size="large"
                          :allow-clear="true"
                          :dropdown-match-select-width="false"
                          style="width:280px !important; margin-top: 20px"
                          :get-popup-container="trigger => trigger.parentNode"
                          @change="checkStyle(index, 'color', childNode)"
                        >
                          <a-select-option
                            :key="-1"
                            :value="-1"
                          >
                            全部
                          </a-select-option>
                          <a-select-option
                            v-for="childNodeColor in childNode.colorList"
                            :key="childNodeColor.propertyValueId"
                            :value="childNodeColor.propertyValueId"
                          >
                            {{ childNodeColor.propertyValue }}
                          </a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <div style="display: flex;margin-top: 10px;flex-wrap: wrap">
                      <div
                        v-for="(color, colorKey) in childNode.colorSelectList"
                        :key="color.propertyValueId"
                        @click="checkStyle(index, 'color', color, 1, colorKey)"
                      >
                        <house-custom-card
                          :custom-info="color"
                          :custom-type="3"
                        />
                      </div>
                    </div>
                  </div>
                  <!-- 门框颜色 -->
                  <div v-if="childNode.doorFrameColorList && childNode.doorFrameColorList.length && !childNode.colorList.length">
                    <div
                      style="display: flex;"
                    >
                      <div
                        style="font-size:16px;margin-top: 33px;margin-left:13px;text-align: left"
                      >
                        门框颜色
                      </div>
                      <div style="margin-left: 20px; position: relative;">
                        <a-select
                          v-model="childNode.doorFrameColorId"
                          class="dr-select"
                          size="large"
                          :allow-clear="true"
                          :dropdown-match-select-width="false"
                          style="width:280px !important; margin-top: 20px"
                          :get-popup-container="trigger => trigger.parentNode"
                          @change="checkStyle(index, 'doorFrameColor', childNode)"
                        >
                          <a-select-option
                            key="-1"
                            value="全部"
                          >
                            全部
                          </a-select-option>
                          <a-select-option
                            v-for="doorFrameColor in childNode.doorFrameColorList"
                            :key="doorFrameColor.propertyValueId"
                            :value="doorFrameColor.propertyValueId"
                          >
                            {{ doorFrameColor.propertyValue }}
                          </a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <div style="display: flex;margin-top: 10px;flex-wrap: wrap">
                      <div
                        v-for="(doorFrameColor, doorFrameColorKey) in childNode.doorFrameColorSelectList"
                        :key="doorFrameColor.propertyValueId"
                        @click="checkStyle(index, 'doorFrameColor', doorFrameColor, 1, doorFrameColorKey)"
                      >
                        <house-custom-card
                          :custom-info="doorFrameColor"
                          :custom-type="3"
                        />
                      </div>
                    </div>
                  </div>
                  <!-- 门芯颜色 -->
                  <div v-if="childNode.coreColorList && childNode.coreColorList.length && !childNode.colorList.length">
                    <div
                      style="display: flex"
                    >
                      <div
                        style="font-size:16px;margin-top: 33px;margin-left:13px;text-align: left"
                      >
                        门芯颜色
                      </div>
                      <div style="margin-left: 20px; position: relative;">
                        <a-select
                          v-model="childNode.coreColorId"
                          class="dr-select"
                          size="large"
                          :allow-clear="true"
                          :dropdown-match-select-width="false"
                          style="width:280px !important; margin-top: 20px"
                          :get-popup-container="trigger => trigger.parentNode"
                          @change="checkStyle(index, 'coreColor', childNode)"
                        >
                          <a-select-option
                            key="-1"
                            value="全部"
                          >
                            全部
                          </a-select-option>
                          <a-select-option
                            v-for="childNodeColor in childNode.coreColorList"
                            :key="childNodeColor.propertyValueId"
                            :value="childNodeColor.propertyValueId"
                          >
                            {{ childNodeColor.propertyValue }}
                          </a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <div style="display: flex;margin-top: 10px;flex-wrap: wrap">
                      <div
                        v-for="(coreColor, coreColorKey) in childNode.coreColorSelectList"
                        :key="coreColor.propertyValueId"
                        @click="checkStyle(index, 'coreColor', coreColor, 1, coreColorKey)"
                      >
                        <house-custom-card
                          :custom-info="coreColor"
                          :custom-type="3"
                        />
                      </div>
                    </div>
                  </div>
                  <!-- 替换按钮 -->
                  <div style="margin: 0 auto">
                    <a-button
                      v-if="childNode.coreColorList && childNode.coreColorList.length || childNode.colorList && childNode.colorList.length || childNode.doorFrameColorList && childNode.doorFrameColorList.length"
                      class="buttonRE"
                      :loading="btnLoading"
                      @click="replaceQT()"
                    >
                      替换
                    </a-button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </a-tab-pane>
      </dr-tabs>
    </div>
  </div>
</template>
<script src='./HouseCustomGlobalReplace.js'></script>
<style lang="less" scoped src="./HouseCustomGlobalReplace.less">
</style>
