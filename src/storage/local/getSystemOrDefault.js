import {
  SYSTEM
} from '@/constants'
import * as names from './names'

export default (defaultSystem = SYSTEM.ADMIN_TYPE_EMS) => {
  let system = localStorage.getItem(names.SYSTEM)
  return system != null ? system : defaultSystem
}
