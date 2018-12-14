let Audio = {
  instance: null,
  init() {
    if (this.instance == null) {
      let instance = this.instance = document.createElement('audio')
      instance.style.position = 'absolute'
      instance.style.left = '-9999px'
      instance.style.top = '-9999px'
      instance.style.visibility = 'hidden'
      document.body.appendChild(instance)
    }
    return this.instance
  },
  destroy() {
    if (this.instance) {
      this.instance.pause()
      document.body.removeChild(this.instance)
    }
  },
  play(src) {
    let audio = this.init()
    audio.pause()
    audio.src = src
    audio.play()
    return audio
  }
}


export default {
  play(src) {
    Audio.play(src)
  },
  destroy() {
    Audio.destroy()
  }
}
