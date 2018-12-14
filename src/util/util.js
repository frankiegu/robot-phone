import * as types from '@/store/mutations-types'
import {
  SYSTEM
} from '@/constants'

let util = {}

util.titles = SYSTEM.SYSTEM_TITLE_MAP

util.shorts = {
  [SYSTEM.ADMIN_TYPE_SMS]: SYSTEM.ADMIN_TYPE_SMS_SHORT,
  [SYSTEM.ADMIN_TYPE_OMS]: SYSTEM.ADMIN_TYPE_OMS_SHORT,
  [SYSTEM.ADMIN_TYPE_PAMS]: SYSTEM.ADMIN_TYPE_PAMS_SHORT,
  [SYSTEM.ADMIN_TYPE_CAMS]: SYSTEM.ADMIN_TYPE_CAMS_SHORT,
  [SYSTEM.ADMIN_TYPE_EMS]: SYSTEM.ADMIN_TYPE_EMS_SHORT,
  [SYSTEM.ADMIN_TYPE_STAFF]: SYSTEM.ADMIN_TYPE_STAFF_SHORT
}

// 企业员工后台使用企业后台菜单
util.shortFix = system => {
  return Number(system) === SYSTEM.ADMIN_TYPE_STAFF ? SYSTEM.ADMIN_TYPE_EMS_SHORT : util.shorts[Number(system)]
}

util.title = (title) => {
  title = title || 'AI智能电话机器人'
  window.document.title = title
}

// 初始数据
util.pageOpenedList = (system) => [{
  path: 'home',
  title: '首页',
  name: util.shortFix(system) + 'HomeIndex'
}]
util.currentPageName = (system) => util.shortFix(system) + 'HomeIndex'

/**
 * 时间格式转换 ms -> date
 * @param {string} _ms 毫秒数 | 时间格式
 * @param {string} _format yyyy-MM-dd hh:mm:ss
 */
util.msToDate = (_ms, _format) => {
  let ms = _ms
  let format = _format || 'yyyy-MM-dd hh:mm:ss'
  if (!ms) {
    return ''
    // }else if (ms.toString().length === 10) {
    //   ms *= 1000
  }
  const d = new Date(ms)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const seconds = d.getSeconds()

  const addPrefix = source => (source < 10 ? `0${source}` : source)

  format = format.replace('yyyy', year)
    .replace('MM', addPrefix(month))
    .replace('dd', addPrefix(day))
    .replace('hh', addPrefix(hour))
    .replace('mm', addPrefix(minute))
    .replace('ss', addPrefix(seconds))

  return format
}

/**
 * 时间格式化 hh:mm:ss
 * @param {int} time
 */
util.timeFormat = (time) => {
  if (!time) {
    return ''
  }
  time = +time
  let h = Math.floor(time / 3600)
  let m = Math.floor(time % 3600 / 60)
  let s = time % 3600 % 60

  let str = ''
  if (h > 0) {
    str += h + ':'
  }
  m = m < 10 ? '0' + m : m
  str += m + ':'
  s = s < 10 ? '0' + s : s
  str += s
  return str
}

/**
 * 现在的时间
 * @param {string} _format yyyy-MM-dd hh:mm:ss
 */
util.nowToDate = _format => {
  let format = _format
  format = format || 'yyyy-MM-dd hh:mm:ss'
  return util.msToDate(new Date().getTime(), format)
}

/**
 * 路由跳转统一跳转到默认页面
 * 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
 */
util.toDefaultPage = (routers, name, router, next) => {
  let len = routers.length
  let i = 0
  let notHandle = true
  while (i < len) {
    if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
      router.replace({
        name: routers[i].children[0].name
      })
      notHandle = false
      next()
      break
    }
    i++
  }
  if (notHandle) {
    next()
  }
}

/**
 * 返回路由 title
 * @param {Object} 路由对象
 */
util.handleTitle = item => item.title

/**
 * 打开页面
 * 更新已打开页面的 store 数据、缓存列表，更新对应的 tags 数据
 */
util.openPage = (vm, name) => {
  const argu = vm.$route.params || {}
  const query = vm.$route.query || {}
  let pageOpenedList = vm.$store.state.pageOpenedList
  let pageOpenedCount = pageOpenedList.length
  let i = 0
  let isNew = true // 是否为新打开的页面
  while (i < pageOpenedCount) {
    if (name === pageOpenedList[i].name) {
      vm.$store.commit(types.OPEN_PAGE, {
        index: i,
        argu: argu,
        query: query
      })
      isNew = false
      break
    }
    i++
  }
  // 添加一个新的页面 && tag
  if (isNew) {
    const list = vm.$store.state.subMenuList
    const page = list.filter(item => {
      if (item.children) {
        return name === item.children[0].name
      } else {
        return name === item.name
      }
    })

    if (page.length > 0) {
      let pageObj = page[0]
      pageObj = pageObj.children ? pageObj.children[0] : pageObj
      if (argu) {
        pageObj.argu = argu
      }
      if (query) {
        pageObj.query = query
      }
      vm.$store.commit(types.INCREASE_PAGE_AND_TAG, pageObj)
    }
  }
  // reset 当前激活状态的页面名称
  vm.$store.commit(types.SET_CURRENT_PAGE_NAME, name)

  vm.$router.push({
    name: name
  })
}

export default util
