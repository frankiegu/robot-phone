export default (rule, value, callback, source, options) => {
  let errors = []
  if (value) {
    let valNumber = +value
    if (isNaN(valNumber)) {
      errors.push(rule.message || '请输入正确的数值')
    } else if (valNumber > rule.max) {
      errors.push(rule.message || `最大值不能超过${rule.max}`)
    }
  }
  callback(errors)
}
