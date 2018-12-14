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

export default Object.assign(extendBaseApi('user_white', API_MODULE), {
  /**
   * 批量新增
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/UserWhiteController/addUsingPOST_1
   * @param {*} data
   */
  batchSave(data) {
    return axios({
      url: `/${API_MODULE}/user_white`,
      method: 'POST',
      data
    })
  },
  /**
   * 任务列表
   * http://121.40.216.49:50555/enterprise-business/swagger-ui.html#!/UserWhiteController/getPageUsingGET_17
   * @param {*} params
   */
  listTask(params) {
    return axios({
      url: `/${API_MODULE}/user_white/task`,
      method: 'GET',
      params: removeEmpty(params),
      responseType: 'json'
    })
  }
})
