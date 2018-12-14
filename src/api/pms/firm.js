// FirmController : 企业管理
import axios from 'axios'

import {
  apiVersion,
  apiRootPms
} from '@/config'

const API_MODULE = `${apiRootPms}/${apiVersion}/firm`
const removeEmpty = true

/**
 * 获取企业列表
 * start_time 开始时间 (日期格式YYYY-MM-DD,String类型) query	string
 * end_time 结束时间 (日期格式YYYY-MM-DD,String类型) query	string
 * name 企业名称 query	string
 * status 状态 query	integer
 * page_num 1 当前分页数 query	integer
 * page_size 10 分页大小 query	integer
 */ 


export function getList(params) {
  return axios({
    url: `${API_MODULE}`,
    params,
    removeEmpty
  })
}


/**
 * 新增企业
 * account (string, optional): 企业账号 ,
 * contacts_address (string, optional): 联系地址 ,
 * contacts_mobile (string, optional): 联系电话 ,
 * contacts_name (string, optional): 联系人 ,
 * mobile (string, optional): 绑定手机号 ,
 * name (string, optional): 企业名称 ,
 * password (string, optional): 账号密码 ,
 * remarks (string, optional): 备注 ,
 * verif_code (string, optional): 验证码
 */ 

export function addFirm(data) {
  return axios({
    url: `${API_MODULE}`,
    data,
    method: 'POST'
  })
}

/**
 * 基础信息--》编辑企业
 */

export function updateFirm(data) {
  return axios({
    url: `${API_MODULE}/update`,
    data,
    method: 'PUT'
  })
}

/**
 * 删除企业
 */

export function deleteFirm(id) {
  return axios({
    url: `${API_MODULE}/delete/${id}`,
    method: 'DELETE'
  })
}

/**
 * 基础信息--》修改企业状态
 */

export function updateStatus(data) {
  return axios({
    url: `${API_MODULE}`,
    data,
    method: 'PUT'
  })
}

/**
 * 获取坐席续费--》续费单价
 */
export function getDefaultRenewPrice() {
  return axios({
    url: `${API_MODULE}/price`,
  })
}


/**
 * 新增坐席续费
 * admin_id (integer, optional): 企业ID ,
 * consume_port (integer, optional): 消耗端口 ,
 * mobile (string, optional): 坐席号码 ,
 * per_price (number, optional): 续费单价 ,
 * total_price (number, optional): 续费总价 ,
 * year (integer, optional): 续费时间(单位:年)
 */ 

export function addFirmRenew(data) {
  return axios({
    url: `${API_MODULE}/renew`,
    data,
    method: 'POST'
  })
}


/**
 * 获取坐席续费--》企业名称(下拉框)
 */

export function getAllFirmList() {
  return axios({
    url: `${API_MODULE}/select`,
  })
}

/**
 * 获取企业详情
 */ 
export function getDetail(id) {
  return axios({
    url: `${API_MODULE}/${id}`,
  })
}


/**
 * 获取企业坐席号码
 */ 
export function getMobile(id) {
  return axios({
    url: `${API_MODULE}/${id}/mobile`,
  })
}


/**
 * 获取企业坐席列表
 * page_num 1 当前分页数 query	integer
 * page_size 10 分页大小 query	integer
 */ 
export function getSeatList(id,params) {
  return axios({
    url: `${API_MODULE}/${id}/seat`,
    params,
  })
}

