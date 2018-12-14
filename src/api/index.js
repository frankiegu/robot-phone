/* 
sms -- 超级管理后台
oms -- 运营管理后台
pms -- 代理后台，合并了以下
  1、pams -- 省代管理后台
  2、cams -- 市代管理后台
ems -- 企业管理后台 
*/

import sms from "./sms"
import oms from "./oms"
import pms from "./pms"
import ems from "./ems"
import common from "./common"
// export default requireContextToObj(require.context('./src', false, /\.js$/))
export default {
  sms,
  oms,
  pms,
  ems,
  common
}