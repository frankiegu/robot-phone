import axios from 'axios'
import transformRequestFactory from './src/transformRequest'
import transformResponseFactory from './src/transformResponse'
import interceptorFactory from './src/interceptor'

// axios config https://github.com/mzabriskie/axios
export default {
  options: {
    // axios.defaults
    // false 不安装
    defaults: {
      timeout: 60000
    },

    // config.transformRequest
    // false 不安装
    transformRequest: {},

    // config.transformResponse
    // false不安装
    transformResponse: {},

    // axios.interceptors
    // false 不安装
    interceptor: {}
  },
  install(Vue, opts = {}) {
    if (!axios) {
      console.warn('Please run npm install --save axios.')
      return
    }
    let {
      defaults,
      transformRequest,
      transformResponse,
      interceptor
    } = Object.assign({}, this.options, opts)

    if (defaults !== false) {
      Object.assign(axios.defaults, defaults)
    }

    if (transformRequest !== false) {
      transformRequestFactory.install(axios.defaults.transformRequest, transformRequest)
    }

    if (transformResponse !== false) {
      transformResponseFactory.install(axios.defaults.transformResponse, transformResponse)
    }

    if (interceptor !== false) {
      interceptorFactory.install(axios.interceptors.request, axios.interceptors.response, interceptor)
    }
  }
}
