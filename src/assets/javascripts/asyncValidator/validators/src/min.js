export default (rule, value, callback, source, options) => {
  let errors = []
  if (value) {
    let valNumber = +value
    if (isNaN(valNumber)) {
      errors.push(rule.message || '请输入正确的数值')
    } else if (valNumber < rule.min) {
      errors.push(rule.message || `最小值不能小于${rule.min}`)
    }
  }
  callback(errors)
}
