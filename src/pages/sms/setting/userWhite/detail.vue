<template>
  <div>
    <Tabs v-model="tabName">
      <TabPane label="基础信息"
               name="info">
        <ms-lazy :initial="tabName === 'info'">
          <info-tab-panel :data="entity" />
        </ms-lazy>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'
import wordDbApi from '@/api/sms/userWhite'
import InfoTabPanel from './components/detail/infoTabPane.vue'

export default {
  mixins: [detailMixin],
  components: {
    InfoTabPanel
  },
  data() {
    return {
      tabName: 'info'
    }
  },
  props: {
    fullScreen: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getApi() {
      return wordDbApi
    },
    toggleFullScreen() {
      this.$emit('toggleFullScreen', !this.fullScreen)
    },
    showForm() {
      this.$emit('showForm', this.entity.id)
    }
  }
}
</script>