import * as EMS from './src/ems'
import * as SYSTEM from './src/system'
import * as OMS from './src/oms'

export const CALL_RESULT = {
  '1': '已接通',
  '2': '无法接通',
  '3': '拒接',
  '4': '外呼失败',
  '5': '白名单过滤',
  '6': 'D类客户过滤',
  '7': '频率限制',
  '8': '空号'
}

export const getCallResultLabel = callResult => CALL_RESULT[callResult]

export {
  EMS,
  SYSTEM,
  OMS
}
