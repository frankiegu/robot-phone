<template>
  <div>
    <Modal v-model="computedVisible"
           :title="title"
           :closable="false"
           :mask-closable="false"
           width="400px">
      <call v-if="computedVisible"
            v-bind="data"
            @outgoing="setCallState(0)"
            @ring="setCallState(1)"
            @running="setCallState(2)"
            @end="setCallState(3)"
            @close="close()"
            @uninstall="uninstall" />
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="install.show"
           title="安装插件"
           :mask-closable="false">
      <p>请确认您当前已经打开[话务机器人人工坐席]插件</p>
      <p>若未安装，请点击
        <a :href="install.downloadUrl">下载插件</a> 安装后刷新页面重试</p>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import Call from './index'
import { EMS } from '@/constants'

export default {
  model: {
    prop: 'visible',
    event: 'change'
  },
  components: {
    Call
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      callState: 0,
      install: {
        show: false,
        downloadUrl: EMS.CALLER_INSTALL_URL
      }
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
    },
    title() {
      return ['呼叫客户', '待接通', '通话中', '已挂断'][this.callState]
    }
  },
  methods: {
    setCallState(state) {
      this.callState = state
    },
    close() {
      this.computedVisible = false
    },
    uninstall() {
      this.computedVisible = false
      this.install.show = true
    }
  }
}
</script>
