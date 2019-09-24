// websocket实例管理：心跳检测，重连机制

let ws // websocket实例
let WS_URL = ''  // websocketURL
const HEART_BEAT_TIME = 35 //  服务器心跳间隔 30s ,防止网络延迟情况，把检测间隔设为35s

/**
 *
 *
 * @param {String} url 地址
 * @returns
 */
function createWebSocket(url) {
  WS_URL = url
  return new Promise(function(resolve){
    // try {
    console.info('%c准备创建链接','color:blue')
    ws = new WebSocket(WS_URL);
    initEventHandle();
    resolve(ws)
    // } catch (e) {
    //   reconnect();
    // }
  })
}

// 初始化事件函数
function initEventHandle() {
  ws.addEventListener('error',(event) => {
    console.info('%c连接出错,准备关闭连接','color:blue')
    ws.close(3500)
    // reconnect();
  })
  ws.addEventListener('open',(event) => {
    console.info('%c连接打开','color:blue')
    heartCheck.reset().start();      //心跳检测重置
  })
  ws.addEventListener('message',(event) => { //如果获取到消息，心跳检测重置
    console.info('%c收到消息','color:blue')
    heartCheck.reset().start();      //拿到任何消息都说明当前连接是正常的
  })
}

// 心跳检测
let heartCheck = {
  timeout: HEART_BEAT_TIME * 1000,  //  心跳检测时长
  timerId: null, // 定时变量
  reset: function () { // 重置定时
    clearTimeout(this.timerId);
    return this;
  },
  start: function () { // 开启定时
    console.info('%c开启心跳检测','color:blue')
    this.timerId = setTimeout(function () {
      // 心跳时间内收不到消息，主动触发连接关闭
      console.log('%c心跳时间内收不到消息，关闭连接','color:blue')
      ws.close(3500);
    },this.timeout)
  }
}

// 重连
// function reconnect() {
//   if (reconnect.lockReconnect) return;
//   reconnect.lockReconnect = true;
//   setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
//     createWebSocket(WS_URL);
//     reconnect.lockReconnect = false;
//   }, 3000);
// }

export default createWebSocket 