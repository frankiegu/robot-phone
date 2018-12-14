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

export default Object.assign(extendBaseApi('study', API_MODULE), {
  /**
   * 修改记录列表
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/StudyController/modifyDetailUsingGET
   * @param {*} params
   */
  listModify(params) {
    return axios({
      url: `${API_MODULE}/study/modify`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  /**
   * 修改话术节点
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/StudyController/updateNodeUsingPUT
   * @param {*} data
   */
  updateNode(data) {
    return axios({
      url: `${API_MODULE}/study/node`,
      method: 'PUT',
      data
    })
  },
  /**
   * 获取节点详情
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/StudyController/getDetailUsingGET_9
   * @param {*} nodeId
   */
  getNode(nodeId) {
    return axios({
      url: `${API_MODULE}/study/node/${nodeId}`,
      method: 'GET',
      responseType: 'json'
    })
  },
  /**
   * 更新状态
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/StudyController/getPageUsingPUT
   * @param {*} data
   */
  updateStatus(data) {
    return axios({
      url: `${API_MODULE}/study/status`,
      method: 'PUT',
      data
    })
  }
})
