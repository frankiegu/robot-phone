import {
  eachOwn,
  requireContextToObj
} from '@/util'

let interceptors = requireContextToObj(require.context('./src', false, /\.js$/))

export default {
  options: {
    // GET禁用缓存 config.cache = true 强制开启缓存
    disableCache: {},

    // 支持post/put/patch 的表单提交方式
    applicationForm: {},

    // ajax开始时显示loading 
    loading: {},

    // 只返回response.data，该拦截器必须放置在所有response拦截器的最后
    returnResponseData: {},

    // hmac 认证
    authMac: {},

    // 数据的驼峰转下划线
    dataToUnderline: {},

    // 全局错误处理
    errorHandle: {},

    // baseURL 分发
    urlDispatch: {},

    // 移除参数中的空字符串
    removeEmpty: {}
  },
  install(requestInterceptor, responseInterceptor, opts = {}) {
    opts = Object.assign({}, this.options, opts)

    eachOwn(opts, (value, name) => {
      if (value !== false && interceptors[name]) {
        let interceptor = interceptors[name]

        // 支持install模式
        // 完全自定义处理
        if (typeof interceptor.install === 'function') {
          interceptor.install(requestInterceptor, responseInterceptor, value)
        }
        // {
        //    request: Function, 
        //    response: Function(success)
        //  } 
        //  or
        // {
        //    request: Function, 
        //    response: {
        //      success: Function,
        //      error: Function
        //    }
        //  }
        else {
          if (interceptor.request) {
            requestInterceptor.use(interceptor.request)
          }
          if (interceptor.response) {
            if (typeof interceptor.response === 'function') {
              responseInterceptor.use(interceptor.response)
            } else {
              responseInterceptor.use(interceptor.response.success, interceptor.response.error)
            }
          }
        }
      }
    })
  }
}
