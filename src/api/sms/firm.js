// FirmController : 企业管理
import axios from 'axios'

import {
  apiVersion,
  apiRootSms
} from '@/config'

const API_MODULE = `${apiRootSms}/${apiVersion}/firm`
const removeEmpty = true

/**
 * 获取企业列表
 * params
 *  start_time 开始时间 (日期格式YYYY-MM-DD,String类型) query	string
 *  end_time 结束时间 (日期格式YYYY-MM-DD,String类型) query	string
 *  name 企业名称 query	string
 *  status 状态 query	integer
 *  page_num (required) 当前分页数 query	integer 
 *  page_size (required) 分页大小 query	integer 
 */

export function getList(params) {
  return axios({
    url: `${API_MODULE}`,
    params,
    removeEmpty
  })
}

/**
 * 获取通话列表
 * id (required) 企业ID query	integer
 * page_num (required) 当前分页数 query	integer
 * page_size (required) 分页大小 query	integer
 */

export function getCallRecordList(params) {
  return axios({
    url: `${API_MODULE}/call_record`,
    params,
    removeEmpty
  })
}

/**
 * 获取客户列表
 * id 企业ID query	integer
 * status 分配状态 0未分配 1已分配 query	integer
 * user_level 客户等级 [A,B,C,D,E,F]分别代表【A级、B级、C级、D级、E级、F级 query	string
 * call_all_time 通话时长 [1,2,3,4]分别代表【小于10秒、10秒~1分钟、1分钟~2分钟、大于2分钟】 query	integer
 * call_count 通话轮次 [1,2,3,4]分别代表【0~10轮、11~20轮、21~30轮、大于30轮 query	integer 
 * page_num 当前分页数 query	integer
 * page_size 分页大小 query	integer
 */

export function getCustomerList(params) {
  return axios({
    url: `${API_MODULE}/customer`,
    params,
    removeEmpty
  })
}

/**
 * 导出客户列表
 * id 企业ID query	integer
 * status 分配状态 0未分配 1已分配 query	integer
 * user_level 客户等级 [A,B,C,D,E,F]分别代表【A级、B级、C级、D级、E级、F级 query	string
 * call_all_time 通话时长 [1,2,3,4]分别代表【小于10秒、10秒~1分钟、1分钟~2分钟、大于2分钟】 query	integer
 * call_count 通话轮次 [1,2,3,4]分别代表【0~10轮、11~20轮、21~30轮、大于30轮 query	integer
 * page_num 当前分页数 query	integer
 * page_size 分页大小 query	integer
 */

export function exportCustomerList(params) {
  return axios({
    url: `${API_MODULE}/export`,
    params
  })
}

/**
 * 获取企业端口列表
 * id (required) 企业ID query	integer
 * page_num (required) 当前分页数 query	integer
 * page_size (required) 分页大小 query	integer
 */

export function getPortList(params) {
  return axios({
    url: `${API_MODULE}/port`,
    params,
    removeEmpty
  })
}

/**
 * 更新状态
 * id (integer, optional): ID ,
 * status (integer, optional): 状态
 */

export function updataStatus(data) {
  return axios({
    url: `${API_MODULE}/status`,
    data,
    method: 'PUT'
  })
}

/**
 * 获取任务列表
 * id (required) 企业ID query	integer
 * page_num (required) 当前分页数 query	integer
 * page_size (required) 分页大小 query	integer
 */

export function getTaskList(params) {
  return axios({
    url: `${API_MODULE}/task`,
    params,
    removeEmpty
  })
}


/**
 * 获取企业详情
 * id
 */

export function getFirmDetail(id) {
  return axios({
    url: `${API_MODULE}/${id}`,
  })
}

/**
 * 获取未关联话术列表
 * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/FirmController/notSelectFirmUsingGET
 */
export function listUnrelateWhispering(params) {
  return axios({
    url: `${API_MODULE}/select_whispering`,
    method: 'GET',
    params,
    removeEmpty: true,
    responseType: 'json'
  })
}


/**
 * 企业关联话术
 * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/FirmController/addRelateUsingPUT
 * @param {*} data
 */
export function addRelate(data) {
  return axios({
    url: `${API_MODULE}/add_relate`,
    method: 'PUT',
    data
  })
}

/**
 * 企业下的话术列表
 * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/FirmController/whisperingUsingGET
 * @param {*} params
 */
export function listWhispering(params) {
  return axios({
    url: `${API_MODULE}/whispering`,
    method: 'GET',
    params,
    removeEmpty: true,
    responseType: 'json'
  })
}

/**
 * 设置企业的话术权限
 * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/FirmController/authorizationUsingPUT
 * @param {*} data
 */
export function authorization(data) {
  return axios({
    url: `${API_MODULE}/authorization`,
    method: 'PUT',
    data
  })
}
