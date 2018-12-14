import axios from 'axios'
import {
  apiVersion,
  apiRootCommon
} from '@/config'

const API_MODULE = `${apiRootCommon}/${apiVersion}`
// 企业管理员相关
// http://121.40.216.49:50999/common-business/swagger-ui.html#/AdminInfoController
export default {
  /**
   * 获取企业管理员详情
   * http://121.40.216.49:50999/common-business/swagger-ui.html#!/AdminInfoController/getDetailUsingGET
   */
  getAdminInfo() {
    return axios({
      url: `${API_MODULE}/admin_info`,
      method: 'GET',
      responseType: 'json'
    })
  },
  /**
   * 登录
   * http://121.40.216.49:50999/common-business/swagger-ui.html#!/AdminInfoController/loginUsingGET
   * @param {*} params
   */
  login(params, options) {
    return axios(Object.assign({
      url: `${API_MODULE}/admin_info/login`,
      method: 'GET',
      params,
      responseType: 'json'
    }, options))
  },
  /**
   * 修改绑定手机
   * http://121.40.216.49:50999/common-business/swagger-ui.html#!/AdminInfoController/updateMobileUsingPOST
   * @param {*} data
   */
  updateMobile(data) {
    return axios({
      url: `${API_MODULE}/admin_info/updateMobile`,
      method: 'POST',
      data
    })
  },
  /**
   * 修改密码
   * http://121.40.216.49:50999/common-business/swagger-ui.html#!/AdminInfoController/updatePwdUsingPOST
   * @param {*} data
   */
  updatePwd(data) {
    return axios({
      url: `${API_MODULE}/admin_info/updatePwd`,
      method: 'POST',
      data
    })
  },
  
  /**
   * 发送短信
   * http://121.40.216.49:50999/common-business/swagger-ui.html#!/AdminInfoController/sendMessageUsingPOST
   * @param {*} mobile
   */
  sendMsg(mobile) {
    return axios({
      url: `${API_MODULE}/sendmessage/${mobile}`,
      method: 'POST'
    })
  },
  /**
   * 获取七牛token
   * http://121.40.216.49:50999/common-business/swagger-ui.html#!/AdminInfoController/getQiniuTokenUsingGET
   * @param {*} type
   */
  getQiniuToken(type = 1) {
    return axios({
      url: `${API_MODULE}/common/${type}/qiniu_token`,
      method: 'GET',
      responseType: 'json'
    })
  },
  findPwd(data) {
    return axios({
      url: `${API_MODULE}/admin_info/findPwd`,
      method: 'POST',
      data
    })
  },
  /**
   * 秘钥
   * http://121.40.216.49:50999/common-business/swagger-ui.html#!/AdminInfoController/rsaUsingGET
   */
  getSecret() {
    return axios({
      url: `${API_MODULE}/admin_info/secret`,
      method: 'GET',
      responseType: 'json'
    })
  },
  /**
   * 获取运营商列表
   * http://121.40.216.49:50999/common-business/swagger-ui.html#!/AdminInfoController/getOperatorPageUsingGET
   * @param {*} params
   */
  listOperator(params) {
    return axios({
      url: `${API_MODULE}/select/operator`,
      method: 'GET',
      responseType: 'json',
      params,
      removeEmpty: true
    })
  },
  /**
   * 获取企业列表
   * http://121.40.216.49:50999/common-business/swagger-ui.html#!/AdminInfoController/getFirmPageUsingGET
   * @param {*} params
   */
  listFirm(params) {
    return axios({
      url: `${API_MODULE}/select/firm`,
      method: 'GET',
      responseType: 'json',
      params,
      removeEmpty: true
    })
  },
  /**
   * 修改头像
   * http://121.40.216.49:50999/common-business/swagger-ui.html#!/AdminInfoController/getFirmPageUsingPUT
   * @param {*} data
   */
  updateHeadImg(data) {
    return axios({
      url: `${API_MODULE}/admin_info/updateHeadImg`,
      method: 'PUT',
      data
    })
  }
}
