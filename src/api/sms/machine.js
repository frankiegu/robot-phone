import axios from 'axios'
import {
  apiVersion,
  apiRootSms
} from '@/config'

const API_MODULE = `${apiRootSms}/${apiVersion}/machine_info`
const removeEmpty = true
/**
 * 获取设备列表
 * start_time 
 * end_time	
 * machine_no 设备号
 * page_num 当前分页数
 * page_size 分页大小
 */

export function getMachineList(params) {
  return axios({
    url: `${API_MODULE}`,
    params,
    removeEmpty
  })
}
/**
 * 新增设备
 * fs_ip_addr (string): fs的地址和端口号 ,
 * machine_name (string): 机器名称 ,
 * machine_no (string): 机器编号 ,
 * sip_id (string): sip编号 ,
 * slot_count (integer): 机器端口数
 * @export
 * @param {any} params 
 * @returns 
 */
export function addMachine(params) {
  return axios({
    url: `${API_MODULE}`,
    data: params,
    method: 'POST'
  })
}
/**
 * 编辑设备
 * fs_ip_addr (string): fs的地址和端口号 ,
 * machine_name (string): 机器名称 ,
 * machine_no (string): 机器编号 ,
 * sip_id (string): sip编号 ,
 * slot_count (integer): 机器端口数
 * @method [PUT]
 */
export function updateMachine(params) {
  return axios({
    url: `${API_MODULE}`,
    data: params,
    method: 'PUT'
  })
}
/**
 * 获取开通申请列表
 * operator_id 运营商ID
 * province_proxy_id 省代ID
 * city_proxy_id 市代ID
 * status 状态 0审批中 1已开通 2拒绝
 * admin_name 企业名称
 * page_num 当前分页码
 * page_size 
 */
export function getMachineApplyList(params) {
  return axios({
    url: `${API_MODULE}/applyInfo`,
    params,
  })
}

/**
 * 开通请求
 * human_seats 人工坐席列表 ,
 * id  申请ID ,
 * robot_seats 机器坐席列表
 * SeatInfo {
machine_id (integer, optional): 设备ID ,
mobile (string, optional): 坐席号码 ,
slot_id (integer, optional): 端口ID
}
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function postMachineApply(params) {
  return axios({
    url: `${API_MODULE}/applyInfo`,
    data: params,
    method: 'POST'
  })
}
/**
 * 获取开通申请详情
 * @export
 * @param {any} id 
 * @returns 
 */
export function getApplyInfo(id) {
  return axios({
    url: `${API_MODULE}/applyInfo/${id}`,
  })
}
/**
 * 获取开通申请详情
 * @export
 * @param {any} id 
 * @returns 
 */
export function getApplyDetails(id) {
  return axios({
    url: `${API_MODULE}/apply_details/${id}`,
  })
}
/**
 * 获取端口列表
 * 
 * @export
 * @param {any} id 
 * @returns 
 */
export function getSlotList(id) {
  return axios({
    url: `${API_MODULE}/getSlotList/${id}`,
  })
}
/**
 * 获取设备列表
 * 
 * @export
 * @param 
 * @returns 
 */
export function getUsableMachineList() {
  return axios({
    url: `${API_MODULE}/getUsableMachineList`,
  })
}
/**
 * 获取端口列表
 * 
 * @export
 * @param {any} id 
 * @returns 
 */
export function getUsableSlot(id) {
  return axios({
    url: `${API_MODULE}/getUsableSlot/${id}`,
  })
}
/**
 * 拒绝申请
 * @export
 * @param {any} id 
 * @returns 
 */
export function rejectApply(id) {
  return axios({
    url: `${API_MODULE}/rejectApply/${id}`,
    method: 'POST'
  })
}
/**
 * 删除设备信息
 * 
 * @export
 * @param {any} id 
 * @returns 
 */
export function deleteMachine(id) {
  return axios({
    url: `${API_MODULE}/${id}`,
    method: 'DELETE'
  })
}
/**
 * 获取设备详情
 * 
 * @export
 * @param {any} id 
 * @returns 
 */
export function getMachineInfo(id) {
  return axios({
    url: `${API_MODULE}/${id}`,
  })
}
/**
 * 获取运营商
 * 
 * @export
 * @returns 
 */
export function getOperator() {
  return axios({
    url: `${API_MODULE}/operator`,
  })
}
/**
 * 获取省代
 * @export
 * @param {any} params 
 * @returns 
 */
export function getProvinceList(id) {
  return axios({
    url: `${API_MODULE}/province`,
    params: {
      id
    }
  })
}
/**
 * 获取省代
 * @export
 * @param {any} platformId provinceProxyId
 * @returns 
 */
export function getCityList(params) {
  return axios({
    url: `${API_MODULE}/city`,
    params,
  })
}

/**
 * 端口列表--》删除
 */
export function deletePortById(id) {
  return axios({
    url: `${API_MODULE}/slot/${id}`,
    method: 'DELETE'
  })
}

/**
 * 编辑端口->获取端口详情
 */
export function getSlotDetail(id) {
  return axios({
    url: `${API_MODULE}/slot/${id}`,
  })
}
/**
 * 编辑端口
 * id (required) 列表id query	integer
 * mobile 电话 query	string 
 * card_type 类型 1机器 2人工 query	integer
 */
export function updateSlot(data) {
  return axios({
    url: `${API_MODULE}/slot`,
    data: data,
    method: 'PUT'
  })
}

/**
 * 卡槽迁移
 * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/MachineInfoController/moveSlotUsingPUT
 * @param {*} data
 */
export function moveSlot(data) {
  return axios({
    url: `${API_MODULE}/move_slot`,
    data: data,
    method: 'PUT'
  })
}

/**
 * 迁移卡槽时，获取设备列表
 * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/MachineInfoController/getMachineUsingGET
 * @param {*} params
 */
export function listMoveSlotMachine(params) {
  return axios({
    url: `${API_MODULE}/getMachine`,
    method: 'GET',
    params,
    removeEmpty: true,
    responseType: 'json'
  })
}

/**
 * 迁移卡槽时，获取端口列表
 * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/MachineInfoController/getSlotUsingGET
 * @param {*} params
 */
export function listMoveSlotSlot(params) {
  return axios({
    url: `${API_MODULE}/getSlot`,
    method: 'GET',
    params,
    removeEmpty: true,
    responseType: 'json'
  })
}
