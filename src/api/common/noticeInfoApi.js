import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootCommon
} from '@/config'

const API_MODULE = `${apiRootCommon}/${apiVersion}`

export default Object.assign(extendBaseApi('notice_info', API_MODULE), {
  /**
   * 获取消息数量
   * http://121.40.216.49:50999/common-business/swagger-ui.html#!/NoticeInfoController/getCountUsingGET
   */
  count() {
    return axios({
      url: `/${API_MODULE}/notice_info/count`,
      method: 'GET'
    })
  }
})
