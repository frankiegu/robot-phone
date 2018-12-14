export default data => {
  for (let key in data) {
    if (data.hasOwnProperty(key) && data[key] instanceof Array) {
      data[key] = data[key].join(',')
    }
  }
  return data
}
