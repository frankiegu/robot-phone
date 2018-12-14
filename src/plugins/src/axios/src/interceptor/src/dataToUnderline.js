import {
  dataToUnderline,
  decomposeUrl
} from '@/util'

export default {
  request: config => {
    if (config.dataToUnderline !== false) {
      let params = config.params || {}
      if (/\?/.test(config.url)) {
        let urlDecomposion = decomposeUrl(config.url)
        config.url = config.url.replace(/(\?.*)$/, '')
        config.params = dataToUnderline(Object.assign(params, urlDecomposion.params))
      } else {
        config.params = dataToUnderline(params)
      }
      if (config.method.toLowerCase() !== 'get') {
        config.data = dataToUnderline(config.data)
      }
    }
    return config
  }
}
