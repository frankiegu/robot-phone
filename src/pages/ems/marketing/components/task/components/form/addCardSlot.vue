<template>
  <Form :label-width="1"
        :model="entity"
        :rules="rules"
        ref="form">
    <div style="max-height: 341px; overflow: auto;">
      <Row v-for="(v, i) in list"
           :key="i">
        <i-col :span="2">
          <label class="ivu-form-item-label">{{i+1}}</label>
        </i-col>
        <i-col :span="8">
          <FormItem prop="mobile"
                    required>
            <i-input v-model.trim="v.mobile"
                     :maxlength="20"
                     placeholder="请输入电话号码(必填)" />
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem prop="userName">
            <i-input v-model.trim="v.userName"
                     :maxlength="20"
                     placeholder="请输入姓名" />
          </FormItem>
        </i-col>
        <i-col :span="6">
          <i-button type="primary"
                    class="ml5"
                    @click="add(i)">添加</i-button>
          <i-button type="warning"
                    class="ml5"
                    v-if="list.length > 1"
                    @click="remove(i)">移除</i-button>
        </i-col>
      </Row>
    </div>
    <FormItem class="text-c mt10">
      <Button type="ghost"
              style="margin-right: 8px"
              @click="cancel">取消</Button>
      <Button type="primary"
              @click="submit">确定</Button>
    </FormItem>
  </Form>
</template>

<script>
import { formMixin } from '@/mixins'
import { isTelOrMobile, desenPhone } from '@/util'

export default {
  mixins: [formMixin],
  data() {
    return {
      list: [{
        mobile: '',
        userName: ''
      }]
    }
  },
  methods: {
    add(i) {
      this.list.splice(i + 1, 0, {
        mobile: '',
        userName: ''
      })
    },
    remove(i) {
      this.list.splice(i, 1)
    },
    submit() {
      for (let i = 0, l = this.list.length; i < l; i++) {
        let v = this.list[i]
        if (!isTelOrMobile(v.mobile)) {
          this.warning(`第${i + 1}个电话号码无效，请检查`)
          return false
        }
      }
      this.$emit('after-submit', this.list.map(v => {
        v.userName = v.userName || `客户${desenPhone(v.mobile)}`
        return v
      }))
    }
  }
}
</script>
