<template>
  <Form :label-width="120"
        :model="entity"
        :rules="rules"
        ref="form">
    <FormItem label="话术名称"
              prop="name">
      <Input placeholder="请输入话术名称"
             v-model="entity.name"
             :maxlength="20" />
    </FormItem>

    <FormItem>
      <Button 
              style="margin-right: 8px"
              @click="cancel">取消</Button>
      <Button type="primary"
              @click="submit">确定</Button>
    </FormItem>
  </Form>
</template>

<script>
import { formMixin } from '@/mixins'
import whisperingApi from '@/api/ems/whispering'

let firmMap = {}
export default {
  mixins: [formMixin],
  data() {
    return {
      platformId: '',
      entity: {
        name: '',
        whisperingId: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入话术名称' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          let entity = Object.assign({}, this.entity)
          if (this.beforeSubmit(entity) !== false) {
            whisperingApi.copy(entity).then(data => {
              this.$emit('after-submit', data, entity)
            })
          }
        }
      })
    }
  }
}
</script>
