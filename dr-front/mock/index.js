import Mock from 'mockjs'
import message from './messagebox/message.js'
import res1 from './houseCustom/按模版分类查模版分页数据-h'
import res2 from './houseCustom/按三级类目（地柜吊柜）查询物料类目及属性集合-y'
import res3 from './houseCustom/按物料类目查询属性集合-h'
import res4 from './houseCustom/根据模版id查询详细-h'
import res5 from './houseCustom/根据模版类目id查可替换的模版类目下拉列表-h'
import res6 from './houseCustom/根据物料id查询颜色集合-yh'
import res7 from './houseCustom/根据物料类目属性获取物料列表-yh'
Mock.mock(/websoctMessage/,message.websoct)
Mock.mock(/dr-web\/msgBox\/queryMsgList/,message.list)
Mock.mock(/dr-web\/cabinet\/queryCategoryProperties/,res1)
Mock.mock(/dr-web\/cabinet\/queryReplaceTemplateByPage/,res2)
Mock.mock(/dr-web\/cabinet\/queryComponentAttr/,res3)
Mock.mock(/dr-web\/cabinet\/queryCabinetTempByTemplateId/,res4)
Mock.mock(/dr-web\/cabinet\/queryReplaceCategory/,res5)
Mock.mock(/dr-web\/cabinet\/queryCabinetByComponentId/,res6)
Mock.mock(/dr-web\/cabinet\/queryFilterCabinet/,res7)
export default Mock