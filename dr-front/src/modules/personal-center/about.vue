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
    <div class="aboutTitle">
      关于
    </div>
    <div class="aboutTab">
      <a-tabs
        :active-key="activekey"
        tab-position="left"
        @change="changetab"
      >
        <a-tab-pane
          key="1"
          tab="更新日志"
        >
          <div class="">
            <div
              style="width:50%;text-align:left;"
            >
              <div>
                <!-- &nbsp;&nbsp;&nbsp;&nbsp;更新日志&nbsp;&nbsp;{{ versionNo }} -->
                <p class="version-name">
                  Dreamroom Version 1.2.9_2019.08.02
                </p>
                <div class="version-content">
                  1.新增艾佳项目标准原始户型数据提交功能；<br>
                  2.新增艾佳项目户型原始户型图生成功能；<br>
                  3.修复了方案户型拆改功能使用过程中，设计过程数据丢失的问题；<br>
                  4.修复了渲染视角切换导致崩溃的问题；<br>
                  5.优化了因户型临摹图格式错误，导致加载失败问题的用户提示；<br>
                </div>
                <p class="version-name">
                  Dreamroom Version 1.2.10_2019.08.10
                </p>
                <div class="version-content">
                  1.云相册功能采用web版，体验更棒；<br>
                  2.增加支持窗的替换功能；<br>
                  3.增加方案耗时统计功能，可通过报表查看真实的方案设计时长；<br>
                  4.使用新版安装器，具备自更新能力；<br>
                  5.铝扣板物料生成优化，暖风机和面板灯位置正确；
                </div>
                <p class="version-name">
                  Dreamroom Version 1.2.10.1_2019.08.12
                </p>
                <div class="version-content">
                  1.修复硬装门没法带入到硬装清单数据问题；<br>
                  2.修复飘窗生成窗台板位置不正确的问题；<br>
                  3.修复加载动画“下移家具”快捷键描述错误的问题；<br>
                  4.修复上一次空间的视角数据被清空问题； <br>
                  5.修复属性面板被隐藏的问题；
                </div>
                <p class="version-name">
                  Dreamroom Version 1.2.11_2019.08.16
                </p>
                <div class="version-content">
                  1.新增客户对已完成的设计方案的修改意见反馈；<br>
                  2.支持用户在app进行硬装替换实时渲染；<br>
                  3.支持任意方案状态下进行方案提交和云渲染；<br>
                  4.方案提交新增云渲染任务校验；
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          key="2"
          tab="快捷键"
        >
          <div class="keyboardContent">
            <div class="box">
              <div class="eachrow">
                <div class="name">
                  单键
                </div>
              </div>
              <div class="eachrow">
                <div class="box1">
                  <p class="keyboard1">
                    P
                  </p>
                  <p class="tips">
                    显示/隐藏后端环境选择控件
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    V
                  </p>
                  <p class="tips">
                    吸附
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    H
                  </p>
                  <p class="tips">
                    顶视图切换
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    Esc
                  </p>
                  <p class="tips">
                    退出/终止进度
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    T
                  </p>
                  <p class="tips">
                    软硬装选配
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    Del
                  </p>
                  <p class="tips">
                    删除
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    R
                  </p>
                  <p class="tips">
                    开/关门
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    M
                  </p>
                  <p class="tips">
                    隐藏/显示屋顶
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    G
                  </p>
                  <p class="tips">
                    隐藏/显示光源
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    Alt
                  </p>
                  <p class="tips">
                    反向
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    A
                  </p>
                  <p class="tips">
                    左移
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    D
                  </p>
                  <p class="tips">
                    右移
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    W
                  </p>
                  <p class="tips">
                    前进
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    S
                  </p>
                  <p class="tips">
                    后退
                  </p>
                </div>
              </div>
            </div>
            <div class="box">
              <div class="eachrow">
                <div class="name">
                    &nbsp;&nbsp;
                </div>
              </div>
              <div class="eachrow">
                <div class="box1">
                  <p class="keyboard1">
                    Q
                  </p>
                  <p class="tips">
                    上移
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    E
                  </p>
                  <p class="tips">
                    下移
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    F
                  </p>
                  <p class="tips">
                    三维界面切换到全局视角
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    鼠标左键
                  </p>
                  <p class="tips">
                    选中
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    鼠标右键
                  </p>
                  <p class="tips">
                    旋转视角
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    空格
                  </p>
                  <p class="tips">
                    切换移动、旋转、缩放操作
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    <a-icon type="arrow-left" />
                  </p>
                  <p class="tips">
                    左移物体1mm
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    <a-icon type="arrow-right" />
                  </p>
                  <p class="tips">
                    右移物体1mm
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    <a-icon type="arrow-up" />
                  </p>
                  <p class="tips">
                    后移物体1mm
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    <a-icon type="arrow-down" />
                  </p>
                  <p class="tips">
                    前移物体1mm
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    [
                  </p>
                  <p class="tips">
                    Y轴旋转物体+90°
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    ]
                  </p>
                  <p class="tips">
                    Y轴旋转物体-90°
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    9
                  </p>
                  <p class="tips">
                    UV偏移X-0.01
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard1">
                    0
                  </p>
                  <p class="tips">
                    UV偏移Y-0.01
                  </p>
                </div>
              </div>
            </div>
            <div class="box">
              <div class="eachrow">
                <div class="name">
                  组合键
                </div>
              </div>
              <div class="eachrow">
                <div class="box1">
                  <p class="keyboard2">
                    Ctrl+X
                  </p>
                  <p class="tips">
                    隐藏墙体/门窗
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard2">
                    Ctrl+C
                  </p>
                  <p class="tips">
                    复制
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard2">
                    Ctrl+V
                  </p>
                  <p class="tips">
                    粘贴
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard2">
                    Ctrl+S
                  </p>
                  <p class="tips">
                    保存
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard2">
                    Ctrl+左键
                  </p>
                  <p class="tips">
                    多选
                  </p>
                </div>
                <div class="box1">
                  <p class="keyboard2">
                    Shift + <a-icon type="arrow-left" />
                  </p>
                  <p class="tips">
                    左移物体10mm
                  </p>
                </div>
                <div class="box1">
                  <div class="keyboard2">
                    Shift + <a-icon type="arrow-right" />
                  </div>
                  <div class="tips">
                    右移物体10mm
                  </div>
                </div>
                <div class="box1">
                  <div class="keyboard2">
                    Alt + <a-icon type="arrow-up" />
                  </div>
                  <div class="tips">
                    上移物体1mm
                  </div>
                </div>
                <div class="box1">
                  <div class="keyboard2">
                    Alt + Shift + <a-icon type="arrow-up" />
                  </div>
                  <div class="tips">
                    上移物体10mm
                  </div>
                </div>
                <div class="box1">
                  <div class="keyboard2">
                    Alt + <a-icon type="arrow-down" />
                  </div>
                  <div class="tips">
                    下移物体1mm
                  </div>
                </div>
                <div class="box1">
                  <div class="keyboard2">
                    Alt + Shift + <a-icon type="arrow-down" />
                  </div>
                  <div class="tips">
                    下移物体10mm
                  </div>
                </div>
                <div class="box1">
                  <div class="keyboard2">
                    Ctrl + [
                  </div>
                  <div class="tips">
                    Y轴旋转物体+5°
                  </div>
                </div>
                <div class="box1">
                  <div class="keyboard2">
                    Ctrl + ]
                  </div>
                  <div class="tips">
                    Y轴旋转物体-5°
                  </div>
                </div>
                <div class="box1">
                  <div class="keyboard2">
                    Alt + 9
                  </div>
                  <div class="tips">
                    UV偏移Y-0.01
                  </div>
                </div>
                <div class="box1">
                  <div class="keyboard2">
                    Alt + 0
                  </div>
                  <div class="tips">
                    UV偏移Y+0.01
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          key="3"
          tab="开发团队"
        >
          <div class="teamContent">
            <div class="eachrow">
              <p>筑梦（DreamRoom）团队:</p>
              <p>Bro Hai</p>
              <p>Bro Chao</p>
              <p>Bro Yi</p>
              <p> Legend YuanYuan</p>
              <p>Bro Jun</p>
              <p>Bro Zhao</p>
              <p>Songsong</p>
              <p>Big Shen</p>
              <p>YangYang</p>
              <p>Yuguoguo</p>
              <p>Jason</p>
              <p>Zhexue</p>
              <p>Xingchen</p>
              <p>MCYan</p>
              <p>FeiFei</p>
              <p>Siling</p>
              <p>Boss Shen</p>
              <p>Star</p>
              <p>Naive Zhang</p>
              <p>Sunny Feng</p>
              <br>
              <p>We dream more!</p>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
export default {
  'name': 'About',
  data() {
    return {
      activekey: '1',
      versionNo:null
    }
  },
  mounted () {
    this.changetab('1')
  },
  methods: {
    /**
       * tab切换
       */
    changetab(key) {
      this.activekey = key
      const self=this
      if(this.activekey==1){
        self.$gLoading.show('正在加载..')
        this.$http.post('/dr-web/ver/queryLatestMsg',{}).then(function(res){
          self.$gLoading.hide()
          if(res.code==1) {
            self.versionNo=res.data.msg
          } else {
            self.versionNo='暂无版本号'
          }
        })

      }
    },
    backhome() {
      this.$router.push({path: './home'})
    }
  }
}
</script>
<style lang="less">
  .backRow {
    height: 60px;
    background-color: #FFF;
    line-height: 60px;
    text-align: left;
    padding-left: 60px;
    box-shadow: 0 0 30px 0 rgba(0,0,0,.1);
    .backTitle {
      font-size: 16px;
      font-weight: 400;
      color: #8D8D8D;
      cursor: pointer;
    }
  }

  .aboutTitle {
    font-size: 20px;
    font-weight: 600;
    color: #5C5C5C;
    position: absolute;
    top: 74px;
    left: 60px;
    z-index: 1;
  }

  .aboutTab {
    .updataLogContent {
      padding: 60px;
      .eachrow {
        display: -webkit-flex;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: flex-start;
        margin-bottom: 30px;
        .name {
          height: 16px;
          font-size: 16px;
          font-weight: 600;
          color: #5C5C5C;
          line-height: 16px;
        }
        .text {
          text-align: left;
          height: 120px;
          font-size: 14px;
          font-weight: 400;
          color: #8D8D8D;
          line-height: 30px;
        }
      }
    }
    .keyboardContent {
      padding: 60px;
      display: flex;
      flex-wrap: nowrap;
      .box {
        .eachrow {
          .name {
            height: 16px;
            font-size: 16px;
            font-weight: 600;
            color: #5C5C5C;
            line-height: 16px;
            padding-bottom: 8px;
            width: 328px;
            text-align: left;
          }
          .box1 {
            padding-top: 20px;
            display: flex;
            flex-wrap: wrap;
            .keyboard1 {
              text-align: left;
              width: 100px;
              height: 14px;
              font-size: 14px;
              font-weight: 600;
              color: #5C5C5C;
              line-height: 14px;
            }
            .keyboard2 {
              text-align: left;
              width: 100px;
              height: 14px;
              font-size: 14px;
              font-weight: 600;
              color: #5C5C5C;
              line-height: 14px;
            }
            .tips {
              text-align: left;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #8D8D8D;
              line-height: 14px;
            }
          }
        }
      }
    }
    .teamContent {
      padding-left: 60px;
      padding-top: 30px;
      .eachrow {
        text-align: left;
        font-size: 14px;
        color: #5C5C5C;
        line-height: 14px;
      }
    }
    /deep/ .ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
      height: 56px;
      line-height: 52px;
      margin: 0px;
      padding-left: 60px;
      padding-top: 0px;
      padding-bottom: 0px;
      text-align: left;
      font-size: 16px;
      font-weight: 600;
    }
    /deep/ .ant-tabs-nav .ant-tabs-tab-active {
      background-color: #586287;
      color: white;
    }
    /deep/ .ant-tabs .ant-tabs-left-bar {
      background-color: #FFFF;
      padding-top: 60px;
      min-width: 220px;
      border-right: none;
      height: calc(100vh - 60px);
      box-shadow: 0 0 30px 0 rgba(0,0,0,.1);
    }
    /deep/ .ant-tabs .ant-tabs-left-content {
      padding-top: 60px;
      padding-left: 60px;
    }
    /deep/.ant-tabs .ant-tabs-left-bar .ant-tabs-ink-bar {
      display: none !important;
    }
  }
  .version-name{
    font-size: 16px;
    color: #5c5c5c;
    font-weight: 600;
  }
  .version-content{
    margin-bottom: 40px;
  }
</style>
