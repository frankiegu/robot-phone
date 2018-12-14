<template>
  <div class="ckeditor">
    <textarea ref="editor"></textarea>
  </div>
</template>
<script>
import extend from 'extend'
import CKEDITOR from 'CKEDITOR'
import defaultConfig from './config'


export default {
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    },
    height: {
      type: String,
      required: false
    },
    toolbar: {
      type: Array,
      required: false
    },
    language: {
      type: String,
      default: 'zh-cn'
    },
    extraplugins: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      editor: null,
      timer: null,
      ready: false
    }
  },
  mounted() {
    const ckeditorConfig = extend({}, defaultConfig, this.config, {
      toolbar: this.toolbar,
      language: this.language,
      height: this.height,
      extraPlugins: this.extraplugins
    })

    this.editor = CKEDITOR.replace(this.$refs.editor, ckeditorConfig)

    this.onEditorReady(editor => {
      this.$emit('ready', editor)
    })
  },
  destroyed() {
    if (this.editor) {
      this.editor.destroy()
    }
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.ready = false
  },
  methods: {
    updateEditor(content = this.content) {
      if (this.editor) {
        clearInterval(this.timer)
        let tryCount = 0
        this.timer = setInterval(() => {
          if (this.editor.getData() !== content && tryCount++ <= 10) {
            this.onEditorReady(editor => {
              editor.setData(content)
            })
          } else {
            clearInterval(this.timer)
          }
        }, 50)
      }
    },
    onEditorReady(fn) {
      if (this.ready) {
        fn(this.editor)
      } else if (this.editor) {
        this.editor.on('instanceReady', ({ editor }) => {
          this.ready = true
          fn(editor)
        })
      } else {
        throw new Error('ckeditor is not initialized')
      }
    },
    getData() {
      if (this.editor) {
        return this.editor.getData()
      }
      return ''
    },
    setData(content = '') {
      this.updateEditor(content)
    }
  }
}
</script>
<style>
.ckeditor {
  width: 100%;
  clear: both;
}
</style>
