import axios from 'axios'
import {
  apiVersion,
  apiRootSms
} from '@/config'

const API_MODULE = `${apiRootSms}/${apiVersion}`

export default {
  /**
   * 获取呼叫时间
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/SystemConfigController/callTimeUsingGET
   */
  getCallTime() {
    return axios({
      url: `${API_MODULE}/system_config/call_time`,
      method: 'GET',
      responseType: 'json'
    })
  },
  /**
   * 更新呼叫时间
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/SystemConfigController/updateCallTimeUsingPUT
   * @param {*} data
   */
  updateCallTime(data) {
    return axios({
      url: `${API_MODULE}/system_config/call_time`,
      method: 'PUT',
      data
    })
  }
}
