import {
  getStaticUrl
} from '@/util'

export const XLS_TEMPLATE = {
  TASK_CALL_SLOT_LIST: getStaticUrl('xls/ems/1.xlsx?v=' + new Date().getTime())
}
export const XLS_WHITE_TEMPLATE = {
  WHITE_SLOT_LIST: getStaticUrl('xls/ems/2.xlsx?v=' + new Date().getTime())
}
export const CALLER_INSTALL_URL = getStaticUrl('caller/setupCaller-1.0.0.exe?v=' + new Date().getTime())
