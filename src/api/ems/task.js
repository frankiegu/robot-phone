import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootEms
} from '@/config'

const API_MODULE = `${apiRootEms}/${apiVersion}`
// 任务相关
// http://121.40.216.49:50555/enterprise-business/swagger-ui.html#/TaskController
export default Object.assign(extendBaseApi('task', API_MODULE), {
  /**
   * 获取机器人坐席列表
   * @param {*} params
   */
  listCard(params) {
    return axios({
      url: `${API_MODULE}/task/getTaskCardOption`,
      method: 'GET',
      params
    })
  },
  /**
   * 获取可用机器人坐席列表
   * @param {*} params
   */
  listFreeCard(params) {
    return axios({
      url: `${API_MODULE}/task/getFreeTaskCardOption`,
      method: 'GET',
      params
    })
  },
  /**
   * 获取时间模板列表
   * @param {*} params
   */
  listTimeTemplate(params) {
    return axios({
      url: `${API_MODULE}/task/taskTimeTemplateOption`,
      method: 'GET',
      params
    })
  },
  /**
   * 获取话术列表
   * @param {*} params
   */
  listWhispering(params) {
    return axios({
      url: `${API_MODULE}/task/whisperingOption`,
      method: 'GET',
      params
    })
  },
  /**
   * 获取话术列表
   * @param {*} params
   */
  getTimeLimit() {
    return axios({
      url: `${API_MODULE}/task/time`,
      method: 'GET',
    })
  },
  /**
   * 获取短信模板
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/TaskController/addTaskUsingPOST
   * @param {*} params
   */
  listMessageTemplate(params) {
    return axios({
      url: `${API_MODULE}/task/messageTemplate`,
      method: 'GET',
      params,
      removeEmpty: true
    })
  },
  /**
   * 获取企业短信数量
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/TaskController/getMessageCountUsingGET
   */
  getMessageCount() {
    return axios({
      url: `${API_MODULE}/task/message_count`,
      method: 'GET',
      responseType: 'json'
    })
  },
  /**
   * 获取员工
   * @param {*} params
   */
  listEmployee(params) {
    return axios({
      url: `${API_MODULE}/task/employee`,
      method: 'GET',
      responseType: 'json',
      params,
      removeEmpty: true
    })
  },
  /**
   * 获取营销对象
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/TaskController/getUserUsingGET
   * @param {*} params
   */
  listUser(params) {
    return axios({
      url: `${API_MODULE}/task/user`,
      method: 'GET',
      responseType: 'json',
      params,
      removeEmpty: true
    })
  },
  /**
   * 导出营销对象
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/TaskController/exportUsingGET_1
   * @param {*} params
   */
  exportUser(params) {
    return axios({
      url: `${API_MODULE}/task/user/export`,
      method: 'GET',
      params,
      removeEmpty: true
    })
  },
  /*
   * 获取转接人工坐席的销售人员列表
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/TaskController/getEmployeeUsingGET_1
   * 
   */
  listTransferEmployee() {
    return axios({
      url: `${API_MODULE}/task/transfer/employee`,
      method: 'GET',
      responseType: 'json'
    })
  },
  /**
   * 获取转接人工坐席的人工坐席列表
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/TaskController/getFreeHumanUsingGET
   */
  listTransferHumanCardRelate() {
    return axios({
      url: `${API_MODULE}/task/transfer/getHumanCardRelate`,
      method: 'GET',
      responseType: 'json'
    })
  }
})
