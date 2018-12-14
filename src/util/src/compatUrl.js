export default (url, params) => {
  if (url && params) {
    if (/\?/.test(url)) {
      url += '&'
    } else {
      url += '?'
    }
    Object.keys(params).forEach(key => {
      url += `${key}=${params[key]}`
    })
  }
  return url
}
