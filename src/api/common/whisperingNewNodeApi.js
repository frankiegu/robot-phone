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
export default Object.assign(extendBaseApi('whisperingNew/node', API_MODULE), {
  listModule(params) {
    return axios({
      url: `/${API_MODULE}/whisperingNew/node/module`,
      method: 'GET',
      responseType: 'json',
      params,
      removeEmpty: true
    })
  },
  sort(data) {
    return axios({
      url: `${API_MODULE}/whisperingNew/node/indexs`,
      method: 'PUT',
      data
    })
  }
})
