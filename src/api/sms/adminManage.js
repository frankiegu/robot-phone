// adminiManageController : 管理员管理相关接口

import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootSms
} from '@/config'
import {
  removeEmpty
} from '@/util'


const API_MODULE = `${apiRootSms}/${apiVersion}`

export default Object.assign(extendBaseApi('super_user', API_MODULE), {
  /**
   * 获取 接口
   * http://121.40.216.49:50888/superManager-business/swagger-ui.html#/SuperUserController
   * @param {*} params
   */
  
  /*
  获取菜单列表
  */
  getMenuList(id) {
    return axios({
      url: `${API_MODULE}/super_user/${id}/menu`,
      method: 'GET',
    })
  },
  
  /**
   * 分配管理员菜单
   */
  allotAminManage(params) {
    return axios({
      url: `${API_MODULE}/super_user/allotMenu`,
      method: 'PUT',
      params
    })
  },

})