import flatArray from './src/flatArray'

export default {
  options: {
    // // 在transformRequest中展开array的数据
    flatArray: false
  },
  install(transformRequestInterceptor, opts = {}) {
    opts = Object.assign({}, this.options, opts)

    if (opts.flatArray) {
      transformRequestInterceptor.push(flatArray)
    }
  }
}
