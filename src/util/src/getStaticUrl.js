import {
  staticUrl
} from '@/config'
export default url => {
  return staticUrl + '/' + (url ? String(url) : '')
}
