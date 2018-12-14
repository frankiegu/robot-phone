import Util from '@/util/util'

const state = {
  system: '', // 当前系统类型
  menuList: [],
  subMenuList: [], // 点击后打开 tag 的二级菜单
  // routers: [
  //   ...appRouter
  // ],
  pageOpenedNames: [],
  pageOpenedList: [],
  currentPageName: '',
  // 系统中需要用到的用户信息
  userId: '',
  userName: '',
  userAvatar: '',
  userType: '',
  userMacKey: '',
  platformLogo: '',
  platformName: ''
}

export default state
