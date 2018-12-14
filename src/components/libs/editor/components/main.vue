<template>
  <ckeditor :config="config"
            @ready="ready"
            ref="ckeditor" />
</template>

<script>
import Ckeditor from './ckeditor'
import config from './config'
export default {
  components: {
    Ckeditor
  },
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    ready(editor) {
      this.$emit('ready', editor)
    },
    onReady(fn) {
      this.$refs.ckeditor.onEditorReady(fn)
    },
    // 中文输入法内容更新不及时时，手动获取数据
    getData() {
      return this.$refs.ckeditor.getData()
    },
    setData(content) {
      return this.$refs.ckeditor.setData(content)
    }
  }
}
</script>
