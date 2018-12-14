// DictionaryTemplateController : 白名单相关接口

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

export default Object.assign(extendBaseApi('user_white', API_MODULE), {
  /**
   * 获取 接口
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#/UserWhiteController
   * @param {*} params
   */
  /**
  * 获取白名单列表接口
  * 
  * @param {*} params
  *         d (integer, optional): ID ,
  *         name (string, optional): 名称 ,
  *         phone (string, optional): 电话 ,
  *         remarks (string, optional): 备注
  */
  
  getUserWhiteList(params, option) {
    return axios({
      url: `${API_MODULE}/user_white`,
      method: 'GET',
      params: removeEmpty(params)
    })
  },
  /**
  * 获取白名单详情接口
  * 
  * @param {*} params
  *         integer:   string, 词库id
  */
  getUserWhiteDetail(id) {
    return axios({
      url: `${API_MODULE}/user_white/${id}`,
      method: 'GET'
    })
  }, 
  /**
  * 新增白名单接口
  * 
  * @param {*} params
  *         id: integer, 模板id
  *         word_name  : string, 单词
  */
  newUserWhiteTemplate(params, option) {
    return axios({
      url: `${API_MODULE}/user_white`,
      method: 'POST',
      data: removeEmpty(params)
    })
  }, 
  /**
  * 编辑白名单接口
  * 
  * @param {*} params
  *         
  */
  updateUserWhiteTemplate(params) {
    return axios({
      url: `${API_MODULE}/user_white`,
      method: 'PUT',
      data: removeEmpty(params)
    })
  },
  /**
  * 删除白名单模板
  * 
  * @param {*} params
  *         id: integer, 模板id
  */
  deleteUserWhiteTemplate(ids) {
    return axios({
      url: `${API_MODULE}/user_white/delete`,
      method: 'PUT',
      data: removeEmpty(ids)
    })
  },
  /**
  * 同步词库
  * 
  * @param {*} params
  */
  synchroData(params) {
    return axios({
      url: `${API_MODULE}/user_white/send`,
      method: 'GET',
      data: removeEmpty(params)
    })
  },
})