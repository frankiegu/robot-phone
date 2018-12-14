<template>
  <div>
    <i-form :label-width="120"
            :data="entity"
            :rules="rules"
            :model="entity"
            ref="form">
      <Row v-for="(v, i) in list"
           :key="i">
        <i-col :span="7">
          <FormItem label="客户名称">
            <i-input v-model.trim="v.name"
                     :maxlength="20"></i-input>
          </FormItem>
        </i-col>
        <i-col :span="7">
          <FormItem label="手机号码"
                    required>
            <i-input v-model.trim="v.phone"
                     :maxlength="11"></i-input>
          </FormItem>
        </i-col>
        <i-col :span="7">
          <FormItem label="备注">
            <i-input v-model.trim="v.remarks"></i-input>
          </FormItem>
        </i-col>
        <i-col :span="3"
               style="padding-top: 4px">
          <Button type="primary"
                  shape="circle"
                  size="small"
                  icon="plus-round"
                  class="ml-20"
                  @click="add(i)" />
          <Button type="warning"
                  shape="circle"
                  size="small"
                  icon="minus-round"
                  class="ml-10"
                  @click="remove(i)"
                  v-show="list.length > 1" />
        </i-col>
      </Row>

      <FormItem>
        <i-button type="ghost"
                  style="margin-right: 8px"
                  @click="cancel">取消</i-button>
        <i-button type="primary"
                  @click="submit">确定</i-button>
      </FormItem>
    </i-form>
  </div>
</template>

<script>
import { formMixin } from "@/mixins";
import entity from "../../src/entity";
import userWhiteApi from "@/api/sms/userWhite";
import { mobileValidator } from '@/assets/javascripts/asyncValidator/validators'
export default {
  mixins: [formMixin],
  props: {
    data: ''
  },
  data() {

    return {
      list: [],
      entity: entity({
        id: '',
        name: "",
        phone: "",
        remarks: ""
      }),
      rules: {
        phone: [
          { required: true, message: "请输入电话号码" },
          { validator: mobileValidator }
        ]
      }
    };
  },
  created() {
    this.add(0)
  },
  mounted() {

  },
  methods: {
    getApi() {
      return userWhiteApi;
    },
    add(i) {
      this.list.splice(i + 1, 0, entity())
    },
    remove(i) {
      this.list.splice(i, 1)
    },
    submit() {
      // console.log(this.data)

      let list = this.list
      if (list.length === 0) {
        return this.warning(`请至少输入一个电话号码`)
      }
      for (let i = 0, l = list.length; i < l; i++) {
        let v = list[i]
        if (v.phone === '') {
          return this.warning(`请输入第[${i + 1}]个电话号码`)
        }
        if (!/^1\d{10}$/.test(v.phone)) {
          return this.warning(`第[${i + 1}]个电话号码不是合法的电话号码`)
        }
      }
      this.getApi().saveOrUpdate({ list }).then(data => {
        this.$emit('after-submit', data, list)
      })
    },
    cancel() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      if (this.beforeCancel() !== false) {
        this.$emit("on-cancel");
      }
    }
  }
};
</script>
