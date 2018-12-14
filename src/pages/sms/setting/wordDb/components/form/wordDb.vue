<template>
  <Form :label-width="120"
        :model="entity"
        :rules="rules"
        ref="form">
    <FormItem label="单词"
              prop="wordName">
      <Input placeholder="请输入单词"
             v-model.trim="entity.wordName"
             :maxlength="20" />
    </FormItem>
    <FormItem>
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
import entity from '../../src/entity'
import wordDbApi from '@/api/sms/wordDb'

export default {
  mixins: [formMixin],
  data() {
    return {
      entity: entity({
        id: '',
        wordName: ''
      }),
      rules: {
        wordName: [
          { required: true, message: '请输入单词' }
        ]
      }
    }
  },
  methods: {
    getApi() {
      return wordDbApi
    },
    submit() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          let entity = Object.assign({}, this.entity)
          if (this.beforeSubmit(entity) !== false) {
            this.getApi().saveOrUpdate(entity).then(data => {
              this.$emit('after-submit', data, entity)
            })
          }
        }
      })
    },
    cancel() {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      if (this.beforeCancel() !== false) {
        this.$emit('on-cancel')
      }
    }
  }
}
</script>
