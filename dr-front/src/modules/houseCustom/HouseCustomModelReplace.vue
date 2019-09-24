<template>
  <div>
    <div
      v-if="modelDetail.templateName"
      id="my-custom-wrap"
      class="hearder"
      style="width: 1092px"
    >
      <template>
        <a-row>
          <h1>{{ modelDetail.templateName }}</h1>
        </a-row>
        <a-row>
          <div class="priceFont">
            <span>价格:</span>
            <span class="fontStyle">{{ totalPrice ? totalPrice : '未定制' }}</span>
          </div>
        </a-row>
        <a-row>
          <div class="heightFont">
            <div v-if="modelDetail.tempType == 2">
              <span>离地</span>
              <span style="margin:0px 30px 0px 20px;">
                <a-input
                  v-model="distance"
                  class="heightLength"
                  size="large"
                  placeholder="请输入"
                /></span>
              <span>
                <a-button
                  class="saveButton"
                  type="dashed"
                  size="small"
                  :btn-loading="btnLoading"
                  @click="saveHeight(distance)"
                >
                  保存
                </a-button>
              </span>
            </div>
            <a-button
              class="changeModelButton"
              type="dashed"
              size="small"
              @click="defaultChangeSave(1)"
            >
              替换模型
            </a-button>
            <!-- <a-button
              v-if="resetFlag"
              class="changeModelButton"
              type="dashed"
              size="small"
              @click="defaultChangeSave(2)"
            >
              重置模型
            </a-button> -->
          </div>
        </a-row>
      </template><template v-if="!showModel">
        <div class="componentBody">
          <a-row>
            <div
              v-for="(n, i) in componentList"
              :key="n.id"
            > 
              <a-row :style="{background: n.disabled ? '#e6e6e6' : ''}">
                <div>
                  <a-col
                    class="boxRight"
                  >
                    <div>
                      <a-row class="card cardbar">
                        <house-custom-card
                          :custom-info="n"
                          :custom-type="1"
                        />
                      </a-row>
                    </div>
                  </a-col>
                  <a-col class="boxLeft">
                    <a-checkbox
                      v-if="!n.disabled && n.requiredType == 3"
                      :checked="n.showRequiredType"
                      style="margin-right:10px"
                      @change="changeCheckBox(i, n.showRequiredType)"
                    />
                    <a-button
                      v-if="!n.disabled"
                      :disabled="!n.showRequiredType"
                      @click.native="searchModel(n, i)"
                    >
                      {{ n.cheacked ? '收起' : '展开' }}
                    </a-button>
                  </a-col>
                </div>
              </a-row>
              <div v-if="n.cheacked">
                <div v-if="!n.hardName && n.categoryName != '拉手'">
                  <a-row
                    v-if="n.fashion.propertyName || n.textureMaterial.propertyName"
                    style="margin-left: 75px;"
                  >
                    <!-- 款式 -->
                    <div
                      v-if="n.fashion.propertyName"
                      class="select"
                    >
                      {{ n.fashion.propertyName }}
                      <a-select
                        v-model="n.chooseFashionId"
                        class="dr-select"
                        size="large"
                        placeholder="款式"
                        :dropdown-match-select-width="false"
                        :get-popup-container="trigger => trigger.parentNode"
                        style="position:relative;"
                        @change="chooseProperty(n, i, 'fashion', 1)"
                      >
                        <a-select-option
                          v-for="fashion in n.fashion.propertyValueList"
                          :key="fashion.propertyValueId"
                          :value="fashion.propertyValueId"
                        >
                          {{ fashion.propertyValue }}
                        </a-select-option>
                      </a-select>
                    </div>
                    <!-- 材质 -->
                    <div
                      v-if="(n.fashion.propertyName && n.chooseFashionId) || (!n.fashion.propertyName && n.textureMaterial.propertyName)"
                      class="select"
                    >
                      {{ n.textureMaterial.propertyName }}
                      <a-select
                        v-model="n.chooseTextureMaterialId"
                        class="dr-select"
                        size="large"
                        :dropdown-match-select-width="false"
                        placeholder="材质"
                        :get-popup-container="trigger => trigger.parentNode"
                        style="position:relative;"
                        @change="chooseProperty(n, i, 'textureMaterial', 1)"
                      >
                        <a-select-option
                          v-for="material in n.textureMaterial.propertyValueList"
                          :key="material.propertyValueId"
                          :value="material.propertyValueId"
                        >
                          {{ material.propertyValue }}
                        </a-select-option>
                      </a-select>
                    </div>
                  </a-row>
                  <a-row
                    v-if="n.chooseTextureMaterialId"
                    style="margin-left: 75px;"
                  >
                    <div
                      v-for="model in n.materielList"
                      :key="model.componentId"
                      class="scheme-wrapper"
                      @click="chooseProperty(model, i, 'materiel', 1)"
                    >
                      <house-custom-card
                        :custom-info="model"
                        :custom-type="2"
                      />
                    </div>
                  </a-row>
                  <!-- 颜色 -->
                  <div v-if="n.color.propertyName">
                    <a-row style="margin-left: 75px;">
                      <div
                        v-if="n.color.propertyName"
                        class="select"
                      >
                        {{ n.color.propertyName }}
                        <a-select
                          v-model="n.colorId"
                          class="dr-select"
                          size="large"
                          :dropdown-match-select-width="true"
                          :get-popup-container="trigger => trigger.parentNode"
                          style="position:relative;"
                          @change="chooseProperty(n, i, 'chooseColor', 1)"
                        >
                          <a-select-option value="-1">
                            全部
                          </a-select-option>
                          <a-select-option
                            v-for="color in n.colorList"
                            :key="color.propertyValueId"
                            :value="color.propertyValueId"
                          >
                            {{ color.propertyValue }}
                          </a-select-option>
                        </a-select>
                      </div>
                    </a-row>
                    <a-row style="margin-left: 75px;">
                      <div
                        v-for="item in n.color.propertyValueList"
                        :key="item.id"
                        class="scheme-wrapper"
                        @click="chooseProperty(item, i, 'color', 1)"
                      >
                        <house-custom-card
                          :custom-info="item"
                          :custom-type="3"
                        />
                      </div>
                    </a-row>
                  </div>
                  <!-- 门框 -->
                  <div v-if="!n.color.propertyName && n.doorFrameColor.propertyName">
                    <a-row style="margin-left: 75px;">
                      <div
                        v-if="n.doorFrameColor.propertyName"
                        class="select"
                      >
                        {{ n.doorFrameColor.propertyName }}
                        <a-select
                          v-model="n.doorFrameColorId"
                          class="dr-select"
                          size="large"
                          :dropdown-match-select-width="false"
                          :get-popup-container="trigger => trigger.parentNode"
                          style="position:relative;"
                          @change="chooseProperty(n, i, 'chooseDoorFrameColor', 1)"
                        >
                          <a-select-option value="-1">
                            全部
                          </a-select-option>
                          <a-select-option
                            v-for="doorFrameColor in n.doorFrameColorList"
                            :key="doorFrameColor.propertyValueId"
                            :value="doorFrameColor.propertyValueId"
                          >
                            {{ doorFrameColor.propertyValue }}
                          </a-select-option>
                        </a-select>
                      </div>
                    </a-row>
                    <a-row style="margin-left: 75px;">
                      <div
                        v-for="item in n.doorFrameColor.propertyValueList"
                        :key="item.id"
                        class="scheme-wrapper"
                        @click="chooseProperty(item, i, 'doorFrameColor', 1)"
                      >
                        <house-custom-card
                          :custom-info="item"
                          :custom-type="3"
                        />
                      </div>
                    </a-row>
                  </div>
                  <!-- 门芯 -->
                  <div v-if="!n.color.propertyName && n.coreColor.propertyName">
                    <a-row style="margin-left: 75px;">
                      <div
                        v-if="n.coreColor.propertyName"
                        class="select"
                      >
                        {{ n.coreColor.propertyName }}
                        <a-select
                          v-model="n.coreColorId"
                          class="dr-select"
                          size="large"
                          :dropdown-match-select-width="false"
                          :get-popup-container="trigger => trigger.parentNode"
                          style="position:relative;"
                          @change="chooseProperty(n, i, 'chooseCoreColor', 1)"
                        >
                          <a-select-option value="-1">
                            全部
                          </a-select-option>
                          <a-select-option
                            v-for="coreColor in n.coreColorList"
                            :key="coreColor.propertyValueId"
                            :value="coreColor.propertyValueId"
                          >
                            {{ coreColor.propertyValue }}
                          </a-select-option>
                        </a-select>
                      </div>
                    </a-row>
                    <a-row style="margin-left: 75px;">
                      <div
                        v-for="item in n.coreColor.propertyValueList"
                        :key="item.id"
                        class="scheme-wrapper"
                        @click="chooseProperty(item, i, 'coreColor', 1)"
                      >
                        <house-custom-card
                          :custom-info="item"
                          :custom-type="3"
                        />
                      </div>
                    </a-row>
                  </div>
                  <a-row>
                    <a-button
                      v-if="n.textureMaterial.propertyName"
                      class="buttonRE"
                      @click="changeComponent(3,n)"
                    >
                      替换
                    </a-button>
                  </a-row>
                  <div
                    v-if="n.cheacked && !n.textureMaterial.propertyName"
                    class="nodata"
                  >
                    <dr-nodata />
                  </div>
                </div>
                <div v-if="n.hardName">
                  <a-row>
                    <div
                      v-for="hard in n.hardInfo.list"
                      :key="hard.id"
                      class="scheme-wrapper"
                      @click="chooseProperty(hard, i, 'hard', 1)"
                    >
                      <house-custom-card
                        :custom-info="hard"
                        :custom-type="5"
                      />
                    </div>
                    <div
                      v-if="$ifEmpty(n.hardInfo.list) || n.hardInfo.list.length == 0"
                      class="nodata"
                    >
                      <a-row style="height: 100px;" />
                      <dr-nodata />
                    </div>
                  </a-row>
                  <a-row>
                    <div style="margin-top: 35px;">
                      <dr-pagination
                        v-model="searchHardParam.pageNo"
                        class="footPage"
                        simple
                        :page-size="searchHardParam.pageSize"
                        :total="n.hardInfo.count"
                        @change="onPagesizeChangeHard"
                      />
                    </div>
                  </a-row>
                  <a-row v-if="n.hardInfo.list && n.hardInfo.list.length >0 ">
                    <div
                      class="selectRow lastButton"
                    >
                      <a-button
                        class="primaryBtn ant-btn ant-btn-primary"
                        @click="changeComponent(4,n)"
                      >
                        确认替换
                      </a-button>
                    </div>
                  </a-row>
                </div>
                <div v-if="n.categoryName == '拉手'">
                  <a-row
                    style="margin-left: 75px;"
                  >
                    <div
                      v-for="model in n.materielList"
                      :key="model.componentId"
                      class="scheme-wrapper"
                      @click="chooseProperty(model, i, 'materiel', 2)"
                    >
                      <house-custom-card
                        :custom-info="model"
                        :custom-type="2"
                      />
                    </div>
                  </a-row>
                  <a-row>
                    <a-button
                      class="buttonRE"
                      @click="changeComponent(5,n, 'hand')"
                    >
                      替换
                    </a-button>
                  </a-row>
                </div>
              </div>
            </div>
          </a-row>
        </div>
      </template>

      <template v-if="showModel">
        <div>
          <a-row>
            <div
              class="select"
            >
              <a-select
                v-model="searchParam.id"
                class="dr-select"
                size="large"
                :dropdown-match-select-width="false"
                :get-popup-container="trigger => trigger.parentNode"
                style="position:relative;"
                @change="changeCategory(searchParam.id)"
              >
                <a-select-option
                  v-for="category in categoryList"
                  :key="category.categoryId"
                  :value="category.categoryId"
                >
                  {{ category.categoryName }}
                </a-select-option>
              </a-select>
            </div>
          </a-row>
          <a-row>
            <div
              v-for="n in templateInfo.list"
              :key="n.id"
              class="scheme-wrapper"
              @click="chooseModel(n)"
            >
              <house-custom-card
                :custom-info="n"
                :custom-type="4"
              />
            </div>
            <div
              v-if="$ifEmpty(templateInfo.list) || templateInfo.list.length == 0"
              class="nodata"
            >
              <dr-nodata />
            </div>
          </a-row>
          <a-row>
            <div style="clean:both;" />
            <div>
              <dr-pagination
                v-model="searchParam.pageNo"
                class="footPage"
                simple
                :page-size="searchParam.pageSize"
                :total="templateInfo.count"
                @change="onPagesizeChange"
              />
            </div>
          </a-row>
          <a-row v-if="templateInfo.list && templateInfo.list.length >0 ">
            <div
              class="selectRow lastButton"
            >
              <a-button
                class="defaultBtn ant-btn ant-btn-default"
                @click="defaultChangeSave(3)"
              >
                取消
              </a-button>
              <a-button
                class="primaryBtn ant-btn ant-btn-primary"
                @click="changeComponent(2, null)"
              >
                确认替换
              </a-button>
            </div>
          </a-row>
        </div>
      </template>
    </div>
    <div
      v-if="$ifEmpty(modelDetail.componentList) || !modelDetail.templateName"
      class="nodata"
    >
      <a-row style="height: 100px;" />
      <dr-nodata />
    </div>
  </div>
</template>
<script src='./HouseCustomModelReplace.js'></script>

<style lang="less" scoped>
.hearder {
  padding-top: 120px;
  /deep/ .ant-row-flex{
    height: 100%;
    flex-flow: row nowrap !important;
  }
}
// 新css
.priceFont {
  color: #8D8D8D;
  font-size: 14px;
}
.fontStyle {
  margin: 10px;
}
.heightFont {
  color: #5C5C5C;
  font-size: 16px;
  margin-top: 15px;
}
.heightLength {
  width: 199px;
}
.saveButton {
  position: absolute;
  margin-left: -90px;
  margin-top: 10px;
  background-color: #F5F5F5;
}
.boxRight {
  display: inline;
  float:left;
  width:50%;
  text-align: left;
}
.boxLeft {
  display: inline;
  float:right;
  width:50%;
  text-align: right;
}
.select {
  float: left;
  padding: 15px;
  font-size: 16px;
  color: #5C5C5C;
}
.dr-select {
  min-width: 300px;
}
/deep/.ant-select-selection-selected-value {
  font-size: 14px;
  color: #5C5C5C;
}
// .component {
//   overflow: auto;
//   height:100vh;
//   -webkit-flex-direction: column;
// }
.componentBody {
  width: 100%;
  height: inherit;
  position: relative;
}
// end新css
h1 {
  font-size: 20px;
}
h2 {
  font-size: 14px;
  color: #8D8D8D;
}
.changeModelButton {
  margin-left: 5px;
}
.fontStyle {
  margin: 10px;
}
.cardbar {
  display: flex;
  height: 92px;
}
.scheme-wrapper {
  display: inline-block;
  margin-left: 10px;
  float: left;
}
.card {
  height: 92px;
  cursor: pointer;
  margin-bottom: 10px;
}
.buttonRE {
  background: #586287;
  color: #fff;
  width:94px !important;
  margin-top: 20px;
}
.lastButton {
    box-sizing: border-box;
    font-variant: tabular-nums;
    line-height: 1.5;
    color: #5c5c5c;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    margin-top: 18px;
    height: 55px;
    // text-align: center;
}
.defaultBtn {
  padding: 0px 60px 0px;
  margin-right: 10px;
}
.primaryBtn {
  padding: 0px 40px 0px;
  margin-right: 20px;
}
/deep/.ant-popover-inner-content {
  padding: 0px;
}
</style>
