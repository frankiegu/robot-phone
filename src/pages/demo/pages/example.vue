<template>
  <div>
    <div class="panel">
      <div class="panel-body">
        <p>单文件，字符串存值</p>
        <ms-upload v-model="singleFile"
                   target="qiniu" />
        <p>value: {{singleFile}}</p>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <p>多文件，字符串存值</p>
        <ms-upload v-model="multipleFile"
                   target="qiniu"
                   :limit="2" />
        <p>value: {{multipleFile}}</p>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <p>多文件，数组存值</p>
        <ms-upload v-model="arrFile"
                   target="qiniu"
                   :limit="2" />
        <p>value: {{arrFile}}</p>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <p>单图片，字符串存值</p>
        <ms-image-upload v-model="singleImageFile" />
        <p>value: {{singleImageFile}}</p>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <p>多图片，字符串存值</p>
        <ms-image-upload v-model="multipleImageFile"
                         :limit="2" />
        <p>value: {{multipleImageFile}}</p>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <p>多图片，数组存值</p>
        <ms-image-upload v-model="arrImageFile"
                         :limit="2" />
        <p>value: {{arrImageFile}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      singleFile: '',
      multipleFile: '',
      arrFile: [],
      singleImageFile: '',
      multipleImageFile: '',
      arrImageFile: []
    }
  }
}
</script>
