// 全屋定制api
import Vue from 'vue'
import {notification} from 'ant-design-vue'
let httpVue = new Vue()

/**
 *
 *完成定制
 * @param {objecgt} param 请求参数
 * @returns
 */
// function submit(param){
//   httpVue.$gLoading.show('正在加载中...')
//   return new Promise(function(resolve,reject){
//     // 正常写法
//     let url = ''
//     httpVue.$http.post(url,param).then(data => {
//       if(data.code === 1){ 
//         notification.error({
//           message: '成功',
//           description: '定制成功！'
//         })
//         resolve(true)
//       }else{
//         notification.error({
//           message: '定制失败',
//           description:data.msg || '服务异常，请稍后再试'
//         })
//         reject(false)
//       }
//     }).finally( () => {
//       httpVue.$gLoading.hide()
//     })
//   })
// }

/**
 *
 *根据三级类目（地柜 or 吊柜）查询物料类目及属性集合
 * @param {objecgt} param 请求参数
 * @returns
 */
function getMaterialCategoryAndProperties(param){
  httpVue.$gLoading.show('正在加载中...')
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/cabinet/queryCategoryProperties',param).then(data => {
      if(data.code === 1){ 
        resolve(data.data)
      }else{
        notification.error({
          message: '查询物料类目及属性集合失败',
          description:data.msg || '服务异常，请稍后再试'
        })
        reject(false)
      }
    }).finally( () => {
      httpVue.$gLoading.hide()
    })
  })
}

/**
 *
 *根据模版分类查询模版分页数据
 * @param {objecgt} param 请求参数
 * @returns
 */
function getTemplatesByClassifyId(param){
  httpVue.$gLoading.show('正在加载中...')
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/cabinet/queryReplaceTemplateByPage',param).then(data => {
      if(data.code === 1){ 
        resolve(data.data)
      }else{
        notification.error({
          message: '查询物料类目及属性集合失败',
          description:data.msg || '服务异常，请稍后再试'
        })
        reject(false)
      }
    }).finally( () => {
      httpVue.$gLoading.hide()
    })
  })
}

/**
 *
 *根据物料类目查询属性集合
 * @param {objecgt} param 请求参数
 * @returns
 */
function getPropertiesByClassifyId(param){
  httpVue.$gLoading.show('正在加载中...')
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/cabinet/queryMaterialInfo',param).then(data => {
      if(data.code === 1){ 
        resolve(data.data)
      }else{
        notification.error({
          message: '查询物料类目属性失败',
          description:data.msg || '服务异常，请稍后再试'
        })
        reject(false)
      }
    }).finally( () => {
      httpVue.$gLoading.hide()
    })
  })
}

/**
 *
 *根据模版id查询详细
 * @param {objecgt} param 请求参数
 * @returns
 */
function getDetailByTemplateId(param){
  httpVue.$gLoading.show('正在加载中...')
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/cabinet/queryCabinetTempMergedByTemplateId',param).then(data => {
      if(data.code === 1){ 
        resolve(data.data)
      }else{
        notification.error({
          message: '查询模型详情失败',
          description:data.msg || '服务异常，请稍后再试'
        })
        reject(false)
      }
    }).finally( () => {
      httpVue.$gLoading.hide()
    })
  })
}

/**
 *
 *根据模版类目id查询可替换的模版类目下拉列表
 * @param {objecgt} param 请求参数
 * @returns
 */
function getCategoryListByClassifyId(param){
  httpVue.$gLoading.show('正在加载中...')
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/cabinet/queryReplaceCategory',param).then(data => {
      if(data.code === 1){ 
        resolve(data.data)
      }else{
        notification.error({
          message: '查询模型分类失败',
          description:data.msg || '服务异常，请稍后再试'
        })
        reject(false)
      }
    }).finally( () => {
      httpVue.$gLoading.hide()
    })
  })
}

/**
 *
 *根据物料id查询颜色集合
 * @param {objecgt} param 请求参数
 * @returns
 */
function getColorsByMaterielId(param){
  httpVue.$gLoading.show('正在加载中...')
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/cabinet/queryCabinetByComponentId',param).then(data => {
      if(data.code === 1){ 
        resolve(data.data)
      }else{
        notification.error({
          message: '查询颜色列表失败',
          description:data.msg || '服务异常，请稍后再试'
        })
        reject(false)
      }
    }).finally( () => {
      httpVue.$gLoading.hide()
    })
  })
}


/**
 *
 *根据物料类目属性获取物料列表
 * @param {objecgt} param 请求参数
 * @returns
 */
function getMaterielList(param){
  httpVue.$gLoading.show('正在加载中...')
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/cabinet/queryFilterCabinet',param).then(data => {
      if(data.code === 1){ 
        resolve(data.data)
      }else{
        notification.error({
          message: '查询物料列表失败',
          description:data.msg || '服务异常，请稍后再试'
        })
        reject(false)
      }
    }).finally( () => {
      httpVue.$gLoading.hide()
    })
  })
}
/**
 * 根据父类目id查询所有叶子节点
 */
function geCategoryList(param){
  httpVue.$gLoading.show('正在加载中...')
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/category/queryCategory',param).then(data => {
      if(data.code === 1){ 
        resolve(data.data)
      }else{
        notification.error({
          message: '查询类目列表失败',
          description:data.msg || '服务异常，请稍后再试'
        })
        reject(false)
      }
    }).finally( () => {
      httpVue.$gLoading.hide()
    })
  })
}
/**
 * 【物料替换】根据硬装类目查询可替换硬装数据
 */
function queryModelByCondition (param) {
  httpVue.$gLoading.show('正在加载中...')
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/model/queryModelByCondition',param).then(data => {
      if(data.code === 1){ 
        resolve(data.data)
      }else{
        notification.error({
          message: '查询模型列表失败',
          description:data.msg || '服务异常，请稍后再试'
        })
        reject(false)
      }
    }).finally( () => {
      httpVue.$gLoading.hide()
    })
  })
}
/**
 *根据模版 参数查询详细
 * @param {objecgt} param 请求参数
 * @returns
 */
function queryCabinetTempByGroupId(param){
  httpVue.$gLoading.show('正在加载中...')
  return new Promise(function(resolve,reject){
    httpVue.$http.post('/dr-web/cabinet/queryCabinetTempByGroupId',param).then(data => {
      if(data.code === 1){ 
        resolve(data.data)
      }else{
        notification.error({
          message: '查询模型详情失败',
          description:data.msg || '服务异常，请稍后再试'
        })
        reject(false)
      }
    }).finally( () => {
      httpVue.$gLoading.hide()
    })
  })
}

const houseCustomApi = {
  getMaterialCategoryAndProperties:getMaterialCategoryAndProperties,
  getTemplatesByClassifyId:getTemplatesByClassifyId,
  getPropertiesByClassifyId:getPropertiesByClassifyId,
  getDetailByTemplateId:getDetailByTemplateId,
  getCategoryListByClassifyId:getCategoryListByClassifyId,
  getColorsByMaterielId:getColorsByMaterielId,
  getMaterielList:getMaterielList,
  geCategoryList: geCategoryList,
  queryModelByCondition: queryModelByCondition,
  queryCabinetTempByGroupId: queryCabinetTempByGroupId
}

export default houseCustomApi