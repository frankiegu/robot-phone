// FirmController : 企业管理 
import axios from 'axios'
import {
  apiVersion,
  apiRootOms
} from '@/config'

const API_MODULE = `${apiRootOms}/${apiVersion}/seat`
const removeEmpty= true

// GET /v1.0/seat

/**
 * 获取坐席列表
 * start_time 开始时间 query	string
 * end_time 结束时间 query	string
 * mobile 坐席号码 query	string
 * admin_id 企业ID query	integer
 * status 状态 query	integer
 * card_type 坐席类型 query	integer
 * page_num (required) 当前分页数 query	integer
 * page_size (required) 分页大小 query	integer
 */
export function getList(params) {
  return axios({
    url: `${API_MODULE}`,
    params
  })
}

/**
 * 获取坐席详情
 */
export function getDetail(id) {
  return axios({
    url: `${API_MODULE}/${id}`
  })
}
