// CardSlotController : 机器人/人工坐席相关接口

import axios from 'axios'
import {
  apiVersion,
  apiRootEms
} from '@/config'

const API_MODULE = `${apiRootEms}/${apiVersion}/card_relate`

/**
 * 机器人通话记录接口
 * @param  {[Object]} params 
 *         page_num: 当前页
 *         page_size: 分页数
 *         card_id: 机器人／人工坐席ID
 */
export function getCallRecords(params) {
  return axios({
    url: `${API_MODULE}/call_records`,
    params
  })
}
/**
 * 人工通话记录接口
 * @param  {[Object]} params 
 *         page_num: 当前页
 *         page_size: 分页数
 *         card_id: 机器人／人工坐席ID
 */
export function getArtificialCallRecords(params) {
  return axios({
    url: `${API_MODULE}/employee_records`,
    params
  })
}
/**
 * 
 * 修改昵称
 * @export
 * @param {any} id 
 * @returns 
 */
export function updateNickName({
  id,
  nickName
}) {
  return axios({
    url: `${API_MODULE}/update`,
    method: 'PUT',
    data: {
      id,
      nickName
    }
    // data:{id,nickName}
  })
}
/**
 * 机器人/人工坐席通话记录接口
 * @param  {[Object]} params 
 *         card_id: 机器人／人工坐席ID
 */
export function getDetail(id) {
  return axios({
    url: `${API_MODULE}/${id}`,
  })
}

/**
 * 机器人/人工坐席列表接口
 * @param  {[Object]} params 
 *         page_num: 当前页
 *         page_size: 分页数
 *         card_type: 类型：1 机器人，2 人工
 */
export function getList(params) {
  return axios({
    url: `${API_MODULE}`,
    params,
  })
}

/**
 * 设置固定坐席
 * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/CardRelateController/addTaskUsingPUT
 * @param {*} data
 */
export function setFixed(data) {
  return axios({
    url: `${API_MODULE}/set_fixed`,
    method: 'PUT',
    data
  })
}

/**
 * 更新固定坐席状态
 * @param {*} data
 */
export function updateFixedStatus(data) {
  return axios({
    url: `${API_MODULE}/fixed_status`,
    method: 'PUT',
    data
  })
}

/**
 * 固定坐席详情
 * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/CardRelateController/getFixedDetailUsingGET
 * @param {*} id
 */
export function getFixedDetail(id) {
  return axios({
    url: `${API_MODULE}/fixed/${id}`,
    method: 'GET',
    responseType: 'json'
  })
}
