import Main from '@/pages/Main.vue'
import * as types from './types'
// id: [132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145,
// 146, 147, 148, 149, 186, 187]

const ROUTER_MODULE = '/oms'
export default [{
  path: `${ROUTER_MODULE}/`,
  // name: 'omsHome',
  redirect: '/home',
  icon: 'icon-nav-home',
  meta: {
    pass: true
  },
  component: Main,
  children: [{
    path: 'home',
    name: 'omsHomeIndex',
    icon: 'icon-nav-home',
    title: '首页',
    meta: {
      title: '首页',
      pass: true
    },
    component: resolve => {
      require(['@/pages/oms/home/Home.vue'], resolve)
    }
  }, {
    path: 'person',
    name: 'omsPersonSetting',
    meta: {
      pass: true
    },
    components: {
      person: resolve => {
        require(['@/pages/oms/home/Person.vue'], resolve)
      }
    }
  }]
}, {
  path: `${ROUTER_MODULE}`,
  icon: 'icon-nav-home',
  meta: {
    id: '136'
  },
  title: '系统消息',
  component: Main,
  children: [{
    path: `notice_info`,
    name: types.NOTICE_INFO,
    meta: {
      title: '系统消息',
      id: '143'
    },
    title: '系统消息',
    component: resolve => require(['@/pages/oms/noticeInfo'], resolve)
  }]
}, {
  path: `${ROUTER_MODULE}/setting`,
  icon: 'icon-nav-home',
  meta: {
    id: '137'
  },
  title: '系统设置',
  component: Main,
  children: [{
    path: 'param',
    name: types.SETTING_PARAM,
    title: '系统参数',
    meta: {
      id: '144'
    },
    component: resolve => require(['@/pages/oms/setting/param'], resolve)
  }, {
    path: 'city',
    name: types.SETTING_CITY,
    title: '城市管理',
    meta: {
      id: '145'
    },
    component: resolve => require(['@/pages/oms/setting/city'], resolve)
  }, {
    path: 'city_level',
    name: types.SETTING_CITY_LEVEL,
    title: '城市等级管理',
    meta: {
      id: '146'
    },
    component: resolve => require(['@/pages/oms/setting/cityLevel'], resolve)
  }]
}, {
  path: `${ROUTER_MODULE}/provinceProxy`,
  icon: 'icon-nav-home',
  meta: {
    id: '132'
  },
  title: '省代管理',
  component: Main,
  children: [{
    path: 'baseInfo',
    name: 'omsProvinceProxy',
    title: '省代管理',
    meta: {
      // pass: true,
      id: '147'
    },
    component: resolve => require(['@/pages/oms/provinceProxy/index'], resolve)
  }]
},

  // {
  //   path : `${ROUTER_MODULE}/provinceProxy`,
  //   icon : 'icon-nav-home',
  //   meta : {
  //     id: '132',
  //     pass: true
  //   },
  //   name : 'omsProvinceProxy',
  //   title : '省代管理',
  //   component : resolve => require(['@/pages/oms/provinceProxy/index'], resolve)
  // },

{
  path: `${ROUTER_MODULE}/cityProxy`,
  icon: 'icon-nav-home',
  meta: {
    id: '133'
  },
  title: '市代管理',
  component: Main,
  children: [{
    path: 'baseInfo',
    name: types.CITY_PROXY_BASE,
    title: '市级代理',
    meta: {
      // pass: true,
      id: '138'
    },
    component: resolve => require(['@/pages/oms/cityProxy/index'], resolve)
  }]
}, {
  path: `${ROUTER_MODULE}/firm`,
  icon: 'icon-nav-home',
  meta: {
    id: '134'
  },
  title: '企业管理',
  component: Main,
  children: [{
    path: 'baseInfo',
    name: 'firmBaseInfo',
    title: '企业管理',
    meta: {
      // pass: true,
      id: '140'
    },
    component: resolve => require(['@/pages/oms/firm/index'], resolve)
  }]
}, {
  path: `${ROUTER_MODULE}/seat`,
  icon: 'icon-nav-home',
  meta: {
    id: '135'
  },
  title: '坐席管理',
  component: Main,
  children: [{
    path: 'baseInfo',
    name: 'seatBaseInfo',
    title: '坐席管理',
    meta: {
      // pass: true,
      id: '142'
    },
    component: resolve => require(['@/pages/oms/seat/index'], resolve)
  }]
}, {
  path: `${ROUTER_MODULE}/standard`,
  icon: 'icon-nav-home',
  meta: {
    id: '139'
  },
  title: '指标管理',
  component: Main,
  children: [{
    path: 'year',
    name: types.CITY_PROXY_YEAR,
    title: '年度达标代理',
    meta: {
      // pass: true,
      id: '186'
    },
    component: resolve => require(['@/pages/oms/cityProxy/yearIndicator'], resolve)
  }, {
    path: 'month',
    name: types.CITY_PROXY_MONTH,
    title: '季度达标代理',
    meta: {
      // pass: true,
      id: '187'
    },
    component: resolve => require(['@/pages/oms/cityProxy/quarterIndicator'], resolve)
  }]
}
]
