export default (rule, value, callback, source, options) => {
    let errors = []
    var reg = new RegExp("[\\u4E00-\\u9FFF]+","g")
    if (value && reg.test(value)){
      errors.push(rule.message || '密码不能为汉字')
    }else if (value.length<6 || value.length>19){
      errors.push(rule.message || '长度为6-18位')
    }
    callback(errors)
  }