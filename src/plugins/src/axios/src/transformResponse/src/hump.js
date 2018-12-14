import {
  dataToHump
} from '@/util'

// 数据转驼峰
export default function (data) {
  if (data && typeof data === 'object' && !(data instanceof Blob)) {
    return dataToHump(data)
  }
  return data
}
