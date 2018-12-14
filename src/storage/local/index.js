import * as names from './names'
import StorageCls from '../storageCls'
import getSystemOrDefault from './getSystemOrDefault'

class LocalItem extends StorageCls {
  constructor({
    name,
    encrypt = true
  }) {
    super({
      name,
      encrypt,
      storage: localStorage
    })
  }
}

/**
 * system
 */
export const systemLocal = new LocalItem({
  name: names.SYSTEM,
  encrypt: false
})
systemLocal.getOrDefault = getSystemOrDefault

/**
 * 最后一次登录的用户账号
 */
export const lastLoginAccountLocal = new LocalItem({
  name: names.LAST_USER_ACCOUNT
})
