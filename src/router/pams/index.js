import Main from '@/pages/Main.vue'
import * as types from './types'

const ROUTER_MODULE = '/pams'
export default [{
  path: `${ROUTER_MODULE}/`,
  name: 'pamsHome',
  redirect: '/home',
  icon: 'icon-nav-home',
  meta: {
    pass: true
  },
  component: Main,
  children: [{
    path: 'home',
    name: 'pamsHomeIndex',
    icon: 'icon-nav-home',
    title: '首页',
    meta: {
      pass: true
    },
    component: resolve => {
      require(['@/pages/pams/home/Home.vue'], resolve)
    }
  }, {
    path: 'person',
    name: 'pamsPersonSetting',
    meta: {
      pass: true
    },
    components: {
      person: resolve => {
        require(['@/pages/pams/home/Person.vue'], resolve)
      }
    }
  }]
}, {
  path: `${ROUTER_MODULE}/cityProxy`,
  icon: 'icon-nav-home',
  meta: {id:'123'},
  title: '市级代理管理',
  component: Main,
  children: [{
    path: 'baseInfo',
    name: types.CITY_PROXY_BASE,
    title: '市级代理',
    meta: {
      // pass: true,
      id:'127'
    },
    component: resolve => require(['@/pages/pams/cityProxy/index'], resolve)
  }]
},{
  path: `${ROUTER_MODULE}`,
  icon: 'icon-nav-marketing',
  title: '端口管理',
  component: Main,
  meta: {
    id: '124'
  },
  children: [{
    path: `port`,
    name: types.PORT,
    meta: {
      id: '129'
    },
    title: '端口管理',
    component: resolve => require(['@/pages/pams/port'], resolve),
  }]
}, {
  path: `${ROUTER_MODULE}`,
  icon: 'icon-nav-marketing',
  meta: {
    id: '125'
  },
  title: '财务统计',
  component: Main,
  children: [{
    path: `finance`,
    name: types.FINANCE,
    meta: {
      id: '129'
    },
    title: '财务统计',
    component: resolve => require(['@/pages/pams/finance'], resolve),
  }]
}, {
  path: `${ROUTER_MODULE}/setting`,
  icon: 'icon-nav-marketing',
  meta: {
    id: '126'
  },
  title: '系统设置',
  component: Main,
  children: [{
    path: 'notice_info',
    name: types.SETTING_NOTICE_INFO,
    title: '我的消息',
    meta: {
      id: '130'
    },
    component: resolve => require(['@/pages/pams/setting/noticeInfo'], resolve)
  }, {
    path: 'log',
    name: types.SETTING_LOG,
    title: '操作日志',
    meta: {
      id: '131'
    },
    component: resolve => require(['@/pages/pams/setting/log'], resolve)
  }]
}]
