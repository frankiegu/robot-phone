<template>
  <ms-lazy :initial="tabName === 'info'">
    <user-white :data="entity"
                @on-cancel="cancelForm"
                @after-submit="afterSubmitForm"
                class="pd10"
                style="padding-bottom: 100px;" />
  </ms-lazy>
</template>

<script>
import { formMixin } from '@/mixins'
import userWhiteEvBus from './src/userWhite'
import userWhite from './components/form/userWhite'

export default {
  mixins: [formMixin],
  components: {
    userWhite
  },
  data() {
    return {
      tabName: 'info'
    }
  },
  methods: {
    afterSubmitForm(data, entity) {
      this.success(this.entity.id ? '编辑白名单成功' : '添加白名单成功')
      if (!this.entity.id) {
        this.entity.id = entity.id
      }
      if (this.entity.id) {
        userWhiteEvBus.$emit('list.update', entity.id)
      } else {
        userWhiteEvBus.$emit('list.new')
      }
    },
    cancelForm() {
      this.$emit('cancel', '', true)
    }
  }
}
</script>
