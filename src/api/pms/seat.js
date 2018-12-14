// SeatController : 坐席管理 
import axios from 'axios'

import {
  apiVersion,
  apiRootPms
} from '@/config'

const API_MODULE = `${apiRootPms}/${apiVersion}/seat`
const removeEmpty = true


/**
 * 新增坐席
 * admin_id (integer, optional): 企业id ,
 * express_company (string, optional): 快递公司 ,
 * express_no (string, optional): 快递单号 ,
 * human_seats (Array[string], optional): 人工坐席用 ,
 * per_price (number, optional): 坐席单价 ,
 * robot_seats (Array[string], optional): 机器坐席用

 */
export function addSeat(data) {
  return axios({
    url: `${API_MODULE}/card_apply`,
    data,
    method: 'POST'
  })
}

/**
 * 坐席列表--》获取坐席列表
 * start_time 开始时间 query	string
 * end_time 结束时间 query	string
 * mobile 坐席号码 query	string
 * admin_id 企业ID query	integer
 * status 状态 query	integer
 * card_type 坐席类型 query	integer 
 * page_num (required) 当前分页数 query	integer
 * page_size (required) 分页大小 query	integer
 */ 
export function getSeatList(params) {
  return axios({
    url: `${API_MODULE}`,
    params,
    removeEmpty
  })
}


/**
 * 获取企业列表
 */ 
export function getFirmList() {
  return axios({
    url: `${API_MODULE}/firm`,
  })
}


/**
 * 代理信息
 */ 
export function getProxyDetail() {
  return axios({
    url: `${API_MODULE}/proxy`,
  })
}


/**
 * 获取坐席详情
 * id
 */ 
export function getSeatDetail(id) {
  return axios({
    url: `${API_MODULE}/${id}`
  })
}


/**
 * 开通坐席申请--》快递名称下拉
 */
export function getLogisticsList() {
  return axios({
    url: `${API_MODULE}/logistics`,
  })
}

/**
 * 获取坐席申请列表
 * name 企业名称 query	string
 * status 状态 query	integer
 * page_num 当前分页数 query	integer
 * page_size 分页大小 query	integer
 */ 
export function getApplyList(params) {
  return axios({
    url: `${API_MODULE}/apply`,
    params,
    removeEmpty
  })
}


/**
 * 获取坐席申请详情
 * id
 */ 
export function getApplyDetail(id) {
  return axios({
    url: `${API_MODULE}/apply/${id}`,
  })
}


/**
 * 坐席列表--》续费记录
 * @param {*} id 
 */
export function getRenewRecord(id) {
  return axios({
    url: `${API_MODULE}/card_renew_log/${id}`
  })
}

