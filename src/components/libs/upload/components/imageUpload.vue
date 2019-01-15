<template>
  <div class="ms-image-upload">
    <div class="demo-upload-list"
         v-for="(item, i) in uploadList"
         :key="i">
      <img :src="item.url">
      <div class="demo-upload-list-cover">
        <Icon type="ios-eye-outline"
              @click.native="handleView(item.url)"></Icon>
        <Icon type="ios-trash-outline"
              @click.native="handleRemove(item)"></Icon>
      </div>
    </div>
    <ms-upload :options="options"
               :name="name"
               :title="title"
               :data="data"
               :action="action"
               :multiple="multiple"
               :accept="accept"
               :format="format"
               :maxSize="maxSize"
               :singleFileSize="singleFileSize"
               :limit="limit"
               :showMsg="showMsg"
               :target="target"
               :targetType="targetType"
               v-model="fileList"
               ref="msUpload"
               style="display: inline-block;width:58px;"
               v-show="uploadList.length < limit">
      <div class="ms-image-upload-btn">
        <Icon type="camera"
              size="20"></Icon>
      </div>
    </ms-upload>
    <Modal title="图片预览"
           v-model="preview.show">
      <img :src="preview.url"
           v-if="preview.show"
           style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import MsUpload from './index'

export default {
  components: {
    MsUpload
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    options: {
      type: Object,
      default() {
        return {
          showUploadList: false,
          type: 'drag'
        }
      }
    },
    value: {
      type: [String, Array]
    },
    name: {
      type: String,
      default: 'file'
    },
    title: {
      type: String,
      default: '选择图片'
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    action: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    format: {
      type: Array,
      default() {
        return ['jpg', 'jpeg', 'gif', 'png', 'bmp']
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
      default: 'qiniu'
    },
    targetType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      uploadList: [],
      preview: {
        show: false,
        url: ''
      }
    }
  },
  computed: {
    fileList: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  mounted() {
    this.uploadList = this.$refs.msUpload.uploadList;
    console.log(" this.uploadList", this.uploadList)
  },
  methods: {
    handleView(url) {
      this.preview.url = url
      this.preview.show = true
    },
    handleRemove(file) {
      this.$refs.msUpload.onRemove(file)
    }
  }
}
</script>
<style lang="scss">
.ms-image-upload {
  .ms-image-upload-btn {
    width: 58px;
    height: 58px;
    line-height: 58px;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
  }
}
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
