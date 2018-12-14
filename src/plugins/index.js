import axiosPlugin from './src/axios'
import assetPlugin from './src/asset'
import iviewPlugin from './src/iview'
import vmaAssistPlugin from './src/vmaAssist'

export default {
  install(Vue, opts = {}) {
    Vue.use(axiosPlugin, opts.axios || {})
    Vue.use(assetPlugin, opts.asset || {})
    Vue.use(iviewPlugin, opts.iview || {})
    Vue.use(vmaAssistPlugin, opts.vmaAssist || {})
  }
}
