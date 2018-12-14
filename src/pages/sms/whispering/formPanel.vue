<template>
  <ms-panel v-model="computedVisible"
            :title="entity.id ? '编辑话术' : '新增话术'">
    <mod-form :data="entity"
              v-if="computedVisible"
              @cancel="close" />
  </ms-panel>
</template>

<script>
import ModForm from './form'
import whisperingApi from '@/api/sms/whispering'

export default {
  model: {
    prop: 'visible',
    event: 'change'
  },
  components: {
    ModForm
  },
  props: {
    data: {
      type: Object,
      default() {
        return {
          // 话术ID
          id: ''
        }
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
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
        this.$emit('change', val)
      }
    }
  },
  watch: {
    'data'() {
      this.get()
    },
    'data.id'() {
      this.get()
    }
  },
  created() {
    this.get()
  },
  methods: {
    get() {
      if (this.data) {
        if (this.data.id) {
          whisperingApi.get(this.data.id).then(res => {
            this.entity = Object.assign({}, this.entity, this.data, res)
          })
        } else {
          this.entity = Object.assign({}, this.entity, this.data)
        }
      }
    },
    close() {
      this.computedVisible = false
      this.$emit('close')
    }
  }
}
</script>
