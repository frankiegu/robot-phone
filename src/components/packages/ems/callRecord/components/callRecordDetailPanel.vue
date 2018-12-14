<template>
  <ms-panel v-model="computedVisible"
            title="通话详情">
    <ms-lazy :initial="computedVisible">
      <call-record-detail :data="entity" />
    </ms-lazy>
  </ms-panel>
</template>

<script>
import CallRecordDetail from './callRecordDetail'
import callRecordApi from '@/api/ems/callRecord'

export default {
  model: {
    prop: 'visible',
    event: 'model'
  },
  components: {
    CallRecordDetail
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: ''
  },
  data() {
    return {
      entity: {}
    }
  },
  computed: {
    computedVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('model', val)
      }
    }
  },
  watch: {
    id() {
      this.get()
    }
  },
  created() {
    this.get()
  },
  methods: {
    get() {
      if (this.id) {
        callRecordApi.get(this.id).then(data => {
          this.entity = data
        })
      }
    }
  }
}
</script>
