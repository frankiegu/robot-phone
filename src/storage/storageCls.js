import {
  Base64
} from 'js-base64'
import getSystemOrDefault from './local/getSystemOrDefault'

export const Encrypt = {
  encode(data, encrypt = true) {
    return encrypt ? Base64.encode(data) : data
  },
  decode(data, encrypt = true) {
    return encrypt ? Base64.decode(data) : data
  }
}

export default class Storage {
  constructor({
    name,
    encrypt = true,
    storage = null
  }) {
    this.name = name
    this.encrypt = encrypt

    if (storage == null) {
      throw new Error('storage must not be null')
    }
    this.storage = storage
  }
  set(data) {
    this.storage.setItem(this.name, Encrypt.encode(data, this.encrypt))
  }
  get() {
    return Encrypt.decode(this.storage.getItem(this.name), this.encrypt)
  }
  setBySystem(data) {
    console.log(data)
    let system = getSystemOrDefault()
    let json = {
      [system]: data
    }
    this.storage.setItem(this.name, Encrypt.encode(JSON.stringify(json), this.encrypt))
  }
  getBySystem() {
    let system = getSystemOrDefault()
    try {
      let json = JSON.parse(Encrypt.decode(this.storage.getItem(this.name)), this.encrypt)
      return json[system]
    } catch (e) {}
    return null
  }
  remove() {
    this.storage.removeItem(this.name)
  }
}
