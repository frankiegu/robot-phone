export default (rule, value, callback, source, options) => {
  let errors = []
  if (value && !/^\d+(\.\d+)?$/.test(value)) {
    errors.push(rule.message || '请输入正确的数值')
  }
  callback(errors)
}
