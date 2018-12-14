import axios from 'axios'
import {
  apiVersion,
  apiRootOms
} from '@/config'
import {
  removeEmpty
} from '@/util'

const API_MODULE = `${apiRootOms}/${apiVersion}`

export default {
  /**
   * 获取代理端口数量
   * http://121.40.216.49:50777/manager-business/swagger-ui.html#!/SystemConfigController/updateProxyPortUsingPUT
   */
  getProxyPort() {
    return axios({
      url: `/${API_MODULE}/system_config/proxy_port`,
      method: 'GET',
      responseType: 'json'
    })
  },
  /**
   * 更新代理端口数量
   * http://121.40.216.49:50777/manager-business/swagger-ui.html#/
   * @param {*} data
   */
  updateProxyPort(data) {
    return axios({
      url: `/${API_MODULE}/system_config/proxy_port`,
      method: 'PUT',
      data
    })
  },
  /**
   * 获取系统参数
   * http://121.40.216.49:50777/manager-business/swagger-ui.html#!/SystemConfigController/systemParamUsingGET
   */
  getSystemParam() {
    return axios({
      url: `/${API_MODULE}/system_config/system_param`,
      method: 'GET',
      responseType: 'json'
    })
  },
  /**
   * 更新系统参数
   * http://121.40.216.49:50777/manager-business/swagger-ui.html#!/SystemConfigController/updateSystemParamUsingPUT
   * @param {*} data
   */
  updateSystemParam(data) {
    return axios({
      url: `/${API_MODULE}/system_config/system_param`,
      method: 'PUT',
      data
    })
  },
  /**
   * 等级城市关联列表
   * http://121.40.216.49:50777/manager-business/swagger-ui.html#!/SystemConfigController/cityLevelUsingGET
   * @param {*} params
   */
  listLevelCity(params) {
    return axios({
      url: `/${API_MODULE}/system_config/city_level`,
      method: 'GET',
      params: removeEmpty(params),
      responseType: 'json'
    })
  },
  /**
   * 更新等级城市关联
   * @param {*} data
   */
  updateLevelCity(data) {
    return axios({
      url: `/${API_MODULE}/system_config/city_level`,
      method: 'PUT',
      data
    })
  },
  /**
   * 城市等级列表
   * http://121.40.216.49:50777/manager-business/swagger-ui.html#!/SystemConfigController/cityLevelListUsingGET
   * @param {*} params
   */
  listCityLevel(params) {
    return axios({
      url: `/${API_MODULE}/system_config/city_level_list`,
      method: 'GET',
      params: removeEmpty(params),
      responseType: 'json'
    })
  },
  /**
   * 城市管理列表
   * http://121.40.216.49:50777/manager-business/swagger-ui.html#!/SystemConfigController/cityManageUsingGET_1
   * @param {*} params
   */
  listCity(params) {
    return axios({
      url: `/${API_MODULE}/system_config/city_manage`,
      method: 'GET',
      params: removeEmpty(params),
      responseType: 'json'
    })
  },
  /**
   * 城市列表，不包含城市等级
   * http://121.40.216.49:50777/manager-business/swagger-ui.html#!/SystemConfigController/cityPageUsingGET
   * @param {*} params
   */
  listCityPage(params) {
    return axios({
      url: `/${API_MODULE}/system_config/city_page`,
      method: 'GET',
      params: removeEmpty(params),
      responseType: 'json'
    })
  },
  /**
   * 获取城市代理商列表
   * http://121.40.216.49:50777/manager-business/swagger-ui.html#!/SystemConfigController/cityManageUsingGET
   * @param {*} params
   */
  listCityAgent(params) {
    return axios({
      url: `/${API_MODULE}/system_config/city_agent`,
      method: 'GET',
      params: removeEmpty(params),
      responseType: 'json'
    })
  },
  /**
   * 城市等级管理-代理商列表
   * http://121.40.216.49:50777/manager-business/swagger-ui.html#!/SystemConfigController/agentPageUsingGET
   * @param {*} params
   */
  listAgentPage(params) {
    return axios({
      url: `/${API_MODULE}/system_config/agent_page`,
      method: 'GET',
      params: removeEmpty(params),
      responseType: 'json'
    })
  }
}
