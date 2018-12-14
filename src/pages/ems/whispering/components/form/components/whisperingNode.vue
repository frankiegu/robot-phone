<template>
  <Form :label-width="80"
        style="overflow: hidden;"
        :model="entity"
        :rules="rules"
        ref="form">
    <div class="block">
      <div class="block-header clear" style="margin-bottom:30px;">
        <div class="fr">
          <Button type="error"
                  size="small"
                  style="margin-right:10px;"
                  @click="removeNode">删除对话</Button>
          <Button type="success"
                  size="small"
                  v-if="entity.id"
                  style="margin-right:10px;"
                  @click="restoreNode">还原</Button>
          <Button type="primary"
                  size="small"
                  @click="submitNode">保存</Button>
        </div>
        <b>话术节点</b>
        <Icon type="md-create" />
      </div>
      <div class="block-body">
        <Row :gutter="20">
          <i-col :span="12">
            <FormItem label="话术名称"
                      prop="name">
              <Input placeholder="请输入话术名称"
                     style="width:300px"
                     v-model.trim="entity.name"
                     :maxlength="20" />
            </FormItem>
          </i-col>
        </Row>

        <!--
          不需要关键字类型
            3、主流程
            7、挽回失败
            8、无人应答流程
            9、未匹配关键字流程
            10、转接人工流程
         -->
        <template v-if="[3, 7, 8, 9, 10].indexOf(entity.type) === -1">
          <div key="key-key">
            <FormItem label="关键字">
              <Input placeholder="请输入关键字，多个关键字用英文“;”隔开，回车确定。"
                     v-model.trim="key.text"
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
          </div>
        </template>

        <b class="fs-16 mb-10">Ai语音</b>
        <i-input type="textarea"
                 placeholder="对照语音输入文字"
                 :rows="4"
                 v-model.trim="entity.content"
                 :maxlength="200" />

        <FormItem :label-width="1"
                  prop="videoUrl">
          <!-- 旁白流程允许多条语音 -->
          <ms-upload v-model="entity.videoUrl"
                     accept="audio/wav"
                     :format="['wav']"
                     :limit="[1].indexOf(entity.type) > -1 ? 10 : 1"
                     :data="{id: this.entity.whisperingId}">
            <span slot="tip" style="margin-left:10px;">支持wav格式
              <span v-if="[1].indexOf(entity.type) > -1">，旁白流程最多允许
                <em class="c-danger">10</em>个音频</span>
            </span>
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

        <!--
          不需要回复的类型
            1、旁白流程
            6、关键字结束流程
            7、挽回结束流程
            8、无人应答流程
            9、未匹配关键字流程
            10、转接人工流程
         -->
        <template v-if="[1, 6, 7, 8, 9, 10].indexOf(entity.type) === -1">
          <div class="text-r">
            <Button type="primary"
                    size="small"
                    @click="addReply">添加回复</Button>
          </div>

          <template v-show="entity.replys.length">
            <div v-for="(v, i) in entity.replys"
                 :key="i">
              <hr class="mt-20 mb-20" />
              <whispering-reply :data="v"
                                @remove="removeReply(i)"
                                :whisperingId="entity.whisperingId"
                                ref="replyForm" />
            </div>
          </template>
          <p class="nodata"
             v-show="entity.replys.length === 0">暂无回复</p>
        </template>

      </div>
    </div>
  </Form>
</template>

<script>
import { formMixin } from '@/mixins'
import WhisperingReply from './whisperingReply'
import nodeEntity from '../src/nodeEntity'
import replyEntity from '../src/replyEntity'
import { MsUpload } from '@/components/libs/upload'
import whisperingNodeApi from '@/api/ems/whisperingNode'
import { validateKey, reduceKeys } from '@/util'

export default {
  mixins: [formMixin],
  components: {
    WhisperingReply,
    MsUpload
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
      entity: nodeEntity({
        keyStatus: 1
      }),
      rules: {
        name: [
          { required: true, message: '请输入话术名称' }
        ],
        videoUrl: [
          { required: true, message: '请选择音频文件' }
        ],
        keys: [
          { validator: keysValidator, message: '至少输入一个关键字' }
        ]
      },
      initialData: '',
      key: {
        text: ''
      }
    }
  },
  methods: {
    afterEntity(entity) {
      this.refreshInitialData(entity)
    },
    // 记录初始化的数据
    // 用于判断数据是否有变更
    refreshInitialData(entity = this.entity) {
      this.initialData = JSON.stringify(entity)
    },
    hasModify() {
      // 1、新增时，始终true
      // 2、编辑时，判断当前节点是否有变更
      return !this.entity.id || JSON.stringify(this.entity) !== this.initialData
    },
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
    // 添加回复
    addReply() {
      this.entity.replys.push(replyEntity({
        redeem: 0,
        whisperingId: this.entity.whisperingId
      }))
    },
    // 移除回复
    removeReply(index) {
      this.entity.replys.splice(index, 1)
    },
    // 保存/更新话术节点
    submitNode() {
      let validators = [this.$refs.form.validate()]
      if (this.$refs.replyForm) {
        validators = validators.concat(this.$refs.replyForm.map(v => v.validate()))
      }
      Promise.all(validators).then(valids => {
        // Notice:
        // iview 的 form.valid的resolve条件为只要所有field验证完成即可，验证结果在参数中返回
        // 而不是通过promise的resolve和reject区分验证通过/失败
        if (valids.every(valid => !!valid)) {
          let entity = Object.assign({}, this.entity)
          if (this.$refs.replyForm) {
            // 读取replys的最新数据
            entity.replys = this.$refs.replyForm.map(v => v.entity)
          }

          whisperingNodeApi.saveOrUpdate(entity).then(id => {

            // 新增/编辑成功后，当前节点的初始数据需要更新为最新数据，否则在父节点判断当前节点是否变化的验证时无法通过
            // 新增时需要回写ID，因为新增始终被当作是有变更需要保存
            if (!entity.id) {
              this.entity.id = id
            }
            this.refreshInitialData()

            this.success(entity.id ? '更新成功' : '新增成功')
            this.$emit('after-submit', id, entity)
          })
        }
      }, () => { })
    },
    // 移除话术节点
    removeNode() {
      this.$emit('remove')
    },
    // 还原话术节点
    restoreNode() {
      this.refreshInitialData()
      this.$emit('restore')
    }
  }
}
</script>
