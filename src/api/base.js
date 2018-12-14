import axios from 'axios'
import {
  removeEmpty
} from '@/util'
import {
  apiVersion as apiVersionConfig
} from '@/config'

const extendBaseApi = (modular, apiVersion = apiVersionConfig, mock = false) => {
  let prefixUri = `/${apiVersion}/${modular}`
  return {
    /**
     * 查询列表
     * @param {*} params
     */
    list(params, options) {
      return axios(Object.assign({
        url: prefixUri,
        method: 'GET',
        params: removeEmpty(params),
        responseType: 'json',
        mock
      }, options))
    },
    /**
     * 查询对象
     * @param {*} id
     */
    get(id, options) {
      return axios(Object.assign({
        url: `${prefixUri}/${id}`,
        method: 'GET',
        responseType: 'json',
        mock
      }, options))
    },
    /**
     * 新增数据
     * @param {*} data
     */
    save(data, options) {
      return axios(Object.assign({
        url: prefixUri,
        method: 'POST',
        data,
        responseType: 'json',
        mock
      }, options))
    },
    /**
     * 更新数据
     * @param {*} data
     */
    update(data, options) {
      return axios(Object.assign({
        url: prefixUri,
        method: 'PUT',
        data,
        responseType: 'json',
        mock
      }, options))
    },
    /**
     * 新增数据/更新数据
     * @param {*} data
     */
    saveOrUpdate(data, options) {
      return data.id ? this.update(data, options) : this.save(data, options)
    },
    /**
     * 删除数据
     * @param {*} id
     */
    del(id, options) {
      return axios(Object.assign({
        url: `${prefixUri}/${id}`,
        method: 'DELETE',
        responseType: 'text',
        mock
      }, options))
    },
    updateStatu(data, options) {
      return axios(Object.assign({
        url: `${prefixUri}/status`,
        method: 'PUT',
        data: removeEmpty(data)
      }, options))
    }
  }
}

export default extendBaseApi
