import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootEms
} from '@/config'

const API_MODULE = `${apiRootEms}/${apiVersion}`
// 话术相关
// http://121.40.216.49:50888/superManager-business/swagger-ui.html#/WhisperingController
export default Object.assign(extendBaseApi('whispering', API_MODULE), {
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
   * 提交审核
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/WhisperingController/checkStatusUsingPUT
   * @param {*} id
   */
  commit(id) {
    return axios({
      url: `${API_MODULE}/whispering/commit?id=${id}`,
      method: 'PUT'
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
  }
})
