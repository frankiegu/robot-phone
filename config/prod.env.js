'use strict'
const config = require('./index')

module.exports = {
  NODE_ENV: '"production"',
  DEBUG_MODE: false,
  apiEms: '"http://47.96.107.241:50555"',
  apiSms: '"http://47.96.107.241:50888"',
  apiOms: '"http://47.96.107.241:50777"',
  apiPms: '"http://47.96.107.241:50666"',
  apiCommon: '"http://47.96.107.241:50999"',
  staticUrl: `"${config.build.assetsPublicPath}${config.build.assetsSubDirectory}"`,
  loginBg: '""',
  favicon: '"./static/logo.png"'
}
