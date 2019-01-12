<template>
  <Upload v-bind="computedOptions"
          class="mt-15"
          :headers="headers"
          :show-upload-list="isShowList"
          :before-upload="beforeUpload"
          :on-preview="onPreview"
          :on-success="onSuccess"
          :on-error="onError"
          :on-remove="onRemove"
          :on-format-error="onFormatError"
          :on-exceeded-size="onExceededSize"
          ref="upload">
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else>
      <Button type="primary"
              size="small"
              icon="ios-cloud-upload-outline">{{title}}</Button>
    </template>
    <template v-if="$slots.tip"
              slot="tip">
      <slot name="tip" />
    </template>
  </Upload>
</template>

<script>
import { apiConfig } from '@/config'
import { callOrApply, isIE, concatArgs, randRange } from '@/util'
import {
  Message
} from 'iview'
import adminInfoApi from '@/api/common/adminInfoApi'
import AuthMac from '@/plugins/src/axios/src/interceptor/src/authMac'
import emitter from 'iview/src/mixins/emitter'

let success = content => {
  Message.success({
    content,
    duration: 5
  })
}
let warning = content => {
  Message.warning({
    content,
    duration: 10
  })
}
export default {
  mixins: [emitter],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    isShowList:{
      type:Boolean,
      default:true
    },
     InUploadList:{
      type:Array
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    value: {
      type: [String, Array]
    },
    title: {
      type: String,
      default: '选择文件'
    },
    name: {
      type: String,
      default: 'file'
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    action: {
      type: String,
      default: apiConfig.sms.uploadFile
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: null
    },
    format: {
      type: Array,
      default() {
        return []
      }
    },
    maxSize: {
      type: Number,
      // 默认闲置50MB
      default: 50 * 1024
    },
    singleFileSize: {
      type: Number,
      default: 10 * 1024
    },
    limit: {
      type: Number,
      default: 1
    },
    // 是否显示提示信息
    showMsg: {
      type: Boolean,
      default: true
    },
    // 上传类型
    // 默认 / qiniu-七牛
    target: {
      type: String,
      default: ''
    },
    targetType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      qiniuAction: '',
      domainUrl: '',
      uploadList: [],
      uploading: false,
      headers: {}
    }
  },
  computed: {
    computedOptions() {
      let options = {
        name: this.name,
        action: this.target === 'qiniu' ? this.qiniuAction : this.action,
        data: this.data,
        multiple: this.multiple
      }
      if (this.accept) {
        options.accept = this.accept
      }
      if (this.format && this.format.length) {
        options.format = this.format
      }
      if (this.maxSize) {
        options.maxSize = this.maxSize
      }

      // 默认文件列表
      options.defaultFileList = this.fileList

      return Object.assign(options, this.options)
    },
    isArray() {
      return Array.isArray(this.value)
    },
    fileSizeByte() {
      return this.singleFileSize * 1024
    },
    // 数据格式支持
    // 1、[url, url, url]
    // 2、'url,url,url' if(limit > 1)
    // 3、'url' if(limit === 1)
    fileList: {
      get() {
        if (this.isArray) {
          return this.value.map(v => {
            return {
              name: this.getFileName(v),
              url: v
            }
          })
        } else {
          let ret = []
          if (this.value) {
            if (this.limit > 1) {
              ret = this.value.split(',').map(v => {
                return {
                  name: this.getFileName(v),
                  url: v
                }
              })
            } else {
              ret.push({
                name: this.getFileName(this.value),
                url: this.value
              })
            }
          }
          return ret
        }
      },
      set(val) {
        if (this.isArray) {
          this.$emit('change', val.map(v => v.url))
        } else {
          if (this.limit > 1) {
            val = (val && val.length) ? val.map(v => v.url).join(',') : ''
          } else {
            val = (val && val.length) ? val[0].url : ''
          }
          this.$emit('change', val)

          // iview upload 在组件上传成功后会先触发一次 on-form-change，再调用on-success回调函数，
          // 此时的fieldValue是上一次的值，导致iview form验证不正确
          this.dispatch('FormItem', 'on-form-change', val);
        }
      }
    }
  },
  watch: {
    fileList(val) {
      // 维持 this.uploadList 的引用不变
      this.uploadList.splice(0, this.uploadList.length)
      val.forEach(v => {
        this.uploadList.push(v)
      })
    }
  },
  methods: {
    getFileName(url) {
      if (url) {
        let ret = url.split('/')
        return ret[ret.length - 1]
      }
      return url
    },
    applyEmit(emitName, args) {
      let argsArr = Array.apply(null, args)
      argsArr.unshift(emitName)
      return callOrApply(this, this.$emit, argsArr)
    },
    beforeUpload(file) {
      if (this.uploading) {
        this.showMessage(warning, '文件上传中，请稍后添加')
        return false
      }

      // 验证文件数量限制
      if (this.fileList.length >= this.limit) {
        this.onExceed()
        return false
      }

      this.uploading = true
      // 验证单文件
      if (this.verifyFile(file)) {
        let res = this.applyEmit('before-upload', arguments)
        if (res !== false) {
          return this.handleTarget(file)
        }
      }
      this.uploading = false
      return false
    },
    handleTarget(file) {
      switch (this.target) {
        case 'qiniu':
          return adminInfoApi.getQiniuToken(this.targetType).then(data => {
            this.data.token = data.token
            this.qiniuAction = data.qiniuZone.upUrls[randRange(0, data.qiniuZone.upUrls.length - 1)]
            this.domainUrl = data.domainUrl
            return file
          })
        default:
          // 设置headers
          return new Promise(resolve => {
            this.headers = AuthMac.getAuthMacHeaders({
              url: this.action,
              method: 'POST'
            })
            setTimeout(() => {
              resolve()
            }, 0)
          })
      }
      return true
    },
    onSuccess(response, file, fileList) {
      this.uploading = false;
      this.InUploadList.push({audio:response.url})
      switch (this.target) {
        case 'qiniu':
          response.name = response.key
          response.url = this.domainUrl + '/' + response.hash
          break
        default:
        // 测试数据
        // response.url = 'http://aiphone.h5h5h5.cn/call_217_503.wav?id=' + new Date().getTime()
      }

      this.fileList = this.fileList.concat([response])
    },
    onError(err, file, fileList) {
      this.uploading = false
      let msg = `上传失败: ${err.message}`
      this.showMessage(warning, msg)
      this.applyEmit('on-error', concatArgs(arguments, err.message))
    },
    onPreview() {
      this.applyEmit('on-preview', arguments)
    },
    onRemove(file, fileList) {
      let index = -1
      if ((index = this.fileList.indexOf(file)) > -1) {
        let fileList = this.fileList.slice(0)
        fileList.splice(index, 1)
        this.fileList = fileList
      }
      this.applyEmit('on-remove', arguments)
    },
    onFormatError(file, fileList) {
      this.emitExtsExceed()
    },
    onExceededSize(file, fileList) {
      this.emitFileSizeExceed(file)
    },
    onExceed() {
      let msg = `最多允许上传${this.limit}个文件`
      this.showMessage(warning, msg)
      this.applyEmit('on-exceed', concatArgs(arguments, msg))
    },
    emitExtsExceed(file) {
      let msg = `只支持[${this.format.join(',')}]文件类型`
      this.showMessage(warning, msg)
      this.applyEmit('on-format-exceed', [file, msg])
    },
    emitFileSizeExceed(file) {
      let msg = `文件不能大小不能超过${Math.floor(this.singleFileSize / 1024)}MB`
      this.showMessage(warning, msg)
      this.applyEmit('on-file-size-exceed', [file, msg])
    },
    verifyFile(file) {
      return this.verifyExts(file) && this.verifyFileSize(file)
    },
    verifyExts(file) {
      return this.checkExts(file) ? true : (
        this.emitExtsExceed(file),
        false
      )
    },
    verifyFileSize(file) {
      return this.checkFileSize(file) ? true : (
        this.emitFileSizeExceed(file),
        false
      )
    },
    checkExts(file) {
      if (this.format.length === 0) {
        return true
      }
      let fileName = isIE ? file.value : file.name
      let index
      if ((index = fileName.lastIndexOf('.')) > -1) {
        let ext = fileName.substr(index + 1).toLowerCase()
        return this.format.some(predictExt => {
          return predictExt.toLowerCase() === ext
        })
      }
      return false
    },
    checkFileSize(file) {
      return this.singleFileSize <= 0 || (
        isIE ? this.checkFileSizeIE(file) : this.checkFileSizeOthers(file)
      )
    },
    checkFileSizeIE(file) {
      let fso = new ActiveXObject("Scripting.FileSystemObject")
      let target = fso.getFile(file.value)
      if (target && target.size !== undefined && target.size > this.fileSizeByte) {
        return false
      }
      // IE下，默认不验证文件大小
      return true
    },
    checkFileSizeOthers(file) {
      return file.size <= this.fileSizeByte
    },
    showMessage(fn, msg) {
      if (this.showMsg) {
        fn(msg)
      }
    }
  }
}
</script>
