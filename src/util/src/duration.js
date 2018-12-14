function compatValue(val) {
  return val < 10 ? `0${val}` : val
}
// val 为秒数
export default (val, format = [/*{
  step: 1000,
  unit: '毫秒'
}, */{
  step: 60,
  unit: '秒'
}, {
  step: 60,
  unit: '分'
}, {
  step: 24,
  unit: '小时'
}]) => {
  let value = +val
  if (value === value) {
    if (value === 0) return 0
    return format.map(v => {
      if (value > v.step) {
        let divi = Math.floor(value % v.step)
        value = Math.floor(value / v.step)
        if (divi > 0) {
          return `${compatValue(divi)}${v.unit}`
        }
      } else if (value > 0) {
        let divi = value
        value = 0
        return `${compatValue(divi)}${v.unit}`
      }
      return ''
    }).reverse().join('')
  }
  return val
}
