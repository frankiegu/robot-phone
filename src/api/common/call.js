import axios from 'axios'
import {
  apiVersion,
  apiRootCommon
} from '@/config'

const API_MODULE = `${apiRootCommon}/${apiVersion}`

export default {
  /**
   * 呼叫记录数量
   * http://121.40.216.49:50999/common-business/swagger-ui.html#!/CallRecordController/getPageUsingGET
   */
  getCallCount() {
    return axios({
      url: `${API_MODULE}/callrecord/count`,
      method: 'GET',
      responseType: 'json'
    })
  }
}
