<template>
  <div style="padding:0 40px;">
    <i-form :label-width="80" :data="entity" :rules="rules" :model="entity" ref="form">
      <FormItem label="手机号码" prop="phone">
        <i-input v-model.trim="entity.phone" :maxlength="11" :disabled="!!entity.id"></i-input>
      </FormItem>
      <FormItem label="客户名称" prop="name">
        <i-input v-model.trim="entity.name" :maxlength="20"></i-input>
      </FormItem>
        <FormItem label="备注" >
        <i-input v-model.trim="entity.remarks" :maxlength="20"></i-input>
      </FormItem>
    </i-form>
  </div>
</template>

<script>
  import {
    formMixin
  } from "@/mixins";
  import entity from "./src/entity";
  import userWhiteApi from "@/api/ems/userWhite";
  import {
    mobileValidator
  } from "@/assets/javascripts/asyncValidator/validators";

  export default {
    mixins: [formMixin],
    data() {
      return {
        entity: entity(),
        rules: {
          phone: [{
              required: true,
              message: "请输入手机号码"
            },
            {
              validator: mobileValidator,
              message: "请输入合法的手机号"
            }
          ]
        }
      };
    },
    methods: {
      getApi() {
        return userWhiteApi;
      }
    }
  };

</script>
