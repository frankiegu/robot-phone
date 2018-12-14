import {
  SYSTEM
} from '@/constants'
import Main from '@/pages/Main.vue'
import demoRouter from './demo'
import emsRouter from './ems'
import smsRouter from './sms'
import omsRouter from './oms'
import pamsRouter from './pams'
import camsRouter from './cams'
import loginRouter from './login'

const forgetRouter = {
  path: '/forget',
  name: 'forget',
  meta: {
    pass: true
  },
  component: resolve => {
    require(['@/pages/Forget.vue'], resolve)
  }
}

const page404 = {
  path: '/404',
  name: 'p404',
  meta: {
    title: '页面找不到啦',
    pass: true
  },
  component: resolve => {
    require(['@/pages/404.vue'], resolve)
  }
}

// home 页面 -> 跳转不同系统
// export const otherRouter = {
//   path: '/',
//   name: 'home',
//   redirect: '/home',
//   icon: 'icon-nav-home',
//   meta: { pass: true },
//   component: Main,
//   children: [{
//     path: 'home',
//     name: 'homeIndex',
//     icon: 'icon-nav-home',
//     title: '首页',
//     meta: { pass: true },
//     component: resolve => {
//       require(['@/pages/ems/home/Home.vue'], resolve)
//     }
//   }]
// }

// 作为 Main 组件的子页面，并且为左侧菜单的路由
export const appRouter = {
  [SYSTEM.ADMIN_TYPE_SMS_SHORT]: smsRouter,
  [SYSTEM.ADMIN_TYPE_OMS_SHORT]: omsRouter,
  [SYSTEM.ADMIN_TYPE_PAMS_SHORT]: pamsRouter,
  [SYSTEM.ADMIN_TYPE_CAMS_SHORT]: camsRouter,
  [SYSTEM.ADMIN_TYPE_EMS_SHORT]: emsRouter,
  [SYSTEM.ADMIN_TYPE_STAFF_SHORT]: emsRouter
}
export const routers = [
  ...demoRouter,
  ...emsRouter,
  ...smsRouter,
  ...omsRouter,
  ...pamsRouter,
  ...camsRouter,
  ...loginRouter,
  forgetRouter,
  // otherRouter,
  ...appRouter,
  page404
]
