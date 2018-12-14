import Cookies from 'js-cookie'
import {
  authMac,
  decomposeUrl
} from '@/util'

let authorization = ({
  url,
  method,
  macId,
  macKey
}) => {
  let urlDecomposion = decomposeUrl(url)
  return authMac({
    macId,
    macKey,
    httpMethod: method,
    requestURI: urlDecomposion.uri,
    host: urlDecomposion.host
  })
}

export const getAuthMacHeaders = ({
  url,
  method,
  macId,
  macKey
}) => {
  return {
    Authorization: authorization({
      url,
      method,
      macId,
      macKey
    }),
    mac_key: macKey
  }
}

export const AuthMac = {
  options: {
    macId: '2YotnFZFEjr1zCsicMWpAA',
    getMacKey() {
      try {
        const user = Cookies.getJSON('user')
        return user.macKey || ''
      } catch (e) {}
      return ''
    }
  },
  getAuthMacHeaders({
    url,
    method
  }) {
    return getAuthMacHeaders({
      url: url,
      method: method,
      macId: this.options.macId,
      macKey: this.options.getMacKey()
    })
  },
  install(requestInterceptor, responseInterceptor, opts = {}) {

    // 覆盖到this.options上，其他地方可直接使用
    opts = Object.assign(this.options, opts)

    requestInterceptor.use(config => {
      // mac = false 接口不做hmac认证
      if (config.mac !== false && config.headers.Authorization == null) {
        let macKey = opts.getMacKey()
        Object.assign(config.headers, getAuthMacHeaders({
          url: config.url,
          method: config.method,
          macId: opts.macId,
          macKey
        }))
      }
      return config
    })
  }
}

// hmac 认证
// https://coding.net/u/chenzuopeng/p/wm-uc/git
export default AuthMac
