// CallRecordController : 通话记录相关接口

import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootEms,
  apiEms
} from '@/config'
import {
  removeEmpty,
  compatUrl
} from '@/util'

const API_MODULE = `${apiRootEms}/${apiVersion}`

export default Object.assign(extendBaseApi('call_record', API_MODULE), {
  /**
   * 获取呼叫日志列表接口
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/CallRecordController/logUsingGET
   * @param {*} params
   */
  listLog(params) {
    return axios({
      url: `${API_MODULE}/call_record/log/list`,
      method: 'GET',
      params: removeEmpty(params),
      responseType: 'json'
    })
  },
  /**
   * 导出通话记录
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/CallRecordController/exportUsingGET
   * @param {*} params
   */
  exportFile(params) {
    return axios({
      url: `${API_MODULE}/call_record/export`,
      method: 'GET',
      params: removeEmpty(params)
    })
  },
  /**
   *
   *
   * @param {*} id 判断阅读完成
   */
  isRead(data) {
    return axios({
      url: `${API_MODULE}/call_record/read`,
      method: "POST",
      data
    })
  },
  /**
   * 修改通话内容
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/CallRecordController/updateContentUsingPUT
   * @param {*} data
   */
  callContent(data) {
    return axios({
      url: `${API_MODULE}/call_record/call_content`,
      method: "PUT",
      data
    })
  }
})


/**
 * 获取通话记录详情接口
 * @param  {[type]} id 记录 ID
 */
export function getRecordDetail(id) {
  return axios({
    url: `${API_MODULE}/call_record/detail/${id}`,
  })
}



/**
 * 获取通话记录列表接口
 * @param  {[type]} params 
 *   call_all_time (integer, optional): 通话时长 ,
 *   call_count (integer, optional): 通话轮次 ,
 *   call_type (integer, optional): 主叫类型 1机器 2人工 = ['1', '2']integerEnum:1, 2,
 *   mobile (string, optional): 查询号码 ,
 *   page_num (integer): 当前分页数 ,
 *   page_size (integer): 分页大小 ,
 *   status (integer, optional): 分配状态 0未分配 1已分配 = ['0', '1']integerEnum:0, 1,
 *   task_id (integer, optional): 任务id ,
 *   user_level (string, optional): 用户等级
 */
export function getRecordList(params) {
  return axios({
    url: `${API_MODULE}/call_record`,
    params,
  })
}

/**
 * 获取呼叫日志列表接口
 * @param  {[type]} params 
 *         page_num   当前页
 *         page_size  分页数
 *         task_id    任务ID
 *         call_status    呼叫状态 呼叫结果 0开始呼叫 1已接通 2 无法接通 3拒接 4外呼失败
 *         mobile   客户号码
 */

export function getRecordLogList(params) {
  return axios({
    url: `${API_MODULE}/call_record/log`,
    params,
  })
}

/**
 * 获取通话详情
 */
export function getRecordDetailById(id) {
  return axios({
    url: `${API_MODULE}/call_record/${id}`
  })
}
