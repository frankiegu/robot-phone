// CallRecordController : 通话记录相关接口

import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootSms,
  apiSms
} from '@/config'
import {
  removeEmpty,
  compatUrl
} from '@/util'

const API_MODULE = `${apiRootSms}/${apiVersion}`

export default Object.assign(extendBaseApi('call_record', API_MODULE), {
  /**
   * 获取运营商
   * 
   * @export
   * @returns 
   */
  getOperatorList() {
    return axios({
      url: `${API_MODULE}/call_record/all_operator`,
    })
  },
  /**
   *
   *
   * @returns 获取企业列表
   */
  getFirmList(params) {
    return axios({
      url: `${API_MODULE}/call_record/all_firm`,
      params
    })
  },
    /**
   *
   *
   * @returns 获取企业列表
   */
  getTaskList(params) {
    return axios({
      url: `${API_MODULE}/call_record/task`,
      params
    })
  },
  /**
   * 导出通话记录
   * 
   * @param {*} params
   */
  exportFile(params) {
    return axios({
      url: `${API_MODULE}/call_record/export`,
      method: 'GET',
      params: removeEmpty(params),
      // responseType: 'blob',
      // timeout: 120000
    })
  },
})


/**
 * 获取通话记录详情接口
 * @param  {[type]} id 记录 ID
 */
export function getRecordDetail(id) {
  return axios({
    url: `${API_MODULE}/call_record/detail/${id}`,
  })
}




