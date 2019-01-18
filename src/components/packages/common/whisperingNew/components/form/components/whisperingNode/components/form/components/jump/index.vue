<template>
  <div>
    <i-switch v-model="enable"
              v-if="showEnable"
              size="large"
              style="margin: 0 0 10px 20px;">
      <span slot="open">启用</span>
      <span slot="close">禁用</span>
    </i-switch>
    <Form :label-width="80"
          :model="entity"
          :rules="rules"
          v-show="shouldShowForm"
          @submit.prevent
          ref="form">
      <!-- <FormItem label="提取标签"
                prop="label"
                v-if="showLabel">
        <Input placeholder="敬请期待..."
               v-model.trim="entity.label"
               disabled
               :maxlength="20" />
      </FormItem> -->
      <FormItem label="跳转流程"
                prop="nextNode">
        <Row>
          <i-col :span="12">
            <Select style="width:187px;" v-model="entity.nextModule"
                    placeholder="请选择"
                    transfer>
              <Option :value="1">主流程</Option>
              <Option :value="2">辅助流程</Option>
              <Option :value="3">特殊流程</Option>
              <Option :value="4">指定流程节点</Option>
            </Select>
          </i-col>
          <i-col :span="12">
            <Select style="width:187px;" v-model="entity.nextNode"
                    clearable
                    transfer
                    placeholder="请选择">
              <Option v-for="v in moduleList"
                      :key="v.id"
                      :value="v.id">{{v.name}}</Option>
            </Select>
          </i-col>
          <p v-show="entity.nextModule === 4 && entity.nextNode === 0"
             class="c-warning">注：【下一个节点】为当前主流程的下一个节点，或下一个主流程的第一个节点</p>
        </Row>
      </FormItem>
      <!-- 未识别流程不需要关键字 -->
      <template v-if="keyWordRequired">
        <key-word v-model="entity.keyWord"
                  required>
          <template slot="keyStatus">
            <Checkbox v-model="entity.isValid"
                      :true-value="1"
                      :false-value="0">设为有效关键字</Checkbox>
          </template>
        </key-word>
        <FormItem label="工单项"
                >
                <i-col :span="6">
         <Select style="width:120px;" v-model="entity.workorderItem"
                    placeholder="请选择"
                    transfer>
                    <Option :value="item.item" v-for="(item,index) in wrorkList" :key="index">{{item.item}}</Option>
             
            </Select>
            </i-col>
            <i-col :span="6" offset="2" v-if="entity.workorderItem!=null">
              <Input placeholder="请输入工单记录值" v-model="entity.workorderValue" :disabled="isDisabled"/>
            </i-col>
           
             <i-col :span="6" offset="2" v-if="entity.workorderItem!=null">
              <Checkbox v-model="ischecked" @on-change="changeCheckBox">根据用户回答记录</Checkbox>
            </i-col>
            </FormItem>
      </template>
    </Form>
  </div>
</template>

<script>
import { formMixin } from '@/mixins'
import whisperingNewApi from '@/api/common/whisperingNewApi'
import entity from './src/entity'
import { KeyWord } from '@/components/packages/common/whispering'

export default {
  mixins: [formMixin],
  components: {
    KeyWord
  },
  props: {
    allModuleList: {
      type: Array,
      default() {
        return []
      }
    },
    showLabel: {
      type: Boolean,
      default: false
    },
    showKeyWord: {
      type: Boolean,
      default: true
    },
    showEnable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
       ischecked:false,
      isDisabled:false,
      wrorkList:[],
       params: {
        pageNum: 1,
        pageSize: 1000,
        totalNum: 0,
        whisperingId: this.data.whisperingId
      },
      enable: false,
      entity: entity({
        nextModule: 1,
        nextNode: '',
        isValid: 1
      }),
      rules: {
        nextNode: [
          { required: true, message: '请选择跳转流程' }
        ],
        keyWord: [
          { required: true, message: '请至少输入一个关键字' }
        ]
      }
    }
  },
  computed: {
    moduleList() {
      let nextModule = this.entity.nextModule
      if (nextModule) {
        return this.allModuleList.filter(v => v.module === nextModule)
      }
      return []
    },
    keyWordRequired() {
      return this.showKeyWord && [3].indexOf(entity.nextType) === -1
    },
    shouldShowForm() {
      return !this.showEnable || this.enable
    }
  },
  watch: {
    'entity.nextModule'() {
      if (!this.moduleList.some(v => v.id === this.entity.nextNode)) {
        this.entity.nextNode = ''
      }
    }
  },
  mounted() {
    this.$refs.form.resetFields()
    this.list();
  },
  methods: {
     getApi() {
      return whisperingNewApi
    },
     changeCheckBox(){
     if(this.ischecked==true){
       this.entity.workorderValue = '$asr.result';
       this.isDisabled = true;
     }
     else{
        this.isDisabled = false;
     }
    },
     list() {
      let params = this.params;
      whisperingNewApi.workorderList(params).then(page => {
        this.wrorkList = page.dataList;
      })
    },
    afterEntity(entity) {
      this.enable = entity && !!entity.id
    },
    getEntity() {
      return this.entity
    },
    validate(name) {
      return !this.shouldShowForm ? Promise.resolve(null) : new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (!valid) {
            reject({ key: 'FORM_INVALID', name })
          }
          // 需要添加关键字的至少需要输入一个关键字
          if (this.keyWordRequired) {
            if (!this.entity.keyWord) {
              reject('KEY_WORD_REQUIRED')
            }
          }
          resolve(Object.assign({}, this.entity))
        })
      })
    }
  }
}
</script>
