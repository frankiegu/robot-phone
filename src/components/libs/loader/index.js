import {
  Spin
} from 'iview'

export default {
  show() {
    Spin.show({
      render: (h) => {
        return h('div', [
          h('Icon', {
            'class': 'demo-spin-icon-load',
            props: {
              type: 'load-c',
              size: 22
            }
          }),
          h('div', '拼命加载中...')
        ])
      }
    })
  },
  hide() {
    Spin.hide()
  }
}
