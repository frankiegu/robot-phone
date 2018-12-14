<template>
  <div>
    <i-form :label-width="100"
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
          <FormItem label="备注"
                    >
            <i-input v-model.trim="v.remarks"
                     :maxlength="11"></i-input>
          </FormItem>
        </i-col>
        <i-col :span="3"
               style="padding-top: 4px">
         
                  <span @click="add(i)" style="cursor: pointer;margin-left:5px;">
                    <Icon size="28" type="md-add-circle" />
                  </span>
                  <span v-show="list.length > 1" @click="remove(i)" style="cursor: pointer;">
                    <Icon size="28" type="md-remove-circle" />
                  </span>
        </i-col>
      </Row>
    </i-form>
  </div>
</template>

<script>
import { formMixin } from '@/mixins'
import entity from './src/entity'
import userWhiteApi from '@/api/ems/userWhite'

export default {
  mixins: [formMixin],
  data() {
    return {
      list: []
    }
  },
  created() {
    this.add(0)
  },
  methods: {
    add(i) {
      this.list.splice(i + 1, 0, entity())
    },
    remove(i) {
      this.list.splice(i, 1)
    },
    submit() {
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
      userWhiteApi.batchSave({
        list
      }).then(data => {
        this.$emit('after-submit', data, list)
      })
    }
  }
}
</script>