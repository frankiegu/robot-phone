import {
  Spin
} from 'iview'

export default {
  show() {
    Spin.show({
      render: (h) => {
        return h('div', [
          h('Icon', {
            'class': 'demo-spin-icon-load ivu-icon ivu-icon-ios-loading',
            props: {
              type: 'load-c',
              size: 22
            }
          }),
          h('div', '玩命加载中...')
        ])
      }
    })
  },
  hide() {
    Spin.hide()
  }
}
