/* eslint-disable brace-style */
import Vue from 'vue'
import VueRouter from 'vue-router'
import iView from 'iview'
import {
  Message as iviewMessage
} from 'iview'
import Cookies from 'js-cookie'
import Util from '@/util/util'
import {
  isDev
} from "@/config"
import * as loginTypes from './login/types'
import {
  routers
} from './router'
import * as mutationTypes from '../store/mutations-types'
import {
  mapMutations
} from 'vuex'

Vue.use(VueRouter)

const RouterConfig = {
  // mode: 'history', // https://router.vuejs.org/zh-cn/essentials/history-mode.html
  routes: routers
}
const router = new VueRouter(RouterConfig)

/**
 * 指向的路由名称是否为登录页
 * @param {*} name
 */
let isLoginName = name => {
  return Object.keys(loginTypes).some(key => loginTypes[key] === name)
}

router.beforeEach((to, from, next) => {
  const {
    id,
    pass
  } = to.meta
  const menus = localStorage.menus

  // demo 页面放行
  if (/^\/demo/.test(to.fullPath)) {
    next()
    return
  }

  // 开发环境放行
  // if (isDev) {
  //   next()
  //   return
  // }

  let user = Cookies.get('user')
  // 用户已登录
  if (user) {
    // 强制允许通过
    if (pass) {
      return next()
    }

    let redirectToSystemHome = () => {
      const system = localStorage.getItem('system')
      return next({
        name: Util.currentPageName(system)
      })
    }

    // 重定向到对应后台的首页
    // 1、前往的是登录页

    if (isLoginName(to.name)) {
      return redirectToSystemHome()
    }
    // 2、用户没有目标页面的菜单权限
    if (menus && menus.split(',').indexOf(id) === -1) {
      iviewMessage.warning({
        content: '没有当前菜单权限',
        duration: 8,
        closable: true
      })
      return redirectToSystemHome()
    }
  }
  // 用户未登录
  else {
    // 前往的不是登录页|找回密码页面，重定向到登录
    if (!isLoginName(to.name) && to.name !== 'forget') {
      return next({
        name: loginTypes.LOGIN
      })
    }
  }

  iView.LoadingBar.start()
  next()

  // if (!Cookies.get('user') && !isLoginName(to.name) && to.name !== 'forget') {
  //   // 用户未登录，且前往的不是登录页|找回密码页面
  //   next({
  //     name: loginTypes.LOGIN
  //   })
  // } else if (Cookies.get('user') && isLoginName(to.name)) {
  //   // 用户已登录，且前往的是登录页
  //   const system = localStorage.getItem('system')
  //   next({
  //     name: Util.currentPageName[system]
  //   })
  // } else if (!pass && menus && menus.split(',').indexOf(id) === -1) {
  //   // Util.toDefaultPage([...routers], to.name, router, next)
  //   next({
  //     name: from.name
  //   })
  // } else {
  //   console.log('通过', to.name)
  //   next()
  // }
})

router.afterEach(to => {
  // Util.openNewPage(router.app, to.name, to.params, to.query);
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

// 重定向到登录页
export const redirectToLoign = () => {
  const user = Cookies.getJSON('user')
  Cookies.remove('user')
  router.push({
    // eslint-disable-next-line no-mixed-operators
    name: user && user.loginRouter || loginTypes.LOGIN
  })
}

export default router
