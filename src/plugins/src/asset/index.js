import {
  fmt,
  eachOwn
} from 'asset-web-support/dist/utils'

export default {
  install(Vue) {
    eachOwn(fmt, (value, key) => {
      Vue.filter(key, fmt[key])
      Vue.prototype.symbol = function () {
        return Symbol()
      }
    })
  }
}
