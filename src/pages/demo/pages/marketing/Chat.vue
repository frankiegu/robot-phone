<template>
  <call-record-detail :data="entity"
                      :autoScroll="autoScroll" />
</template>

<script>
import CallRecordDetail from '@/components/packages/ems/callRecord/components/callRecordDetail'
import callRecordApi from '@/api/ems/callRecord'

export default {
  components: {
    CallRecordDetail
  },
  data() {
    return {
      entity: {
        recordDetailsList: []
      },
      autoScroll: false
    }
  },
  created() {
    this.autoScroll = !!this.$route.query.autoScroll

    let id = this.$route.query.id || 434
    let duration = this.$route.query.duration || 1000
    setInterval(() => {
      callRecordApi.get(id, {
        loading: false
      }).then(data => {
        this.entity = data
      })
    }, duration)
  }
}
</script>
