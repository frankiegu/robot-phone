export default (rule, value, callback, source, options) => {
  let errors = []
  if (value && !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)) {
    errors.push(rule.message || '请输入正确的邮箱地址')
  }
  callback(errors)
}
