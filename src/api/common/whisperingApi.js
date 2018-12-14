// import axios from 'axios'
import {
  apiVersion,
  apiRootCommon
} from '@/config'
import axios from 'axios';

const API_MODULE = `${apiRootCommon}/${apiVersion}`
// 话术相关
// http://121.40.216.49:50999/common-business/swagger-ui.html#/WhisperingController
export default {
  initExperience(whisperingId) {
    return axios({
      url: `${API_MODULE}/whispering/experience/init`,
      method: 'GET',
      params: {
        whisperingId
      }
    })
  },
  sendExperience(data) {
    return axios({
      url: `${API_MODULE}/whispering/experience/content`,
      method: 'PUT',
      data,
      responseType: 'json'
    })
  },
  exportXls(id, flag) {
    return axios({
      url: `${API_MODULE}/whispering/export`,
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
      url: `${API_MODULE}/whispering/template`,
      method: 'GET',
      responseType: 'blob'
    })
  }
}
