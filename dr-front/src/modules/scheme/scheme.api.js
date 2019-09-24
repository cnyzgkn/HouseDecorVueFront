/**
 * scheme 模块公用api
 */
import Vue from 'vue'
let httpVue = new Vue()
/**
 * 获取我的方案
 * @param {String} userId 用户ID
 * @param {Number} type  1：普通  2：DNA
 * @param {string} status 状态 默认为空 DNA方案:(0.下架|1.上架) 普通方案:( 0.未提交|1.待审核|2.审核通过|3.审核不通过|4.已上线|其它.错误状态 99.草稿中)
 * @param {Number} pageNo 当前页数
 * @param {Number} pageSize 页面大小
 * @param {String} name 搜索名称
 * @param {Number} solutionId 搜索方案id
 */
export function getMySchemesByContion ({ userId, type = 1, status = '', pageNo = 1, pageSize = 10, name = '', solutionId }) {
  if (!userId) {
    return
  }
  let data = {
    addUserId: userId,
    type: type,
    pageNo: pageNo,
    pageSize: pageSize,
    name: name,
    solutionId: solutionId
  }
  if (status !== '' && !isNaN(Number(status))) {
    // if(status === '99'){ // 99:表示该方案未同步至beta系统，则用status字段去查询
    //   data.status = 99
    // }else{ // 以同步至beta系统，则用betastatus字段去查询
    //   data.betaStatus = Number(status)
    // }
    data.betaStatus = Number(status)
  }
  return httpVue.$http({
    method: 'post',
    url: '/dr-web/solution/queryByUserId',
    data: data
  })
}
