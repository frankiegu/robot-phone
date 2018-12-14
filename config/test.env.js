'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  DEBUG_MODE: true,
  apiEms: '"http://47.96.107.241:50555"',
  apiSms: '"http://47.96.107.241:50888"',
  apiOms: '"http://47.96.107.241:50777"',
  apiPms: '"http://47.96.107.241:50666"',
  apiCommon: '"http://47.96.107.241:50999"'
})
