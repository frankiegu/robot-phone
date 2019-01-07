// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import api from '@/api'
import * as filters from './filter'
import '@/assets/javascripts/polyfill'
import plugins from './plugins'
import {
  api as apiBaseURL
} from '@/config'
import * as libComponents from '@/components/libs'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './assets/stylesheets/theme/default'
import VueTree from 'vue-simple-tree'
import * as directives from './directives'

Vue.use(iView)
Vue.use(VueTree)
Vue.use(plugins)
Object.keys(libComponents).forEach(name => {
  Vue.component(name, libComponents[name])
})

const isDebugMode = process.env.NODE_ENV !== 'production'
Vue.config.debug = isDebugMode
Vue.config.devtools = isDebugMode
Vue.config.productionTip = isDebugMode
// 挂载api
for (let k in api) {
  // eslint-disable-next-line no-useless-escape
  Vue.prototype[`\$${k}Api`] = api[k]
}

// 注册全局自定义过滤器
Object.keys(filters).forEach(v => {
  Vue.filter(v, filters[v])
})

// 注册全局指令
Object.keys(directives).forEach(v => {
  Vue.directive(v, directives[v])
})

// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。
  inserted: el => {
    // 聚焦元素
    el.focus()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
