<template>
  <Tabs v-model="tabName">
    <TabPane label="基础信息"
             name="info">
      <ms-lazy :initial="tabName === 'info'">
        <word-db :data="entity"
                    @on-cancel="cancelForm"
                    @after-submit="afterSubmitForm"
                    class="pd10"
                    style="padding-bottom: 100px;" />
      </ms-lazy>
    </TabPane>
  </Tabs>
</template>

<script>
import { formMixin } from '@/mixins'
import wordDbEventBus from './src/wordDbEventBus'
import WordDb from './components/form/wordDb'

export default {
  mixins: [formMixin],
  components: {
    WordDb
  },
  data() {
    return {
      tabName: 'info'
    }
  },
  methods: {
    afterSubmitForm(data, entity) {
      this.success(this.entity.id ? '编辑词库成功' : '新增词库成功')
      if (!this.entity.id) {
        this.entity.id = entity.id
      }
      if (this.entity.id) {
        wordDbEventBus.$emit('list.update', entity.id)
      } else {
        wordDbEventBus.$emit('list.new')
      }
    },
    cancelForm() {
      this.$emit('cancel', '', true)
    }
  }
}
</script>
