// CallRecordController : 呼叫管理
import axios from 'axios'
import {
  apiVersion,
  apiRootSms
} from '@/config'

const API_MODULE = `${apiRootSms}/${apiVersion}/sendmessage`

/**
 * 获取呼叫列表
 */ 
export function sendMessage(mobile) {
    return axios({
        url: `${API_MODULE}/${mobile}`,
        method:'POST'
    })
}