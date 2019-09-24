// 方案卡片公用js

import global from '@/common/config/global.js'

/**
 *根据返回的方案类型和状态标识处理：
  *  1.展示不同的状态文本
  *  2.展示不同的状态样式后缀
  * @param {String} type 方案类型
  * @param {Number} tag  方案状态
  */
export function hanldeStatus (type, tag) {
  let obj = {
    statusText: '',
    statusClassSuffix: ''
  }

  let status = global.myProjectSchemeStatus
  if (type === 2) {
    status = global.myDnaSchemeStatus
  }

  for (let i = 0, len = status.length; i < len; i++) {
    if (status[i].tag === tag.toString()) {
      obj.statusText = status[i].statusCn
      obj.statusClassSuffix = status[i].status
      break
    }
  }

  return obj
}
