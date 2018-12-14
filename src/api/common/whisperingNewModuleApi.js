// import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootCommon
} from '@/config'

const API_MODULE = `${apiRootCommon}/${apiVersion}`
// 新话术相关
// http://121.40.216.49:50999/common-business/swagger-ui.html#/WhisperingNewController
export default Object.assign(extendBaseApi('whisperingNew/module', API_MODULE), {
  
})
