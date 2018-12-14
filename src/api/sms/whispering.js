import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootSms
} from '@/config'

const API_MODULE = `${apiRootSms}/${apiVersion}`
// 话术相关
// http://121.40.216.49:50888/superManager-business/swagger-ui.html#/WhisperingController
export default Object.assign(extendBaseApi('whispering', API_MODULE), {
  sendPublic(id) {
    return axios({
      url: `${API_MODULE}/whispering/send/${id}`,
    })
  },
  /**
   * 话术关联企业
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/WhisperingController/addRelateUsingPUT_1
   * @param {*} data
   */
  addRelate(data) {
    return axios({
      url: `${API_MODULE}/whispering/add_relate`,
      method: 'PUT',
      data
    })
  },
  /**
   * 删除话术企业关联
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/WhisperingController/deleteRelateUsingPUT
   * @param {*} data
   */
  removeRelate(data) {
    return axios({
      url: `${API_MODULE}/whispering/delete_relate`,
      method: 'PUT',
      data
    })
  },
  /**
   * 话术管理->企业列表
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/WhisperingController/getFirmUsingGET
   * @param {*} params
   */
  listFirm(params) {
    return axios({
      url: `${API_MODULE}/whispering/firm`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  /**
   * 状态更新
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/WhisperingController/updateStatusUsingPUT_2
   * @param {*} data
   */
  updateStatus(data) {
    return axios({
      url: `${API_MODULE}/whispering/status`,
      method: 'PUT',
      data
    })
  },
  /**
   * 获取未关联企业列表
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/WhisperingController/notSelectFirmUsingGET_1
   * @param {*} params
   */
  listUnrelateFirm(params) {
    return axios({
      url: `${API_MODULE}/whispering/select_firm`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  /**
   * 复制话术
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/WhisperingController/getWhisperingDetailUsingGET
   * @param {*} data
   */
  copy(data) {
    return axios({
      url: `${API_MODULE}/whispering/copy`,
      method: 'PUT',
      data
    })
  },
  /**
   * 获取话术操作日志
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/WhisperingController/getLogPageUsingGET
   * @param {*} params
   */
  listLog(params) {
    return axios({
      url: `${API_MODULE}/whispering/log`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  /**
   * 企业列表，不带分页
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/WhisperingController/getFirmPageUsingGET
   * @param {*} params
   */
  listAllFirm(params) {
    return axios({
      url: `${API_MODULE}/whispering/all_firm`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  /**
   * 运营商列表，不分页
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/WhisperingController/getOperatorPageUsingGET
   * @param {*} params
   */
  listSelectOperator(params) {
    return axios({
      url: `${API_MODULE}/whispering/select_operator`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  /**
   * 话术审核
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/WhisperingController/checkStatusUsingPUT
   * @param {*} data
   */
  check(data) {
    return axios({
      url: `${API_MODULE}/whispering/check`,
      method: 'PUT',
      data
    })
  },
  /**
   * 设置企业的话术权限
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/WhisperingController/authorizationUsingPUT_1
   * @param {*} data
   */
  authorization(data) {
    return axios({
      url: `${API_MODULE}/whispering/authorization`,
      method: 'PUT',
      data
    })
  }
})
