// StatisticsInfoController : 统计相关

import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootOms
} from '@/config'
import {
  removeEmpty
} from '@/util'

const API_MODULE = `${apiRootOms}/${apiVersion}`

export default Object.assign(extendBaseApi('statistics_info', API_MODULE), {

  /**
   * 获取统计详情
   */
  getManagData(id) {
    return axios({
      url: `${API_MODULE}/statistics_info/manag`,
    })
  },

  /**
   * 获取通话次数统计列表
   * date_type 分类 1七天 2 三十天 3 月
   */
  getCallList(type) {
    return axios({
      url: `${API_MODULE}/statistics_info?date_type=${type}`
    })
  },

  /**
   * 获取客户等级统计列表
   * date_type 分类 1七天 2 三十天 3 月
   */
  getLevelList(type) {
    return axios({
      url: `${API_MODULE}/statistics_info/level?date_type=${type}`
    })
  },
  /**
   * 获取运营商短信数量
   * http://121.40.216.49:50777/manager-business/swagger-ui.html#!/StatisticsInfoController/getMessageCountUsingGET
   */
  getMessageCount() {
    return axios({
      url: `${API_MODULE}/statistics_info/message_count`,
      responseType: 'json'
    })
  },
  /**
   * 获取后台端口信息
   *http://121.40.216.49:50777/manager-business/swagger-ui.html#!/StatisticsInfoController/getPortDetailUsingGET
   */
  getPlatePort() {
    return axios({
      url: `${API_MODULE}/statistics_info/account_port_detail`,
    })
  }
})
