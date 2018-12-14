export default (rule, value, callback, source, options) => {
    let errors = []
    if (value && !/^[0-9]*[1-9][0-9]*$/.test(value)) {
      errors.push(rule.message || '请输入大于0的整数')
    }
    callback(errors)
  }
  