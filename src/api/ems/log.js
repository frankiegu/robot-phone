// LCustomerInfoController : 客户相关

import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootEms
} from '@/config'
import {
  removeEmpty
} from '@/util'

const API_MODULE = `${apiRootEms}/${apiVersion}`

export default Object.assign(extendBaseApi('log_system_user', API_MODULE), {

})
