import * as types from './types'

export default [{
  path: '/login',
  name: types.LOGIN,
  // meta: {
  //   pass: true
  // },
  component: resolve => require(['@/pages/login/index'], resolve)
}, {
  path: '/ems/login',
  name: types.LOGIN_EMS,
  // meta: {
  //   pass: true
  // },
  component: resolve => require(['@/pages/login/emsLogin'], resolve)
}, {
  path: '/sms/login',
  name: types.LOGIN_SMS,
  // meta: {
  //   pass: true
  // },
  component: resolve => require(['@/pages/login/smsLogin'], resolve)
}, {
  path: '/oms/login',
  name: types.LOGIN_OMS,
  // meta: {
  //   pass: true
  // },
  component: resolve => require(['@/pages/login/omsLogin'], resolve)
}, {
  path: '/pams/login',
  name: types.LOGIN_PAMS,
  // meta: {
  //   pass: true
  // },
  component: resolve => require(['@/pages/login/pamsLogin'], resolve)
}, {
  path: '/cams/login',
  name: types.LOGIN_CAMS,
  // meta: {
  //   pass: true
  // },
  component: resolve => require(['@/pages/login/camsLogin'], resolve)
}, {
  path: '/staff/login',
  name: types.LOGIN_STAFF,
  // meta: {
  //   pass: true
  // },
  component: resolve => require(['@/pages/login/staffLogin'], resolve)
}]
