// CallRecordController : 通话记录相关接口

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

export default Object.assign(extendBaseApi('notice_info', API_MODULE), {
  /**
   * 获取消息数量
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/NoticeInfoController/getCountUsingGET
   */
  count() {
    return axios({
      url: `${API_MODULE}/notice_info/count`,
      method: 'GET'
    })
  }
})
