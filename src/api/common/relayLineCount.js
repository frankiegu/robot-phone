// 中继线相关接口

import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootCommon
} from '@/config'
import {
  removeEmpty
} from '@/util'
const API_MODULE = `${apiRootCommon}/${apiVersion}`

export default Object.assign(extendBaseApi('relayLineCount', API_MODULE), {

  /**
   *
   *
   * @param {*} id
   * @returns 获取通话详情
   */
  getCallDetail(id) {
    return axios({
      url: `${API_MODULE}/relayLineCount/call_record/${id}`,
    })
  },

  /**
   *http://121.40.216.49:50999/common-business/swagger-ui.html#/RelayLineCountController
   *
   * @param {*} params
   * @param {*} option
   * @returns 获取设备列表
   */
  getMachineList() {
    return axios({
      url: `${API_MODULE}/relayLineCount/machine`,
      method: 'GET'
    })
  },
  /**
   *
   *
   * @returns 获取企业列表
   */
  getFirmList(params) {
    return axios({
      url: `${API_MODULE}/relayLineCount/all_firm`,
      params
    })
  },

  /**
   *
   *
   * @returns 获取运营商列表
   */
  getOperatorList() {
    return axios({
      url: `${API_MODULE}/relayLineCount/select_operator`,
    })
  },
  /**
   *
   *
   * @returns 中继线计费管理导出
   */
  getAllTime(params) {
    return axios({
      url: `${API_MODULE}/relayLineCount/export`,
      method: 'GET'
    })
  },
  /**
   *
   *
   * @param {*} ids
   * @returns 删除计费管理
   */
  deleteRelalLine(ids) {
    return axios({
      url: `${API_MODULE}/relayLineCount/delete`,
      method: 'PUT',
      data: removeEmpty(ids)
    })
  },
  /**
   *
   *
   * @returns 中继线计费管理导出
   */
  doExport(params) {
    return axios({
      url: `${API_MODULE}/relayLineCount/export`,
      params: removeEmpty(params)
    })
  },
  /**
   *
   *
   * @returns 获取中继线时间统计
   */
  getAllTime(params) {
    return axios({
      url: `${API_MODULE}/relayLineCount/count`,
      params
    })
  },

  /**
   *
   *
   * @param {*} data
   * @returns 更改计费状态
   */
  changeStatus(data) {
    return axios({
      url: `${API_MODULE}/relayLineCount/status`,
      method: 'PUT',
      data
    })
  },

  /**
   *
   *
   * @param {*} data
   * @returns 批量更改计费状态
   */
  changeAllStatus(data) {
    return axios({
      url: `${API_MODULE}/relayLineCount/batch_status`,
      method: 'PUT',
      data
    })
  },
})
