import * as types from '@/router/demo/types'

export default [{
  icon: 'icon-nav-home',
  title: '首页',
  children: [{
    title: '文件上传',
    name: types.EXAMPLE
  }, {
    title: '微信用户',
    name: types.WECHAT
  }]
}, {
  icon: 'icon-nav-marketing',
  title: '营销管理',
  children: [{
    title: '营销任务',
    name: types.MARKETING.TASK
  }, {
    title: '呼叫记录',
    name: types.MARKETING.CALL
  }, {
    title: '通话详情',
    name: types.MARKETING.CALL_DETAIL
  }, {
    title: '创建营销任务',
    name: types.MARKETING.TASK_FORM
  }]
}, {
  icon: 'icon-nav-customer',
  title: '客户中心',
  children: [{
    title: '我的客户',
    name: types.CLIENT.MINE
  }, {
    title: '编辑客户',
    name: types.CLIENT.FORM
  }]
}, {
  icon: 'icon-nav-robot',
  title: '销售人员管理',
  name: types.SELLER.MANAGER,
  children: []
}, {
  icon: 'icon-nav-robot',
  title: '代理设置',
  name: types.PROXY.INDEX,
  children: []
}, {
  icon: 'icon-nav-robot',
  title: '开通坐席申请',
  name: types.ROBOT,
  children: []
}, {
  icon: 'icon-nav-robot',
  title: '代理基础信息',
  name: types.PROXY.INFO,
  children: []
}, {
  icon: 'icon-nav-robot',
  title: '话术管理',
  children: [{
    title: '新增话术',
    name: types.WHISPERING.FORM
  }]
}]
