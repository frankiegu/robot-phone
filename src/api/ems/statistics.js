// StatisticsInfoController : 统计相关

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

export default Object.assign(extendBaseApi('statistics_info', API_MODULE), {

  /**
   * 获取统计详情
   */
  getHomeData (id) {
    return axios({
      url: `${API_MODULE}/statistics_info/homepage`,
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
   * 导出拨号数据
   */
  getExportCall (type) {
    return axios({
      url: `${API_MODULE}/statistics_info/export_call_count?date_type=${type}`
    })
  },

  getExportLevel (type) {
    return axios({
      url: `${API_MODULE}/statistics_info/export_level?date_type=${type}`
    })
  }
})
