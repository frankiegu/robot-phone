import {
  apiRootEms,
  apiRootSms,
  apiRootOms,
  apiRootPms,
  apiRootCommon,
  apiEms,
  apiSms,
  apiOms,
  apiPms,
  apiCommon
} from '@/config'

const URL_DISPATCH = {
  [apiRootEms]: apiEms,
  [apiRootSms]: apiSms,
  [apiRootOms]: apiOms,
  [apiRootPms]: apiPms,
  [apiRootCommon]: apiCommon
}
export default {
  request: config => {
    if (config.urlDispatch !== false) {
      // 非绝对地址
      if (!/^http/.test(config.url)) {
        let businesses = config.url.split('/')
        let business = businesses[0] || businesses[1]
        if (URL_DISPATCH[business]) {
          config.url = URL_DISPATCH[business] + '/' + config.url
        }
      }
    }
    return config
  }
}
