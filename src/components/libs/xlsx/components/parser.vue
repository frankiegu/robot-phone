<template>
  <Upload action=""
          :before-upload="beforeUpload">
    <slot name="default" v-if="$slots.default" />
    <Button 
            icon="ios-cloud-upload-outline"
            v-else>批量导入</Button>
            
    <template slot="tip">
      <slot name="tip"
            v-if="$slots.tip" />
      <div v-else>
        <p v-if="$slots.desc" class="pp">
          <slot name="desc" />
        </p>
        <span v-if="templateUrl" class="post">
          点击
          <a :href="templateUrl"
             class="c-primary">获取模板</a>
        </span>
      </div>
    </template>
  </Upload>
</template>
<script>
import XLSX from 'xlsx'

export default {
  props: {
    templateUrl: {
      type: String,
      default: ''
    },
    rABS: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    beforeUpload(file) {
      let reader = new FileReader()
      reader.onload = e => {
        let data = e.target.result
        let wb
        if (this.rABS) {
          wb = XLSX.read(btoa(fixdata(data)), { //手动转化
            type: 'base64'
          })
        } else {
          wb = XLSX.read(data, {
            type: 'binary'
          })
        }

        let outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        this.$emit('change', outdata)
      }

      if (this.rABS) {
        reader.readAsArrayBuffer(file)
      } else {
        reader.readAsBinaryString(file)
      }

      return false
    },
    fixdata(data) {
      let o = ""
      let l = 0
      let w = 10240
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    }
  }
}
</script>
