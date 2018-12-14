import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootPms
} from '@/config'

const API_MODULE = `${apiRootPms}/${apiVersion}`
const MOUDLE = `${API_MODULE}/city_proxy`
const removeEmpty= true

export default Object.assign(extendBaseApi('city_proxy', API_MODULE), {
    /**
   * 开通市代--》获取代理城市列表
   * http://47.98.111.177:50666/proxy-business/swagger-ui.html#!/CityProxyController/getCityUsingGET
   * @param {*} params
   */
  listProxyCity(params) {
    return axios({
      url: `${MOUDLE}/city`,
      params,
      removeEmpty
    })
  },
  /**
   * 获取市级代理列表
   * @param {any} params 
   * @returns 
   */
  getCityProxyList(params) {
    return axios({
      url: `${MOUDLE}`,
      params,
      removeEmpty
    })
  },
  /**
   * 新增市级代理
   * 
   * @param {any} params 
   * @returns 
   */
  addCityProxy(params) {
    return axios({
      url: `${MOUDLE}`,
      data:params,
      method:'POST',
      removeEmpty
    })
  },
  /**
   * 编辑市级代理
   * 
   * @param {any} params 
   * @returns 
   */
  editCityProxy(params) {
    return axios({
      url: `${MOUDLE}`,
      data:params,
      method:'PUT'
    })
  },
    /**
   * 删除市级代理
   * 
   * @param {any} params 
   * @returns 
   */
  deleteCityProxy(id) {
    return axios({
      url: `${MOUDLE}/${id}`,
      method:'DELETE'
    })
  },
  /**
   * 代理升级时最低出售端口数
   * 
   * @param {any} params 
   * @returns 
   */
  getAddPort(params) {
    return axios({
      url: `${MOUDLE}/add_port`,
      params,
      removeEmpty
    })
  },
  /**
   * 获取城市列表
   * @param {any} params 
   * @returns 
   */
  getCityList(id) {
    return axios({
      url: `${MOUDLE}/city/${id}`,
      removeEmpty
    })
  },
  /**
   * 获取企业列表
   * @param {any} params 
   * @returns 
   */
  getFirmList(params) {
    return axios({
      url: `${MOUDLE}/firm`,
      params,
      removeEmpty
    })
  },
  /**
   * 获取企业详情
   * 
   * @param {any} id 
   * @returns 
   */
  getFirmDetail(id) {
    return axios({
      url: `${MOUDLE}/firm/${id}`,
      params,
      removeEmpty
    })
  },
  /**
   * 获取端口记录列表
   * 
   * @param {any} params 
   * @returns 
   */
  getPortList(params) {
    return axios({
      url: `${MOUDLE}/port`,
      params,
      removeEmpty
    })
  },
  /**
   * 获取代理台数和价格
   * 
   * @param {any} params 
   * @returns 
   */
  getProxyInfo(params) {
    return axios({
      url: `${MOUDLE}/proxy_info`,
      params,
      removeEmpty
    })
  },
  /**
   * 新增代理升级
   * 
   * @param {any} params 
   * @returns 
   */
  addProxyUp(params) {
    return axios({
      url: `${MOUDLE}/proxy_up`,
      data:params,
      method:'POST',
      removeEmpty
    })
  },
  /**
   * 新增出售端口
   * 
   * @param {any} params 
   * @returns 
   */
  addSellPort(params) {
    return axios({
      url: `${MOUDLE}/sell_port`,
      data:params,
      method:'POST',
      removeEmpty
    })
  },
  /**
   * 获取代理商列表
   * 
   * @param {any} id 
   * @returns 
   */
  getFirmSelectList(id) {
    return axios({
      url: `${MOUDLE}/firm_select`,
      params:{id},
      removeEmpty
    })
  },
  /**
   * 获取市级代理详情
   * 
   * @param {any} id 
   * @returns 
   */
  getCityProxyDetail(id) {
    return axios({
      url: `${MOUDLE}/${id}`,
      removeEmpty
    })
  },
  /**
   * 市级代理--》基础信息--》更新状态
   * @param {any} id 
   * @returns 
   */
  editStatus(params){
    return axios({
      url: `${MOUDLE}/status`,
      method:'PUT',
      data:params,
      removeEmpty
    })
  },
  // GET /v1.0/city_proxy/province

  /**
   * 获取省份列表 ：能开通代理的省份列表
   */
    getProvinceList () {
      return axios({
        url: `${MOUDLE}/province`,
      })
    },

    /**
     * 获取城市列表 ：能开通代理的城市列表
     */
    getCityList (id) {
      return axios({
        url: `${MOUDLE}/city/${id}`,
      })
    }

})
