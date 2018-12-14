const MOBILE = /^1\d{10}$/
const TEL = /^(\d{3}-?)(\d{8})$|^(\d{4}-?)(\d{7})$|^(\d{4}-?)(\d{8})$/

export default value => {
  return value && (MOBILE.test(value) || TEL.test(value))
}

// 脱敏处理
// 支持手机号码/固化
export const desenPhone = telOrMobile => {
  return telOrMobile.replace(/^(.{3}|.{4}-?)([^-]{4})(.*)/, '$1****$3')
}
