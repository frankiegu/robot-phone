export default (rule, value, callback, source, options) => {
  let errors = []
  if (value && !/^1\d{10}$/.test(value)) {
    errors.push(rule.message || '请输入正确的电话号码')
  }
  callback(errors)
}
