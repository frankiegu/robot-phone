import {
  Message
} from 'iview'

export default {
  options: {
    extend: {
      'success': {
        duration: 5
      },
      'info': {
        duration: 8
      },
      'warning': {
        duration: 10
      },
      'error': {
        duration: 30
      },
      'loading': {}
    }
  },
  install(Vue, opts = {}) {
    opts = Object.assign({}, this.options, opts)

    if (opts.extend !== false) {
      Object.keys(opts.extend).forEach(name => {
        let value = opts.extend[name]
        Vue.prototype[name] = (content, options = {}) => {
          if (typeof content !== 'object') {
            options.content = content
          } else {
            options = content
          }
          Message[name](Object.assign({}, value, options))
        }
      })
    }
  }
}
