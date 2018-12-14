import {
  requireContextToObj
} from '@/util'

export default requireContextToObj(require.context('./', false, /\.js$/),['./index.js'])