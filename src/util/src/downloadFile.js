/**
 * base64转blob
 * @param {*} base64Code
 */
const base64ToBlob = base64Code => {
  let parts = base64Code.split(';base64,')
  let contentType = parts[0].split(':')[1]
  let raw = window.atob(parts[1])
  let rawLength = raw.length

  let uInt8Array = new Uint8Array(rawLength)

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], {
    type: contentType
  })
}

/**
 * 下载blob文件
 * @param {*} blob
 * @param {*} fileName
 * @param {*} clearTime
 */
const downloadFile = (blob, fileName, clearTime = 10000) => {
  if (!blob || !(blob instanceof Blob)) {
    return
  }
  let url = window.URL.createObjectURL(new Blob([blob]))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName || '下载.xls')
  document.body.appendChild(link)
  link.click()

  setTimeout(() => {
    document.body.removeChild(link)
  }, clearTime)
}

/**
 * 根据url下载
 * @param {*} dataUrl
 * @param {*} fileName
 * @param {*} clearTime
 */
const downloadFileUrl = (dataUrl, fileName, clearTime = 10000) => {
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = dataUrl
  link.setAttribute('download', fileName || '下载.xls')
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    document.body.removeChild(link)
  }, clearTime)
}

/**
 * 下载base64图片
 * @param {*} base64Code
 * @param {*} fileName
 * @param {*} clearTime
 */
const downloadBase64Img = (base64Code, fileName, clearTime = 10000) => {
  downloadFile(base64ToBlob(base64Code), fileName, clearTime)
}

export {
  base64ToBlob,
  downloadBase64Img,
  downloadFileUrl
}

export default downloadFile
