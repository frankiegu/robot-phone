// DictionaryTemplateController : 词库模板相关接口

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

export default Object.assign(extendBaseApi('word_db', API_MODULE), {
  /**
   * 获取 接口
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#/WordDbController
   * @param {*} params
   */
  /**
  * 获取词库模板列表接口
  * 
  * @param {*} params
  *         word_name:   string, 单词
  *         page_num: integer, 当前页
  *         page_size: integer, 分页数
  *         status: integer, 是否读取 1 是 2 否
  */
  getWordDbList(params, option) {
    return axios({
      url: `${API_MODULE}/word_db`,
      method: 'GET',
      params: removeEmpty(params)
    })
  },
  /**
  * 获取词库模板详情接口
  * 
  * @param {*} params
  *         integer:   string, 词库id
  */
  getWordDbDetail(id) {
    return axios({
      url: `${API_MODULE}/word_db/${id}`,
      method: 'GET'
    })
  }, 
  /**
  * 新增词库模板接口
  * 
  * @param {*} params
  *         id: integer, 模板id
  *         word_name  : string, 单词
  */
  newWordDbTemplate(params, option) {
    return axios({
      url: `${API_MODULE}/word_db`,
      method: 'POST',
      data: removeEmpty(params)
    })
  }, 
  /**
  * 编辑词库模板接口
  * 
  * @param {*} params
  *         id: integer, 模板id
  *         word_name  : string, 单词
  */
  updateWordDbTemplate(params, option) {
    return axios({
      url: `${API_MODULE}/word_db`,
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
  deleteWordDbTemplate(params) {
    return axios({
      url: `${API_MODULE}/word_db/delete`,
      method: 'PUT',
      data: removeEmpty(params)
    })
  },
  /**
  * 同步词库
  * 
  * @param {*} params
  */
  synchroData(params) {
    return axios({
      url: `${API_MODULE}/word_db/send`,
      method: 'GET',
      data: removeEmpty(params)
    })
  },
})