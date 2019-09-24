<template>
  <div class="loginback">
    <div
      v-show="!loginLoading"
      class="loginContainer"
    >
      <div class="header">
        <img src="./assets/images/logo-header.png">
      </div>
      <!--登录容器-->
      <div
        v-show="showtab=='login'"
        class="content"
      >
        <div class="tabHeader">
          <div
            style="margin-right:80px;"
            :class="[{'activetab':activetab === 'pass'},{'tabInfo':activetab !== 'pass'}]"
            @click="tabClick('pass')"
          >
            <div>密码登录</div>
            <div
              v-if="activetab === 'pass'"
              class="activetabline"
            />
          </div>
          <div
            :class="[{'activetab':activetab === 'message'},{'tabInfo':activetab !== 'message'}]"
            @click="tabClick('message')"
          >
            <div>短信登录</div>
            <div
              v-if="activetab === 'message'"
              class="activetabline"
            />
          </div>
        </div>
        <div v-show="activetab=='pass'">
          <a-form
            class="loginForm"
            :form="passform"
            @submit="passLoginSubmit"
          >
            <a-form-item
              label=""
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
              required
            >
              <a-input
                v-decorator="[
                  'account',
                  {rules: [{ required: true, message: '请输入登录手机号！' }]}
                ]"
                placeholder="请输入登录手机号"
              >
                <img
                  slot="prefix"
                  class="iconInfo"
                  src="./assets/images/login-phone.png"
                >
              </a-input>
            </a-form-item>
            <a-form-item
              label=""
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
              required
            >
              <a-input
                v-decorator="[
                  'password',
                  {rules: [{ required: true, message: '请输入密码！' }]}
                ]"
                type="password"
                placeholder="请输入密码"
              >
                <img
                  slot="prefix"
                  class="iconInfo"
                  src="./assets/images/login-pass.png"
                >
              </a-input>
            </a-form-item>
            <a-form-item class="rememberRow">
              <a-checkbox
                v-decorator="[
                  'autologin',
                  {
                    valuePropName: 'checked',
                    initialValue: autologin
                  }
                ]"
                @change="onCheckAutologin"
              >
                自动登录
              </a-checkbox>
              <a-checkbox
                v-decorator="[
                  'remember',
                  {
                    valuePropName: 'checked',
                    initialValue: remember
                  }
                ]"
              >
                记住密码
              </a-checkbox>
            </a-form-item>
            <a-form-item class="btnRow">
              <a-button
                type="primary"
                html-type="submit"
                class="loginBtn"
              >
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
        <div v-show="activetab=='message'">
          <a-form
            class="loginForm"
            :form="messageForm"
            @submit="messageLoginSubmit"
          >
            <a-form-item
              label=""
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
              required
            >
              <a-input
                v-decorator="[
                  'phone',
                  {rules: [{ required: true, message: '请输入登录手机号！'},{validator:checkPhone}]}]"
                placeholder="请输入登录手机号"
              >
                <img
                  slot="prefix"
                  class="iconInfo"
                  src="./assets/images/login-phone.png"
                >
              </a-input>
            </a-form-item>
            <a-form-item
              label=""
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 22 }"
              required
              class="smsCodeInfo"
            >
              <a-form-item :style="{ float:'left' }">
                <a-input
                  v-decorator="[
                    'smsCode',
                    {rules: [{ required: true, message: '请输入验证码！' }]}
                  ]"
                  placeholder="请输入验证码"
                >
                  <img
                    slot="prefix"
                    class="iconInfo"
                    src="./assets/images/logincodeIcon.png"
                  >
                </a-input>
              </a-form-item>
              <a-form-item
                :style="{ display: 'inline-block', width: '192px;' }"
              >
                <div
                  v-if="!showSeconds"
                  class="smsCodeBtn"
                  type="primary"
                  @click="getLoginMessage()"
                >
                  获取验证码
                </div>
                <div
                  v-if="showSeconds"
                  class="smsCodeBtn"
                  type="primary"
                >
                  {{ codeTime }}秒后重试
                </div>
              </a-form-item>
            </a-form-item>
            <a-form-item class="btnRow">
              <a-button
                type="primary"
                html-type="submit"
                class="loginBtn"
              >
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
        <div class="tabfooter">
          <div
            class="forgerpass"
            @click="showcontainer('getbackpass')"
          >
            忘记密码
          </div>
          <div
            class="registerNew"
            @click="showcontainer('newuser')"
          >
            注册新用户
          </div>
        </div>
      </div>
      <!--注册新用户-->
      <div
        v-show="showtab=='newuser'"
        class="backpass"
      >
        <div class="title">
          <div>
            <a-icon
              class="iconInfo"
              type="left"
              @click="showcontainer('login')"
            />注册新用户
          </div>
        </div>
        <div class="content">
          <a-form
            class="loginForm"
            :form="form"
            @submit="addNewUser"
          >
            <a-form-item
              label=""
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
              required
            >
              <a-input
                v-decorator="[
                  'newphone',
                  {rules: [{ required: true, message: '请输入需注册的手机号！'},{validator:checkPhone}]}]"
                placeholder="请输入需注册的手机号"
              >
                <img
                  slot="prefix"
                  class="iconInfo"
                  src="./assets/images/login-phone.png"
                >
              </a-input>
            </a-form-item>
            <a-form-item
              label=""
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 20 }"
              required
              class="smsCodeInfo"
            >
              <a-form-item
                :style="{ float:'left' }"
              >
                <a-input
                  v-decorator="[
                    'newuserCode',
                    {rules: [{ required: true, message: '请输入验证码！' }]}
                  ]"
                  placeholder="请输入验证码"
                >
                  <img
                    slot="prefix"
                    class="iconInfo"
                    src="./assets/images/logincodeIcon.png"
                  >
                </a-input>
              </a-form-item>
              <a-form-item
                :style="{ display: 'inline-block', width: '192px;' }"
              >
                <div
                  v-if="!shownewUserSeconds"
                  class="smsCodeBtn"
                  type="primary"
                  @click="getNewUserCode()"
                >
                  获取验证码
                </div>
                <div
                  v-if="shownewUserSeconds"
                  class="smsCodeBtn"
                  type="primary"
                >
                  {{ newcodeTime }}秒后重试
                </div>
              </a-form-item>
            </a-form-item>
            <a-form-item
              label=""
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
              required
            >
              <a-input
                v-decorator="[
                  'newuserPass',
                  {rules: [{ required: true, message: '请输入密码！'},{validator:checkPass}]}]"
                :type="!showpass?'password':'text'"
                placeholder="请设置6-18位密码，不包含特殊符号"
              >
                <img
                  slot="prefix"
                  class="iconInfo"
                  src="./assets/images/login-pass.png"
                >
                <img
                  v-if="showpass"
                  slot="suffix"
                  class="passIcon"
                  src="./assets/images/showpass.png"
                  @click="changePasstype"
                >
                <img
                  v-if="!showpass"
                  slot="suffix"
                  class="passIcon"
                  src="./assets/images/hidepass.png"
                  @click="changePasstype"
                >
              </a-input>
            </a-form-item>
            <a-form-item class="btnRow">
              <a-button
                type="primary"
                html-type="submit"
                class="loginBtn"
              >
                注册
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
      <!--忘记密码-->
      <div
        v-show="showtab=='getbackpass'"
        class="backpass"
      >
        <div class="title">
          <div>
            <a-icon
              class="iconInfo"
              type="left"
              @click="showcontainer('login')"
            />忘记密码
          </div>
        </div>
        <div class="content">
          <a-form
            class="loginForm"
            :form="forgetpassForm"
            @submit="editPassword"
          >
            <a-form-item
              label=""
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
              required
            >
              <a-input
                v-decorator="[
                  'backpassphone',
                  {rules: [{ required: true, message: '请输入手机号！'},{validator:checkPhone}]}]"
                placeholder="请输入要忘记密码的手机号"
              >
                <img
                  slot="prefix"
                  class="iconInfo"
                  src="./assets/images/login-phone.png"
                >
              </a-input>
            </a-form-item>
            <a-form-item
              label=""
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 20 }"
              required
              class="smsCodeInfo"
            >
              <a-form-item :style="{ float:'left' }">
                <a-input
                  v-decorator="[
                    'backpasssmsCode',
                    {rules: [{ required: true, message: '请输入验证码！' }]}
                  ]"
                  placeholder="请输入验证码"
                >
                  <img
                    slot="prefix"
                    class="iconInfo"
                    src="./assets/images/logincodeIcon.png"
                  >
                </a-input>
              </a-form-item>
              <a-form-item
                :style="{ display: 'inline-block', width: '192px;' }"
              >
                <div
                  v-if="!showbakpassSeconds"
                  class="smsCodeBtn"
                  type="primary"
                  @click="getbackPassMessage()"
                >
                  获取验证码
                </div>
                <div
                  v-if="showbakpassSeconds"
                  class="smsCodeBtn"
                  type="primary"
                >
                  {{ backcodeTime }}秒后重试
                </div>
              </a-form-item>
            </a-form-item>
            <a-form-item
              label=""
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
              required
            >
              <a-input
                v-decorator="[
                  'newPassword',
                  {rules: [{ required: true, message: '请输入密码！'},{validator:checkPass}]}]"
                :type="!showpass?'password':'text'"
                placeholder="请重置6-18位密码，不包含特殊符号"
              >
                <img
                  slot="prefix"
                  class="iconInfo"
                  src="./assets/images/login-pass.png"
                >
                <img
                  v-if="showpass"
                  slot="suffix"
                  class="passIcon"
                  src="./assets/images/showpass.png"
                  @click="changePasstype"
                >
                <img
                  v-if="!showpass"
                  slot="suffix"
                  class="passIcon"
                  src="./assets/images/hidepass.png"
                  @click="changePasstype"
                >
              </a-input>
            </a-form-item>
            <a-form-item class="btnRow">
              <a-button
                type="primary"
                html-type="submit"
                class="loginBtn"
              >
                修改密码
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
    <div
      v-show="loginLoading"
      class="loginLoading"
    >
      <div class="loadingtitle">
        <div>正在登录</div>
        <a-spin class="spinInfo" />
      </div>
    </div>
  </div>
</template>

<script>
import {passLogin ,messageLogin ,checkeMessage,resetpassword,addUser} from '@/common/base.api.js'
import { setUserInfo } from '@/common/utils/baseFunc.js'
import { getQtDataBytTag,execQtFuncByChannel } from '@/common/utils/baseMethods.js'
import global from '@/common/config/global.js'
export default {
  'name': 'Login',
  components: {  },
  data () {
    return {
      formLayout: 'horizontal',
      passform: this.$form.createForm(this),
      messageForm:this.$form.createForm(this),
      forgetpassForm:this.$form.createForm(this),
      form:this.$form.createForm(this),
      activetab:'pass',
      codeTime:60,//短信倒计时秒数
      showSeconds:false,//是否显示短信登录倒计时
      codeTimeTimer:null,
      remember:null, //记住密码
      autologin:null, //自动登录
      userInfo:null,
      showtab:'login',  //显示tab  login显示登录tab  newuser显示注册新用户  getbackpass忘记密码
      showbakpassSeconds :false,//是否显示忘记密码倒计时
      backpasscodeTimeTimer:null,
      backcodeTime:60,//忘记密码倒计时秒数
      shownewUserSeconds:false,//是否显示注册新用户
      newUsercodeTimeTimer:null,
      newcodeTime:60,//注册新用户计时秒数
      showpass:false,//是否显示密码
      loginTime:0,    //启动登录倒计时
      loginLoading:false, //显示登录loading
    }
  },
  watch: {

  },
  mounted(){
    //获取自动登录和记住密码值
    const self=this
    const  userInfo = this.$getUserInfo()
    this.userInfo=userInfo
    this.remember=userInfo.remember  //记住密码
    this.autologin=userInfo.autologin //自动登录
    //自动登录直接调用登录接口，跳转home主页
    if(this.autologin){
      this.passform.setFieldsValue({
        account:this.userInfo.account,
        password: this.userInfo.password,
        remember: this.userInfo.remember,
        autologin: this.userInfo.autologin,
      })
      let submitInfo = {
        account: this.userInfo.account,
        password: this.userInfo.password,
        systemId: 4
      }
      self.loginLoading = true
      passLogin(submitInfo).then(data => {
        if (data && data.data) {
          const loginInfo = data.data
          const userInfo = {
            ...loginInfo,
            remember: true,
            autologin: true,
            password: self.userInfo.password,
            account: self.userInfo.account
          }
          //登录信息存入缓存
          setUserInfo(userInfo)
          //登录完成之后跳转到首页
          self.pushHome(userInfo)
        } else {
          self.loginLoading = false
          self.$notification.error({
            message: '失败',
            description: data.msg || '登录失败，请稍后再试！'
          })
        }
      })
    }
    if(this.remember){
      this.passform.setFieldsValue({
        account:this.userInfo.account,
        password: this.userInfo.password
      })
    }
  },
  methods: {
    /**
     * showotherContainer
     */
    showcontainer(value) {
      this.showtab = value
      this.showpass = false
      //清空忘记密码倒计时
      this.backcodeTime = 60
      this.showbakpassSeconds = false//是否显示忘记密码倒计时
      clearInterval(this.backpasscodeTimeTimer)
      //清空注册新用户倒计时
      this.newcodeTime = 60
      this.shownewUserSeconds = false
      clearInterval(this.newUsercodeTimeTimer)
      this.clearPasswordForm()
      this.clearAddNewUserForm()
    },
    //校验手机号码
    checkPhone(rule, value, callback) {
      if (value !== null && value !== undefined && value !== '' && !(/^1(3|4|5|7|8)\d{9}$/.test(value))) {
        // eslint-disable-next-line
        callback('手机号格式错误!');
      } else {
        callback();
      }
    },
    //校验密码（6-18位，数字字母组成）
    checkPass(rule, value, callback) {
      if (value !== null && value !== undefined && value !== '' && !(/^[a-zA-Z0-9]{6,18}$/.test(value))) {
        // eslint-disable-next-line
        callback('请输入6-18位密码，不包含特殊字符');
      } else {
        callback();
      }
    },
    /**
     * tab切换，
     * 清空数据
     */
    tabClick(tab) {
      this.activetab = tab
      //清空短信登录倒计时
      this.codeTime = 60
      this.showSeconds = false
      clearInterval(this.codeTimeTimer)
      //清空忘记密码倒计时
      this.backcodeTime = 60
      this.showbakpassSeconds = false//是否显示忘记密码倒计时
      clearInterval(this.backpasscodeTimeTimer)
      //清空注册新用户倒计时
      this.newcodeTime = 60
      this.shownewUserSeconds = false
      clearInterval(this.newUsercodeTimeTimer)
      //是否显示密码设置位false
      this.showpass = false
    },
    /**
     * 密码登录
     */
    passLoginSubmit(e) {
      e.preventDefault();
      const self = this
      this.passform.validateFields((err, formInfo) => {
        if (!err) {
          let submitInfo = {
            account: formInfo.account,
            password: formInfo.password,
            systemId: 4
          }
          self.loginLoading = true
          passLogin(submitInfo).then(data => {
            if (data && data.data) {
              const loginInfo = data.data
              const userInfo = {
                ...loginInfo,
                remember: formInfo.remember,
                autologin: formInfo.autologin,
                password: formInfo.password,
                account: formInfo.account
              }
              //登录信息存入缓存
              setUserInfo(userInfo)
              //登录完成之后跳转到首页
              self.pushHome(userInfo)
            } else {
              self.loginLoading = false
              self.$notification.error({
                message: '失败',
                description: data.msg || '登录失败，请稍后再试！'
              })
            }
          })
        }
      });
    },
    /**
     *短信登录
     */
    messageLoginSubmit(e) {
      e.preventDefault();
      const self = this
      this.messageForm.validateFields((err, formInfo) => {
        if (!err) {
          const submitInfo = {
            mobile: formInfo.phone,
            smsCode: formInfo.smsCode,
            systemId: 0
          }
          self.loginLoading = true
          checkeMessage({mobile: formInfo.phone, smsCode: formInfo.smsCode, type: 2}).then(res => {
            if (res.success) {
              messageLogin(submitInfo).then(data => {
                if (data && data.data) {
                  const loginInfo = data.data
                  const passwordInfo={
                    account: self.passform.getFieldValue('account'),
                    password: self.passform.getFieldValue('password'),
                    remember: self.passform.getFieldValue('remember'),
                    autologin: self.passform.getFieldValue('autologin'),
                  }
                  const storageInfo={...passwordInfo,...loginInfo}
                  //登录信息存入缓存
                  setUserInfo(storageInfo)
                  //登录完成之后跳转到首页
                  self.pushHome(storageInfo)
                } else {
                  self.loginLoading = false
                  self.$notification.error({
                    message: '失败',
                    description: data.msg || '短信验证校验失败！'
                  })
                }
              })
            } else {
              self.loginLoading = false
              this.$notification.error({
                message: '失败',
                description: res.msg || '短信验证校验失败！'
              })
            }
          })
        }
      })
    },
    /**
     *忘记密码登录
     */
    editPassword(e) {
      e.preventDefault();
      const self = this
      this.forgetpassForm.validateFields((err, formInfo) => {
        if (!err) {
          const submitInfo = {
            mobile: formInfo.backpassphone,
            password: formInfo.newPassword,
            smsCode: formInfo.backpasssmsCode
          }
          resetpassword(submitInfo).then(res => {
            if (res.success) {
              self.$notification.success({
                message: '成功',
                description: '密码修改成功，请登录'
              })
              this.showcontainer('login')
            } else {
              self.$notification.error({
                message: '失败',
                description: res.msg || '密码修改失败！'
              })
            }
          })
        }
      })
    },
    /**
     *新增用户
     */
    addNewUser(e) {
      e.preventDefault();
      const self = this
      this.form.validateFields((err, formInfo) => {
        if (!err) {
          const submitInfo = {
            mobile: formInfo.newphone,
            password: formInfo.newuserPass,
            smsCode: formInfo.newuserCode
          }
          checkeMessage({mobile: formInfo.newphone, smsCode: formInfo.newuserCode, type: 1}).then(response => {
            if (response.success) {
              addUser(submitInfo).then(res => {
                if (res.success) {
                  self.$notification.success({
                    message: '成功',
                    description: '新用户注册成功，请登录'
                  })
                  this.showcontainer('login')
                } else {
                  self.$notification.error({
                    message: '失败',
                    description: res.msg || '新用户注册失败，请稍后再试！'
                  })
                }
              })
            } else {
              this.$notification.error({
                message: '失败',
                description: response.msg
              })

            }
          })
        }
      })
    },

    /**
     * 登录成功之后将登录信息传入QT
     */
    sendLoginToQt(userInfo) {
      userInfo.sessionId = '1' // 由于某些老beta接口需要sessionId，故在此写死
      execQtFuncByChannel(global.qtChannel.main,'onLogIn',userInfo)
    },
    /**
     * 获取登录验证码
     */
    async getLoginMessage() {
      const self = this
      const phone = this.messageForm.getFieldValue('phone')
      // if (phone == undefined || phone == '' || phone == null) {
      //   this.$message.error('请输入用户手机号')
      //   return;
      // }
      let checkResult = await new Promise(function (resolve, reject) {
        self.messageForm.validateFields(['phone'], (errors, values) => {
          if (errors) {
            self.$message.error('手机号填写错误，不能发送验证码！')
            reject(false)
          } else {
            resolve(true)
          }
        })
      })
      if (!checkResult) {
        return
      }
      //启动倒计时
      this.showSeconds = true
      this.codeTimeTimer = setInterval(() => {
        this.codeTime--;
        if (this.codeTime <= 0) {
          this.showSeconds = false
          this.codeTime = 60
          clearInterval(this.codeTimeTimer)
        }
      }, 1000)
      const data = {
        "ip": null,
        "mobile": phone,
        "source": 1,
        "type": 2
      }
      const host = window.location.host
      //线上验证码使用短信接口，其他环境使用模拟接口
      let url = 'dr-web/verification/simulateSmsCode'
      if (host.indexOf('dr.ihomefnt.com') > -1) {
        url = 'dr-web/verification/sendSmsCode'
      }
      this.$http.post(url, data).then(function (res) {
        if (res.success) {
          self.$notification.success({
            message: '成功',
            description: '验证码发送成功'
          })
        } else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '验证码发送失败，请稍后再试！'
          })
        }
      }).catch(function (res) {
        self.$notification.error({
          message: '失败',
          description: res.msg || '验证码发送失败，请稍后再试！'
        })
      });
    },
    /**
     *获取忘记密码验证码
     */
    async getbackPassMessage() {
      const self = this
      const backpassphone = this.forgetpassForm.getFieldValue('backpassphone')
      let checkResult = await new Promise(function (resolve, reject) {
        self.forgetpassForm.validateFields(['backpassphone'], (errors, values) => {
          if (errors) {
            self.$message.error('手机号填写错误，不能发送验证码！')
            reject(false)
          } else {
            resolve(true)
          }
        })
      })
      if (!checkResult) {
        return
      }
      // if (backpassphone == undefined || backpassphone == '' || backpassphone == null) {
      //   this.$message.error('请输入要忘记密码的手机号')
      //   return;
      // }
      //启动倒计时
      this.showbakpassSeconds = true
      this.backpasscodeTimeTimer = setInterval(() => {
        this.backcodeTime--;
        if (this.backcodeTime <= 0) {
          this.showbakpassSeconds = false
          this.backcodeTime = 60
          clearInterval(this.backpasscodeTimeTimer)
        }
      }, 1000)
      const data = {
        "ip": null,
        "mobile": backpassphone,
        "source": 1,
        "type": 3
      }
      const host = window.location.host
      //线上验证码使用短信接口，其他环境使用模拟接口
      let url = 'dr-web/verification/simulateSmsCode'
      if (host.indexOf('dr.ihomefnt.com') > -1) {
        url = 'dr-web/verification/sendSmsCode'
      }
      this.$http.post(url, data).then(function (res) {
        if (res.success) {
          self.$notification.success({
            message: '成功',
            description: '验证码发送成功'
          })
        } else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '验证码发送失败！'
          })
        }
      }).catch(function (res) {
        self.$notification.error({
          message: '失败',
          description: res.msg || '验证码发送失败！'
        })
      });
    },
    /**
     *获取注册新用户验证码
     */
    async getNewUserCode() {
      const self = this
      const newphone = this.form.getFieldValue('newphone')
      let checkResult = await new Promise(function (resolve, reject) {
        self.form.validateFields(['newphone'], (errors, values) => {
          if (errors) {
            self.$message.error('手机号填写错误，不能发送验证码！')
            reject(false)
          } else {
            resolve(true)
          }
        })
      })
      if (!checkResult) {
        return
      }
      //启动倒计时
      this.shownewUserSeconds = true
      this.newUsercodeTimeTimer = setInterval(() => {
        this.newcodeTime--;
        if (this.newcodeTime <= 0) {
          this.shownewUserSeconds = false
          this.newcodeTime = 60
          clearInterval(this.newUsercodeTimeTimer)
        }
      }, 1000)
      const data = {
        "ip": null,
        "mobile": newphone,
        "source": 1,
        "type": 1
      }
      const host = window.location.host
      //线上验证码使用短信接口，其他环境使用模拟接口
      let url = 'dr-web/verification/simulateSmsCode'
      if (host.indexOf('dr.ihomefnt.com') > -1) {
        url = 'dr-web/verification/sendSmsCode'
      }
      this.$http.post(url, data).then(function (res) {
        if (res.success) {
          self.$notification.success({
            message: '成功',
            description: '验证码发送成功'
          })
        } else {
          self.$notification.error({
            message: '失败',
            description: res.msg || '验证码发送失败，请稍后再试！'
          })
        }
      }).catch(function (res) {
        self.$notification.error({
          message: '失败',
          description: res.msg || '验证码发送失败，请稍后再试！'
        })
      });
    },
    changePasstype() {
      this.showpass = !this.showpass
    },
    // 点击自动登录时，默认选中记住密码
    onCheckAutologin() {
      setTimeout(() => {
        if (this.passform.getFieldValue('autologin')) {
          this.passform.setFieldsValue({remember: true})
        }
      }, 0)
    },
    /**
     * 登录之后调QT接口，查看是否启动成功
     * 最多等待10秒
     * 10秒内启动成功跳转首页
     * 10内启动失败，不跳转，直接提示登录失败
     */
    async pushHome(userInfo) {
      const self=this
      const loginTimeTimer = setInterval(() => {
        this.loginTime++;
        if (this.loginTime % 2 === 0 && this.loginTime < 61) {
          const promise = this.getQtStartStatus()
          promise.then(function(result) {
            if (result == 1) {
              self.loginLoading = false
              self.loginTime = 0
              clearInterval(loginTimeTimer)
              //自动登录，将登录信息传给Qt，跳转home页
              self.sendLoginToQt(userInfo)
              self.$router.push('/home')
            }
          });
        }
        if (this.loginTime > 60) {
          self.$notification.error({
            message: '失败',
            description: '登录失败（启动超时）'
          })
          self.loginLoading = false
          self.loginTime = 0
          clearInterval(loginTimeTimer)
        }
      }, 1000)
    },
    /**
     * 获取QT返回的时候启动成功的状态
     */
    async getQtStartStatus() {
      return  getQtDataBytTag(global.qtChannel.cppObject,global.qtTag.isDRStartComplete)
    },
    /**
     * 清空忘记密码Form表单
     */
    clearPasswordForm(){
      this.forgetpassForm.setFieldsValue({
        backpassphone:null,
        backpasssmsCode: null,
        newPassword: null
      })
    },
    /**
     * 清空注册新用户表单
     */
    clearAddNewUserForm() {
      this.form.setFieldsValue({
        newphone: null,
        newuserCode: null,
        newuserPass: null
      })
    }
  }}
</script>

<style lang="less" scoped>
  .loginback {
    width: 100%;
    height:calc(100vh);
    background: url("./assets/images/login-bg.jpg") no-repeat;
    background-size: 100%;
    .loginContainer {
      position: relative;
      width:520px;
      height:512px;
      background:#F9F9F9;
      box-shadow:0px 10px 20px 0px rgba(0,0,0,0.02);
      border-radius:8px;
      margin: 0 auto;
      top:calc((100vh - 512px)/2);
      .header {
        padding-top: 40px;
        padding-bottom: 30px;
        text-align: center;
        img {
          height: 40px;
        }
      }
    }
    .backpass {
        .title {
          font-size:14px;
          font-weight:600;
          color:#5C5C5C;
          text-align: left;
          margin-left: 222px;
          .iconInfo {
            padding-right: 26px;
            padding-top: 4px;
            font-size: 14px;
            font-weight: 400;
            cursor: pointer;
          }
        }
    }
    .content {
      padding-left: 60px;
      .tabHeader {
        display: flex;
        font-size:14px;
        font-weight:400;
        color:#8D8D8D;
        padding-left: 92px;
        .tabInfo {
          cursor: pointer;
        }
        .activetab {
          font-weight:600;
          color:#5C5C5C;
        }
        .activetabline {
          width:30px;
          height:6px;
          background:#586287;
          border-radius:3px;
          margin-top: 10px;
        }
      }
      .loginForm {
        padding-top: 40px;
        /deep/.ant-input {
          width:400px;
          height:50px;
          background:#ffff;
          border-radius:40px;
          font-size: 14px;
          font-weight: 400;
          border-color: #ffff;
        }
        .smsCodeInfo {
          height: 50px;
          line-height: 50px;
          /deep/.ant-input {
            width:240px;
          }
          .smsCodeBtn {
            width:140px;
            height:50px;
            line-height: 50px;
            background:#FFFFFF;
            border-radius:40px;
            border-color: #FFFFFF;
            font-size:14px;
            font-weight:600;
            color:#5C5C5C;
            cursor: pointer;
          }
        }
        /deep/.has-error .ant-input-affix-wrapper .ant-input {
          border-color: #E96C2E;
        }
        /deep/.ant-form-explain, .ant-form-extra {
          position: relative;
          top: 5px;
          width: 100%;
        }
        /deep/.has-error .ant-form-explain, .has-error .ant-form-split {
          color: #E96C2E;
          font-size:12px;
          font-weight:400;
        }
        .iconInfo {
          width: 18px;
        }
        .passIcon {
          width: 24px;
          cursor: pointer;
        }
        .rememberRow {
          text-align: left;
          margin-left: 105px;
          margin-bottom: 10px;
        }
        .btnRow {
          text-align: left;
          .loginBtn {
            width: 400px;
            height: 50px;
            border-radius: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #FFFFFF;
          }
        }
        /deep/.ant-input-affix-wrapper .ant-input:not(:first-child){
          padding-left: 70px;
        }
        /deep/.ant-input-affix-wrapper .ant-input-prefix {
          left: 40px;
        }
        /deep/.ant-input-affix-wrapper .ant-input-suffix {
          right: -145px;
        }
      }
      .tabfooter {
        font-size:12px;
        font-weight:400;
        color:#586287;
        width: 400px;
        .forgerpass {
          float: left;
          cursor: pointer;
          margin-left: 10px;
        }
        .registerNew {
          float: right;
          cursor: pointer;
          margin-right: 10px;
        }
      }
    }
    /deep/.ant-form label {
      font-size:14px;
      font-weight:400;
      color:#8D8D8D;
    }
    .loginLoading {
      position: relative;
      width:520px;
      height:512px;
      background:rgba(88,98,135,1);
      box-shadow:0px 10px 20px 0px rgba(0,0,0,0.02);
      border-radius:8px;
      margin: 0 auto;
      top:calc((100vh - 512px)/2);
      .loadingtitle {
        font-size: 16px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        margin: 0 auto;
        padding-top: 220px;
        .spinInfo {
          margin-top: 20px;
          /deep/ .ant-spin-dot i {
            background-color: #FFF;
          }
        }
      }

    }
  }

</style>
