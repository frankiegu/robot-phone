<template>
  <Form :label-width="120"
        :model="entity"
        :rules="rules"
        @submit.native.prevent
        ref="form">
    <FormItem label="流程类型"
              prop="module">
      <RadioGroup v-model="entity.module">
        <Radio :label="1"
               disabled>主流程</Radio>
        <Radio :label="2"
               disabled>辅助流程</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="流程名称"
              prop="name">
      <Input placeholder="请输入流程名称"
             v-model.trim="entity.name"
             @keyup.native.enter="submit"
             style="width:280px;"
             :maxlength="20" />
    </FormItem>
  </Form>
</template>

<script>
import { formMixin } from '@/mixins'
import entity from './src/entity'
import whisperingNewModuleApi from '@/api/common/whisperingNewModuleApi'

export default {
  mixins: [formMixin],
  data() {
    return {
      entity: entity({
        module: this.data.module
      }),
      rules: {
        module: [
          { required: true, message: '请选择流程类型' }
        ],
        name: [
          { required: true, message: '请输入流程名称' }
        ]
      }
    }
  },
  methods: {
    getApi() {
      return whisperingNewModuleApi
    }
  }
}
</script>
