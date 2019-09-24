/**
 * 系统变量
 */
const global = {
  // 我的产品方案状态
  myProjectSchemeStatus: [
    {
      status: 'all',
      statusCn: '全部方案',
      tag: ''
    },
    {
      status: 'draft',
      statusCn: '草稿中',
      tag: '99'
    },
    {
      status: 'uncommitted',
      statusCn: '未提交审核',
      tag: '0'
    },
    {
      status: 'checkPending',
      statusCn: '审核中',
      tag: '1'
    },
    // {
    //   status: 'pass',
    //   statusCn: '审核通过',
    //   tag: '2'
    // },
    {
      status: 'noPass',
      statusCn: '审核不通过',
      tag: '3'
    },
    {
      status: 'noPass',
      statusCn: '渲图中',
      tag: '5'
    },
    {
      status: 'online',
      statusCn: '已上线',
      tag: '4'
    },
    {
      status: 'online',
      statusCn: '已下线',
      tag: '6'
    }
  ],
  // 我的DNA方案状态
  myDnaSchemeStatus: [
    {
      status: 'all',
      statusCn: '全部方案',
      tag: ''
    },
    {
      status: 'offline',
      statusCn: '草稿中',
      tag: '99'
    },
    {
      status: 'offline',
      statusCn: '未上线',
      tag: '0'
    },
    {
      status: 'online',
      statusCn: '已上线',
      tag: '1'
    }
  ],
  // 本地环境模拟获取QT的数据：key为QT标示，value为假数据
  //    获取本地以下载的产品方案id
  savedProductSolutionNameStr:'47964;47960;47818;47698;47948;47964;',
  //    获取本地以下载的DNA方案id
  savedDNASolutionNameStr:'47964;47960;47818;47698;47948;47676;',
  savedHouse1NameStr:'1029265;1029239;1028567',
  //    dr是否启动成功
  isDRStartComplete:1,
  // 我的收藏，一级分类
  topCategory:[
    {
      name:'模型',
      id:1
    },
    {
      name:'材质',
      id:2
    }
  ],
  // QT通信索引名
  qtChannel:{
    main:'qtCanvas', // 主页面
    commonModal:'qtCommonMsgBox', // 消息弹窗模块的任务详情和方案详情弹窗页面
    messageDetail: 'qtMessageDetail',     // 消息盒子详情
    // messageBox:'qtMsgBox', // 消息盒子主页页面
    messageList: 'qtMessageList',     // 消息列表
    cppObject:'cppObject',
    commonMsgBox:'cppObjectCommonMsgBox',
    houseCustom:'qtHouseCustomMainChannel', // 全屋定制
    cppObjectHouseCustom:'cppObjectqtHouseCustom'
  },
  // 从QT获取数据时标示
  qtTag:{
    isDRStartComplete:'isDRStartComplete',
    savedProductSolutionNameStr:'savedProductSolutionNameStr',
    savedDNASolutionNameStr:'savedDNASolutionNameStr',
    savedHouse1NameStr:'savedHouse1NameStr',
    getUserInfo: 'getUserInfo',   // qt 消息盒子
    userInfoStr:'userInfoStr',
    onReduceUnreadCount: 'onReduceUnreadCount',
    showMessageDetail: 'showMessageDetail',   // qt 打开方案/任务详情
    rejectTask: 'rejectTask'      // qt 拒绝任务
    // newMessageNotify: 'newMessageNotify'    // 消息盒子 接收 qt的新消息
    // resizeDetailWindow: 'resizeDetailWindow'
  }
}

function deepFreeze(object) {

  // Retrieve the property names defined on object
  var propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self
  
  for (let name of propNames) {
    let value = object[name];

    object[name] = value && typeof value === "object" ? 
      deepFreeze(value) : value;
  }

  return Object.freeze(object);
}


export default deepFreeze(global)
