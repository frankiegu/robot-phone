import {
  getStaticUrl
} from '@/util'

export const XLS_TEMPLATE = {
  TASK_CALL_SLOT_LIST: getStaticUrl('xls/ems/营销对象模板.xlsx?v=' + new Date().getTime())
}
export const XLS_WHITE_TEMPLATE = {
  WHITE_SLOT_LIST: getStaticUrl('xls/ems/白名单模板.xlsx?v=' + new Date().getTime())
}
export const CALLER_INSTALL_URL = getStaticUrl('caller/setupCaller-1.0.0.exe?v=' + new Date().getTime())
