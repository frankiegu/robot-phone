import * as names from './names'
import StorageCls from '../storageCls'

class SessionItem extends StorageCls {
  constructor({
    name,
    encrypt = true
  }) {
    super({
      name,
      encrypt,
      storage: sessionStorage
    })
  }
}

/**
 * 当前菜单
 */
export const navActiveIndexSession = new SessionItem({
  name: names.NAV_ACTIVE_INDEX
})

export const protocolSession = new SessionItem({
  name: names.PROTOCOL_VISIBLE
})
protocolSession.set = function (val) {
  this.storage.setItem(this.name, val)
}
protocolSession.getOrDefault = function () {
  let val = this.storage.getItem(this.name)
  return val === "false" ? false : true
}
