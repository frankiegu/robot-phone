import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootEms
} from '@/config'

const API_MODULE = `${apiRootEms}/${apiVersion}`
// 微信相关
// http://121.40.216.49:50555/enterprise-business/swagger-ui.html#/WxController
export default Object.assign(extendBaseApi('wx', API_MODULE), {
  getCode() {
    return axios({
      url: `${API_MODULE}/wx/code`,
      method: 'GET'
    })
  },
  /**
   * 更新处理状态
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/WxController/updateStatusUsingPUT_1
   * @param {*} data
   */
  updateStatus(data) {
    return axios({
      url: `${API_MODULE}/wx/status`,
      method: 'PUT',
      data
    })
  }
})
