<template>
  <Form :label-width="90"
        style="overflow: hidden;"
        :model="entity"
        :rules="rules"
        ref="form">
    <FormItem label="节点名称"
              prop="name">
      <Input placeholder="请输入节点名称"
             v-model.trim="entity.name"
             style="width:398px;"
             :maxlength="20" />
    </FormItem>
    <FormItem label="提取标签"
              prop="label"
              v-if="showLabel">
      <Input placeholder="请输入提取标签"
       style="width:398px;"
             v-model.trim="entity.label"
             :maxlength="20" />
    </FormItem>
    <FormItem label="优先级"
              prop="priority"
              v-if="showPriority">
      <InputNumber :max="999999"
       style="width:398px;"
                   :min="1"
                   v-model="entity.priority" />
    </FormItem>
    <key-word required
              v-model="entity.keyWord"
              v-if="showKeyWord" />
    <slot />
    <FormItem>
      <p>Ai语音</p>
      <i-input type="textarea"
               placeholder="对照语音输入文字"
               :rows="4"
                style="width:398px;"
               v-model.trim="entity.content"
               :maxlength="200" />
      <FormItem :label-width="1"
                prop="videoUrl">
        <!-- 旁白流程允许多条语音 -->
        <ms-upload v-model="entity.videoUrl"
                   accept="audio/wav"
                   :format="['wav']"
                   :limit="1"
                   :data="{id: this.entity.whisperingId}">
          <span class="ml-10" slot="tip">支持wav格式</span>
        </ms-upload>
      </FormItem>

      <div class="audio"
           v-if="entity.videoUrl">
        <div class="audio-file"
             style="margin-right: 0; margin-bottom: 10px;"
             v-for="v in entity.videoUrl.split(',')"
             :key="v">
          <audio controls
                 :src="v" />
        </div>
      </div>
    </FormItem>
    <hr />
    <Row class="pd10">
      <i-col :span="6">
        <Checkbox v-model="entity.isEnd"
                  :true-value="1"
                  :false-value="0">结束通话</Checkbox>
      </i-col>
      <!-- 五期未完成屏蔽
      <i-col :span="6">
        <Checkbox v-model="entity.isInterrupt"
                  :true-value="1"
                  :false-value="0">不允许打断</Checkbox>
      </i-col>
      <i-col :span="6">
        <Checkbox v-model="entity.isTransfer"
                  :true-value="1"
                  :false-value="0">转接人工</Checkbox>
      </i-col>
      <i-col :span="6"
             v-if="showTogether">
        <Checkbox v-model="entity.isTogether"
                  :true-value="1"
                  :false-value="0">跟主流程一起播放</Checkbox>
      </i-col>
      -->
    </Row>
  </Form>
</template>

<script>
import { formMixin } from '@/mixins'
import entity from '../../src/entity'
import { numberValidator } from '@/assets/javascripts/asyncValidator/validators'
import { KeyWord } from '@/components/packages/common/whispering'

export default {
  mixins: [formMixin],
  components: {
    KeyWord
  },
  props: {
    showLabel: {
      type: Boolean,
      default: false
    },
    showPriority: {
      type: Boolean,
      default: false
    },
    showTogether: {
      type: Boolean,
      default: false
    },
    showKeyWord: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let rules = {
      name: [
        { required: true, message: '请输入节点名称' }
      ],
      videoUrl: [
        { required: true, message: '请选择ai语音' }
      ]
    }
    if (this.showPriority) {
      rules.priority = [
        { required: true, message: '请输入优先级' },
        { validator: numberValidator }
      ]
    }
    if (this.showKeyWord) {
      rules.keyWord = [
        { required: true, message: '请至少输入一个关键字' }
      ]
    }
    return {
      entity: entity({
        isEnd: 0,
        isInterrupt: 0,
        isTogether: 0,
        isTransfer: 0,
        priority: 1
      }),
      rules
    }
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve(Object.assign({}, this.entity))
          } else {
            reject('FORM_INVALID')
          }
        })
      })
    }
  }
}
</script>
