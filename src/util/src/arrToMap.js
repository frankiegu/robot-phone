export default (arr, id = 'id') => {
  let map = {}
  arr.forEach(v => {
    map[v[id]] = v
  })
  return map
}
