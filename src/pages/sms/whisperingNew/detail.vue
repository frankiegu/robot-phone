<template>
  <div class="panel">
    <div class="panel-header">
      <i class="icon icon-enlarge panel-header-icon"
         :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'"
         @click="toggleFullScreen"></i>
      任务详情
      <div class="panel-header-tools"
           v-if="entity.id">
        <Button type="default"
                @click="showTalk">体验话术</Button>
        <export-whispering :data="entity"
                           isNew />
        <!-- 发布话术 -->
        <template v-if="entity.send === 1">
          <Button type="primary"
                  @click="release">发布</Button>
        </template>
        <!-- 企业待审核话术 -->
        <template v-if="entity.owner === 2 && entity.checkStatus === 0">
          <Button type="info"
                  @click="showCheckStatus">审核</Button>
        </template>
        <!-- 共享话术才能关联企业 -->
        <template v-if="entity.owner === 1">
          <Button type="primary"
                  @click="showRelate">关联企业</Button>
        </template>
        <Button type="primary"
                @click="showCopy">复制</Button>
        <Button type="primary"
                @click="showForm">编辑</Button>
        <Button type="error"
                @click="showDel(entity.id)">删除话术</Button>
      </div>
    </div>
    <div class="panel-body">
      <p class="nodata"
         v-show="!entity.id">暂无数据</p>
      <Tabs v-model="tabName"
            v-if="entity.id">
        <TabPane label="基础信息"
                 name="info"
                 style="padding: 0 5px;">
          <info-tab-pane :data="entity"
                         v-if="tabName === 'info'"
                         showStatusBtn
                         @updated="updatedInfo" />
        </TabPane>
        <TabPane label="问答管理"
                 name="question"
                 style="padding: 0 5px;">
          <question-tab-pane :data="entity"
                             v-if="tabName === 'question'"
                             @updated="updatedInfo" />
        </TabPane>
        <TabPane label="参数配置"
                 name="setting"
                 style="padding: 0 5px;">
          <param-tab-pane :data="entity"
                          v-if="tabName === 'setting'" />
        </TabPane>
        <TabPane label="企业列表"
                 name="firm"
                 style="padding: 0 5px;">
          <firm-tab-pane :data="entity"
                         v-if="tabName === 'firm'" />
        </TabPane>
        <TabPane label="企业操作日志"
                 name="log"
                 v-if="entity.owner === 2"
                 style="padding: 0 5px;">
          <log-tab-pane :data="entity"
                        v-if="tabName === 'log'" />
        </TabPane>
      </Tabs>
    </div>

    <!-- 话术关联企业 -->
    <Modal v-model="relate.show"
           title="关联企业">
      <Form :label-width="120"
            :model="relate.entity"
            :rules="relate.rules"
            ref="relateForm"
            v-if="relate.show">
        <FormItem label="话术">
          {{data.title}}
        </FormItem>
        <FormItem label="选择企业"
                  prop="ids">
          <unrelate-firm-select v-model="relate.entity.ids"
                                :options="{multiple: true}"
                                :whisperingId="entity.id" />
        </FormItem>
        <FormItem label="是否允许复制">
          <Checkbox v-model="relate.entity.isCopy"
                    :true-value="1"
                    :false-value="0" />
        </FormItem>
        <FormItem label="是否允许导出">
          <Checkbox v-model="relate.entity.isDownload"
                    :true-value="1"
                    :false-value="0" />
        </FormItem>
        <FormItem>
          <Button type="ghost"
                  style="margin-right: 8px"
                  @click="cancelRelate">取消</Button>
          <Button type="primary"
                  @click="submitRelate">确定</Button>
        </FormItem>
      </Form>
      <div slot="footer"></div>
    </Modal>

    <!-- 复制话术 -->
    <Modal v-model="copy.show"
           title="复制话术">
      <copy :data="copy.entity"
            showAuthorization
            @after-submit="afterSubmitCopy"
            @on-cancel="cancelCopy"
            v-if="copy.show" />
      <div slot="footer"></div>
    </Modal>

    <!-- 企业话术审核 -->
    <Modal v-model="checkStatus.show"
           title="审核">
      <Form :label-width="60"
            :model="checkStatus.entity"
            :rules="checkStatus.rules"
            ref="checkStatusForm"
            v-if="checkStatus.show">
        <FormItem label="备注："
                  prop="content">
          <i-input type="textarea"
                   :rows="4"
                   :maxlength="200"
                   placeholder="请输入原因"
                   v-model.trim="checkStatus.entity.content" />
        </FormItem>
        <FormItem>
          <Button type="ghost"
                  style="margin-right: 8px"
                  @click="cancelCheckStatus">取消</Button>
          <Button type="primary"
                  style="margin-right: 8px"
                  @click="resolveCheckStatus">通过</Button>
          <Button type="warning"
                  @click="rejectCheckStatus">拒绝</Button>
        </FormItem>
      </Form>
      <div slot="footer"></div>
    </Modal>

    <talk v-model="talk.show"
          :whisperingId="entity.id"
          :title="entity.title" />
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'
import { ExportWhispering } from '@/components/packages/common/whispering'
import { Copy, InfoTabPane, LogTabPane, QuestionTabPane } from '@/components/packages/common/whisperingNew'
import FirmTabPane from './components/detail/firmTabPane'
import ParamTabPane from './components/detail/paramTabPane'
import whisperingNewApi from '@/api/common/whisperingNewApi'
import { UnrelateFirmSelect } from '@/components/packages/common/select'
import Talk from '@/components/packages/common/talk'

export default {
  mixins: [detailMixin],
  components: {
    InfoTabPane,
    FirmTabPane,
    LogTabPane,
    UnrelateFirmSelect,
    Copy,
    QuestionTabPane,
    ParamTabPane,
    Talk,
    ExportWhispering
  },
  props: {
    fullScreen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tabName: 'info',
      relate: {
        show: false,
        entity: {
          ids: [],
          isCopy: 1,
          isDownload: 1
        },
        rules: {
          ids: [
            {
              validator(rule, value, callback, source, options) {
                let errors = []
                if (value && value.length === 0) {
                  errors.push(rule.message)
                }
                callback(errors)
              }, message: '请选择企业'
            }
          ]
        }
      },
      copy: {
        show: false,
        entity: {
          name: '',
          isCopy: 1,
          isDownload: 1
        },
        rules: {
          name: [
            { required: true, message: '请输入话术名称' }
          ]
        }
      },
      checkStatus: {
        show: false,
        entity: {
          content: ''
        }
      },
      talk: {
        show: false
      }
    }
  },
  methods: {
    afterEntity(entity) {
      if (entity.owner !== 2 && this.tabName === 'log') {
        this.tabName = 'info'
      }
    },
    toggleFullScreen() {
      this.$emit('toggleFullScreen', !this.fullScreen)
    },
    showDel(id, content = '删除操作不可恢复，确认继续删除?') {
      this.$Modal.confirm({
        title: '确认删除',
        content,
        onOk: (action, instance) => {
          whisperingNewApi.del(id).then(() => {
            this.success('删除成功')
            this.$emitBus('sms.whisperingNew.list.delete')
          })
        }
      })
    },
    showForm() {
      this.$emit('showForm', this.entity.id)
    },
    showRelate() {
      this.relate.entity.ids = []
      this.relate.entity.isCopy = 1
      this.relate.entity.isDownload = 1
      this.relate.show = true
    },
    cancelRelate() {
      this.relate.show = false
    },
    submitRelate() {
      this.$refs.relateForm.validate().then(valid => {
        if (valid) {
          whisperingNewApi.addRelate(Object.assign({}, this.relate.entity, {
            whisperingId: this.entity.id
          })).then(() => {
            this.success('关联成功')
            this.relate.show = false
            this.$emitBus('sms.whisperingNew.list.update')
          })
        }
      })
    },
    release() {
      whisperingNewApi.sendPublic(this.entity.id).then(() => {
        this.success('发布成功')
        this.$emitBus('sms.whisperingNew.list.update')
      })
    },
    showCopy() {
      this.copy.entity = {
        name: this.entity.title,
        whisperingId: this.entity.id,
        isCopy: 1,
        isDownload: 1
      }
      this.copy.show = true
    },
    cancelCopy() {
      this.copy.show = false
    },
    afterSubmitCopy() {
      this.success('复制成功')
      this.copy.show = false
      this.$emitBus('sms.whisperingNew.list.update')
    },
    showCheckStatus() {
      this.checkStatus.entity.content = ''
      this.checkStatus.show = true
    },
    cancelCheckStatus() {
      this.checkStatus.show = false
    },
    resolveCheckStatus() {
      this.updateCheckStatus(1, '通过')
    },
    rejectCheckStatus() {
      this.updateCheckStatus(2, '拒绝')
    },
    updateCheckStatus(checkStatus, label) {
      let content = this.checkStatus.entity.content
      if (content === '') {
        content = label
      }
      return whisperingNewApi.check({
        checkStatus,
        content,
        id: this.entity.id
      }).then(() => {
        this.success(`${label}成功`)
        this.checkStatus.show = false
        this.$emitBus('sms.whisperingNew.list.update')
      })
    },
    updatedInfo() {
      this.$emitBus('sms.whisperingNew.list.update')
    },
    showTalk() {
      this.talk.show = true
    }
  }
}
</script>
