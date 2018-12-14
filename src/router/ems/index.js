import Main from '@/pages/Main.vue'
const ROUTER_MODULE = '/ems'

export default [{
  path: `${ROUTER_MODULE}/`,
  redirect: '/home',
  icon: 'icon-nav-home',
  meta: {
    pass: true
  },
  component: Main,
  children: [{
    path: 'home',
    name: 'emsHomeIndex',
    icon: 'icon-nav-home',
    title: '首页',
    meta: {
      pass: true
    },
    component: resolve => {
      require(['@/pages/ems/home/Home.vue'], resolve)
    }
  }, {
    path: 'person',
    name: 'emsPersonSetting',
    meta: {
      pass: true
    },
    components: {
      person: resolve => {
        require(['@/pages/ems/home/Person.vue'], resolve)
      }
    }
  }]
}, {
  path: `${ROUTER_MODULE}/marketing`,
  name: 'marketing',
  icon: 'icon-nav-marketing', // 自定义的图标
  meta: {
    id: '89'
  },
  title: 'AI外呼', // 自定义的 tab 标题
  component: Main,
  children: [{
    path: 'task',
    name: 'marketingTask',
    title: '任务管理',
    meta: {
      id: '95'
    },
    // inline: true, // 不在左侧菜单显现
    component: resolve => {
      require(['@/pages/ems/marketing/Task.vue'], resolve)
    }
  }, {
    path: 'call',
    name: 'marketingCall',
    title: '呼叫记录',
    meta: {
      id: '98'
    },
    component: resolve => {
      require(['@/pages/ems/marketing/Call.vue'], resolve)
    }
  }, {
    path: 'seat',
    name: 'robotSeat',
    title: 'AI坐席',
    meta: {
      id: '101'
    },
    component: resolve => {
      require(['@/pages/ems/seat/robot.vue'], resolve)
    }
  }]
}, {
  path: `${ROUTER_MODULE}/whispering`,
  name: 'whispering',
  icon: 'icon-nav-marketing',
  meta: {
    id: '196'
  },
  title: '话术管理',
  component: Main,
  children: [{
    path: 'index',
    name: 'whisperingIndex',
    title: '话术列表',
    meta: {
      id: '197'
    },
    component: resolve => {
      require(['@/pages/ems/whispering/index'], resolve)
    }
  }, {
    path: 'new',
    name: 'whisperingNewIndex',
    title: '新话术列表',
    meta: {
      id: '205'
    },
    component: resolve => {
      require(['@/pages/ems/whisperingNew/index'], resolve)
    }
  }]
}, {
  path: `${ROUTER_MODULE}/client`,
  name: 'client',
  icon: 'icon-nav-customer',
  title: '客户中心',
  meta: {
    id: '90'
  },
  component: Main,
  children: [{
    path: 'manager',
    name: 'clientManager',
    title: '客户管理',
    meta: {
      id: '99'
    },
    component: resolve => {
      require(['@/pages/ems/client/Manager.vue'], resolve)
    }
  }, {
    path: 'mine',
    name: 'clientMine',
    title: '我的客户',
    meta: {
      id: '100'
    },
    component: resolve => {
      require(['@/pages/ems/client/Mine.vue'], resolve)
    }
  }, {
    path: 'white',
    name: 'userWhite',
    title: '黑名单',
    meta: {
      id: '193'
    },
    component: resolve => {
      require(['@/pages/ems/client/userWhite'], resolve)
    }
  }, {
    path: 'call_log',
    name: 'callLog',
    title: '呼叫记录',
    meta: {
      id: '201'
    },
    component: resolve => {
      require(['@/pages/ems/client/CallLog.vue'], resolve)
    }
  }]
},

  // {
  //   path: `${ROUTER_MODULE}/robot`,
  //   name: 'robot',
  //   icon: 'icon-nav-robot',
  //   title: '机器坐席管理',
  //   meta: {
  //     id: '91'
  //   },
  //   component: Main,
  //   children: [{
  //     path: 'seat',
  //     name: 'robotSeat',
  //     title: '机器坐席',
  //     meta: {
  //       id: '101'
  //     },
  //     component: resolve => {
  //       require(['@/pages/ems/seat/robot.vue'], resolve)
  //     }
  //   }]
  // },

{
  path: `${ROUTER_MODULE}/manual`,
  name: 'manual',
  icon: 'icon-nav-robot',
  title: '人工坐席管理',
  meta: {
    id: '92'
  },
  component: Main,
  children: [{
    path: 'seat',
    name: 'manualSeat',
    title: '人工坐席',
    meta: {
      id: '103'
    },
    component: resolve => {
      require(['@/pages/ems/seat/manual.vue'], resolve)
    }
  }]
}, {
  path: `${ROUTER_MODULE}/fix`,
  name: 'fix',
  icon: 'icon-nav-robot',
  title: '智能坐席',
  meta: {
    id: '194'
  },
  component: Main,
  children: [{
    path: 'seat',
    name: 'fixSeat',
    title: '智能接待',
    meta: {
      id: '195'
    },
    component: resolve => {
      require(['@/pages/ems/seat/fix.vue'], resolve)
    }
  }]
}, {
  path: `${ROUTER_MODULE}/relayLine`,
  name: 'relayLine',
  icon: 'icon-nav-robot',
  title: '中继线计费',
  meta: {
    id: '207'
  },
  component: Main,
  children: [{
    path: 'relayLineCount',
    name: 'relayLineCount',
    title: '中继线管理',
    meta: {
      id: '208'
    },
    component: resolve => {
      require(['@/pages/ems/relayLine/index.vue'], resolve)
    }
  }]
}, {
  path: `${ROUTER_MODULE}/seller`,
  name: 'seller',
  icon: 'icon-nav-account',
  title: '团队管理',
  meta: {
    id: '93'
  },
  component: Main,
  children: [{
    path: 'manager',
    name: 'sellerManager',
    title: '团队管理',
    meta: {
      id: '105'
    },
    component: resolve => {
      require(['@/pages/ems/seller/Manager.vue'], resolve)
    }
  }
    //  {
    //   path: 'wx',
    //   name: 'wxManager',
    //   title: '绑定微信推送',
    //   meta: {
    //     id: '192'
    //   },
    //   component: resolve => {
    //     require(['@/pages/ems/wx/index.vue'], resolve)
    //   }
    // }
  ]
}, {
  path: `${ROUTER_MODULE}/setting`,
  name: 'setting',
  icon: 'icon-nav-setting',
  title: '系统设置',
  meta: {
    id: '94'
  },
  component: Main,
  children: [
    //   {
    //   path: 'keyword',
    //   name: 'keyword',
    //   title: '关键字管理',
    //   meta: { id: '107' },
    //   component: resolve => {
    //     require(['@/pages/ems/setting/Keyword.vue'], resolve)
    //   }
    // }, {
    //   path: 'study',
    //   name: 'study',
    //   title: '学习管理',
    //   meta: { id: '108' },
    //   component: resolve => {
    //     require(['@/pages/ems/setting/Study.vue'], resolve)
    //   }
    // },
    {
      path: 'message',
      name: 'emsMessage',
      title: '短信模板管理',
      meta: {
        id: '190'
      },
      component: resolve => {
        require(['@/pages/ems/setting/message'], resolve)
      }
    },
    {
      path: 'time',
      name: 'emsTime',
      title: '时间模板管理',
      meta: {
        id: '109'
      },
      component: resolve => {
        require(['@/pages/ems/setting/time'], resolve)
      }
    }, {
      path: 'time/edit/:templateId',
      name: 'emsTimeEdit',
      title: '时间模板编辑',
      inline: true,
      meta: {
        pass: true
      },
      component: resolve => {
        require(['@/pages/ems/setting/time/new.vue'], resolve)
      }
    }, {
      path: 'time/add',
      name: 'emsTimeAdd',
      title: '时间模板新增',
      inline: true,
      meta: {
        pass: true
      },
      component: resolve => {
        require(['@/pages/ems/setting/time/new.vue'], resolve)
      }
    }, {
      path: 'tag',
      name: 'tag',
      title: '客户标签管理',
      meta: {
        id: '110'
      },
      component: resolve => {
        require(['@/pages/ems/setting/tag/index.vue'], resolve)
      }
    }, {
      path: 'tag/add',
      name: 'emsTagAdd',
      title: '客户标签管理',
      inline: true,
      meta: {
        pass: true
      },
      component: resolve => {
        require(['@/pages/ems/setting/tag/new.vue'], resolve)
      }
    }, {
      path: 'tag/edit/:labelId',
      name: 'emsTagEdit',
      title: '客户标签管理',
      inline: true,
      meta: {
        pass: true
      },
      component: resolve => {
        require(['@/pages/ems/setting/tag/new.vue'], resolve)
      }
    }, {
      path: 'notice',
      name: 'myNotice',
      title: '我的消息',
      meta: {
        id: '188'
      },
      component: resolve => {
        require(['@/pages/ems/setting/notice/index'], resolve)
      }
    }, {
      path: 'log',
      name: 'log',
      title: '操作日志',
      meta: {
        id: '189'
      },
      component: resolve => {
        require(['@/pages/ems/setting/log'], resolve)
      }
    }
  ]
}
]
