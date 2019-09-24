<template>
  <div>
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
    <div class="myInfoTitle">
      个人中心
    </div>
    <div class="myInfotab">
      <a-tabs
        :active-key="activekey"
        tab-position="left"
        @change="changetab"
      >
        <a-tab-pane
          key="1"
          tab="个人信息"
        >
          <div class="personContent">
            <div class="eachrow">
              <div class="name">
                昵称
              </div>
              <div class="content">
                {{ userDetailInfo.nickName }}
              </div>
              <a-icon
                type="form"
                class="editIcon"
                @click="editnickname"
              />
            </div>
            <div class="eachrow">
              <div
                class="name"
              >
                头像
              </div>
              <a-avatar
                v-if="$ifEmpty(userDetailInfo.uImg)"
                :size="100"
                icon="user"
              />
              <a-avatar
                v-if="!$ifEmpty(userDetailInfo.uImg)"
                :size="100"
                icon="user"
                :src="$ifAliyunImage(userDetailInfo.uImg)?userDetailInfo.uImg+'!original':userDetailInfo.uImg"
              />
              <a-upload
                name="file"
                :multiple="true"
                :before-upload="beforeUpload"
                :show-upload-list="showUploadList"
                @change="uploadchange"
              >
                <a-button
                  type="dashed"
                >
                  修改头像
                </a-button>
              </a-upload>
            </div>
            <div class="eachrow">
              <div class="name">
                账号
              </div>
              <div
                class="content"
              >
                {{ userDetailInfo.formatMobile }}
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          key="2"
          tab="密码管理"
        >
          <div class="passwordContent">
            <div class="eachrow">
              <div class="name">
                手机账号
              </div>
              <div>{{ userDetailInfo.formatMobile }}</div>
            </div>
            <div class="eachrow">
              <div class="name">
                手机验证码
              </div>
              <div>
                <a-input
                  v-model="smsCode"
                  class="phoneInput"
                  placeholder="请输入手机验证码"
                />
              </div>
              <a-button
                v-show="Verification"
                class="getcodebtn"
                type="default"
                @click="sendSmsCode"
              >
                获取手机验证码
              </a-button>
              <a-button
                v-show="!Verification"
                class="getcodebtn"
                type="default"
              >
                <span>{{ codeTime }}</span>秒后重新获取
              </a-button>
            </div>
            <div class="eachrow">
              <div class="name">
                新密码
              </div>
              <div>
                <a-input
                  v-model="newPassword"
                  class="otherInput"
                  placeholder="请输入新密码"
                />
              </div>
            </div>
            <div class="eachrow">
              <div class="name">
                再次输入
              </div>
              <div>
                <a-input
                  v-model="rePassword"
                  class="otherInput"
                  placeholder="请再次输入新密码"
                />
              </div>
            </div>
            <div
              class="eachrow"
              @click="passwordSubmit"
            >
              <a-button
                class="sureEditBtn"
                type="default"
              >
                确定修改
              </a-button>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <!--修改昵称弹出框-->
    <a-modal
      centered
      title="修改昵称"
      :visible="editnamevisible"
      @ok="editNickNameConfirm"
      @cancel="cancelEditNickName"
    >
      <div>
        <span>昵称：</span>
        <a-input
          v-model="editNickName"
          style="width: 200px"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import {formatMobile} from '@/common/utils/baseMethods.js'
export default {
  'name': 'MyInfo',
  data() {
    return {
      activekey: '1',
      userDetailInfo: {},
      editnamevisible: false,
      editNickName: null,//修改的昵称
      uploadurl:null,
      file:null, //文件上传
      edituImg:null,
      validateAvator:true,
      showUploadList:false, //是否显示上传的list
      codeTime: 60,
      Verification: true,
      codeTimeTimer:null,//倒计时
      //上传的表格
      smsCode: '',
      newPassword: '',
      rePassword: ''
    }
  },
  created() {
    //查询用户信息
    this.queryUserDetail()
    this.uploadurl=process.env.VUE_APP_UPLOADURL
  },
  methods: {
    /**
       * 返回到首页
       */
    backhome() {
      this.$router.push('/home')
    },
    /**
       * tab切换
       */
    changetab(key) {
      this.activekey = key
      //重置修改密码信息,关闭倒计时
      //上传的表格
      this.smsCode= ''
      this.newPassword=''
      this.rePassword= ''
      this.codeTime = 60
      this.Verification=true
      clearInterval(this.codeTimeTimer)
    },
    /**
       * 查询用户信息
       */
    queryUserDetail() {
      const self = this
      self.userDetailInfo = {}
      self.total = 0
      let userInfo = this.$getUserInfo()
      this.$gLoading.show('正努力加载...')
      const searchParam = {userId: userInfo.user.userId,}
      this.$http.post('/dr-web/queryDesigner', searchParam).then(function (res) {
        self.$gLoading.hide()
        if (res) {
          if (res.code == 1 && res.data) {
            self.userDetailInfo=res.data
            self.userDetailInfo.formatMobile = formatMobile( self.userDetailInfo.mobile)
          }
        }
        else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '查询用户信息失败，请稍后再试！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        self.$notification.error({
          message: '失败',
          description: res.msg || '查询用户信息失败，请稍后再试！'
        })
      });

    },
    /**
       * 修改昵称
       */
    editnickname() {
      this.editNickName = this.userDetailInfo.nickName
      this.editnamevisible = true
    },
    /**
       * 取消修改昵称
       */
    cancelEditNickName() {
      this.editnamevisible = false
    },
    /**
       * 修改昵称确认
       */
    editNickNameConfirm() {
      const self = this
      if (this.$ifEmpty(this.editNickName)) {
        this.$message.error('请输入昵称')
      }
      else {
        self.$gLoading.show('正在更新....')
        let userInfo = this.$getUserInfo()
        const param = {
          nickname: this.editNickName,
          uImg: this.userDetailInfo.uImg,
          userId: userInfo.user.userId
        }
        this.$http.post('/dr-web/designer/update', param).then(function (res) {
          self.$gLoading.hide()
          if (res) {
            if (res.code == 1) {
              self.$notification.success({
                message: '成功',
                description: '昵称更新成功'
              })
              self.queryUserDetail()
              self.editnamevisible = false
            }
            else {
              self.$notification.error({
                message: '失败',
                description: res.msg || '昵称更新失败，请稍后再试！'
              })
            }
          }
          else {
            self.$notification.error({
              message: '失败',
              description: res.msg || '昵称更新失败，请稍后再试！'
            })
          }
        }).catch(function (res) {
          self.$gLoading.hide()
          self.$notification.error({
            message: '失败',
            description: res.msg || '昵称更新失败，请稍后再试！'
          })
        });
      }
    },
    beforeUpload(file) {
      this.file = file
      if(file.type!=='image/png' && file.type!=='image/jpeg' && file.type!=='image/jpg' && file.type!=='image/gif'){
        this.$message.error('请上传图片类型的文件！')
        this.validateAvator=false
      }
      else {
        this.validateAvator=true
      }
      return false;
    },
    /**
     * 头像上传
     */
    uploadchange() {
      if (this.validateAvator) {
        const self=this
        self.$gLoading.show('正在上传....')
        const uploadUrl = this.uploadurl + '/unifyfile/file/drGeneralUpload'
        let formData = new FormData()
        formData.append('file', this.file)
        this.$http.post(uploadUrl, formData).then(function (res) {
          if (res) {
            if (res.code == 200 && res.data) {
              //头像上传完之后，重置头像信息，保存
              self.edituImg = res.data
              self.updateDesignAvator()
            }
          } else {
            self.$notification.error({
              message: '失败',
              description: res.msg || '头像上传失败，请稍后再试！'
            })
          }
        }).catch(function (res) {
          self.$gLoading.hide()
          self.$notification.error({
            message: '失败',
            description: res.msg || '头像上传失败，请稍后再试！'
          })
        });
      }
    },
    //更新头像保存
    updateDesignAvator(){
      const self =this
      let userInfo = this.$getUserInfo()
      const param = {
        nickname: this.editNickName,
        uImg: this.edituImg,
        userId: userInfo.user.userId
      }
      this.$http.post('/dr-web/designer/update', param).then(function (res) {
        if (res) {
          if (res.code == 1) {
            self.$notification.success({
              message: '成功',
              description: '头像更新成功'
            })
            self.queryUserDetail()
          }
          else {
            self.$notification.error({
              message: '失败',
              description: res.msg || '头像更新失败，请稍后再试！'
            })
          }
        }
        else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '头像更新失败，请稍后再试！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide()
        self.$notification.error({
          message: '失败',
          description: res.msg || '头像更新失败，请稍后再试！'
        })
      });


    },
    //发送验证码
    sendSmsCode() {
      const self = this;
      self.$gLoading.show('正在更新....');
      let userInfo = this.$getUserInfo();
      const codeParam = {
        ip: userInfo.user.userId,
        mobile: this.userDetailInfo.mobile,
        type: 0,
        source: 0
      };
      this.$http.post('/dr-web/verification/sendSmsCode', codeParam).then(function (res) {
        self.$gLoading.hide();
        if (res) {
          if (res.code === 1) {
            self.$notification.success({
              message: '成功',
              description: '验证码发送成功'
            });
            self.queryUserDetail();
            self.editnamevisible = false
          }
          else {
            self.$notification.error({
              message: '失败',
              description: res.msg || '验证码发送失败，请稍后再试！'
            })
          }
        }
        else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '验证码发送失败，请稍后再试！'
          })
        }
      }).catch(function (res) {
        self.$gLoading.hide();
        self.$notification.error({
          message: '失败',
          description: res.msg || '验证码发送失败，请稍后再试！'
        })
      });
      //倒计时
      this.Verification = false;
      this.codeTimeTimer = setInterval(() => {
        this.codeTime--;
        if (this.codeTime <= 0) {
          this.Verification = true;
          this.codeTime = 60;
          clearInterval(this.codeTimeTimer)
        }
      }, 1000)
    },
    //确认修改
    passwordSubmit() {
      if (this.$ifEmpty(this.smsCode)) {
        this.$message.error('验证码为空')
      } else if (this.$ifEmpty(this.newPassword)) {
        this.$message.error('新密码为空')
      } else if (this.$ifEmpty(this.rePassword)) {
        this.$message.error('再次输入密码为空')
      } else if (this.newPassword !== this.rePassword) {
        this.$message.error('两次密码不一样')
      } else {
        const self = this;
        self.$gLoading.show('正在更新....');
        const passParam = {
          mobile: this.userDetailInfo.mobile,
          password: this.newPassword,
          smsCode: this.smsCode
        };
        this.$http.post('/dr-web/designer/password/reset', passParam).then(function (res) {
          self.$gLoading.hide();
          if (res) {
            if (res.code === 1) {
              self.$notification.success({
                message: '成功',
                description: '密码修改成功'
              });
              self.queryUserDetail();
              self.editnamevisible = false
            }
            else {
              self.$notification.error({
                message: '失败',
                description: res.msg || '密码修改失败，请稍后再试！'
              })
            }
          }
          else {
            self.$notification.error({
              message: '失败',
              description: res.msg || '密码修改失败，请稍后再试！'
            })
          }
        }).catch(function (res) {
          self.$gLoading.hide();
          self.$notification.error({
            message: '失败',
            description: res.msg || '密码修改失败，请稍后再试！'
          })
        });
      }
    }

  }
}
</script>
<style lang="less" scoped>
  .backRow {
    height: 60px;
    background-color: #f9f9f9;
    line-height: 60px;
    text-align: left;
    padding-left: 60px;
    box-shadow:0 0 30px 0 rgba(0,0,0,.1);
    .backTitle {
      font-size: 16px;
      font-weight: 400;
      color: #8D8D8D;
      cursor: pointer;
    }
  }
  .myInfoTitle {
    font-size: 20px;
    font-weight: 600;
    color: #5C5C5C;
    position: absolute;
    top: 74px;
    left: 60px;
    z-index: 1;
  }
  .myInfotab {
    .personContent {
      .eachrow {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        align-content: flex-start;
        margin-bottom: 30px;
        font-size: 16px;
        .name {
          margin-right: 38px;
          color: #8D8D8D;
        }
        .editIcon {
          margin-left: 10px;
          color: #8D8D8D;
        }
        /deep/.ant-btn{
          margin-left: 20px;
        }
      }
    }
    .passwordContent {
      .eachrow {
        display: -webkit-flex;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: flex-start;
        margin-bottom: 30px;
        .name {
          width: 100px;
          font-size: 16px;
          font-weight: 400;
          color: #8D8D8D;
          text-align: left;
        }
        .phoneInput {
          width: 200px;
          height: 36px;
          background: #FFFFFF;
          border: none;
        }
        .otherInput {
          width: 330px;
          height: 36px;
          background: #FFFFFF;
          border: none;
        }
        .getcodebtn {
          width: 120px;
          height: 36px;
          background: rgba(255, 255, 255, 1);
          font-size: 12px;
          font-weight: 600;
          color: #5C5C5C;
          margin-left: 10px;
          border: none;
        }
        .editIcon {
          margin-left: 10px;
          margin-top: 5px;
          color: #8D8D8D;
        }
        .editbtn {
          margin-top: 40px;
          margin-left: 20px;
          border: none;
          font-size: 12px;
          font-weight: 600;
          color: #5C5C5C;
        }
      }
      .sureEditBtn {
        width:150px;
        height:48px;
        background:#586287;
        font-size:16px;
        font-weight:600;
        color:#FFFFFF;
        border-radius: 26px;
      }
    }
    /deep/ .ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
      height: 56px;
      line-height: 52px;
      margin: 0px;
      padding: 0px 0px 0px 60px;
      text-align: left;
      font-size: 16px;
      font-weight: 600;
    }
    /deep/ .ant-tabs-nav .ant-tabs-tab-active {
      background-color: #586287;
      color: white;
    }
    /deep/ .ant-tabs .ant-tabs-left-bar {
      background-color: #f9f9f9;
      padding-top: 60px;
      min-width: 220px;
      border-right: none;
      height: calc(100vh - 60px);
      box-shadow: 0 0 30px 0 rgba(0,0,0,.1);
    }
    /deep/ .ant-tabs .ant-tabs-left-content {
      padding:60px;
    }
    /deep/.ant-tabs .ant-tabs-left-bar .ant-tabs-ink-bar {
      display: none !important;
    }
  }
</style>
