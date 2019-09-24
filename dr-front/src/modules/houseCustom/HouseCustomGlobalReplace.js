import DrTabs from '@/components/base/dr-tabs.vue'
import global from '@/common/config/global.js'
import DrNodata  from '@/components/base/dr-nodata'
import MyCustomDetail from '@/components/houseCustom/houseCustomPops.vue'
import { execQtFuncByChannel,provideFunToQtByChannel } from '@/common/utils/baseMethods.js'
import HouseCustomCard from '@/components/houseCustom/houseCustomCard.vue'
export default {
  name:'HouseCustomGlobalReplace',
  inject:['houseCustomApi'],
  components: {DrTabs, MyCustomDetail, DrNodata, HouseCustomCard},
  props: {
    tabList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data(){
    return{
      visible: true,
      firstTab: '', // 默认选第一个
      defaultImg: 'this.src="' + require('../../assets/images/project-none.png') + '"',
      noImg: require('../../assets/images/noImg.png'),
      noDataImg: require('../../assets/images/noData.png'),
      firstIndex: 0,
      secondIndex: null,
      thirdIndex: null,
      fourthIndex: null,
      fifthIndex: null,
      templateList: [
        {
          fashionId: null,
          textureMaterialId: null,
          colorId: null,
          doorFrameColorId: null,
          coreColorId: null,
          fashionList: [],
          textureMaterialList: [],
          childTemplateList: [],
          colorList: [],
          colorSelectList: [],
          doorFrameColorList: [],
          doorFrameSelectColorList: [],
          coreColorList: [],
          coreColorSelectList: []
        }
      ],
      btnLoading:false
    }
  },
  watch:{
    '$store.state.repalceFullHouse':{
      handler:function(val){
        if(val === null){
          return
        }
        this.btnLoading = false
        if(JSON.parse(val).success == 1){
          this.$message.success('替换成功！')
        }
        if (JSON.parse(val).success == 0) {
          this.$message.error('替换失败！')
        }
      },
      deep:true
    }
  },
  mounted () {
    // 查询全局替换类目，默认显示吊柜
    this.firstTab = this.tabList[0].categoryDto.id + ''
    this.$nextTick(() => {
      this.getFullInfo(this.tabList[0].categoryDto.id)
    })
  },
  methods: {
    // 点击获取二级橱柜信息
    tabClick (index) {
      this.getFullInfo(index)
    },
    // 获取第一层数据，默认加载显示第一个
    getFullInfo (categoryId) {
      let that = this
      that.templateList = []
      that.houseCustomApi.getMaterialCategoryAndProperties({categoryId}).then((data) => {
        that.templateList = data.categoryList
        this.$nextTick(() => {
          that.templateList.forEach((item, index) => {
            item.showExpand = index == 0
            item.fashionList = item.attrJson.fashion && item.attrJson.fashion.propertyValueList ? item.attrJson.fashion.propertyValueList : []
            item.textureMaterialList = item.attrJson.textureMaterial && item.attrJson.textureMaterial.propertyValueList ? item.attrJson.textureMaterial.propertyValueList : []
            item.fashionId = item.fashionList.length ? item.fashionList[0].propertyValueId : null
            item.textureMaterialId = item.textureMaterialList.length ? item.textureMaterialList[0].propertyValueId : null
            that.$set(that.templateList, index, item)
          })
          that.getChildTemplateList(that.templateList[0].fashionId, that.templateList[0].textureMaterialId)
        })
      })
    },
    getChildTemplateList (fashion, textureMaterial) {
      let that = this
      that.houseCustomApi.getMaterielList({fashion, textureMaterial}).then((data) => {
        let childTemplateList = data || []
        let obj = Object.assign({},that.templateList[that.firstIndex])
        childTemplateList.forEach(item => {
          item.selectFlag = false
        })
        obj.childTemplateList = childTemplateList
        obj.colorList = []
        obj.colorSelectList = []
        obj.doorFrameColorList = []
        obj.doorFrameColorSelectList = []
        obj.coreColorList = []
        obj.coreColorSelectList = []
        obj.colorId = null
        obj.doorFrameColorId = null
        obj.coreColorId = null
        that.$set(that.templateList, that.firstIndex, obj)
      })
      // that.$forceUpdate()
    },
    getTemplateColorsByMaterielId (componentId) {
      let that = this
      this.houseCustomApi.getColorsByMaterielId({componentId}).then((data) => {
        let objValue = Object.assign({},that.templateList[that.firstIndex])
        objValue.childTemplateList.forEach((item, index) => {
          item.selectFlag = item.componentId == componentId
        })
        objValue.colorSelectList = data.attrJson.color && data.attrJson.color.propertyValueList ? data.attrJson.color.propertyValueList : []
        objValue.colorList = data.attrJson.color && data.attrJson.color.propertyValueList ? data.attrJson.color.propertyValueList : []
        objValue.colorId = objValue.colorList.length ? -1 : null
        objValue.doorFrameColorSelectList = data.attrJson.doorFrameColor && data.attrJson.doorFrameColor.propertyValueList ? data.attrJson.doorFrameColor.propertyValueList : []
        objValue.doorFrameColorList = data.attrJson.doorFrameColor && data.attrJson.doorFrameColor.propertyValueList ? data.attrJson.doorFrameColor.propertyValueList : []
        objValue.coreColorSelectList = data.attrJson.coreColor && data.attrJson.coreColor.propertyValueList ? data.attrJson.coreColor.propertyValueList : []
        objValue.coreColorList = data.attrJson.coreColor && data.attrJson.coreColor.propertyValueList ? data.attrJson.coreColor.propertyValueList : []
        objValue.doorFrameColorId = objValue.doorFrameColorList ? -1 : null
        objValue.coreColorId = objValue.coreColorList ? -1 : null
        that.$set(that.templateList, that.firstIndex, objValue)
      })
    },
    getStyle (index, childNode) {
      this.firstIndex = index
      this.templateList.forEach((item, key) => {
        if (key == index) {
          item.showExpand = !item.showExpand
        }
      })
      this.firstIndex = index
      if (childNode.attrJson) {
        this.templateList[index].fashionList = childNode.attrJson.fashion && childNode.attrJson.fashion.propertyValueList ? childNode.attrJson.fashion.propertyValueList : []
        this.templateList[index].textureMaterialList = childNode.attrJson.textureMaterial && childNode.attrJson.textureMaterial.propertyValueList ? childNode.attrJson.textureMaterial.propertyValueList : []
      }
      this.getChildTemplateList(this.templateList[index].fashionId, this.templateList[index].textureMaterialId)
      this.$forceUpdate()
    },
    checkStyle (firstIndex, name, val, type, typeKey) {
      this.firstIndex = firstIndex
      switch (name) {
        case 'fashion':
          if (!this.templateList[firstIndex].fashionId) {
            this.$message.error('请选择款式')
          }
          break;
        case 'textureMaterial':
          if (!this.templateList[firstIndex].textureMaterialId) {
            let obj = Object.assign({},this.templateList[firstIndex])
            obj.childTemplateList = []
            this.$set(this.templateList, firstIndex, obj)
            this.$message.error('请选择材质')
          } else {
            this.getChildTemplateList(this.templateList[firstIndex].fashionId, this.templateList[firstIndex].textureMaterialId)
          }
          break;
        case 'template':
          this.secondIndex = type
          this.getTemplateColorsByMaterielId(val.componentId)
          break;
        case 'color':
          if (type) {
            this.thirdIndex = typeKey
            this.templateList[firstIndex].colorSelectList.forEach((item, itemKey) => {
              item.selectFlag = false
            })
            this.templateList[firstIndex].colorId = val.propertyValueId
            let obj = this.templateList[firstIndex].colorSelectList[typeKey]
            obj.selectFlag = true
            this.$set(this.templateList[firstIndex].colorSelectList, typeKey, obj)
          } else {
            if (val.colorId == '-1') {
              let newObj = this.templateList[firstIndex]
              this.templateList[firstIndex].colorList.forEach((item, index) => {
                item.selectFlag = false
              })
              newObj.colorSelectList = this.copyArr(this.templateList[firstIndex].colorList)
              this.$set(this.templateList, firstIndex, newObj)
            } else {
              this.templateList[firstIndex].colorSelectList = []
              val.colorList.forEach((item, key) => {
                if (item.propertyValueId == val.colorId) {
                  item.selectFlag = false
                  this.templateList[firstIndex].colorSelectList.push(item)
                }
              })
            }
          }
          break;
        case 'doorFrameColor':
          if (type) {
            this.fourthIndex = typeKey
            this.templateList[firstIndex].doorFrameColorSelectList.forEach((item, itemKey) => {
              item.selectFlag = false
            })
            this.templateList[firstIndex].doorFrameColorId = val.propertyValueId
            let obj = this.templateList[firstIndex].doorFrameColorSelectList[typeKey]
            obj.selectFlag = true
            this.$set(this.templateList[firstIndex].doorFrameColorSelectList, typeKey, obj)
          } else {
            if (val.doorFrameColorId == '-1') {
              let newObj = this.doorFrameColorList[firstIndex]
              this.templateList[firstIndex].doorFrameColorList.forEach((item, index) => {
                item.selectFlag = false
              })
              newObj.doorFrameColorSelectList = this.copyArr(this.templateList[firstIndex].doorFrameColorList)
              this.$set(this.templateList, firstIndex, newObj)
            } else {
              this.templateList[firstIndex].doorFrameColorSelectList = []
              val.doorFrameColorList.forEach((item, key) => {
                if (item.propertyValueId == val.doorFrameColorId) {
                  item.selectFlag = false
                  this.templateList[firstIndex].doorFrameColorSelectList.push(item)
                }
              })
            }
          }
          break;
        case 'coreColor':
          if (type) {
            this.fifthIndex = typeKey
            this.templateList[firstIndex].coreColorSelectList.forEach((item, itemKey) => {
              item.selectFlag = false
            })
            this.templateList[firstIndex].coreColorId = val.propertyValueId
            let obj = this.templateList[firstIndex].coreColorSelectList[typeKey]
            obj.selectFlag = true
            this.$set(this.templateList[firstIndex].coreColorSelectList, typeKey, obj)
          } else {
            if (val.coreColorId == '-1') {
              let newObj = this.templateList[firstIndex]
              this.templateList[firstIndex].coreColorList.forEach((item, index) => {
                item.selectFlag = false
              })
              newObj.coreColorSelectList = this.copyArr(this.templateList[firstIndex].coreColorList)
              this.$set(this.templateList, firstIndex, newObj)
            } else {
              this.templateList[firstIndex].coreColorSelectList = []
              val.coreColorList.forEach((item, key) => {
                if (item.propertyValueId == val.coreColorId) {
                  item.selectFlag = false
                  this.templateList[firstIndex].coreColorSelectList.push(item)
                }
              })
            }
          }
          break;
      }
      this.$forceUpdate()
    },
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
    replaceQT () {
      let flag = true
      if ((!this.templateList[this.firstIndex].colorId || this.templateList[this.firstIndex].colorId == -1) && this.templateList[this.firstIndex].colorList.length) {
        this.$message.error('请选择颜色')
        flag = false
        return
      }
      if (!this.templateList[this.firstIndex].colorList.length) {
        if (this.templateList[this.firstIndex].doorFrameColorList.length && (!this.templateList[this.firstIndex].doorFrameColorId || this.templateList[this.firstIndex].doorFrameColorId == -1)) {
          this.$message.error('请选择门框颜色')
          flag = false
          return
        }
        if (this.templateList[this.firstIndex].coreColorList.length && (!this.templateList[this.firstIndex].coreColorId || this.templateList[this.firstIndex].coreColorId == -1)) {
          this.$message.error('请选择门芯颜色')
          flag = false
          return
        }
      }
      if (flag) {
        let param = {
          typeId: 1,
          component: {
            classType: Number(this.firstTab),
            modelId: this.templateList[this.firstIndex].childTemplateList[this.secondIndex].modelId,
            categoryId: Number(this.templateList[this.firstIndex].childTemplateList[this.secondIndex].betaCategoryId),
            categoryMxUrl: this.templateList[this.firstIndex].childTemplateList[this.secondIndex].mxUrl,
            categoryMxFileMD5: this.templateList[this.firstIndex].childTemplateList[this.secondIndex].mxFileMD5,
            chargeUnit:this.templateList[this.firstIndex].childTemplateList[this.secondIndex].chargeUnit,
            materialId: this.templateList[this.firstIndex].childTemplateList[this.secondIndex].componentId,
            length: this.templateList[this.firstIndex].childTemplateList[this.secondIndex].length,
            width: this.templateList[this.firstIndex].childTemplateList[this.secondIndex].width,
            height: this.templateList[this.firstIndex].childTemplateList[this.secondIndex].height,
            price: this.templateList[this.firstIndex].childTemplateList[this.secondIndex].price,
            categoryName: this.templateList[this.firstIndex].categoryName,
            colorattr: []
          }
        }
        if (this.templateList[this.firstIndex].colorId && this.templateList[this.firstIndex].colorId != -1) {
          param.component.colorattr.push({
            colorCode: this.templateList[this.firstIndex].colorSelectList[this.thirdIndex].propertyValueCode,
            meshName: 'color',
            colorMxUrl: this.templateList[this.firstIndex].colorSelectList[this.thirdIndex].mxUrl,
            colorMxFileMD5: this.templateList[this.firstIndex].colorSelectList[this.thirdIndex].mxFileMD5,
            colorValueId: this.templateList[this.firstIndex].colorSelectList[this.thirdIndex].propertyValueId,
          })
        }
        if (this.templateList[this.firstIndex].doorFrameColorId && this.templateList[this.firstIndex].doorFrameColorId != -1) {
          param.component.colorattr.push({
            colorCode: this.templateList[this.firstIndex].doorFrameColorSelectList[this.fourthIndex].propertyValueCode,
            meshName: 'doorFrameColor',
            colorMxUrl: this.templateList[this.firstIndex].doorFrameColorSelectList[this.fourthIndex].mxUrl,
            colorMxFileMD5: this.templateList[this.firstIndex].doorFrameColorSelectList[this.fourthIndex].mxFileMD5,
            colorValueId: this.templateList[this.firstIndex].doorFrameColorSelectList[this.fourthIndex].propertyValueId,
          })
        }
        if (this.templateList[this.firstIndex].coreColorId && this.templateList[this.firstIndex].coreColorId != -1) {
          param.component.colorattr.push(
            {
              colorCode: this.templateList[this.firstIndex].doorFrameColorSelectList[this.fifthIndex].propertyValueCode,
              meshName: 'coreColor',
              colorMxUrl: this.templateList[this.firstIndex].doorFrameColorSelectList[this.fifthIndex].mxUrl,
              colorMxFileMD5: this.templateList[this.firstIndex].doorFrameColorSelectList[this.fifthIndex].mxFileMD5,
              colorValueId: this.templateList[this.firstIndex].doorFrameColorSelectList[this.fifthIndex].propertyValueId,
            }
          )
        }
        execQtFuncByChannel(global.qtChannel.houseCustom,'onNotifyQtReplaceData', param)
        this.btnLoading = true
        let dataTag = 'replaceFullHouse'
        // 重置
        this.$store.commit('SAVE_QT_REPLACEFULLHOUSE', null)
        provideFunToQtByChannel('onNotifyH5ReplaceDataResult',dataTag)
      }
    },
    // 浮层渲染节点
    getPopupContainer(){
      return document.getElementById("testId")
    }
  }
}