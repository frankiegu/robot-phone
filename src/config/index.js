import {
  cipher
} from 'vma-vue-assist/dist/static/js/utils'

const env = cipher.decodeJSON(process.config)
const IS_DEV = env.NODE_ENV === 'development'
const IS_PROD = env.NODE_ENV === 'prod' || env.NODE_ENV === 'production'

export const nodeEnv = env.NODE_ENV
export const isDev = IS_DEV
export const isProd = IS_PROD
export const apiVersion = 'v1.0'
export const imgDomain = ''
export const makeMenuUrl = false
export const staticUrl = env.staticUrl

export const apiRootEms = 'enterprise-business'
export const apiRootSms = 'superManager-business'
export const apiRootOms = 'manager-business'
export const apiRootPms = 'proxy-business'
export const apiRootCommon = 'common-business'
export const apiEms = env.apiEms
export const apiSms = env.apiSms
export const apiOms = env.apiOms
export const apiPms = env.apiPms
export const apiCommon = env.apiCommon
export const callClientWSUrl = 'ws://localhost:9090/'
export const loginBg = env.loginBg
// export const callClientFSAddr = '47.98.160.69:15060'

export const apiConfig = {
  sms: {
    uploadFile: apiCommon + '/' + apiRootCommon + '/v1.0/whispering/upload',
    removeFile: apiCommon + '/' + apiRootCommon + '/v1.0/whispering/video'
  },
  common: {
    importWhispering: apiCommon + '/' + apiRootCommon + '/v1.0/whispering/import',
    importWhisperingNew: apiCommon + '/' + apiRootCommon + '/v1.0/whisperingNew/import'
  }
}

export default {
  nodeEnv,
  isDev,
  isProd,
  imgDomain,
  apiVersion,
  apiRootEms,
  apiRootSms,
  makeMenuUrl,
  apiEms,
  apiSms,
  apiOms,
  apiPms,
  staticUrl,
  callClientWSUrl
}
