// MessageTemplateController : 短信模板相关接口

import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootEms
} from '@/config'

import {
  removeEmpty
} from '@/util'

const API_MODULE = `${apiRootEms}/${apiVersion}`

export default Object.assign(extendBaseApi('message_template', API_MODULE), {
  /**
   * 获取 接口
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#/MessageTemplateController
   * @param {*} params
   */
  /**
  * 获取短信模板列表接口
  * 
  * @param {*} params
  *         id_name:   string, 模板ID/名称
  *         page_num: integer, 当前页
  *         page_size: integer, 分页数
  *         type: integer, 模板分类 1 初筛推送短信 2 命中关键字短信
  */
  getMessageTemplateList(params, option) {
    return axios({
      url: `${API_MODULE}/message_template`,
      method: 'GET',
      params: removeEmpty(params)
    })
  },
  /**
  * 获取短信模板详情
  * 
  * @param {*} params
  *         id: integer, 模板id
  */
  getMessageTemplateDetail(params, option) {
    return axios({
      url: `${API_MODULE}/message_template/` + params.id,
      method: 'GET'
    })
  }, 
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
  },
  /**
  * 新增短信模板
  * 
  * @param {*} params
  *         content: srting, 模板内容
  *         name: srting, 模板名称
  *         type: integer, 模板分类 1 初筛推送短信 2 命中关键字短信
  */
  addTemplate(params, option) {
    return axios({
      url: `${API_MODULE}/message_template`,
      method: 'POST',
      data: removeEmpty(params)
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
  updateTemplate(params, option) {
    return axios({
      url: `${API_MODULE}/message_template`,
      method: 'PUT',
      data: removeEmpty(params)
    })
  },
  /**
  * 短信模板发送记录
  * 
  * @param {*} params
  *         id: integer, 模板id
  *         page_num : integer, 当前分页数 ,
  *         page_size : integer, 分页大小 ,
  *         type: integer, 模板类型
  */
  getMessageTemplateSendRecordList(params, option) {
    return axios({
      url: `${API_MODULE}/message_template/record`,
      method: 'GET',
      params: removeEmpty(params)
    })
  },
})