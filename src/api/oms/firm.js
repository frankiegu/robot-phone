// FirmController : 企业管理 
import axios from 'axios'
import {
  apiVersion,
  apiRootOms
} from '@/config'

const API_MODULE = `${apiRootOms}/${apiVersion}/firm`
const removeEmpty = true



/**
 * 基础信息->获取企业列表
 * start_time 开始时间 (日期格式YYYY-MM-DD,String类型) query	string 
 * end_time 结束时间 (日期格式YYYY-MM-DD,String类型) query	string 
 * name 企业名称 query	string status 状态 query	integer 
 * page_num (required) 当前分页数 query	integer 
 * page_size (required) 分页大小 query	integer
 */
export function getList(params) {
  return axios({
    url: `${API_MODULE}`,
    params,
    removeEmpty
  })
}


/**
 * 坐席列表->续费->获取企业坐席号码
 */
export function getSeatMobile(id) {
  return axios({
    url: `${API_MODULE}/mobile/${id}`,
  })
}


/**
 * 坐席列表->续费->获取剩余端口数
 */
export function getPortNum() {
  return axios({
    url: `${API_MODULE}/port`,
  })
}


/**
 * 坐席列表->续费->获取续费单价
 */
export function getDefaultRenewPrice(id) {
  return axios({
    url: `${API_MODULE}/price/${id}`
  })
}


/**
 * 坐席列表->续费->新增坐席续费
 * admin_id (integer, optional): 企业ID ,
 * consume_port (integer, optional): 消耗端口 ,
 * mobile (string, optional): 坐席号码 ,
 * per_price (number, optional): 续费单价 ,
 * total_price (number, optional): 续费总价 ,
 * year (integer, optional): 续费时间(单位:年)
 */
export function seatRenew(data) {
  return axios({
    url: `${API_MODULE}/renew`,
    data,
    method: 'POST'
  })
}


/**
 * 坐席列表->获取企业坐席列表
 * page_num (required) 当前分页数 query	integer
 * page_size (required) 分页大小 query	integer
 */
export function getSeatList(id, params) {
  return axios({
    url: `${API_MODULE}/seat/${id}`,
    params
  })
}


/**
 * 坐席列表->续费->获取企业列表(下拉框)
 */
export function getAllFirmList() {
  return axios({
    url: `${API_MODULE}/select`,
  })
}

/**
 * 基础信息->更新状态
 * id (integer, optional): ID ,
 * status (integer, optional): 状态，0-禁用，1-启用
 */
export function updateStatus(data) {
  return axios({
    url: `${API_MODULE}/status`,
    data,
    method: 'PUT'
  })
}


/**
 * 基础信息->获取企业详情
 */
export function getDetail(id) {
  return axios({
    url: `${API_MODULE}/${id}`,
  })
}

/**
 * 增加短信条数
 * http://121.40.216.49:50777/manager-business/swagger-ui.html#!/FirmController/addMessageCountUsingPUT
 * @param {*} data
 */
export function addMessageNum(data) {
  return axios({
    url: `${API_MODULE}/message_num`,
    data,
    method: 'PUT'
  })
}
//修改讯飞key
export function changeKey(data) {
  return axios({
    url: `${API_MODULE}/flykey`,
    data,
    method: 'PUT'
  })
}
