<template>
  <div class="block block-gray">
    <div class="clear"
         >
      <div class="fr">
        <Checkbox v-model="entity.redeem"
                  :true-value="1"
                  :false-value="0">挽回语句</Checkbox>
        <Button type="error"
                size="small"
                @click="removeReply">删除对话</Button>
      </div>
      <b>话术回复</b>
      <Icon type="edit"></Icon>
    </div>
    <div>
      <Form :label-width="80"
            :model="entity"
            :rules="rules"
            ref="form">
        <Row :gutter="20">
          <i-col :span="12">
            <FormItem label="回复名称"
                      prop="name">
              <Input placeholder="请输入回复名称"
                     style="width:300px"
                     v-model.trim="entity.name"
                     :maxlength="20" />
            </FormItem>
          </i-col>
        </Row>
        <FormItem label="关键字"
                  prop="key">
          <Input placeholder="请输入关键字，多个关键字用英文“;”隔开，回车确定。"
                 v-model.trim="key.text"
                style="width:300px"
                 @keyup.native.enter="addKeys" />
        </FormItem>
        <FormItem prop="keys">
          <div v-show="entity.keys.length">
            <div class="tag-container">
              <Tag type="border"
                   closable
                   v-for="(v, i) in entity.keys"
                   :key="i"
                   @on-close="removeKey(i)">{{v}}</Tag>
            </div>
            <Checkbox v-model="entity.keyStatus"
                      :true-value="1"
                      :false-value="0">设为有效关键字</Checkbox>
          </div>
          <p class="nodata"
             v-show="entity.keys.length === 0">暂无关键字</p>
        </FormItem>
        <FormItem label="回复语音">
          <i-input type="textarea"
                   placeholder="对照语音输入文字"
                   :rows="4"
                   v-model.trim="entity.content"
                   :maxlength="200" />

          <FormItem :label-width="1"
                    prop="videoUrl">
            <ms-upload v-model="entity.videoUrl"
                       accept="audio/*"
                       :format="['wav']"
                       :data="{id: whisperingId}">
              <span slot="tip" style="margin-left:10px;">支持wav格式</span>
            </ms-upload>
          </FormItem>
          <div class="audio"
               v-if="entity.videoUrl">
            <div class="audio-file"
                 style="margin-right: 0;">
              <audio controls
                     :src="entity.videoUrl" />
            </div>
          </div>

        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import { formMixin } from '@/mixins'
import replyEntity from '../src/replyEntity'
import { MsUpload } from '@/components/libs/upload'
import { validateKey, reduceKeys } from '@/util'

export default {
  mixins: [formMixin],
  components: {
    MsUpload
  },
  props: {
    whisperingId: {
      type: Number,
      required: true
    }
  },
  data() {
    let keysValidator = (rule, value, callback, source, options) => {
      let errors = []
      if (value && value.length === 0) {
        errors.push(rule.message)
      }
      callback(errors)
    }
    return {
      entity: replyEntity({
        keyStatus: 1
      }),
      rules: {
        name: [
          { required: true, message: '请输入回复名称' }
        ],
        keys: [
          { validator: keysValidator, message: '至少输入一个关键字' }
        ],
        videoUrl: [
          { required: true, message: '请选择音频文件' }
        ]
      },
      key: {
        text: ''
      }
    }
  },
  methods: {
    // 添加关键字
    addKeys() {
      if (this.key.text) {
        let keys = this.key.text.split(';').map(v => String(v).trim())
        let newKeys = reduceKeys(keys, this.entity.keys)

        // 长度限制，单个关键字长度不能超过20个字符
        for (let i = 0, l = newKeys.length; i < l; i++) {
          let key = newKeys[i]
          if (!validateKey(key)) {
            return false
          }
        }

        // 过滤掉一样的key
        this.entity.keys = this.entity.keys.concat(newKeys)
        this.key.text = ''
      }
    },
    // 移除关键字
    removeKey(index) {
      this.entity.keys.splice(index, 1)
    },
    // 移除回复
    removeReply() {
      this.$emit('remove')
    },
    // 验证当前组件
    validate() {
      return this.$refs.form.validate()
    }
  }
}
</script>
