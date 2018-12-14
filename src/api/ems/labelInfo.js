// LabelInfoController : 客户标签相关

import axios from 'axios'
import {
  apiVersion,
  apiRootEms
} from '@/config'

const API_MODULE = `${apiRootEms}/${apiVersion}/label_info`

/**
 * 获取客户标签列表
 * @param  {[type]} params
 *         page_size
 *         page_num
 */
export function getLabelList (params) {
  return axios({
    url: `${API_MODULE}`,
    params
  })
}

/**
 * 新增客户标签
 * @param {[type]} data [description]
 *  label_describe (string): 标签说明 ,
 *  label_name (string): 标签名称 ,
 *  status (integer): 状态 0禁用 1正常
 */
export function addLabel (data) {
  return axios({
    url: `${API_MODULE}`,
    data,
    method: 'POST'
  })
}

/**
 * 编辑客户标签
 * @param  {[type]} data 
 *  id (integer): id ,
 *  label_describe (string): 标签说明 ,
 *  label_name (string): 标签名称 ,
 *  status (integer): 状态 0禁用 1正常
 */
export function updateLabel (data) {
  return axios({
    url: `${API_MODULE}`,
    data,
    method: 'PUT'
  })
}

/**
 * 删除客户标签信息
 * @param  {[type]} id 标签ID
 */
export function deleteLabelById (id) {
  return axios({
    url: `${API_MODULE}/${id}`,
    method: 'DELETE'
  })
}


/**
 * 获取客户标签详情
 * @param  {[type]} id 标签ID
 */
export function getLabelDetail (id) {
  return axios({
    url: `${API_MODULE}/${id}`,
  })
}

/**
 * 获取客户标签详情
 * @param  {[type]}paramsid 
 *  page_size
 *  page_num
 *  lebel_id
 */
export function getUserlList (params) {
  return axios({
    url: `${API_MODULE}/call_record`,
    params
  })
}


