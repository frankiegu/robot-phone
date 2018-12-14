// OperatorController : 运营商管理

import axios from 'axios'
import {
  apiVersion,
  apiRootSms
} from '@/config'

const API_MODULE = `${apiRootSms}/${apiVersion}/operator`

/**
 * 获取运营商列表
 * status 状态 0禁用 1启用
 * name 代理商名称
 * page_num 当前分页数
 * page_size 分页大小
 */

export function getList(params) {
    return axios({
        url: `${API_MODULE}`,
        params
    })
}

/**
 * 获取运营商列表
 * status 状态 0禁用 1启用
 * name 代理商名称
 * page_num 当前分页数
 * page_size 分页大小
 */

export function deleteOperator(id) {
    return axios({
        url: `${API_MODULE}/${id}`,
        method:'DELETE'
    })
}
/**
 * 新增运营商
 * account (string, optional): 运营商账号 ,
 * card_init_count (integer, optional): 代理台数 ,
 * contacts_address (string, optional): 联系地址 ,
 * contacts_mobile (string, optional): 联系电话 ,
 * contacts_name (string, optional): 联系人 ,
 * mobile (integer, optional): 绑定手机号 ,
 * name (string, optional): 运营商名称 ,
 * password (string, optional): 初始密码 ,
 * proxy_price (number, optional): 代理价格 ,
 * remarks (string, optional): 备注 ,
 * verif_code (string, optional): 验证码
 */
export function addOperator(data) {
    return axios({
        url: `${API_MODULE}`,
        data,
        method: 'POST'
    })
}

/**
 * 编辑运营商
 * contacts_address (string, optional): 联系地址 ,
 * contacts_mobile (string, optional): 联系电话 ,
 * contacts_name (string, optional): 联系人 ,
 * mobile (integer, optional): 绑定手机号 ,
 * name (string, optional): 运营商名称 ,
 * password (string, optional): 密码 ,
 * remarks (string, optional): 备注 ,
 * verif_code (string, optional): 验证码
 */

export function updateOperator(data) {
    return axios({
        url: `${API_MODULE}`,
        data,
        method: 'PUT'
    })
}

/**
 * 新增运营商端口数
 * id (integer, optional): 运营商ID ,
 * ports (integer, optional): 新增端口数 ,
 * price (number, optional): 金额
 */
export function addPort(data) {
    return axios({
        url: `${API_MODULE}/add_port`,
        data,
        method: 'POST'
    })
}

/**
 * 获取市代列表
 * id (required) 运用商ID query	integer 
 * page_num (required) 当前分页数 query	integer 
 * page_size (required) 分页大小 query	integer
 */

export function getCityList(params) {
    return axios({
        url: `${API_MODULE}/city`,
        params
    })
}

/**
 * 获取端口记录列表
 * id (required) 运用商ID query	integer 
 * page_num (required) 当前分页数 query	integer
 * page_size (required) 分页大小 query	integer
 */


export function getPortList(params) {
    return axios({
        url: `${API_MODULE}/port`,
        params
    })
}

/**
 * 获取省代列表
 * id (required) 运用商ID query	integer
 * page_num (required) 当前分页数 query	integer
 * page_size (required) 分页大小 query	integer
 */

export function getProvinceList(params) {
    return axios({
        url: `${API_MODULE}/province`,
        params
    })
    
}

/**
 * 获取运营商详情
 * id 运用商ID path	integer
 */

export function getDetail(id) {
    return axios({
        url: `${API_MODULE}/${id}`,
    })
}
/**
 * 运营商管理->基础信息->更新状态
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function changeStatus(params) {
    return axios({
        url: `${API_MODULE}/status`,
        data:params,
        method:'PUT'
    })
}

/**
 * 增加短信条数
 * http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/OperatorController/addMessageCountUsingPUT
 * @param {*} data
 */
export function addMessageNum(data) {
    return axios({
        url: `${API_MODULE}/message_num`,
        data,
        method:'PUT'
    })
}