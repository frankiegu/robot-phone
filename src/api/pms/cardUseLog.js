import axios from 'axios'
import {
  removeEmpty
} from '@/util'
import {
  apiVersion,
  apiRootPms
} from '@/config'

const API_MODULE = `${apiRootPms}/${apiVersion}`

export default {
  /**
   * 获取用户端口总数详情接口
   * http://47.98.111.177:50666/proxy-business/swagger-ui.html#!/CardUseLogController/getPortSaleLogUsingGET
   */
  getAccountPortDetail() {
    return axios({
      url: `/${API_MODULE}/card_use_log/account_port_detail`,
      method: 'GET',
      responseType: 'json'
    })
  },
  /**
   * 获取端口管理记录接口
   * http://47.98.111.177:50666/proxy-business/swagger-ui.html#!/CardUseLogController/getPortSaleLogUsingGET_1
   * @param {*} params
   */
  listPortSaleLog(params) {
    return axios({
      url: `/${API_MODULE}/card_use_log/port_sale_log`,
      method: 'GET',
      params: removeEmpty(params),
      responseType: 'json'
    })
  },
  /**
   * 获取财务统计列表接口
   * http://47.98.111.177:50666/proxy-business/swagger-ui.html#!/CardUseLogController/queryPortStatisticalUsingGET
   * @param {*} params
   */
  listStatis(params) {
    return axios({
      url: `/${API_MODULE}/card_use_log/profit_statistical`,
      method: 'GET',
      params: removeEmpty(params),
      responseType: 'json'
    })
  },
  /**
   * 获取财务总统计接口
   * http://47.98.111.177:50666/proxy-business/swagger-ui.html#!/CardUseLogController/getPortStatisticalTotalUsingGET
   */
  getTotalStatis() {
    return axios({
      url: `/${API_MODULE}/card_use_log/profit_statistical_total`,
      method: 'GET',
      responseType: 'json'
    })
  }
}
