/**
 * 校验正则
 */
let reg = {}

reg.isPassword = value => value.trim().length>5 && value.trim().length<21

reg.isAccount = value => /^[a-zA-Z0-9_]{1,20}$/g.test(value.trim())

reg.isPhone = value => /^[0-9]{11}$/g.test(value.trim())

reg.isCode = value => /^[a-zA-Z0-9]{6}$/g.test(value.trim())

export default reg
