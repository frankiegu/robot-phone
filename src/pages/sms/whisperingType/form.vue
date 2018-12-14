<template>
  <Form :label-width="120"
        :model="entity"
        :rules="rules"
        ref="form">
    <FormItem label="话术分类名称"
              prop="name">
      <Input placeholder="请输入名称"
             v-model="entity.name"
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
import whisperingTypeApi from '@/api/sms/whisperingType'
import entity from './src/entity'

export default {
  mixins: [formMixin],
  data() {
    return {
      entity: entity({}),
      rules: {
        name: [
          { required: true, message: '请输入话术分类名称' }
        ]
      }
    }
  },
  methods: {
    getApi() {
      return whisperingTypeApi
    }
  }
}
</script>
