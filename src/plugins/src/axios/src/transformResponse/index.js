import hump from './src/hump'

export default {
  options: {
    // 数据转驼峰
    hump: {}
  },
  install(transformResponseInterceptor, opts = {}) {
    opts = Object.assign({}, this.options, opts)

    if (opts.hump) {
      transformResponseInterceptor.push(hump)
    }
  }
}
