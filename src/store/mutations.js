/**
 * https://vuex.vuejs.org/zh-cn/mutations.html
 */

import Cookies from 'js-cookie'
import Util from '@/util/util'
import {
  appRouter
} from '@/router/router'
import * as types from './mutations-types'
import * as loginTypes from '@/router/login/types'
import {
  SYSTEM
} from '@/constants'
import {
  lastLoginAccountLocal,
  systemLocal
} from '@/storage/local'
import {
  protocolSession
} from '@/storage/session'

// 用户信息缓存天数
const expiresDays = 7

const mutations = {
  // 初始化用户信息
  [types.INIT_USER](state) {
    const user = Cookies.getJSON('user')
    if (user) {
      state.userId = user.id
      state.userName = user.name
      state.userAvatar = user.headUrl
      state.userType = user.type
      state.userMacKey = user.mac_key
      state.system = user.type
      state.platformLogo = user.platformLogo
      state.platformName = user.platformName
    }
    state.Local = systemLocal.getOrDefault()
  },
  [types.FETCH_USER](state, user) {
    const cachedUser = Cookies.getJSON('user')
    const newUser = Object.assign({}, cachedUser, user)
    state.userId = newUser.id
    state.userName = newUser.name
    state.userAvatar = newUser.headUrl
    state.userType = newUser.type
    state.userMacKey = newUser.macKey
    state.platformLogo = newUser.platformLogo
    state.platformName = newUser.platformName
    localStorage['menus'] = user.menus.join(',')
  },
  // 登录后缓存用户 cookies 信息
  [types.LOGIN](state, obj) {
    const {
      vm,
      user,
      system
    } = obj
    Cookies.set('user', {
      id: user.id,
      name: user.name,
      headUrl: user.headUrl,
      type: user.type,
      macKey: user.macKey,
      loginRouter: user.loginRouter,
      platformLogo: user.platformLogo,
      platformName: user.platformName
    }, {
      expires: expiresDays
    })
    systemLocal.set(system)
    // 分system缓存用户名
    lastLoginAccountLocal.setBySystem(user.account)
    localStorage['menus'] = user.menus.join(',')
    // 清除打开的 tag 和 page 数据
    sessionStorage.pageOpenedNames = JSON.stringify([Util.currentPageName(system)])
    sessionStorage.pageOpenedList = JSON.stringify(Util.pageOpenedList(system))
    sessionStorage.currentPageName = Util.currentPageName(system)
    // 设置系统中需要的用户信息
    state.userId = user.id
    state.userName = user.name
    state.userAvatar = user.headUrl
    state.userType = user.type
    state.platformLogo = user.platformLogo
    state.platformName = user.platformName
    state.system = system
    // 路由跳转
    vm.$router.push({
      name: Util.shortFix(system) + 'HomeIndex'
    })
  },
  // 退出登录清除用户 cookies 信息
  [types.LOGOUT](state, vm) {
    const user = Cookies.getJSON('user')
    Cookies.remove('user')
    state.userId = ''
    state.userName = ''
    state.userAvatar = ''
    // 清除打开的 tag 和 page 数据
    sessionStorage.pageOpenedNames = ''
    sessionStorage.pageOpenedList = ''
    sessionStorage.currentPageName = ''
    localStorage.menus = ''
    protocolSession.remove()
    // 路由跳转
    vm.$router.push({
      name: user && user.loginRouter || loginTypes.LOGIN
    })
  },
  [types.UPDATE_MENU_LIST](state) {
    // 获取左侧菜单数据
    let menuList = []
    let routers = appRouter[Util.shorts[state.system]] || []
    menuList.push(routers[0].children[0])
    const l = routers.length
    for (let i = 1; i < l; i++) {
      const item = routers[i]
      const len = menuList.push(item)
      let childrenArr = item.children
      if (childrenArr === undefined || childrenArr.length === 0) {
        menuList.splice(len - 1, 1)
      } else {
        let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]))
        handledItem.children = childrenArr
        menuList.splice(len - 1, 1, handledItem)
      }
    }
    menuList.map((item) => {
      return Object.assign(item, {selected: false})
    })
    state.menuList = menuList
  },
  // 初始化需要打开 tag 的二级菜单
  [types.UPDATE_SUB_MENU_LIST](state) {
    let tagsList = []
    const list = appRouter[Util.shorts[state.system]] || []
    const l = list.length
    for (let i = 1; i < l; i++) {
      const item = list[i]
      if (item.children) {
        if (item.children.length <= 1) {
          tagsList.push(item.children[0])
        } else {
          tagsList.push(...item.children)
        }
      }
    }
    state.subMenuList = tagsList
  },
  // 初始化已打开的页面标签
  [types.INIT_CACHED_PAGE_NAMES](state) {
    const system = localStorage.system
    if (sessionStorage.pageOpenedNames) {
      state.pageOpenedNames = sessionStorage.pageOpenedNames ? JSON.parse(sessionStorage.pageOpenedNames) : [Util.currentPageName(system)]
    }
  },
  // 初始化已打开的页面
  [types.INIT_CACHED_PAGE_LIST](state) {
    const system = localStorage.system
    state.pageOpenedList = sessionStorage.pageOpenedList ? JSON.parse(sessionStorage.pageOpenedList) : Util.pageOpenedList(system)
  },
  // 初始化当前打开的页面
  [types.INIT_CACHED_CUR_PAGE](state, vm) {
    const system = localStorage.system
    state.currentPageName = sessionStorage.currentPageName ? sessionStorage.currentPageName : Util.currentPageName(system)
    // 跳转到当前页面
    vm.$router.push({
      name: state.currentPageName
    })
  },
  // 添加新页面和标签
  [types.INCREASE_PAGE_AND_TAG](state, pageObj) {
    state.pageOpenedNames.push(pageObj.name)
    sessionStorage.pageOpenedNames = JSON.stringify(state.pageOpenedNames)
    state.pageOpenedList.push(pageObj)
    sessionStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
  },
  // 关闭标签
  [types.CLOSE_TAG_AND_PAGE](state, name) {
    state.pageOpenedNames.forEach((item, index) => {
      if (item === name) {
        state.pageOpenedNames.splice(index, 1)
      }
    })
    sessionStorage.pageOpenedNames = JSON.stringify(state.pageOpenedNames)

    state.pageOpenedList.map((item, index) => {
      if (item.name === name) {
        state.pageOpenedList.splice(index, 1)
      }
    })
    sessionStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
  },
  // 关闭页面
  [types.CLOSE_PAGE](state, name) {
    state.pageOpenedList.map((item, index) => {
      if (item.name === name) {
        state.pageOpenedList.splice(index, 1)
      }
    })
    sessionStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
  },
  [types.SET_CURRENT_PAGE_NAME](state, name) {
    state.currentPageName = name
    sessionStorage.currentPageName = name
  },
  // 一个已打开页面的 open 操作
  [types.OPEN_PAGE](state, get) {
    let openedPage = state.pageOpenedList[get.index]
    if (get.argu) {
      openedPage.argu = get.argu
    }
    if (get.query) {
      openedPage.query = get.query
    }
    state.pageOpenedList.splice(get.index, 1, openedPage)
    sessionStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
  }
}

export default mutations
