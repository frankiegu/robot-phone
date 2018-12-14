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

export default Object.assign(extendBaseApi('customer_info', API_MODULE), {

  /**
   * 编辑客户
   * @param  {[type]} params
   *  req
   */
  updateClient(data) {
    return axios({
      url: `${API_MODULE}/customer_info`,
      method: 'PUT',
      data
    })
  },

  /**
   * 获取人工坐席列表
   * @param  {[type]} params
   *  status
   *  name_mobile
   */
  getClientArtList(params) {
    return axios({
      url: `${API_MODULE}/customer_info/ArtList`,
      params: removeEmpty(params)
    })
  },

  /**
   * 分配员工
   * @param  {[type]} params
   *  employee_id
   *  call_id
   *  is_hide
   */
  allotEmployee(data) {
    return axios({
      url: `${API_MODULE}/customer_info/allot`,
      method: 'POST',
      data
    })
  },

  /**
   * 获取客户列表 通过员工id
   * @param  {[type]} params
   *  req
   */
  getClientListByEmployeeId(params) {
    return axios({
      url: `${API_MODULE}/customer_info/search`,
      params
    })
  },

  /**
   * 删除通话记录
   * @param  {[type]} params
   *  id
   */
  deleteClientById(id) {
    return axios({
      url: `${API_MODULE}/customer_info/${id}`,
      method: 'DELETE'
    })
  },

  /**
   * 获取客户详情
   */
  getClientDetail(id) {
    return axios({
      url: `${API_MODULE}/customer_info/${id}`
    })
  },

  /**
   * 获取任务列表
   */
  getTaskList(mobile) {
    return axios({
      url: `${API_MODULE}/customer_info/task?mobile=${mobile}`
    })
  },

  /**
   * 获取我的客户任务列表
   */
  getEmployeeTaskList(id) {
    return axios({
      url: `${API_MODULE}/customer_info/employee/task?id=${id}`
    })
  },

  /**
   * 获取客户通话
   */
  getRecordList(params) {
    return axios({
      url: `${API_MODULE}/customer_info/record`,
      params
    })
  },

  /**
   * 获取企业下任务列表
   */
  getFirmTaskList() {
    return axios({
      url: `${API_MODULE}/customer_info/firm_task`
    })
  },

  /**
   * 获取人工坐席必要参数
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/CustomerInfoController/getDetailUsingGET_3
   * @param {*} params
   */
  getCall(params) {
    return axios({
      url: `${API_MODULE}/customer_info/call`,
      method: 'GET',
      params,
      responseType: 'json'
    })
  },
  /**
   * 呼叫记录
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/CustomerInfoController/getPageUsingGET_2
   * @param {*} params
   */
  listCallRecord(params) {
    return axios({
      url: `${API_MODULE}/customer_info/call_record`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  listTaskForCallRecord(params) {
    return axios({
      url: `${API_MODULE}/customer_info/call_record/task`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  updateUserLevel(data) {
    return axios({
      url: `${API_MODULE}/customer_info/update_level`,
      method: 'PUT',
      data
    })
  }
})
