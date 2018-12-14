// AdminInfoController : 企业管理员相关

import axios from 'axios'
import extendBaseApi from '../base'
import {
  apiVersion,
  apiRootEms
} from '@/config'

const API_MODULE = `${apiRootEms}/${apiVersion}`

export default Object.assign(extendBaseApi('admin_info', API_MODULE), {
  /**
   * 企业管理员登录
   *  account
   *  password
   *  admin_type 帐号类型：1超级管理 2管理员 3省级代理商 4市级代理 5企业 6员工
   *  [ sms 超级管理后台
        oms 运营管理后台
        pams 省代管理后台
        cams 市代管理后台
        ems 企业管理后台 ]
  *  login_type 登录类型 1帐号登录 2手机登录
  */
  login(obj) {
    const params = {
      account: obj.account,
      password: obj.password,
      admin_type: obj.admin_type,
      login_type: 1
    }
    return axios({
      url: `${API_MODULE}/admin_info/login`,
      params
    })
  },

  /**
   * 获取企业管理员详情
   * [heaer: mac_key]
   */
  getAdminInfo() {
    return axios({
      url: `${API_MODULE}/admin_info`
    })
  },

  /**
   * 新增企业管理员
   */
  addAdmin(data) {
    return axios({
      url: `${API_MODULE}/admin_info`,
      method: 'POST',
      data
    })
  },

  /**
   * 编辑企业管理员 TODO
   */
  updateAdmin(data) {
    return axios({
      url: `${API_MODULE}/admin_info`,
      method: 'PUT',
      data
    })
  },

  /**
   * 发送短信
   */
  sendMsg(mobile) {
    return axios({
      url: `${API_MODULE}/sendmessage/${mobile}`,
      method: 'POST'
    })
  },

  /**
   * 重置密码 TODO
   */
  resetPwd(data) {
    return axios({
      url: `${API_MODULE}/`,
      method: 'POST',
      data
    })
  },

  /**
   * 修改密码
   * {
        "old_password": "string",
        "password": "string"
      }
   */
  updatePwd(data) {
    return axios({
      url: `${API_MODULE}/admin_info/updatePwd`,
      method: 'POST',
      data
    })
  },

    /**
   * 修改讯飞key
   * {
       ifly_asr_key:string
      }
   */
  updateIflyKey(data) {
    return axios({
      url: `${API_MODULE}/admin_info/updateIflyKey`,
      method: 'PUT',
      data
    })
  },

  /**
   * 修改手机号
   * {
        "mobile": "string",
        "msg_code": "string",
        "password": "string"
      }
   */
  updateMobile(data) {
    return axios({
      url: `${API_MODULE}/admin_info/updateMobile`,
      method: 'POST',
      data
    })
  }
})
