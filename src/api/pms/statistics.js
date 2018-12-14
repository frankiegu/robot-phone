// StatisticsInfoController : 统计相关

import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootPms
} from '@/config'
import {
  removeEmpty
} from '@/util'

const API_MODULE = `${apiRootPms}/${apiVersion}`

export default Object.assign(extendBaseApi('statistics_info', API_MODULE), {

  /**
   * 市代理统计详情
   */
  getCity () {
    return axios({
      url: `${API_MODULE}/statistics_info/city`,
    })
  },

  /**
   * 省代理统计详情
   */
  getProvince () {
    return axios({
      url: `${API_MODULE}/statistics_info/province`,
    })
  },

  /**
   * 获取通话次数统计列表
   * date_type 分类 1七天 2 三十天 3 月
   */
  getCallList (type) {
    return axios({
      url: `${API_MODULE}/statistics_info?date_type=${type}`
    })
  },

  /**
   * 获取客户等级统计列表
   * date_type 分类 1七天 2 三十天 3 月
   */
  getLevelList (type) {
    return axios({
      url: `${API_MODULE}/statistics_info/level?date_type=${type}`
    })
  },
   /**
   * 获取后台端口信息
   */
  getPlatePort() {
    return axios({
      url: `${API_MODULE}/card_use_log/account_port_detail`,
    })
  }
})
