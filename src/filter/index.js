import util from '@/util/util'
import {
  duration
} from '@/util'

export {
  duration
}
/**
 * 时间格式转换 ms -> date
 * @return {string} yyyy-MM-dd hh:mm:ss格式时间
 */
export const msToDate = util.msToDate

/**
 * 时间格式化
 */
export const timeFormat = util.timeFormat

export const dateFormat = (value, fmt) => {
  return msToDate(value, fmt)
}
/**
 * 兼容https/http
 * @param  {string} value 地址
 * @return {string}       替换后的地址
 */
export const https = value => {
  if (value) {
    return value.replace(/^http(s)?:/gi, '')
  }
  return ''
}

/**
 * 添加金额分隔符
 * @Datetime 2017-07-25T10:24:12+0800
 * @param    {number}    _str   金额
 * @return   {string}           格式化后的金额字串
 */
export const formatNumber = _str => {
  const str = _str + ''
  let baseLen = 3
  if (str.indexOf('.') > -1) {
    baseLen += str.length - str.indexOf('.')
  }
  if (str.length <= baseLen) {
    return str
  }
  return formatNumber(str.substring(0, str.length - baseLen)) + ', ' + str.substring(str.length - baseLen)
}

/**
 * 添加中国单位
 * @param number {number} 输入金额
 * @param decimalDigit {number} 小数点后尾数
 */
export const NumberUpperFormat = (number, decimalDigit = 1) => {
  const getDigit = integer => {
    let digit = -1
    while (integer >= 1) {
      digit++
      integer /= 10
    }
    return digit
  }

  const addWan = (integer, n, mutiple, d) => {
    const digit = getDigit(integer)
    if (digit > 3) {
      let remainder = digit % 8
      if (remainder >= 5) { // ‘十万’、‘百万’、‘千万’显示为‘万’
        remainder = 4
      }
      if (digit > 5) return Math.floor(Math.round(n / Math.pow(10, remainder + mutiple - d)) / Math.pow(10, decimalDigit)) + '万'
      return Math.round(n / Math.pow(10, remainder + mutiple - d)) / Math.pow(10, decimalDigit) + '万'
    }
    return Math.round(n / Math.pow(10, mutiple - d)) / Math.pow(10, decimalDigit)
  }

  decimalDigit = decimalDigit === null ? 2 : decimalDigit
  const integer = Math.floor(number)
  const digit = getDigit(integer)
  const unit = []
  if (digit > 3) {
    const multiple = Math.floor(digit / 8)
    if (multiple >= 1) {
      const tmp = Math.round(integer / Math.pow(10, 8 * multiple))
      unit.push(addWan(tmp, number, 8 * multiple, decimalDigit))
      for (let i = 0; i < multiple; i++) {
        unit.push('亿')
      }
      return unit.join('')
    }
    return addWan(integer, number, 0, decimalDigit)
  }
  return number
}
//机器人坐席详情状态
export const seatStatus = (number) => {
  let text
  switch (number) {
    case 1:
      text = '正常'
      break
    case 2:
      text = '已过期'
      break
    case 3:
      text = '使用中'
      break
    default:
      text = '未开始 '
      break
  }
  return text
}
export const callResult = (num)=>{
  let text
  switch (num) {
    case 0:
      text = '待呼叫'
      break
    case 1:
      text = '已接通'
      break
    case 2:
      text = '无法接通'
      break
    case 3:
      text = '拒接'
      break
    case 4:
      text = '外呼失败 '
      break
  }
  return text
}
export const proxyType = (num)=>{
  let text
  switch (num) {
    case 1:
      text = '铜'
      break
    case 2:
      text = '银'
      break
    case 3:
      text = '金'
      break
    // default:
    //   text = '铁'
    //   break
  }
  return text
}