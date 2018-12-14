<template>
  <div>
    <i-form :label-width="120" :data="detail" :rules="rules" :model="detail" ref="form">
      <FormItem label="手机号码" prop="phone">
        <i-input v-model.trim="detail.phone" :maxlength="11" :disabled="detail.id"></i-input>
      </FormItem>
      <FormItem label="客户名称" prop="name">
        <i-input v-model.trim="detail.name" :maxlength="20"></i-input>
      </FormItem>
        <FormItem label="备注" >
        <i-input v-model.trim="detail.remarks" :maxlength="20"></i-input>
      </FormItem>
      <FormItem>
        <i-button type="ghost" style="margin-right: 8px" @click="cancel">取消</i-button>
        <i-button type="primary" @click="confirm">确定</i-button>
      </FormItem>
    </i-form>
  </div>
</template>

<script>
  import userWhiteApi from "@/api/sms/userWhite";
 import { formMixin } from '@/mixins'
  export default {
      mixins: [formMixin],
    props:{
      eaditData:{}
    },
    data() {
      return {
        detail:{},
      };
    },
    mounted() {
      this.detail=this.eaditData

    },
    methods: {
      getApi() {
        return userWhiteApi;
      },
      confirm(){
       userWhiteApi.updateUserWhiteTemplate(this.detail).then(
         (data)=>{
           this.$emit('after-submit',data, this.detail)
         }
       )
      }
    }
  };

</script>
