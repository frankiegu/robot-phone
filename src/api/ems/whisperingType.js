// import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootEms
} from '@/config'

const API_MODULE = `${apiRootEms}/${apiVersion}`
// 话术分类相关
// http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/WhisperingController/getTypePageUsingGET
export default Object.assign(extendBaseApi('whispering/type', API_MODULE), {})
