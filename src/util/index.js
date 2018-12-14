import {
  date,
  watchDateRange,
  watchDate,
  watchDateRangeToTimestamp,
  watchDateToTimestamp
} from './src/date'
import getStaticUrl from './src/getStaticUrl'
import arrToMap from './src/arrToMap'
import duration from './src/duration'
import exportXlsx from './src/exportXlsx'
import audio from './src/audio'
import toInterger from './src/toInterger'
import CallClient from './src/callClient'
import compatUrl from './src/compatUrl'
import downloadFile, {
  downloadBase64Img,
  base64ToBlob,
  downloadFileUrl
} from './src/downloadFile'
import validateKey, {
  reduceKeys
} from './src/validateKey'
import isTelOrMobile, {
  desenPhone
} from './src/telOrMobile'
import getType from './src/whiteType'
export * from 'asset-web-support/dist/utils'
export * from 'vma-vue-assist/dist/static/js/utils'
export {
  date,
  watchDateRange,
  watchDate,
  watchDateRangeToTimestamp,
  watchDateToTimestamp,
  getStaticUrl,
  arrToMap,
  duration,
  exportXlsx,
  audio,
  toInterger,
  CallClient,
  compatUrl,
  downloadFile,
  downloadBase64Img,
  downloadFileUrl,
  base64ToBlob,
  validateKey,
  reduceKeys,
  isTelOrMobile,
  desenPhone,
  getType
}
