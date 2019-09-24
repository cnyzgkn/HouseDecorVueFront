<template>
  <div id="my-collection-wrap">
    <div class="backRow">
      <div
        class="backTitle"
        @click="backhome"
      >
        <a-icon type="left" />
        <span
          style="padding-left: 8px"
        >返回</span>
      </div>
    </div>
    <div
      id="myCollectionTitle"
      class="collectionTitle"
    >
      我的收藏
    </div>
    <div class="sort-wrap">
      <span
        :class="{'sort-active':searchParam.sortBy === 1 ? true:false}"
        @click="changeSort(1)"
      >按收藏时间降序</span>
      <span
        :class="{'sort-active':searchParam.sortBy === 2 ? true:false}"
        @click="changeSort(2)"
      >按收藏时间升序</span>
    </div>
    <div
      id="myCollection"
      class="myCollection"
    >
      <a-tabs
        v-model="activeTopCategoryId"
        tab-position="left"
        @change="topCategorychange"
      >
        <a-tab-pane
          v-for="topCategory in topCategorys"
          :key="`my-collection-top-category-${topCategory.id}`"
          :tab="topCategory.name"
        >
          <a-tabs
            :active-key="activeCategorytype"
            tab-position="right"
            @change="categorychange"
          >
            <a-tab-pane
              v-for="category in categoryTypeDict"
              :key="category.id"
              :tab="category.name"
            >
              <div
                id="my-colletion-wrap"
                class="collectionrow"
              >
                <div
                  v-for="(collection,index) in myCollectionList"
                  :key="index"
                  class="eachItem"
                  @mouseenter="showEditCategory(index,$event)"
                  @mouseleave="hideEditCategory(index)"
                >
                  <a-popover
                    placement="right"
                    :get-popup-container="getPopupContainer"
                  >
                    <template slot="content">
                      <my-collection-detail
                        :collection-info="collection"
                      />
                    </template>
                    <div class="collectionimg">
                      <a-icon
                        class="icontag"
                        theme="filled"
                        type="star"
                        @click="onCancelCollection(collection.id)"
                      />
                      <img
                        class="imgpng"
                        :src="$ifAliyunImage(collection.image)?collection.image+'!thumc-180x160':collection.image+'?imageView2/2/w/180/h/160'"
                        onerror="onerror = null;src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP0AAAD8AgMAAADBB0rKAAAADFBMVEX8/Pz////7+/vw8PAN5jRjAAAAAnRSTlPvELLCMn8AAAIVSURBVGje7dhBjqMwEAXQnHeOZkt4DxJ1HyPZeyxVDQEChjStfLKYxXxW3Yt6fBcUmDz+uK+Ox4MAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQOCnI3wJeFMYkNJW9WYwUMRM01ZvEQRCTrnPxdJabyMINGqlmKRp7XYLmBKYdMle9Tgg0hWdVm43gb4U1bydf2qoRCyBSc6tkx3oFUuQk8aq3jQkLMFz/VW9aWNgAneoN0MTxKkNh6NRcJhO9WiCt3qLWA/8ud4GLIG8A1gP6lKdlzP0CHBYQZz/K+k+MOcZFQRUduD554gmiFuK5ZrCCfZGLivS8QvAzfOMAdvDcH4lPB/RLXgfHBKEyzfDJXBMEOzq3fRLAl8BDk9gMXwFVMM0rtMd/y3gvwUcCPhwBsTGu0Bcn5EQEN4ADyYYXtVB3R0gDPscVDf350AzVHfhrR6cAW8Y0IzHfYk3EAhH4JeN3tVVaOtL6E79/CTB+lCPe/2IAUn2s56ux2dN1B2Qpd5jCfoNWOsd2IMS1rrX+S1jgKzAMlRTfVewHiwJ7FWv2QQCpsT7PDunuYAJXOerehM1BR/r+xZj2l6U0qWcbgLRS8piUvQeMD737TZ1oEcTbAPQpNJNPQBnYQXm2L7JmruuRQGpB6gtBn+5huuv1Q8/fT+q5w8QBAgQIECAAAECBAgQIECAAAECBAgQIECAwH8I/AV93/QDLc4abwAAAABJRU5ErkJggg=='"
                      >
                    </div>
                    <div class="cdirection">
                      {{ collection.productName }}
                      {{ collection.categoryName }}
                    </div>
                    <div
                      v-show="collection.editCategoryFlag"
                      class="updateBtn"
                    >
                      <a-button
                        class="btnclass"
                        @click="updateCategory(collection)"
                      >
                        修改分类
                      </a-button>
                    </div>
                  <!-- <my-collection-detail
                    v-show="collection.editCategoryFlag"
                    :collection-info="collection"
                    :placement="detailPlacement"
                  /> -->
                  </a-popover>
                </div>
              </div>
              <!--分页-->
              <dr-pagination
                v-model="searchParam.pageNo"
                simple
                current="searchParam.pageNo"
                :total="total"
                @change="onPagesizeChange"
              />
            </a-tab-pane>
            <a-button
              slot="tabBarExtraContent"
              class="addcategorybtn"
              @click="addCategory"
            >
              <a-icon type="plus" />
              新增分类
            </a-button>
          </a-tabs>
        </a-tab-pane>
      </a-tabs>
      <!--无数据-->
      <dr-nodata
        v-show="isNodata"
        class="collection-no-data"
      />
      <!--新增分类弹出框-->
      <a-modal
        ref="newCategoryModal"
        centered
        title="新增分类"
        :visible="addvisible"
        @ok="addCategorysubmit"
        @cancel="canceladdcategory"
      >
        <a-form
          :form="newCategoryForm"
        >
          <a-form-item
            label="分类名称："
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 12 }"
          >
            <a-input
              v-decorator="[
                'addCategoryName',
                {rules: [{ required: true, message: '请输入分类名称!' },{max:10,message: '分类名称不能超过10个字符!'}]}
              ]"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <!--修改分类弹出框-->
      <a-modal
        centered
        title="修改分类"
        :visible="updateVisible"
        @ok="updateCategorysubmit"
        @cancel="cancelupdatecategory"
      >
        <div>
          <span>分类名称：</span>
          <a-select
            v-model="updateCategoryId"
            class="categoryInput"
            style="min-width: 200px"
          >
            <a-select-option
              v-for="c in choosedTypeDict"
              :key="c.id"
              :value="c.id"
            >
              {{ c.name }}
            </a-select-option>
          </a-select>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script src='./my-collection.js'></script>

<style lang="less" scoped>
  .backRow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    height: 60px;
    background-color: #FFF;
    line-height: 60px;
    text-align: left;
    padding-left: 60px;
    box-shadow: 0 0 30px 0 rgba(0,0,0,.1);
    .backTitle {
      font-size:16px;
      font-weight:400;
      color:#8D8D8D;
      cursor: pointer;
    }
  }
  .collectionTitle {
    position: absolute;
    top: 60px;
    left: 0;
    width: 220px;
    padding-left: 60px;
    text-align: left;
    background: #ffffff;
    line-height: 70px;
    font-size: 20px;
    font-weight: 600;
    color: #5C5C5C;
    z-index: 1;
  }
  .myCollection {
    .collectionrow {
      width: calc(100% + 30px);
      min-height: calc(100vh - 250px);
      max-height: calc(100vh - 180px);
      margin-bottom: 10px;
      overflow: auto;
      position: relative;
      display: -webkit-flex;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      align-content: flex-start;
      .eachItem {
        width: 200px;
        margin-right: 20px;
        margin-bottom: 25px;
        position: relative;
        cursor: pointer;
        .collectionimg {
          width: 200px;
          height: 210px;
          padding: 0px 10px 10px 10px;
          background-color: #FFFFFF;
          .imgpng {
            width: 100%;
            height: 160px;
          }
          .icontag {
            padding: 9px 8px;
            color: #E96C2E;
            font-size: 20px;
            float: right;
            &:hover{
              cursor: pointer;
            }
          }
        }
        .cdirection {
          position: relative;
          overflow: hidden;
          font-size:14px;
          font-weight:400;
          color:#8D8D8D;
          margin-top: 10px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;

        }
        .updateBtn {
          position: absolute;
          width: 200px;
          height: 60px;
          line-height: 60px;
          background-color: #ffffff;
          bottom: 0px;
          .btnclass {
              width:94px;
              height:36px;
              font-size:12px;
              font-weight:600;
              margin-right: 10px;
          }
        }
      }
    }
    .addcategorybtn {
      background: #FFFFFF;
      font-size: 12px;
      font-weight: 600;
      color: #5C5C5C;
    }
    /deep/.ant-tabs-left-bar .ant-tabs-tab {
      height: 58px;
      line-height: 58px;
      padding-left: 60px;
      padding-top: 0;
      padding-bottom: 0;
      font-size: 16px;
      text-align: left;
    }
    /deep/.ant-tabs{
      height: 100vh;
    }
    /deep/.ant-tabs .ant-tabs-left-bar {
      background-color: #FFFF;
      padding-top: 120px;
      width: 220px;
      border-right: none;
      overflow: hidden;
      box-shadow: 0 0 30px 0 rgba(0,0,0,.1);
    }
    /deep/.ant-tabs .ant-tabs-left-content {
      padding: 60px 0 0 0;
      overflow: auto;
    }
    /deep/.ant-tabs .ant-tabs-right-content {
      padding: 80px 40px 30px 60px;
      overflow: auto;
    }
     /deep/.ant-tabs .ant-tabs-right-bar {
      position: relative;
      height: 100vh;
      width: 200px;
      text-align: left;
      margin-top: -60px;
      padding-top: 60px;
      padding-bottom: 20px;
      overflow: auto;
    }
  }
  .collection-no-data{
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-170px);
  }
  /deep/.ant-tabs-tab-arrow-show{
    display: none;
  }
  /deep/.ant-tabs-nav-scroll{
    height: 100%;
  }
  /deep/.ant-tabs-nav-animated{
    height: 100%;
    overflow: auto;
  }
  /deep/.ant-tabs-nav-container{
    overflow: hidden;
    height: auto !important;
    max-height: calc(100% - 40px);
    padding: 20px 0;
  }
  /deep/.ant-tabs-nav-container-scrolling{
    padding: 0 !important;
  }
  /deep/.ant-tabs-right-bar .ant-tabs-nav-scroll{
    padding-top: 40px;
  }
  /deep/.ant-tabs-left-bar .ant-tabs-ink-bar{
    width: 0px !important;
  }
  /deep/.ant-tabs-right-bar .ant-tabs-ink-bar{
    width: 3px !important;
  }
  /deep/.ant-tabs-left-bar .ant-tabs-tab-active{
    background-color: #586287;
    color: #fff;
  }
   /deep/.ant-tabs-right-bar .ant-tabs-tab-active{
    font-weight: 600;
    color: #5c5c5c;
  }
  /deep/.ant-tabs-right{
    margin-top: -60px;
    padding-top: 60px;
  }
  .sort-wrap{
    position: absolute;
    top: 90px;
    left: 280px;
    z-index: 2;
  }
  .sort-wrap span{
    color: #8D8D8D;
    font-size: 12px;
    margin-right: 20px;
  }
  .sort-wrap span.sort-active{
    font-weight: 600;
    color: #586287;
  }
  .sort-wrap span:hover{
    cursor: pointer;
  }
  /deep/.ant-popover-inner-content{
    padding: 0;
  }
  /deep/.ant-popover-arrow{
    display: none;
}
</style>
