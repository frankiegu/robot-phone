import Main from '@/pages/Main.vue'
import * as types from './types'

const ROUTER_MODULE = '/cams'
export default [{
  path: `${ROUTER_MODULE}/`,
  name: 'camsHome',
  redirect: '/home',
  icon: 'icon-nav-home',
  meta: {
    pass: true
  },
  component: Main,
  children: [{
    path: 'home',
    name: 'camsHomeIndex',
    icon: '#icon-home',
    title: '首页',
    meta: {
      pass: true
    },
    component: resolve => {
      require(['@/pages/cams/home/Home.vue'], resolve)
    }
  }, {
    path: 'person',
    name: 'camsPersonSetting',
    meta: {
      pass: true
    },
    components: {
      person: resolve => {
        require(['@/pages/cams/home/Person.vue'], resolve)
      }
    }
  }]
},
{
  path: `${ROUTER_MODULE}/seat`,
  name: 'camsSeat',
  icon: '#icon-dianhuaji', // 自定义的图标
  meta: {
    id: '112'
  },
  title: '坐席管理', // 自定义的 tab 标题
  component: Main,
  children: [{
    path: 'manage',
    name: 'camsSeatManage',
    title: '坐席列表',
    meta: {
      id: '117'
    },
    component: r => {
      require(['@/pages/cams/seat'], r)
    }
  },
  {
    path: 'apply',
    name: 'camsSeatApply',
    title: '坐席申请列表',
    meta: {
      id: '118'
    },
    component: r => {
      require(['@/pages/cams/seat/apply'], r)
    }
  }]
},
{
  path: `${ROUTER_MODULE}/firm`,
  name: 'camsFirm',
  icon: 'icon-nav-marketing', // 自定义的图标
  meta: {
    id: '113'
  },
  title: '企业管理', // 自定义的 tab 标题
  component: Main,
  children: [{
    path: 'manage',
    name: 'camsFirmManage',
    title: '企业管理',
    meta: {
      id: '119'
    },
    // inline: true, // 不在左侧菜单显现
    component: r => {
      require(['@/pages/cams/firm'], r)
    }
  }]
},
// {
//   path: `${ROUTER_MODULE}`,
//   icon: 'icon-nav-marketing',
//   meta: {
//     id: '114'
//   },
//   title: '端口管理',
//   component: Main,
//   children: [{
//     path: `port`,
//     name: types.PORT,
//     meta: {
//       id: '121'
//     },
//     title: '端口管理',
//     component: resolve => require(['@/pages/cams/port'], resolve),
//   }]
// },
{
  path: `${ROUTER_MODULE}`,
  icon: '#icon-caiwu',
  meta: {
    id: '115'
  },
  title: '财务统计',
  component: Main,
  children: [{
    path: `finance`,
    name: types.FINANCE,
    meta: {
      id: '122'
    },
    title: '财务统计',
    component: resolve => require(['@/pages/cams/finance'], resolve)
  }]
}, {
  path: `${ROUTER_MODULE}/setting`,
  icon: '#icon-xitong',
  meta: {
    id: '116'
  },
  title: '系统设置',
  component: Main,
  children: [{
    path: 'notice_info',
    name: types.SETTING_NOTICE_INFO,
    title: '我的消息',
    meta: {
      id: '184'
    },
    component: resolve => require(['@/pages/cams/setting/noticeInfo'], resolve)
  }, {
    path: 'log',
    name: types.SETTING_LOG,
    title: '操作日志',
    meta: {
      id: '185'
    },
    component: resolve => require(['@/pages/cams/setting/log'], resolve)
  }]
}]
