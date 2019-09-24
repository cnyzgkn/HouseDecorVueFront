/**
 * 精品dna 模块公用api
 */
import Vue from 'vue'
let httpVue = new Vue()

/**
 *
 * @param {Number} styleId 风格id
 * @param {Number} seriesId 系列id
 * @param {String} name 搜索名称
 * @param {Number} pageNo 当前页面
 * @param {Number} pageSize 页面大小
 * @param {Number} solutionId 搜索方案id
 */
export function getDnaByContions (styleId = 0, seriesId = 0, name = '', pageNo = 1, pageSize = 10, solutionId) {
  let data = {
    styleId: styleId,
    seriesId: seriesId,
    name: name,
    pageNo: pageNo,
    pageSize: pageSize,
    solutionId: solutionId,
    // 和测试后台确认，查询该接口时需要传递以下参数
    type:2,
    betaStatus:1
  }
  return httpVue.$http.post('/dr-web/solution/queryByCondition', data)
}
