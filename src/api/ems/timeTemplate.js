// TimeTemplateController : 时间模板相关接口
// 
import axios from 'axios'
import {
  apiVersion,
  apiRootEms
} from '@/config'

const API_MODULE = `${apiRootEms}/${apiVersion}/time_template`

/**
 * 获取时间模板列表
 * @param  {[Object]} params 
 *         page_num: 当前页
 *         page_size: 分页数
 */
export function getTemplateList (params) {
  return axios({
    url: `${API_MODULE}`,
    params
  })
}
/**
 * 新增时间模板
 * @param  {[Object]} data 
 *   am_end_time: "string",
 *   am_start_time: "string",
 *   exclude_date: "string",
 *   pm_end_time: "string",
 *   pm_start_time: "string",
 *   template_name: "string",
 *   week_date: "string"
 */

export function addTemplate (data) {
  return axios({
    url: `${API_MODULE}`,
    data,
    method: 'POST'
  })
}

/**
 * 编辑时间模板
 * @param  {[Object]} data 
 *   am_end_time: "string",
 *   am_start_time: "string",
 *   exclude_date: "string",
 *   id: 0,
 *   pm_end_time: "string",
 *   pm_start_time: "string",
 *   status: 0,
 *   template_name: "string",
 *   week_date: "string"
 */

export function updateTemplate (data) {
  return axios({
    url: `${API_MODULE}`,
    data,
    method: 'PUT'
  })
}
/**
 * 删除时间模板
 * @param  {[Object]} id 模板ID
 */

export function deleteTempalteById (id) {
  return axios({
    url: `${API_MODULE}/${id}`,
    method: 'DELETE'
  })
}

/**
 * 获取时间模板详情
 * @param  {[Object]} id 模板ID
 */

export function getTempalteDetail (id) {
  return axios({
    url: `${API_MODULE}/${id}`
  })
}

/**
 * 获取时间模板详情
 * @param  {[Object]} id 模板ID
 */

export function getTaskList (params) {
  return axios({
    url: `${API_MODULE}/task`,
    params
  })
}
