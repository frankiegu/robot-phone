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

export default Object.assign(extendBaseApi('employee_info', API_MODULE), {

  /**
   * 分配菜单
   */
  allotEmployee(params) {
    return axios({
      url: `${API_MODULE}/employee_info/allotMenu`,
      method: 'PUT',
      params
    })
  },

  /**
   * 获取员工菜单
   */
  getMenuList(id) {
    return axios({
      url: `${API_MODULE}/employee_info/${id}/menu`,
    })
  },

  /**
   * 销售人员的客户列表
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/EmployeeInfoController/getCustomerUsingGET
   * @param {*} params
   */
  listCustomer(params) {
    return axios({
      url: `${API_MODULE}/employee_info/customer`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  /**
   * 获取未绑定微信列表
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/EmployeeInfoController/getPageUsingGET_4
   * @param {*} params
   */
  listWx(params) {
    return axios({
      url: `${API_MODULE}/employee_info/wx_list`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  /**
   * 销售人员绑定微信账号
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/EmployeeInfoController/bindUsingPUT
   * @param {*} data
   */
  bindWx(data) {
    return axios({
      url: `${API_MODULE}/operator/status`,
      method: 'PUT',
      data
    })
  },
  /**
   * 更新状态
   * @param {*} data
   */
  updateStatus(data) {
    return axios({
      url: `${API_MODULE}/employee_info/status`,
      method: 'PUT',
      data
    })
  },
  resetPassword(data) {
    return axios({
      url: `${API_MODULE}/employee_info/reset_password`,
      method: 'PUT',
      data
    })
  }
})
