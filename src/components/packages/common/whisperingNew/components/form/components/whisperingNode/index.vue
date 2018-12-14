<template>
  <div>
    <Form :label-width="90"
        style="overflow: hidden;"
        ref="form">
    <div class="block">
      <div class="block-header clear">
        <div class="fr">
          
          <!-- 特殊流程/重复模块 不能删除 -->
          <a href="###" @click="showDel">
            <Icon size="24" color="red" type="ios-trash-outline" />
          </a>
          <a href="###" @click="showUpdate">
            <Icon size="24" type="ios-create-outline" />
          </a>
        </div>
        {{entity.name}}
      </div>
      <div class="block-body" style="margin-top:20px;">
        <Row>
          <i-col :span="14">
            <i-input type="textarea"
                     placeholder="对照语音输入文字"
                     :rows="4"
                     v-model.trim="entity.content"
                     readonly />
            <div class="audio"
                 v-if="entity.videoUrl">
              <div class="audio-file"
                   style="margin-right: 0; margin-bottom: 10px; margin-top: 10px;"
                   v-for="v in entity.videoUrl.split(',')"
                   :key="v">
                <audio controls
                       :src="v" />
              </div>
            </div>
          </i-col>
          <i-col :span="10"
                 style="padding-left: 10px;">
            <div>
              <Checkbox :value="entity.isEnd === 1"
                        disabled>结束通话</Checkbox>
              <!-- 五期未完成屏蔽
              <Checkbox :value="entity.isInterrupt === 1"
                        disabled>不允许打断</Checkbox>
              <Checkbox :value="entity.isTransfer === 1"
                        disabled>转接人工</Checkbox>
                        -->
            </div>
            <hr />
            <!-- 主流程、辅助流程 显示跳转分支 -->
            <template v-if="[1, 2].includes(entity.module)">
              <div v-if="entity.nextNodeList && entity.nextNodeList.length"
                   style="max-height: 200px; overflow: auto;">
                <FormItem v-for="(v, i) in entity.nextNodeList"
                          :key="i"
                          :label="getNextTypeLabel(v.nextType) + ':'"
                          style="margin-bottom: 0;">
                  {{getNextModuleLabel(v.nextModule)}}/{{v.nextNodeName}}
                </FormItem>
              </div>
              <p class="nodata"
                 v-else>暂无跳转分支</p>
            </template>
          </i-col>
        </Row>
      </div>
    </div>
  </Form>
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'
import getNextTypeLabel from './src/nextType'
import getNextModuleLabel from './src/nextModule'

export default {
  mixins: [detailMixin],
  props: {
    shouldShowKeyWord: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getNextTypeLabel,
    getNextModuleLabel,
    showUpdate() {
      this.$emit('showUpdate', this.entity)
    },
    showDel() {
      this.$emit('showDel', this.entity)
    }
  }
}
</script>
