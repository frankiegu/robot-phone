import {
  callClientWSUrl,
  isProd
} from '@/config'
import uuid from 'uuid'

class CallClient {
  constructor({
    machineNo,
    slotNo,
    mobile,
    token,
    fsAddr
  }) {
    this.uid = uuid()
    this.machineNo = machineNo
    this.slotNo = slotNo
    this.mobile = mobile
    this.token = token
    this.fsAddr = fsAddr
    this.socket = null
    this.sendMessageList = []
    this.responseList = []
    this.socketEvtMap = {
      'open': [],
      'close': [],
      'message': {
        'outgoing': [],
        'ring': [],
        'running': [],
        'end': []
      },
      'error': []
    }
    this.init(fsAddr)
  }
  static CALL_STATE = {
    OUTGOING: 'outgoing',
    RING: 'ring',
    RUNNING: 'running',
    END: 'end'
  }
  static debug = !isProd
  init(wsUrl) {
    if (this.socket == null) {
      let callSocketEvt = (evtName, data, evtMap = this.socketEvtMap) => {
        let evts = evtMap[evtName]
        if (evts && evts.length) {
          evts.forEach(fn => {
            fn(data)
          })
        }
      }
      let onMessage = evt => {
        let data = JSON.parse(evt.data)
        if (data.action === 'callState') {
          callSocketEvt(data.state, data, this.socketEvtMap.message)
        }
      }
      this.socket = new WebSocket(wsUrl)
      this.socket.onopen = evt => {
        this.log(`CallClient[${this.uid}]: open[${JSON.stringify(evt)}]`)
        callSocketEvt('open', evt)
      }
      this.socket.onmessage = evt => {
        this.log(`CallClient[${this.uid}]: message[${JSON.stringify(evt)}]`)
        onMessage(evt)
      }
      this.socket.onclose = evt => {
        this.log(`CallClient[${this.uid}]: close[${JSON.stringify(evt)}]`)
        callSocketEvt('close', evt)
      }
      this.socket.onerror = evt => {
        this.log(`CallClient[${this.uid}]: error[${JSON.stringify(evt)}]`)
        callSocketEvt('error', evt)
      }

      // 挂断电话后自动结束当前socket连接
      this.onCallState(CallClient.CALL_STATE.END, () => {
        if (this.socket) {
          this.socket.close()
        }
      })
    }
  }
  log(msg) {
    if (!isProd) {
      console.log(msg)
    }
  }
  send(msg) {
    if (this.socket) {
      this.sendMessageList.push(msg)
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(msg)
      } else {
        this.socketEvtMap.open.push(() => {
          this.socket.send(msg)
        })
      }
    } else {
      console.warn('CallClient is uninitialized.')
    }
  }
  /**
   * 拨打电话
   */
  call() {
    this.send(JSON.stringify({
      'action': 'call',
      'fs_addr': callClientFSAddr,
      'machine_no': this.machineNo,
      'slot_no': this.slotNo,
      'mobile': this.mobile,
      'token': this.token
    }))
  }
  /**
   * 挂断电话
   */
  terminate() {
    this.send(JSON.stringify({
      'action': 'terminate'
    }))
  }
  /**
   * 拨打状态变更事件注册
   * @param {*} callState
   * @param {*} fn
   */
  onCallState(callState, fn) {
    let evts = this.socketEvtMap.message[callState]
    if (evts) {
      evts.push(fn)
    }
  }
  destroy() {
    if (this.socket) {
      this.terminate()
      this.socket.close()
    }
  }
}

export default CallClient
