<template>
  <Modal v-model="computedVisible"
  :mask-closable="false"
         title="修改讯飞Key">
    <Form :label-width="90"
          ref="form"
          :rules='rulesXfKey'
          :model="formXfKey"
          v-if="computedVisible">
      <FormItem label="sdk类型"
                >
        <Select v-model="formXfKey.sdkType"
                placeholder="选择类型"
               >
          <Option value="0">默认</Option>
          <!--
          <Option value="1">讯飞sdk</Option>
          -->
          <Option value="2">讯飞webApi</Option>
        </Select>
      </FormItem>
      <FormItem label="讯飞AppId:"
                v-if='formXfKey.sdkType==1 || formXfKey.sdkType==2'
                prop="iflyAsrKey">
        <Input v-model="formXfKey.iflyAsrKey"
               placeholder="请输入讯飞AppId" />
      </FormItem>
      <FormItem label="ApiKey:"
                v-if='formXfKey.sdkType==2'
                prop="appKey">
        <Input v-model="formXfKey.appkey"
               placeholder="请输入ApiKey" />
      </FormItem>
      
    </Form>
    <div slot="footer">
      <Button 
                type="text"
                size="large"
                @click.native="cancel">取消</Button>
        <Button type="primary"
                @click.native="submit">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { formMixin } from '@/mixins'
import * as firmApi from '@/api/oms/firm'
import statisticsApi from '@/api/oms/statistics'
export default {
  mixins: [formMixin],
  model: {
    prop: 'visible',
    event: 'model'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    keyData: {
      required: true
    },
  },
  watch: {
    'keyData': {
      handler(e) {
        this.formXfKey.id = e.id   
        this.formXfKey.iflyAsrKey = e.iflyAsrKey 
        this.formXfKey.appkey = e.appkey 
        this.formXfKey.sdkType = e.sdkType +'' 
        this.type=e.sdkType +'' 
           },
           deep:true
    }
  },
  data() {
    const validateXfKey = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("讯飞key不能为空"));
      } else {
        callback();
      }
    };
    const validateAppKey = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("appKey不能为空"));
      }
      else {
        callback();
      }
    };
    return {
      formXfKey: {
        iflyAsrKey: '',
        sdkType: '',
        appkey: '',
        id: ''
      },
      type:'',
      rulesXfKey: {
        iflyAsrKey: [
          { validator: validateXfKey, trigger: "blur" }
        ],
        appKey: [
          { validator: validateAppKey, trigger: "blur" }
        ]
      },
    }

  },
  computed: {
    computedVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.formXfKey.sdkType=this.type
        this.$emit('model', val)
      }
    }
  },
  methods: {
    changKey() {
      if(this.formXfKey.sdkType==0){
        firmApi.changeKey(this.formXfKey).then(() => {
            this.success('修改成功')
            this.$emit('after-submit')
          })
          return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          
          firmApi.changeKey(this.formXfKey).then(() => {
            this.success('修改成功')
            this.$emit('after-submit')
          })
        }
      })

    },
    cancel() {
      
      this.computedVisible = false
    },
    submit() {
      this.$Modal.confirm({
        title:"修改讯飞key",
        content: `确认修改讯飞key？`,
        width: 300,
        onOk: this.changKey
      });
    }
  }
}
</script>
