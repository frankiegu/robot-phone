import {
  Message
} from 'iview'

const warning = content => {
  Message.warning({
    content,
    duration: 8
  })
}

// 关键字只允许输入 汉子/数字/字母
const REG = /^([\u4e00-\u9fa5]|\d|\w)+$/

export default key => {
  if (key) {
    if (key.length > 20) {
      warning(`关键字[${key}]的长度大于20个字符，请修改`)
      return false
    } else if (!REG.test(key)) {
      warning(`关键字[${key}]包含无效字符(只允许中文、数字、字母，分隔符请使用英文分号)，请修改`)
      return false
    }
  }
  return true
}

export const reduceKeys = (newKeys, oldKeys) => {
  return newKeys.filter((v, i) => v && oldKeys.indexOf(v) === -1 && newKeys.lastIndexOf(v) === i)
}
