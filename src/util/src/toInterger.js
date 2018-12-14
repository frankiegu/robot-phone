export default (val,times = 100) => {
  let n = 0
  if (!isNaN(parseFloat(val))) {
    n = parseInt(parseFloat(val) * times)
  }
  return n
}

