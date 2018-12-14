// GET禁用缓存 config.cache = true 跳过该拦截器
export default {
  request: config => {
    if (config.method.toLowerCase() === 'get' && config.cache !== true) {
      config.params = config.params || {}
      config.params.__ = (new Date()).getTime()
    }
    return config
  }
}
