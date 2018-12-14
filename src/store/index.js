import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'
import {
  isProd
} from '@/config'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: false,
  plugins: isProd ? [] : [createLogger()]
})
