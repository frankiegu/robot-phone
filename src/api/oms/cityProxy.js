import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootOms
} from '@/config'

const API_MODULE = `${apiRootOms}/${apiVersion}`
const MOUDLE = `${API_MODULE}/city_proxy`
const removeEmpty= true

export default Object.assign(extendBaseApi('city_proxy', API_MODULE), {
  /**
   * 获取省份列表
   * http://121.40.216.49:50777/manager-business/swagger-ui.html#!/CityProxyController/getProvinceUsingGET
   * @param {*} params
   */
  listProvince(params) {
    return axios({
      url: `${MOUDLE}/province`,
      params,
      responseType: 'json'
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
   * 删除市级代理
   * @param {any} params 
   * @returns 
   */
  deleteProxy(id) {
    return axios({
      url: `${MOUDLE}/${id}`,
      method:'DELETE'
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
  /**
   * 获取指标列表(年/季)
   * 
   * @param {any} id 
   * @returns 
   */
  getIndicator(params) {
    return axios({
      url: `${MOUDLE}/indicator`,
      params,
      removeEmpty
    })
  },
  /**
   * 指标管理-处理
   * @param {any} id 
   * @returns 
   */
  editIndicatorStatus(params){
    return axios({
      url: `${MOUDLE}/indicator_status`,
      method:'POST',
      data:params,
      removeEmpty
    })
  },
})
