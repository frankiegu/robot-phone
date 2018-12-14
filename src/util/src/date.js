import date from 'iview/src/utils/date'
import Vue from 'vue'

const watchDateRange = (model, beginName, endName, formatter = 'yyyy-MM-dd HH:mm:ss') => {
  return function (val) {
    val = val || []
    let begin = val[0]
    let end = val[1]
    if (typeof model === 'function') {
      model = model()
    }
    Vue.set(model, beginName, begin ? date.format(begin, formatter) : '')
    Vue.set(model, endName, end ? date.format(end, formatter) : '')
  }
}

const watchDate = (model, dateName, formatter = 'yyyy-MM-dd HH:mm:ss') => {
  return function (val) {
    if (typeof model === 'function') {
      model = model()
    }
    Vue.set(model, dateName, val ? date.format(val, formatter) : '')
  }
}

const watchDateRangeToTimestamp = (model, beginName, endName) => {
  return function (val) {
    val = val || []
    let begin = val[0]
    let end = val[1]
    if (typeof model === 'function') {
      model = model()
    }
    Vue.set(model, beginName, begin ? begin.getTime() : '')
    Vue.set(model, endName, end ? end.getTime() : '')
  }
}

const watchDateToTimestamp = (model, dateName) => {
  return function (val) {
    if (typeof model === 'function') {
      model = model()
    }
    Vue.set(model, dateName, val ? val.getTime() : '')
  }
}

export default date
export {
  watchDateRange,
  watchDate,
  watchDateRangeToTimestamp,
  watchDateToTimestamp,
  date
}
