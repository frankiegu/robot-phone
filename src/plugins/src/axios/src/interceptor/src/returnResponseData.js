// 只返回response.data，该拦截器必须放置在所有response拦截器的最后
// config.dataOnly = false 跳过该拦截器
export default {
  response: response => {
    if (response.config.dataOnly !== false) {
      return response.data
    }
    return response
  }
}
