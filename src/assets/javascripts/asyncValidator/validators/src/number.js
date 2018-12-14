export default (rule, value, callback, source, options) => {
    let errors = []
    if (!/^[0-9]*$/.test(value)){
      errors.push(rule.message || '请输入正确的数字')
    }
    callback(errors)
  }