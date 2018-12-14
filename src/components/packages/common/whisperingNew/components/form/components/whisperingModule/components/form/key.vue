<template>
  <Form :label-width="80"
        style="overflow: hidden;"
        :model="entity"
        :rules="rules"
        @submit.native.prevent
        ref="form">
    <key-word v-model="entity.keyWord" />
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
import { KeyWord } from '@/components/packages/common/whispering'
import whisperingNewModuleApi from '@/api/common/whisperingNewModuleApi'

export default {
  mixins: [formMixin],
  components: {
    KeyWord
  },
  entity() {
    return {
      entity: {
        keyWord: ''
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
