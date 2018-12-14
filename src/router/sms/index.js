import Main from '@/pages/Main.vue'
import * as types from './types'

const ROUTER_MODULE = '/sms'
export default [{
  path: `${ROUTER_MODULE}/`,
  name: 'home',
  redirect: '/home',
  icon: 'icon-nav-home',
  meta: {
    pass: true
  },
  component: Main,
  children: [{
    path: 'home',
    name: 'smsHomeIndex',
    icon: 'icon-nav-home',
    title: '首页',
    meta: {
      pass: true
    },
    component: resolve => {
      require(['@/pages/sms/home/Home.vue'], resolve)
    }
  }, {
    path: 'person',
    name: 'smsPersonSetting',
    meta: {
      pass: true
    },
    components: {
      person: resolve => {
        require(['@/pages/sms/home/Person.vue'], resolve)
      }
    }
  }]
}, {
  path: `${ROUTER_MODULE}/operator`,
  name: 'smsOperator',
  icon: 'icon-nav-home',
  meta: {
    id: '150'
  },
  title: '运营商管理',
  component: Main,
  children: [{
    path: 'manage',
    name: 'smsOperatorManage',
    meta: {
      id: '159'
    },
    title: '运营商管理',
    component: resolve => {
      require(['@/pages/sms/operator/index.vue'], resolve)
    }
  }]
}, {
  path: `${ROUTER_MODULE}/seat`,
  name: 'smsSeat',
  icon: 'icon-nav-home',
  meta: {
    id: '152'
  },
  title: '坐席管理',
  component: Main,
  children: [{
    path: `manage`,
    name: 'smsSeatManage',
    meta: {
      id: '165'
    },
    title: '坐席管理',
    component: resolve => {
      require(['@/pages/sms/seat/index.vue'], resolve)
    }
  }]
},
{
  path: `${ROUTER_MODULE}/callRecord`,
  name: 'smsCallRecord',
  icon: 'icon-nav-home',
  meta: {
    id: '153'
  },
  title: '呼叫管理',
  component: Main,
  children: [{
    path: `manage`,
    name: 'smsCallRecordManage',
    meta: {
      id: '167'
    },
    title: '呼叫记录',
    component: resolve => {
      require(['@/pages/sms/callRecord/index.vue'], resolve)
    }
  }]
}, {
  path: `${ROUTER_MODULE}/firm`,
  name: 'smsFirm',
  icon: 'icon-nav-home',
  meta: {
    id: '157'
  },
  title: '企业管理',
  component: Main,
  children: [{
    path: `manage`,
    name: 'smsFirmManage',
    title: '企业管理',
    meta: {
      id: '175'
    },
    component: resolve => {
      require(['@/pages/sms/firm/index.vue'], resolve)
    }
  }]
}, {
  path: `${ROUTER_MODULE}/machine`,
  name: 'smsMachine',
  icon: 'icon-nav-home',
  meta: {
    id: '151'
  },
  title: '设备管理',
  component: Main,
  children: [{
    path: `manage`,
    name: 'smsMachineManage',
    meta: {
      id: '163'
    },
    title: '设备管理',
    component: resolve => {
      require(['@/pages/sms/machine/index.vue'], resolve)
    }
  }, {
    path: `applyList`,
    name: 'smsMachineApplyList',
    meta: {
      id: '164'
    },
    title: '开通申请',
    component: resolve => {
      require(['@/pages/sms/machine/applyList.vue'], resolve)
    }
  }, {
    path: `apply/:id`,
    name: 'smsMachineApply',
    meta: {
      // id: '165',
      pass: true
    },
    title: '开通操作',
    component: resolve => {
      require(['@/pages/sms/machine/apply.vue'], resolve)
    }
  }, {
    path: `applyDetail/:detailId`,
    name: 'smsMachineApplyDetail',
    meta: {
      // id: '165',
      pass: true
    },
    title: '开通详情',
    component: resolve => {
      require(['@/pages/sms/machine/apply.vue'], resolve)
    }
  }, {
    path: `relayLine`,
    name: 'relayLineAccount',
    meta: {
      id: '206'
    },
    title: '中继线管理',
    component: resolve => {
      require(['@/pages/sms/machine/relayLine/index.vue'], resolve)
    }
  }]
}, {
  path: `${ROUTER_MODULE}`,
  icon: 'icon-nav-home',
  title: '话术管理',
  component: Main,
  meta: {
    id: '181'
  },
  children: [{
    path: 'whispering',
    name: types.WHISPERING,
    title: '话术管理',
    meta: {
      id: '191'
    },
    component: resolve => require(['@/pages/sms/whispering/index.vue'], resolve)

  },
  {
    path: 'whisperingType',
    name: types.WHISPERING_TYPE,
    title: '话术分类',
    meta: {
      id: '183'
    },
    component: resolve => require(['@/pages/sms/whisperingType/index.vue'], resolve)

  }, {
    path: 'whispering/form',
    name: types.WHISPERING_FORM_PANEL,
    title: '新增话术',
    meta: {
      pass: true
    },
    component: resolve => require(['@/pages/sms/whispering/formPanel.vue'], resolve)
  },
  {
    path: 'whispering_new',
    name: types.WHISPERING_NEW,
    title: '新话术管理',
    meta: {
      id: '204'
    },
    component: resolve => require(['@/pages/sms/whisperingNew/index.vue'], resolve)
  }
  ]
}, {
  path: `${ROUTER_MODULE}`,
  icon: 'icon-nav-home',
  title: '短信管理',
  component: Main,
  meta: {
    id: '198'
  },
  children: [{
    path: 'message',
    name: types.MESSAGE_TEMPLATE,
    title: '短信模板管理',
    meta: {
      id: '199'
    },
    component: resolve => require(['@/pages/sms/message/index.vue'], resolve)

  }]
}, {
  path: `${ROUTER_MODULE}/setting`,
  icon: 'icon-nav-home',
  meta: {
    id: '158'
  },
  title: '系统设置',
  component: Main,
  children: [{
    path: 'call_time',
    name: types.SETTING_CALL_TIME,
    title: '呼叫时间设置',
    meta: {
      id: '180'
    },
    component: resolve => require(['@/pages/sms/setting/callTime.vue'], resolve)

  }, {
    path: 'wordDb',
    name: types.SETTING_SETTING_WORD_DB_TEMPLATE,
    title: '词库模板',
    meta: {
      id: '200'
    },
    component: resolve => require(['@/pages/sms/setting/wordDb/index.vue'], resolve)
  }, {
    path: 'user',
    name: types.USER,
    title: '管理员管理',
    meta: {
      id: '202'
    },
    component: resolve => require(['@/pages/sms/setting/user/index.vue'], resolve)
  },
  {
    path: 'userWhite',
    name: types.USER_WHITE,
    title: '白名单管理',
    meta: {
      id: '203'
    },
    component: resolve => require(['@/pages/sms/setting/userWhite/index.vue'], resolve)
  }
  ]
  // }, {   path: '*',   redirect: `${ROUTER_MODULE}/operator/manage`
}
]
