// MessageTemplateController : 短信模板相关接口

import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootSms
} from '@/config'

import {
  removeEmpty
} from '@/util'

const API_MODULE = `${apiRootSms}/${apiVersion}`

export default Object.assign(extendBaseApi('message_template', API_MODULE), {
  /**
   * 更新短信模板状态接口
   * 
   * @param {*} params
   *         id: integer, 模板id
   *         status : integer, 模板状态 0禁用 1启用 ,
   */
  updateTemplateStatus(params, option) {
    return axios({
      url: `${API_MODULE}/message_template/status`,
      method: 'PUT',
      data: removeEmpty(params)
    })
  },
  /**
   * 审核
   * @param {*} data
   */
  check(data) {
    return axios({
      url: `${API_MODULE}/message_template/check`,
      method: 'PUT',
      data: removeEmpty(data)
    })
  },
  /**
   * 编辑短信模板
   * 
   * @param {*} params
   *         id: integer, 模板id
   *         content: srting, 模板内容
   *         name: srting, 模板名称
   *         type: integer, 模板分类 1 初筛推送短信 2 命中关键字短信
   */
  update(params, option) {
    return axios({
      url: `${API_MODULE}/message_template/update`,
      method: 'PUT',
      data: removeEmpty(params)
    })
  },
  /**
   * 删除短信模板
   * 
   * @param {*} params
   *         id: integer, 模板id
   */
  deleteTemplate(id) {
    return axios({
      url: `${API_MODULE}/message_template/${id}`,
      method: 'DELETE'
    })
  }
})
