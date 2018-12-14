// import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootEms
} from '@/config'
import axios from 'axios';

const API_MODULE = `${apiRootEms}/${apiVersion}`
// 话术节点相关
// http://121.40.216.49:50888/superManager-business/swagger-ui.html#!/WhisperingController/getTypePageUsingGET
export default Object.assign(extendBaseApi('whispering/node', API_MODULE), {
  /**
   * 话术节点排序
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#/
   * @param {*} data
   */
  sort(data) {
    return axios({
      url: `${API_MODULE}/whispering/node/indexs`,
      method: 'PUT',
      data
    })
  }
})
