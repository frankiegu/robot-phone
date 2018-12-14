const dialectMap = {
  mandarin: '普通话',
  cantonese: '粤语',
  lmz: '四川话'
}

export default dialectMap

export const getDialectLabel = v => {
  return dialectMap[v]
}
