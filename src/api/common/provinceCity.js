import axios from 'axios'
import {
  apiVersion,
  apiRootCommon
} from '@/config'

const MOUDLE = `${apiRootCommon}/${apiVersion}`
const removeEmpty= true
export default{
  /**
   * 省份列表
   * 
   * @param {any} params 
   * @returns 
   */
  provinceList(params) {
    return axios({
      url: `${MOUDLE}/province`,
      params,
      responseType: 'json'
    })
  },
   /**
   * 获取城市列表
   * @param {any} params 
   * @returns 
   * id 省id
   */
  cityList(params) {
    return axios({
      url: `${MOUDLE}/city`,
      params,
      removeEmpty
    })
  },
}
