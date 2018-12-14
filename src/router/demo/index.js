import * as types from './types'

export default [{
  path: '/demo/chat',
  name: 'demo-chat',
  component: resolve => require(['@/pages/demo/pages/marketing/Chat'], resolve)
}, {
  path: '/demo',
  name: types.DEMO,
  component: resolve => require(['@/pages/demo'], resolve),
  children: [{
    path: 'marketing/call',
    name: types.MARKETING.CALL,
    component: resolve => require(['@/pages/demo/pages/marketing/Call'], resolve)
  }, {
    path: 'marketing/task',
    name: types.MARKETING.TASK,
    component: resolve => require(['@/pages/demo/pages/marketing/Task'], resolve)
  }, {
    path: 'marketing/call/detail',
    name: types.MARKETING.CALL_DETAIL,
    component: resolve => require(['@/pages/demo/pages/marketing/Call-detail'], resolve)
  }, {
    path: 'marketing/task/form',
    name: types.MARKETING.TASK_FORM,
    component: resolve => require(['@/pages/demo/pages/marketing/Task-form'], resolve)
  }, {
    path: 'client/mine',
    name: types.CLIENT.MINE,
    component: resolve => require(['@/pages/demo/pages/client/Mine'], resolve)
  }, {
    path: 'client/form',
    name: types.CLIENT.FORM,
    component: resolve => require(['@/pages/demo/pages/client/Form'], resolve)
  }, {
    path: 'seller/manager',
    name: types.SELLER.MANAGER,
    component: resolve => require(['@/pages/demo/pages/seller/Manager'], resolve)
  }, {
    path: 'proxy/index',
    name: types.PROXY.INDEX,
    component: resolve => require(['@/pages/demo/pages/proxy/index'], resolve)
  }, {
    path: 'robot',
    name: types.ROBOT,
    component: resolve => require(['@/pages/demo/pages/robot/form'], resolve)
  }, {
    path: 'proxy/info',
    name: types.PROXY.INFO,
    component: resolve => require(['@/pages/demo/pages/proxy/info'], resolve)
  }, {
    path: 'whispering/form',
    name: types.WHISPERING.FORM,
    component: resolve => require(['@/pages/demo/pages/whispering/form'], resolve)
  }, {
    path: 'example',
    name: types.EXAMPLE,
    component: resolve => require(['@/pages/demo/pages/example'], resolve)
  }, {
    path: 'wechat',
    name: types.WECHAT,
    component: resolve => require(['@/pages/demo/pages/wechat'], resolve)
  }]
}]
