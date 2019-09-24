<template>
  <div class="headerMenu">
    <!--顶部空白-->
    <div class="topBlank" />
    <!--菜单-->
    <a-menu
      mode="horizontal"
      :selected-keys="selectedKeys"
      @click="changeMenu"
    >
      <template v-for="page in pages">
        <template v-if="!page.children">
          <a-menu-item
            :key="page.url"
            @click="goto(page)"
          >
            {{ page.nameCn }}
          </a-menu-item>
        </template>
        <template v-else>
          <a-sub-menu
            :key="page.url"
            :selected-keys="selectedKeys"
            @click="changeMenu"
          >
            <span
              slot="title"
              class="submenu-title-wrapper"
            >
              {{ page.nameCn }}&nbsp;<a-icon type="caret-down" />
              <a-badge
                v-if="messageInfo.solutionCount"
                :number-style="{backgroundColor: 'rgb(233, 108, 46)'}"
                count="!"
                class="red-icon-wrap"
              />
            </span>
            <template v-for="subPage in page.children">
              <a-menu-item
                :key="subPage.url"
                @click="goto(subPage)"
              >
                {{ subPage.nameCn }}
                <a-badge
                  v-if="subPage.nameCn == '产品方案' && messageInfo.solutionCount"
                  :count="messageInfo.solutionCount"
                  :number-style="{backgroundColor: 'rgb(233, 108, 46)'}"
                  class="red-icon-wrap2"
                  :overflow-count="99"
                />
              </a-menu-item>
            </template>
          </a-sub-menu>
        </template>
      </template>
    </a-menu>
    <!--问题反馈-->
    <div
      class="feedback"
      @click="showFeebback = true"
    >
      <a-icon type="form" />问题反馈
      <feed-back :show-feedback.sync="showFeebback" />
    </div>
    <!--用户信息-->
    <div
      class="userInfo"
      @mouseenter="showUserInfo"
      @mouseleave="hideUserInfo"
    >
      <a-avatar
        v-if="$ifEmpty(userInfo.user.uImg)"
        class="userAvator"
        :size="24"
        icon="user"
      />
      <a-avatar
        v-if="!$ifEmpty(userInfo.user.uImg)"
        class="userAvator"
        :src="$ifAliyunImage(userInfo.user.uImg)?userInfo.user.uImg+'!original':userInfo.user.uImg"
        :size="24"
        icon="user"
      />
      <div class="userName">
        <div>{{ userInfo ? userInfo.user.nickName : '未登录' }}</div>
        <a-icon
          class="iconbtn"
          type="caret-down"
          theme="filled"
        />
      </div>
      <div
        v-if="showUserFlag"
        class="userDownInfo"
      >
        <div class="t1">
          <div>
            <a-avatar
              v-if="$ifEmpty(userInfo.user.uImg)"
              class="userAvator"
              :size="50"
              icon="user"
            />
            <a-avatar
              v-if="!$ifEmpty(userInfo.user.uImg)"
              class="userAvator"
              :src="$ifAliyunImage(userInfo.user.uImg)?userInfo.user.uImg+'!original':userInfo.user.uImg"
              :size="50"
              icon="user"
            />
          </div>
          <div style="width: 160px;">
            <div class="name">
              {{ userInfo.user.nickName }}
            </div>
            <div class="mobile">
              {{ userInfo.user.formatMobile }}
            </div>
          </div>
          <div
            class="exit"
            @click="exitLogin"
          >
            退出
          </div>
        </div>
        <div class="t2">
          <div
            class="eachline"
            @click="pushPage('/my-collection')"
          >
            <a-icon
              class="iconInfo"
              type="star"
            /><span>我的收藏</span>
          </div>
          <div
            class="eachline"
            @click="pushPage('/my-info')"
          >
            <a-icon
              class="iconInfo"
              type="user"
            /><span>个人中心</span>
          </div>
          <div
            class="eachline"
            @click="pushPage('/about')"
          >
            <a-icon
              class="iconInfo"
              type="exclamation-circle"
            /><span>&nbsp;&nbsp;&nbsp;关于&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageList from '@/common/config/pagelist.js'
import FeedBack from '@/components/feedback.vue'
import { setUserInfo } from '@/common/utils/baseFunc.js'
import {formatMobile, execQtFuncByChannel} from '@/common/utils/baseMethods.js'
import global from '@/common/config/global.js'

export default {
  name: 'DrHeader',
  components:{ FeedBack },
  data () {
    return {
      messageInfo: {},
      pages: pageList,
      selectedKeys: [], // 当前选中菜单页
      userInfo: {user:{username:'',userId:""}},
      showUserFlag: false,
      showFeebback:false // 是否显示问题反馈弹窗
    }
  },
  watch: {
    '$route' () {
      this.setCurrentMenu()
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  },
  created () {
    //获取用户信息，头像等
    this.queryUserDetail()
  },
  mounted () {
    // 设置当前url
    this.setCurrentMenu()
    this.searchMessage()

  },
  methods: {
    goto (page) {
      if (page.children) {
        return
      }
      this.$router.push(page.url)
    },
    setCurrentMenu () {
      let _hash = null
      if (location.href.indexOf('#') !== -1) {
        _hash = location.href.split('#')[1].split('/')
      }
      let _hashStr = _hash && _hash.length >= 2 ? '/' + _hash[1] : ''
      this.selectedKeys = [_hashStr]
    },
    changeMenu (menu) {
      const key = menu.key
      this.selectedKeys = [key]
    },
    /**
     * 显示用户下拉
     */
    showUserInfo () {
      this.showUserFlag = true
    },
    /**
     * 隐藏用户下拉
     */
    hideUserInfo () {
      this.showUserFlag = false
    },
    /**
     * @param url
     */
    pushPage (url) {
      this.$router.push(url)
    },
    // 据用户查询方案实时上架与下架意见信息
    searchMessage () {
      const self = this
      let userInfo = this.$getUserInfo()
      let userId = userInfo.user.userId
      this.$http.post('/dr-web/solutionMsg/queryMsgByUser', {userId: userId}).then(function (res) {
        if (res) {
          if (res.code == 1 && res.data) {
            self.messageInfo = res.data
          }
        }
        else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '查询方案实时上架与下架意见信息失败'
          })
        }
      }).catch(function (res) {
        self.$notification.error({
          message: '失败',
          description: res.msg || '查询方案实时上架与下架意见信息失败'
        })
      });
    },
    /**
      * 查询用户信息
      */
    queryUserDetail() {
      const self = this
      self.userInfo = {user:{username:'',userId:""}}
      self.total = 0
      let userInfo = this.$getUserInfo()
      const searchParam = {userId: userInfo.user.userId,}
      this.$http.post('/dr-web/queryDesigner', searchParam).then(function (res) {
        if (res) {
          if (res.code == 1 && res.data) {
            self.userInfo.user=res.data
            self.userInfo.user.formatMobile = formatMobile(self.userInfo.user.mobile)
          }
        }
        else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '查询用户信息失败'
          })
        }
      }).catch(function (res) {
        self.$notification.error({
          message: '失败',
          description: res.msg || '查询用户信息失败'
        })
      });
    },
    exitLogin(){
      execQtFuncByChannel(global.qtChannel.main,'onUploadLogFile', '')
      const  userInfo = this.$getUserInfo()
      userInfo.autologin=false
      //清除缓存
      setUserInfo(userInfo)
      this.$store.commit('CLOSE_WEBSOCKET')
      //跳转到登录页
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less">
.red-icon-wrap {
  position: absolute;
  margin-left: 10px;
  margin-top: -10px;
}
.red-icon-wrap2 {
  position: absolute;
}
  .headerMenu {
    min-width: 1204px;
    .topBlank {
      height: 20px;
      width: 100%;
      background-color: white;
    }
    text-align: left;
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    z-index: 11;
    .ant-menu-horizontal {
      padding-left: 60px;
      border-bottom: none;
      height: 56px;
      line-height: 56px;
      .ant-menu-item, .ant-menu-horizontal > .ant-menu-submenu {
        font-size: 16px;
        font-weight: 400;
        color: #8D8D8D;
        border-bottom: none;
        width: 150px;
      }
      .ant-menu-item:hover,
      .ant-menu-submenu:hover,
      .ant-menu-item-active,
      .ant-menu-submenu-active,
      .ant-menu-item-open,
      .ant-menu-submenu-open,
      .ant-menu-item-selected,
      .ant-menu-submenu-selected {
        background-color: #586287;
        border-bottom:none;
        font-size:16px;
        font-weight:600;
        color:#FFFFFF !important;
        .ant-menu-submenu-title {
          font-size: 16px;
          font-weight: 600;
          color:#FFFFFF !important;
        }

      }
      .ant-menu-item, .ant-menu-submenu {
        border-bottom: none;
      }
    }
    .ant-menu-item:hover,
    .ant-menu-item-active,
    .ant-menu:not(.ant-menu-inline)
    .ant-menu-submenu-open,
    .ant-menu-submenu-active,
    .ant-menu-submenu-title:hover {
      background-color: #586287;
      border-bottom:none;
      font-size:16px;
      font-weight:600;
      color:#FFFFFF;
    }
    .userInfo {
      position: absolute;
      right: 40px;
      top:40px;
      display: flex;
      .userAvator {
        margin-right: 10px;
      }
      .userName {
        display: flex;
        font-size:12px;
        font-weight:400;
        color: #8D8D8D;
        cursor: pointer;
        height: 20px;
        line-height: 20px;
        margin-top: 4px;
        .iconbtn {
          margin-top: 4px;
          margin-left: 5px;
        }
      }
    }

}
  .ant-menu-item {
    font-size:16px;
    color:#8D8D8D;
    text-align: center;
  }
  .ant-menu-item:hover {
    background-color: #F9F9F9;
    color:#8D8D8D;
    font-weight: 600;
  }
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: #F9F9F9;
    font-size:16px;
    font-weight:600;
    color:rgba(141,141,141,1);
  }
  .ant-menu-horizontal.ant-menu-sub,
  .ant-menu-vertical.ant-menu-sub,
  .ant-menu-vertical-left.ant-menu-sub,
  .ant-menu-vertical-right.ant-menu-sub {
    min-width: 100px;
  }
  .ant-menu-vertical .ant-menu-item,
  .ant-menu-vertical-left .ant-menu-item,
  .ant-menu-vertical-right .ant-menu-item,
  .ant-menu-inline .ant-menu-item,
  .ant-menu-vertical .ant-menu-submenu-title,
  .ant-menu-vertical-left .ant-menu-submenu-title,
  .ant-menu-vertical-right .ant-menu-submenu-title,
  .ant-menu-inline .ant-menu-submenu-title {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .ant-menu-item, .ant-menu-submenu-title {
    transition: none;
    font-size:16px !important;
    font-weight:400;
    color:#8D8D8D;
  }
  .ant-menu-vertical .ant-menu-item:not(:last-child), .ant-menu-vertical-left .ant-menu-item:not(:last-child), .ant-menu-vertical-right .ant-menu-item:not(:last-child), .ant-menu-inline .ant-menu-item:not(:last-child){
    margin-bottom: 0px !important;
  }
  .userDownInfo {
    width:320px;
    height:269px;
    background:#FFFFFF;
    border:1px solid #ECECEC;
    position: absolute;
    right: 10px;
    z-index: 99999999;
    padding: 30px;
    top:0;
    right: 0;
    .t1 {
      border-bottom: 1px solid #E8E8E8;
      margin-bottom: 15px;
      display: flex;
      padding-bottom: 20px;
      .name {
        font-size:16px;
        font-weight:600;
        color:#5C5C5C;
        line-height: 20px;
        margin-bottom:8px;
        margin-top: 4px; 
      }
      .mobile {
        font-size:12px;
        font-weight:400;
        color:#C7C7C7;
        line-height:12px;
      }
      .exit {
        float: right;
        &:hover{
          cursor: pointer;
        }
      }
    }
    .t2 {
      .eachline {
        height:46px;
        font-size:14px;
        font-weight:400;
        color:#5C5C5C;
        line-height:46px;
        cursor: pointer;
        padding-left: 64px;
        .iconInfo {
          margin-right: 10px;
          font-size: 16px;
        }
      }
      .eachline:hover {
        background-color: #F9F9F9;
        color: #586287;
      }
    }
  }
  .feedback{
    position: absolute;
    top: 45px;
    right: 180px;
    color: #8d8d8d;
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    .anticon{
      margin-right: 5px;
    }
  }
</style>
