import Loader from '@/components/libs/loader'

let requestCount = 0
let timer

// #注：
// iview.spin 在执行hide时会延迟500ms后remove加载中的元素
// 若在500ms内有两次不重叠的请求发出并返回，则此时iview.spin在第二次hide时remove会报错
let hideLoader = (time = 500) => {
  if (--requestCount <= 0) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      Loader.hide()
    }, time)
  }
}

// ajax开始时显示loading 
// config.loading = false 禁用loading
export default {
  request: config => {
    if (config.loading !== false) {
      requestCount++
      Loader.show()
    }
    return config
  },
  response: {
    success: response => {
      if (response.config.loading !== false) {
        hideLoader()
      }
      return response
    },
    error: error => {
      if (error && error.config && error.config.loading !== false) {
        hideLoader()
      }
      return Promise.reject(error)
    }
  }
}
