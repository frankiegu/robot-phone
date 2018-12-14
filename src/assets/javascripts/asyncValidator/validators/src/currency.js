export default (rule, value, callback, source, options) => {
  let errors = []
  if (value && !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
    errors.push(rule.message || '请输入正确的货币')
  }
  callback(errors)
}
