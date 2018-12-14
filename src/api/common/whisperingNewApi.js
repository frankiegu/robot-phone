// import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootCommon
} from '@/config'
import axios from 'axios'

const API_MODULE = `${apiRootCommon}/${apiVersion}`
// 新话术相关
// http://121.40.216.49:50999/common-business/swagger-ui.html#/WhisperingNewController
export default Object.assign(extendBaseApi('whisperingNew', API_MODULE), {
  /**
   * 更新话术状态
   * @param {*} data
   */
  updateStatus(data) {
    return axios({
      url: `${API_MODULE}/whisperingNew/status`,
      method: 'PUT',
      data
    })
  },
  listUnrelateFirm(params) {
    return axios({
      url: `${API_MODULE}/whisperingNew/select_firm`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  addRelate(data) {
    return axios({
      url: `${API_MODULE}/whisperingNew/add_relate`,
      method: 'PUT',
      data
    })
  },
  removeRelate(data) {
    return axios({
      url: `${API_MODULE}/whisperingNew/delete_relate`,
      method: 'PUT',
      data
    })
  },
  listSelectOperator(params) {
    return axios({
      url: `${API_MODULE}/whisperingNew/select_operator`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  copy(data) {
    return axios({
      url: `${API_MODULE}/whisperingNew/copy`,
      method: 'PUT',
      data
    })
  },
  listFirm(params) {
    return axios({
      url: `${API_MODULE}/whisperingNew/firm`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  getParam(whisperingId) {
    return axios({
      url: `${API_MODULE}/whisperingNew/param/${whisperingId}`,
      method: 'GET',
      responseType: 'json'
    })
  },
  updateParam(data) {
    return axios({
      url: `${API_MODULE}/whisperingNew/param`,
      method: 'PUT',
      data
    })
  },
  sendPublic(id) {
    return axios({
      url: `${API_MODULE}/whisperingNew/send/${id}`,
    })
  },
  listLog(params) {
    return axios({
      url: `${API_MODULE}/whisperingNew/log`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  listAllFirm(params) {
    return axios({
      url: `${API_MODULE}/whisperingNew/all_firm`,
      method: 'GET',
      params,
      removeEmpty: true,
      responseType: 'json'
    })
  },
  check(data) {
    return axios({
      url: `${API_MODULE}/whisperingNew/check`,
      method: 'PUT',
      data
    })
  },
  commit(id) {
    return axios({
      url: `${API_MODULE}/whisperingNew/commit?id=${id}`,
      method: 'PUT'
    })
  },
  exportXls(id, flag) {
    return axios({
      url: `${API_MODULE}/whisperingNew/export`,
      method: 'GET',
      responseType: 'blob',
      params: {
        id,
        flag
      }
    })
  },
  getTemplateFile() {
    return axios({
      url: `${API_MODULE}/whisperingNew/template`,
      method: 'GET',
      responseType: 'blob'
    })
  },
  getAll(whisperingId) {
    return axios({
      url: `${API_MODULE}/whisperingNew/all`,
      method: 'GET',
      params: {
        id: whisperingId
      },
      responseType: 'json'
    })
  },
  authorization(data) {
    return axios({
      url: `${API_MODULE}/whisperingNew/authorization`,
      method: 'PUT',
      data
    })
  }
})
