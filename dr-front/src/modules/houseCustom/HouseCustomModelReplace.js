import DrPagination from '@/components/base/dr-pagination.vue'
import DrNodata  from '@/components/base/dr-nodata'
import global from '@/common/config/global.js'
import MyCustomDetail from '@/components/houseCustom/houseCustomPops.vue'
import HouseCustomCard from '@/components/houseCustom/houseCustomCard.vue'
import { execQtFuncByChannel , provideFunToQtByChannel } from '@/common/utils/baseMethods.js'
export default {
  name:'HouseCustomModelReplace',
  inject:['houseCustomApi'],
  components: { DrPagination , DrNodata , MyCustomDetail , HouseCustomCard },
  props:{
    categoryId:{ // 详情
      type: String,
      default:function(){
        return '0'
      },
      require: true
    },
    templateParam:{ // 变换详情2
      type: Object,
      default:function(){
        return {}
      }
    }
  },
  data(){
    return{
      resetFlag: false, // 重置按钮控制
      distance: '',
      defaultImg: 'this.src="' + require('../../assets/images/project-none.png') + '"',
      noImg: require('../../assets/images/noImg.png'),
      btnLoading: false,
      searchParam: {
        id: null,
        pageSize: 15,
        pageNo: 1
      },
      searchHardParam: {
        categoryId: null,
        pageSize: 21,
        pageNo: 1
      },
      hardFlag: false, // 是否展示硬装
      fashionList: [],
      textureMaterialList:[],
      materielList: [],
      colorList: [],
      doorFrameColorList: [],
      coreColorList: [],
      modelDetail: {},
      componentList: [{
        colorId: '',
        doorFrameColorId: '',
        coreColorId: '',
        textureMaterial: {
          propertyName: '',
          propertyValueList: []
        },
        fashion: {
          propertyName: '',
          propertyValueList: []
        },
        color: {
          propertyName: '',
          propertyValueList: []
        },
        coreColor: {
          propertyName: '',
          propertyValueList: []
        },
        doorFrameColor: {
          propertyName: '',
          propertyValueList: []
        },
        hardInfo: {},
        materielList: []
      }],
      // rightComponentArr: {},
      templateInfo: {},
      showModel: false,
      newPassword: '',
      categoryList: [],
      totalPrice: null,
      chooseEnd: null,
      setTimeParam: null,
      chooseEndId: [],
      chooseEndIdList: [],
      currenActId: null,
      isClickFlag: false
    }
  },
  watch:{
    '$store.state.adjustDistanceToFloor':{
      handler:function(val){
        if(val === null){
          return
        }
        if(JSON.parse(val).success == 1){
          this.$message.success('操作成功！')
        }
        if (JSON.parse(val).success == 0)
          this.$message.error('操作失败！')
      },
      deep:true
    },
    '$store.state.replaceTemplateModel':{
      // 物料-模版替换-返回结果
      handler:function(val){
        let that = this
        console.log(val, 'valreplaceTemplateModel')
        if(val === null){
          return
        }
        this.chooseEnd = null
        this.isClickFlag = false
        if(JSON.parse(val).success == 1){
          this.isClickFlag = true
          this.$gLoading.hide()
          if (this.setTimeParam) {
            this.chooseEnd = this.copyArr(that.setTimeParam)
            this.btnLoading = false
            let obj = null
            let currentIndex = null
            if (this.chooseEnd) {
              if (!this.chooseEnd.hardName) {
                this.componentList.forEach((item, key) => {
                  if (item.categoryId == this.chooseEnd.categoryId) {
                    obj = Object.assign({}, item)
                    currentIndex = key
                  }
                })
                console.log(obj, 132)
                obj.name = this.chooseEnd.materielParam.name
                obj.mainUrl = this.chooseEnd.materielParam.image
                if (obj.attrJson && obj.attrJson.textureMaterial && obj.attrJson.textureMaterial.propertyValueList && obj.attrJson.textureMaterial.propertyValueList.length) {
                  obj.chooseTextureMaterialId = this.chooseEnd.chooseTextureMaterialId
                }
                if (obj.attrJson && obj.attrJson.fashion && obj.attrJson.fashion.propertyValueList && obj.attrJson.fashion.propertyValueList.length) {
                  obj.chooseFashionId = this.chooseEnd.chooseFashionId
                }
                obj.cheacked = false
                obj.colorId = this.chooseEnd.colorId || null
                obj.doorFrameColorId = this.chooseEnd.doorFrameColorId || null
                obj.coreColorId = this.chooseEnd.coreColorId || null
              } else {
                this.componentList.forEach((hardItem, hardKey) => {
                  if (hardItem.drCategoryId == this.chooseEnd.drCategoryId) {
                    obj = Object.assign({}, hardItem)
                    currentIndex = hardKey
                  }
                })
                console.log(obj, 152)
                obj.cheacked = false
                obj.name = this.chooseEnd.chooseHardParam.productName
                obj.image = this.chooseEnd.chooseHardParam.image
              }
              this.$set(this.componentList, currentIndex, obj)
            }
          }
          this.templateInfo.list.forEach((n) => {
            n.selected = false
          })
          this.$message.success('操作成功！')
          // 重新调接口
          let dataTag = 'templateParam'
          this.$store.commit('SAVE_QT_TEMPLATEPARAM', null)
          provideFunToQtByChannel('onNotifyH5SelectTemplateId',dataTag)
        }
        if (JSON.parse(val).success == 0) {
          this.$gLoading.hide()
          this.$message.error('操作失败！')
        }
      },
      deep:true
    },
    '$store.state.templateParam':{
      handler:function(val, oldVal){
        this.currenActId = null
        let oldParam = null
        let param = null
        if (oldVal) {
          oldParam = JSON.parse(oldVal)
          console.log(oldParam, 178)
        }
        if (val) {
          param = JSON.parse(val)
          console.log(param, 182)
        }
        let that = this
        this.chooseEnd = null
        console.log(this.isClickFlag, 189)
        if (oldParam && oldParam.actorId) {
          console.log(this.chooseEndId.includes(oldParam.actorId))
          if (!this.chooseEndId.includes(oldParam.actorId)) {
            this.chooseEndId.push(oldParam.actorId)
            this.chooseEndIdList.push({actId: oldParam.actorId, chooseEnd: that.setTimeParam})
          } else {
            this.chooseEndIdList.forEach((newItem, newKey) => {
              if (newItem.actId == oldParam.actorId && this.isClickFlag) {
                newItem.chooseEnd = that.setTimeParam
              }
            })
          }
          console.log(this.chooseEndIdList, 187)
        }
        if (param && param.actorId) {
          this.currenActId = param.actorId
          if (!this.chooseEndId.includes(param.actorId)) {
            this.chooseEndId.push(param.actorId)
            this.chooseEndIdList.push({actId: param.actorId, chooseEnd: null})
          } else {
            this.chooseEndIdList.forEach((newItem, newKey) => {
              if (newItem.actId == this.currenActId) {
                this.chooseEnd = newItem.chooseEnd
              }
            })
          }
        }
        if (param && param.templateId && param.actorId) {
          this.isClickFlag = false
          this.search(param)
        }
      },
      deep:true,
      immediate: true
    },
    templateParam:{
      deep: true,
      immediate: true,
      handler:function(val){
        this.hardFlag = false
        this.firstFlag = false
        this.secondFlag = false
        this.thirdFlag = false
        this.fourthFlag = false
        this.fifthFlag = false
        this.sixthFlag = false
        this.showModel = false
        this.fashionList = []
        this.textureMaterialList = []
        this.templateParam = val
        // this.search(val)
      }
    }
  },
  created(){
    this.searchCategoryListByClassifyId()
    this.searchPage()
  },
  methods: {
    copyArr (o) {
      if (o instanceof Array) {
        let n = []
        for (let i = 0; i < o.length; ++i) {
          n[i] = this.copyArr(o[i])
        }
        return n
      } else if (o instanceof Object) {
        let n = {}
        for (let i in o) {
          n[i] = this.copyArr(o[i])
        }
        return n
      } else {
        return o
      }
    },
    // 保存离地高度
    saveHeight (value) {
      if (value < 800 || value > 2000) {
        this.$message.error('离地参数在800-2000之间！')
        return
      }
      this.btnLoading = true
      this.$gLoading.show('正在调整离地高度')
      let distance = Number(value)
      let data = {
        distance: distance,
        categoryId: this.modelDetail.categoryId
      }
      execQtFuncByChannel(global.qtChannel.houseCustom,'onNotifyQtAdjustDistanceToFloor',data)
      this.btnLoading = false
      this.$gLoading.hide()
      this.distance = ''
    },
    // 替换模型-重置模版
    defaultChangeSave (type) {
      switch (type) {
        case 1:
          // 替换模版
          this.searchCategoryListByClassifyId()
          this.hardFlag = false
          this.showModel = true
          break;
        case 2:
          // 重置替换模版
          this.templateInfo && this.templateInfo.list.map((n) => {
            n.selected = false
          })
          this.resetFlag = false
          execQtFuncByChannel(global.qtChannel.houseCustom,'onNotifyQtRestoreData',{actorId: this.templateParam.actorId})
          break;
        case 3:
          // 取消
          this.hardFlag = false
          this.showModel = false
          break;
        default:
          break;
      }
    },
    // 通知QT物料替换操作
    changeComponent(type, param){
      let newType = null
      if (type == 5) {
        newType = 3
      } else {
        newType = type
      }
      // model'----type2
      if (type == 2) {
        param = {}
        this.templateInfo.list.map((n) => {
          if (n.selected) {
            param = n
          }
        })
        if (!param.templateId) {
          this.$message.error('请先选择模型！')
          return
        }
        this.resetFlag = true
      }
      // 物料 ------type3
      if (type == 3) {
        if (param.fashion.propertyName && !param.chooseFashionId) {
          this.$message.error('请先选择款式！')
          return
        }
        if (param.textureMaterial.propertyName && !param.chooseTextureMaterialId) {
          this.$message.error('请先选择材质！')
          return
        }
        if (param.materielList && param.materielList.length > 0 && !param.materielParam.componentId) {
          this.$message.error('请先选择物料！')
          return
        }
        if (param.color.propertyName && !param.chooseColorParam.propertyValueId) {
          this.$message.error('请先选择颜色！')
          return
        }
        if (!param.color.propertyName && param.doorFrameColor.propertyName && !param.chooseDoorFrameColorParam.propertyValueId) {
          this.$message.error('请先选择门框！')
          return
        }
        if (!param.color.propertyName && param.coreColor.propertyName && !param.chooseCoreColorParam.propertyValueId) {
          this.$message.error('请先选择门芯！')
          return
        }
      }
      // hard' --- type4 
      if (type == 4) {
        if (!param.chooseHardParam.skuId) {
          this.$message.error('请先选择硬装！')
          return
        }
      }
      // 拉手
      if (type == 5) {
        if (!param.materielParam || (param.materielParam && !param.materielParam.selectFlag)){
          this.$message.error('请先选择拉手！')
        }
      }
      this.$gLoading.show('正努力加载...')
      let data = {
        typeId: newType,
        hashandle: param && param.materielParam && param.materielParam.handlesNumber && param.materielParam.handlesNumber.propertyValueId ? param.materielParam.handlesNumber.propertyValueCode : 0,
        component: null,
        template : type == 2 ? {
          actorId: this.templateParam.actorId,
          templateId: param.templateId
        } : null,
        skumodel: type == 4 ? {
          actorId: this.templateParam.actorId,
          modelId: param.chooseHardParam.modelId,
          drCategoryId: param.chooseHardParam.drCategoryId,
          mxUrl: param.chooseHardParam.mxUrl,
          mxFileMD5: param.chooseHardParam.mxFileMD5,
        } : null
      }
      if (type == 5 || type == 3) {
        data.component = {
          actorId: this.templateParam.actorId,
          modelId: param.materielParam.modelId,
          materialId: param.materielParam.componentId, // 物料ID
          categoryId: param.materielParam.betaCategoryId,
          chargeUnit: param.materielParam.chargeUnit, // 算量方式
          categoryMxUrl: param.materielParam.mxUrl,
          categoryMxFileMD5: param.materielParam.mxFileMD5,
          price: param.materielParam.price, // 价格
          length: param.materielParam.length,
          width: param.materielParam.width,
          categoryName: param.categoryName,
          height: param.materielParam.height,
          colorattr: param.color.propertyName || param.doorFrameColor.propertyName || param.coreColor.propertyName ? [] : null
        }
      }
      if (type == 3) {
        // 颜色存在
        if (param.color.propertyName) {
          data.component.colorattr.push({
            colorCode: param.chooseColorParam.propertyValueCode,
            meshName: 'color',
            colorMxUrl: param.chooseColorParam.mxUrl,
            colorMxFileMD5: param.chooseColorParam.mxFileMD5,
            colorValueId: param.chooseColorParam.propertyValueId,
            propertyId: param.color.propertyId
          })
        }
        // 门框存在
        if (param.doorFrameColor.propertyName) {
          data.component.colorattr.push({
            colorCode: param.chooseDoorFrameColorParam.propertyValueCode,
            meshName: 'doorFrameColor',
            colorMxUrl: param.chooseDoorFrameColorParam.mxUrl,
            colorMxFileMD5: param.chooseDoorFrameColorParam.mxFileMD5,
            colorValueId: param.chooseDoorFrameColorParam.propertyValueId,
            propertyId: param.doorFrameColor.propertyId
          })
        }
        // 门芯存在
        if (param.coreColor.propertyName) {
          data.component.colorattr.push(
            {
              colorCode: param.chooseCoreColorParam.propertyValueCode,
              meshName: 'doorFrameColor',
              colorMxUrl: param.chooseCoreColorParam.mxUrl,
              colorMxFileMD5: param.chooseCoreColorParam.mxFileMD5,
              colorValueId: param.chooseCoreColorParam.propertyValueId,
              propertyId: param.doorFrameColor.propertyId
            },
            {
              colorCode: param.propertyValueCode,
              meshName: 'coreColor',
              colorMxUrl: param.mxUrl,
              colorMxFileMD5: param.mxFileMD5,
              colorValueId: param.propertyValueId,
              propertyId: param.coreColor.propertyId
            }
          )
        }
      }
      this.setTimeParam = param
      execQtFuncByChannel(global.qtChannel.houseCustom,'onNotifyQtReplaceData',data)
      let dataTag = 'replaceTemplateModel'
      // 接收
      this.$store.commit('SAVE_QT_REPLACETEMPLATEMODEL', null)
      provideFunToQtByChannel('onNotifyH5ReplaceDataResult',dataTag)
    },
    // 下拉框-选择-选中
    chooseProperty (param, index, type, clickType) {
      if (clickType) {
        this.chooseEnd = null
      }
      let objColor = Object.assign({}, this.componentList[index])
      switch (type) {
        case 'fashion':
          // 款式
          if (!this.componentList[index].chooseFashionId) {
            this.$message.error('请选择款式')
          }
          break;
        case 'textureMaterial':
          // 材质
          if (!this.componentList[index].chooseTextureMaterialId) {
            this.$message.error('请选择材质')
          } else {
            this.getMaterielList(this.componentList[index].categoryId, this.componentList[index].chooseFashionId, this.componentList[index].chooseTextureMaterialId, index)
          }
          break;
        case 'materiel':
          // 物料
          // this.materielParam = {}
          this.componentList[index].materielParam = param
          this.componentList[index].materielList.forEach((n, i) => {
            this.$nextTick(() => {
              n.selectFlag = n.componentId == param.componentId
              // if (n.componentId == param.componentId) {
              //   n.materielParam = n
              // }
            })
          })
          if (param && param.name != '拉手') {
            // 判断当前门板是否有门把手
            if (param.handlesNumber && param.handlesNumber.propertyId) {
              // 0无1有
              this.componentList.forEach((item, itemkey) => {
                // 判断拉手
                if (item.categoryName == '拉手') {
                  item.disabled = param.handlesNumber.propertyValueList[0].propertyValueCode == 0
                  this.$set(this.componentList, itemkey, item)
                }
              })
            }
            this.getColorsByMaterielId(param.componentId, index)
          }
          break;
        case 'chooseColor':
          // 选择框选择颜色
          param.colorList.forEach((n) => {
            // 重新赋值、同时修改selectFlag选中状态
            n.selectFlag = false
          })
          objColor.color.propertyValueList = []
          this.componentList[index].color.propertyValueList = []
          if (this.componentList[index].colorId == -1) {
            this.$nextTick(() => {
              objColor.color.propertyValueList = param.colorList
              objColor.colorId = param.colorId
              // this.componentList[index].color.propertyValueList = param.colorList
              // this.componentList[index].colorId = param.colorId
            })
          } else {
            param.colorList.forEach((n) => {
              if (n.propertyValueId == this.componentList[index].colorId) {
                objColor.color.propertyValueList.push(n)
                objColor.colorId = param.colorId
              }
            })
          }
          this.$set(this.componentList, index, objColor)
          this.$forceUpdate()
          break;
        case 'color':
          this.componentList[index].chooseColorParam = param
          objColor.chooseColorParam = param
          // 颜色
          this.componentList[index].color.propertyValueList.forEach((n) => {
            n.selectFlag = n.propertyValueId == param.propertyValueId && n.propertyValueCode == param.propertyValueCode
            if (n.selectFlag) {
              objColor.colorId = n.propertyValueId
            }
          })
          this.$set(this.componentList, index, objColor)
          break;
        case 'chooseDoorFrameColor':
          // 选择框选择门框
          console.log(param, index, type, 410)
          param.doorFrameColorList.forEach((n) => {
            // 重新赋值、同时修改selectFlag选中状态
            n.selectFlag = false
          })
          objColor.doorFrameColor.propertyValueList = []
          console.log(this.componentList[index].doorFrameColorId, 416)
          if (this.componentList[index].doorFrameColorId == -1) {
            objColor.doorFrameColor.propertyValueList = param.doorFrameColorList
            objColor.doorFrameColorId = param.doorFrameColorId
          } else {
            param.doorFrameColorList.forEach((n) => {
              if (n.propertyValueId == this.componentList[index].doorFrameColorId) {
                objColor.doorFrameColor.propertyValueList.push(n)
                objColor.doorFrameColorId = param.doorFrameColorId
              }
            })
          }
          this.$set(this.componentList, index, objColor)
          break; 
        case 'doorFrameColor':
          this.componentList[index].chooseDoorFrameColorParam = param
          objColor.chooseDoorFrameColorParam = param
          this.componentList[index].doorFrameColor.propertyValueList.forEach((n) => {
            this.$nextTick(() => {
              n.selectFlag = n.propertyValueId == param.propertyValueId && n.propertyValueCode == param.propertyValueCode
              if (n.selectFlag) {
                objColor.doorFrameColorId = n.propertyValueId
              }
            })
          })
          this.$set(this.componentList, index, objColor)
          break;
        case 'chooseCoreColor':
          // 选择框选择门框
          console.log(param, index, type)
          param.coreColorList.forEach((n) => {
            // 重新赋值、同时修改selectFlag选中状态
            n.selectFlag = false
          })
          objColor.coreColor.propertyValueList = []
          if (this.componentList[index].coreColorId == -1) {
            objColor.coreColor.propertyValueList = param.coreColorList
            objColor.coreColorId = param.coreColorId
          } else {
            param.coreColorList.forEach((n) => {
              if (n.propertyValueId == this.componentList[index].coreColorId) {
                objColor.coreColor.propertyValueList.push(n)
                objColor.objColor = param.coreColorId
              }
            })
          }
          this.$set(this.componentList, index, objColor)
          break; 
        case 'coreColor':
          this.componentList[index].chooseCoreColorParam = param
          objColor.chooseCoreColorParam = param
          this.componentList[index].coreColor.propertyValueList.forEach((n) => {
            n.selectFlag = n.propertyValueId == param.propertyValueId && n.propertyValueCode == param.propertyValueCode
            if (n.selectFlag) {
              objColor.coreColorId = n.propertyValueId
            }
          })
          this.$set(this.componentList, index, objColor)
          break;
        case 'hard':
          this.componentList[index].chooseHardParam = param
          this.componentList[index].hardInfo.list.forEach((n) => {
            n.selected = n.id == param.id
          })
          break;
        default:
          break;
      }
    },
    // 选择物料
    getMaterielList (betaCategoryId, fashion, textureMaterial, index, materialId) {
      let newMaterialId = materialId
      let applicableId = this.modelDetail.categoryId
      console.log(this.chooseEnd, 616)
      if (this.chooseEnd) {
        if (this.componentList[index].categoryId == this.chooseEnd.categoryId) {
          newMaterialId = this.chooseEnd.materielParam.componentId
        }
      }
      this.houseCustomApi.getMaterielList({applicableId, betaCategoryId, fashion, textureMaterial}).then(data => {
        let model = {}
        data.map((n, key) => {
          n.selectFlag = false
          if (n.componentId == newMaterialId) {
            model = n
            console.log(model, 1111111)
            n.selectFlag = true
          }
        })
        this.componentList[index].materielList = data
        this.materielList = data
        this.thirdFlag = this.materielList.length > 0
        if (newMaterialId) {
          this.chooseProperty(model, index, 'materiel')
        }
      })
    },
    // 选择颜色
    getColorsByMaterielId (componentId, index) {
      let objItem = Object.assign({}, this.componentList[index])
      let datas = {
        componentId: componentId
      }
      objItem.colorId = null
      objItem.doorFrameColorId = null
      objItem.coreColorId = null
      this.houseCustomApi.getColorsByMaterielId(datas).then(data => {
        if (this.chooseEnd && this.chooseEnd.colorId && data.attrJson.color && data.attrJson.color.propertyValueList) {
          objItem.colorId = this.chooseEnd.colorId
          data.attrJson.color.propertyValueList.forEach((newValue, newKey) => {
            if (newValue.propertyValueId == this.chooseEnd.colorId) {
              newValue.selectFlag = true
            }
          })
        }
        if (this.chooseEnd && this.chooseEnd.doorFrameColorId && data.attrJson.doorFrameColor && data.attrJson.doorFrameColor.propertyValueList) {
          objItem.doorFrameColorId = this.chooseEnd.doorFrameColorId
          data.attrJson.doorFrameColor.propertyValueList.forEach((newValue, newKey) => {
            if (newValue.propertyValueId == this.chooseEnd.doorFrameColorId) {
              newValue.selectFlag = true
            }
          })
        }
        if (this.chooseEnd && this.chooseEnd.coreColorId && data.attrJson.coreColor && data.attrJson.coreColor.propertyValueList) {
          objItem.coreColorId = this.chooseEnd.coreColorId
          data.attrJson.coreColor.propertyValueList.forEach((newValue, newKey) => {
            if (newValue.propertyValueId == this.chooseEnd.coreColorId) {
              newValue.selectFlag = true
            }
          })
        }
        objItem.color = data.attrJson.color ? data.attrJson.color : {}
        objItem.colorList = data.attrJson.color && data.attrJson.color.propertyValueList ? data.attrJson.color.propertyValueList: {}
        objItem.doorFrameColor = data.attrJson.doorFrameColor ? data.attrJson.doorFrameColor : {}
        objItem.coreColor = data.attrJson.coreColor ? data.attrJson.coreColor : {}
        objItem.doorFrameColorList = data.attrJson.doorFrameColor && data.attrJson.doorFrameColor.propertyValueList ? data.attrJson.doorFrameColor.propertyValueList : {}
        objItem.coreColorList = data.attrJson.coreColor && data.attrJson.coreColor.propertyValueList ? data.attrJson.coreColor.propertyValueList : {}
        this.$set(this.componentList, index, objItem)
      })
    },
    // 选择模版-添加样式
    chooseModel (param) {
      if (this.templateInfo.list && this.templateInfo.list.length > 0) {
        this.templateInfo.list.map((n) => {
          if (n.templateId == param.templateId) {
            n.selected = true
          } else {
            n.selected = false
          }
        })
      }
    },
    // 点击左侧列表
    searchModel (param, index) {
      if(!this.currenActId){
        this.$message.error('请选择模板')
      } else {
        console.log(param, index, '999')
        this.componentList.map((n, i) => {
          this.$nextTick(() => {
            if (param.hardName == 'hard' && n.drCategoryId == param.drCategoryId && index == i) {
              n.cheacked = !n.cheacked
            } else if (n.componentId == param.componentId && index == i){
              n.cheacked = !n.cheacked
            }
          // if (i == index) {
          //   if (!param.clickNum) {
          //     this.getMaterielList(param.categoryId, index)
          //   }
          // }
          })
        })
        // 根据物料类目查询属性集合
        if (!param.cheacked) {
          let datas = {
            materialId: param.materialId
          }
          if (param.hardName == 'hard') {
            this.hardFlag = true
            this.searchHardParam.modelId = param.modelId
            this.searchHardParam.categoryId = param.drCategoryId
            this.searchHardParam.index = index
            if (this.chooseEnd && this.chooseEnd.chooseHardParam && this.chooseEnd.chooseHardParam.modelId) {
              this.searchHardParam.modelId = this.chooseEnd.chooseHardParam.modelId
              this.searchHardParam.categoryId = this.chooseEnd.chooseHardParam.categoryId
            }
            this.searchHardPage()
          } else {
            this.houseCustomApi.getPropertiesByClassifyId(datas).then(data => {
              let objItem = this.componentList[index]
              objItem.textureMaterial = data.attrJson.textureMaterial ? data.attrJson.textureMaterial : {}
              objItem.fashion = data.attrJson.fashion ? data.attrJson.fashion : {}
              if (this.chooseEnd) {
                // if (this.chooseEnd.chooseFashionId) {
                //   objItem.chooseFashionId = this.chooseEnd.chooseFashionId
                // }
                // if (this.chooseEnd.chooseTextureMaterialId) {
                //   objItem.chooseTextureMaterialId = this.chooseEnd.chooseFashionId
                // }
                if (this.chooseEnd.materielParam) {
                  objItem.name = this.chooseEnd.materielParam.name
                  objItem.mainUrl = this.chooseEnd.materielParam.image
                }
              }
              this.$forceUpdate()
              this.$set(this.componentList, index, objItem)
              // this.rightComponentArr = data 
              this.getMaterielList(objItem.categoryId, objItem.chooseFashionId, objItem.chooseTextureMaterialId, index, param.materialId)
            })
          }
        }
      }
      
    },
    // 动态选择模版类型
    changeCategory (id) {
      this.searchPage()
    },
    // 替换模型-按照分页查询分页list
    searchPage () {
      let param = {
        categoryId: this.searchParam.id,
        pageNo: this.searchParam.pageNo,
        pageSize: this.searchParam.pageSize
      }
      this.houseCustomApi.getTemplatesByClassifyId(param).then(data => {
        if (data.list && data.list.length > 0) {
          data.list.map((n) => {
            n.selected = false
          })
        }
        this.templateInfo = data
      })
    },
    // 替换硬装-按照分页查询分页list
    searchHardPage () {
      this.showModel = false
      this.hardFlag = true
      let param = {
        modelId: this.searchHardParam.modelId,
        categoryId: this.searchHardParam.categoryId,
        pageNo: this.searchHardParam.pageNo,
        pageSize: this.searchHardParam.pageSize
      }
      this.houseCustomApi.queryModelByCondition(param).then(data => {
        if (data.list && data.list.length > 0) {
          data.list.map((n) => {
            n.selected = false
            if (this.chooseEnd && this.chooseEnd.chooseHardParam && this.chooseEnd.chooseHardParam.modelId) {
              if (n.modelId == this.chooseEnd.chooseHardParam.modelId) {
                n.selected = true
              }
            }
          })
        }
        this.componentList[this.searchHardParam.index].hardInfo = data
      })
    },
    // 模版分页
    onPagesizeChange (page) {
      this.searchParam.pageNo = page
      this.searchPage()
    },
    // 硬装分页
    onPagesizeChangeHard (page) {
      this.searchHardParam.pageNo = page
      this.searchHardPage()
    },
    // 查询模版详情
    search (val) {
      // val = {
      //   groupId: 5000632,
      //   roomId: 185291,
      //   solutionId: 49913,
      //   guid: 4
      // }
      if (val.groupId) {
        let searchParam = {
          groupId: val.groupId,
          guid: val.guid,
          roomId: val.roomId,
          solutionId: val.solutionId
        }
        this.houseCustomApi.queryCabinetTempByGroupId(searchParam).then(data => {
          this.getList(data)
        })
      } else {
        if (val.templateId) {
          let param = {
            templateId: val.templateId
          }
          this.houseCustomApi.getDetailByTemplateId(param).then(data => {
            this.getList(data)
          })
        }
      }
    },
    getList (data) {
      let totalPrice = 0
      if (data.price) {
        totalPrice = data.price
      }
      this.totalPrice = parseFloat(totalPrice).toFixed(2)
      data.hardSkuList && data.hardSkuList.length && data.hardSkuList.forEach((item, index) => {
        item.hardName = 'hard'
      })
      data.componentList = data.hardSkuList ? [...data.componentList, ...data.hardSkuList] : data.componentList
      let flag = false
      data.componentList && data.componentList.map((n, i) => {
        n.showRequiredType = true
        if (n.attrJson && n.attrJson.textureMaterial && n.attrJson.textureMaterial.propertyValueList && n.attrJson.textureMaterial.propertyValueList.length) {
          n.attrJson.textureMaterial.propertyValueList.forEach((item, key) => {
            if (item.selectFlag) {
              n.chooseTextureMaterialId = item.propertyValueId
            }
          })
        }
        if (n.attrJson && n.attrJson.fashion && n.attrJson.fashion.propertyValueList && n.attrJson.fashion.propertyValueList.length) {
          n.attrJson.fashion.propertyValueList.forEach((item, key) => {
            if (item.selectFlag) {
              n.chooseFashionId = item.propertyValueId
            }
          })
        }
        if (n.categoryName == '门板') {
          n.handlesNumber = n.attrJson && n.attrJson.handlesNumber && n.attrJson.handlesNumber && n.attrJson.handlesNumber.propertyValueList && n.attrJson.handlesNumber.propertyValueList.length ? n.attrJson.handlesNumber.propertyValueList[0] : {}
          flag = n.handlesNumber && n.handlesNumber.propertyValueCode == 0
        }
        n.cheacked = false
        n.textureMaterial = {}
        n.fashion = {}
        n.color = {}
        n.coreColor = {}
        n.doorFrameColor = {}
        n.materielList = []
        n.chooseColorParam = {}
        n.chooseDoorFrameColorParam = {}
        n.chooseCoreColorParam = {}
        n.chooseHardParam = {}
        n.hardInfo = {}
        n.clickNum = 0
      })
      this.modelDetail = data
      this.componentList = data.componentList
      this.componentList.forEach((item, itemkey) => {
        if (item.categoryName == '拉手') {
          item.disabled = flag
        }
      })
    },
    // 替换模型-查询类目下拉框
    searchCategoryListByClassifyId () {
      let param = {
        categoryId: this.modelDetail.categoryId
      }
      this.houseCustomApi.getCategoryListByClassifyId(param).then(data => {
        this.categoryList = data.list
      })
    },
    // 修改状态
    changeCheckBox (i, val) {
      this.componentList[i].showRequiredType = !val
      let used = this.componentList[i].showRequiredType ? 1 : 0
      let data = {
        actorId: this.templateParam.actorId,
        used,
        categoryName: this.componentList[i].categoryName
      }
      execQtFuncByChannel(global.qtChannel.houseCustom,'onNotifyQtCancelOrSelectMatDefault',data)
    }
  }
}