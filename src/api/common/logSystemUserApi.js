import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootCommon
} from '@/config'

const API_MODULE = `${apiRootCommon}/${apiVersion}`

export default Object.assign(extendBaseApi('log_system_user', API_MODULE), {})
