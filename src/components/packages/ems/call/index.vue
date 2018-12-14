<template>
  <div class="call">
    <h3>{{timeTitle}}</h3>
    <div class="call-main">
      <div class="call-item">
        <p>{{customerMobile}}</p>
        <p>{{customerName}}</p>
      </div>
    </div>
    <div class="call-btns">
      <Button type="error"
              long
              shape="circle"
              @click="terminate">{{btnTitle}}</Button>
    </div>
  </div>
</template>

<script>
import { CallClient } from '@/util'
import { duration } from '@/util'

export default {
  props: {
    customerName: {
      type: String,
      default: '客户'
    },
    customerMobile: {
      type: String,
      required: true
    },
    machineNo: {
      type: String,
      required: true
    },
    slotNo: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    fsAddr: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      timer: null,
      time: 1,
      callClientInstance: null,
      callState: 'outgoing'
    }
  },
  computed: {
    btnTitle() {
      return {
        [CallClient.CALL_STATE.OUTGOING]: '关闭',
        [CallClient.CALL_STATE.RING]: '挂断',
        [CallClient.CALL_STATE.RUNNING]: '挂断',
        [CallClient.CALL_STATE.END]: '关闭'
      }[this.callState]
    },
    timeTitle() {
      if (this.callState === CallClient.CALL_STATE.OUTGOING) {
        return '呼叫中...'
      } else {
        return duration(this.time)
      }
    }
  },
  created() {
    let callClient = this.callClientInstance = new CallClient({
      machineNo: this.machineNo,
      slotNo: this.slotNo,
      mobile: this.customerMobile,
      token: this.token
    })
    let startTimer = () => {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.time = 1
      this.timer = setInterval(() => {
        this.time += 1
      }, 1000)
    }
    callClient.onCallState(CallClient.CALL_STATE.OUTGOING, data => {
      this.callState = CallClient.CALL_STATE.OUTGOING
      this.$emit('outgoing')
    })
    callClient.onCallState(CallClient.CALL_STATE.RING, data => {
      this.callState = CallClient.CALL_STATE.RING
      startTimer()
      this.$emit('ring')
    })
    callClient.onCallState(CallClient.CALL_STATE.RUNNING, data => {
      this.callState = CallClient.CALL_STATE.RUNNING
      startTimer()
      this.$emit('running')
    })
    callClient.onCallState(CallClient.CALL_STATE.END, data => {
      this.callState = CallClient.CALL_STATE.END
      clearInterval(this.timer)
      this.$emit('end')
    })
    callClient.socketEvtMap.error.push(() => {
      // 提示安装插件
      this.$emit('uninstall')
    })
    callClient.call()
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    if (this.callClientInstance) {
      this.callClientInstance.destroy()
    }
  },
  methods: {
    terminate() {
      if (this.callClientInstance) {
        this.callClientInstance.terminate()
      }
      if ([CallClient.CALL_STATE.RING, CallClient.CALL_STATE.RUNNING].indexOf(this.callState) > -1) {
        setTimeout(() => {
          this.$emit('close')
        }, 2000)
      } else {
        this.$emit('close')
      }
    }
  }
}
</script>
