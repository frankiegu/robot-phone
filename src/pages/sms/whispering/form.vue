<template>
  <Tabs v-model="tabName">
    <TabPane label="基础信息"
             name="info">
      <ms-lazy :initial="tabName === 'info'">
        <whispering :data="entity"
                    @on-cancel="cancelWhispering"
                    @after-submit="afterSubmitWhispering"
                    class="pd10"
                    style="padding-bottom: 100px;" />
      </ms-lazy>
    </TabPane>
    <TabPane label="话术流程"
             name="node"
             :disabled="!entity.id">
      <ms-lazy :initial="tabName === 'node'">
        <whispering-flow :data="entity"
                         class="pd10" />
      </ms-lazy>
    </TabPane>
  </Tabs>
</template>

<script>
import { formMixin } from '@/mixins'
import Whispering from './components/form/whispering'
import WhisperingFlow from './components/form/whisperingFlow'

export default {
  mixins: [formMixin],
  components: {
    Whispering,
    WhisperingFlow
  },
  data() {
    return {
      tabName: 'info'
    }
  },
  methods: {
    afterSubmitWhispering(id) {
      this.success(this.entity.id ? '编辑话术成功' : '新增话术成功')
      if (!this.entity.id) {
        this.entity.id = id
      }
      this.tabName = 'node'
    },
    cancelWhispering() {
      this.$emit('cancel')
    }
  }
}
</script>
