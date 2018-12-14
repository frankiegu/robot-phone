import {
  removeEmpty,
  decomposeUrl
} from '@/util'

export default {
  request: config => {
    if (config.removeEmpty === true) {
      let params = config.params || {}

      // 处理params的参数
      params = removeEmpty(params)

      // 处理url上的参数
      if (config.url.indexOf('?') > -1) {
        let urlDecomposion = decomposeUrl(config.url)
        config.url = config.url.replace(/(\?.*)$/, '')
        params = Object.assign(params, removeEmpty(urlDecomposion.params))
      }

      config.params = params

      // 处理data参数
      if (config.method.toLowerCase() !== 'get') {
        config.data = removeEmpty(config.data)
      }
    }
    return config
  }
}
