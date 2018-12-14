<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        <i class="icon icon-enlarge panel-header-icon"
           :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'"
           @click="toggleFullScreen"></i>
        短信模板详情
        <div class="panel-header-tools"
             v-if="entity.id">
          <template v-if="entity.isCheck === 0">
            <Button type="info"
                    @click="showCheckStatus">审核</Button>
            <i-button type="primary"
                      @click="showEdit">编辑</i-button>
            <i-button type="error"
                      @click="showDel(entity.id)">删除</i-button>
          </template>
        </div>
      </div>
      <div class="panel-body"
           v-show="!entity || !entity.id">
        <p class="nodata">暂无数据!!</p>
      </div>
      <div class="panel-body"
           v-if="entity && entity.id">
        <Tabs v-model="tabName">
          <TabPane label="基础信息"
                   name="info">
            <ms-lazy :initial="tabName === 'info'">
              <info-tab-panel :data="entity" />
            </ms-lazy>
          </TabPane>
        </Tabs>
      </div>
    </div>

    <!-- 企业短信模板审核 -->
    <Modal v-model="checkStatus.show"
           title="审核">
      <Form :label-width="60"
            :model="checkStatus.entity"
            :rules="checkStatus.rules"
            ref="checkStatusForm"
            v-if="checkStatus.show">
        <FormItem label="备注："
                  prop="reason">
          <i-input type="textarea"
                   :rows="4"
                   :maxlength="200"
                   placeholder="请输入原因"
                   v-model.trim="checkStatus.entity.reason" />
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

    <!-- 弹窗 -->
    <ms-panel v-model="template.show"
              :title="entity.id ? '编辑短信模板' : '新增短信模板'">
      <template v-if="template.show">
        <message-form :data="entity"
                      @on-cancel="cancelForm"
                      @after-submit="afterSubmitForm"></message-form>
      </template>
    </ms-panel>
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'
import messageTemplateApi from '@/api/sms/messageTemplate'
import InfoTabPanel from './components/detail/infoTabPane.vue'
import messageEventBus from './src/messageEventBus'
import MessageForm from './form'

export default {
  mixins: [detailMixin],
  components: {
    InfoTabPanel,
    MessageForm
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
      checkStatus: {
        show: false,
        entity: {
          reason: ''
        }
      },
      template: {
        show: false
      }
    }
  },
  methods: {
    getApi() {
      return messageTemplateApi
    },
    toggleFullScreen() {
      this.$emit('toggleFullScreen', !this.fullScreen)
    },
    showCheckStatus() {
      this.checkStatus.entity.reason = ''
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
    updateCheckStatus(isCheck, label) {
      let reason = this.checkStatus.entity.reason
      if (reason === '') {
        reason = label
      }
      return messageTemplateApi.check({
        isCheck,
        reason,
        id: this.entity.id
      }).then(() => {
        this.success(`${label}成功`)
        this.checkStatus.show = false
        messageEventBus.$emit('list.update')
      })
    },
    showEdit() {
      this.template.show = true
    },
    /**
     * 新增/编辑成功后执行,这次是编辑
     * @param {any} entity, 表单的数据
     * @param {any} data, 提交之后返回值
     */
    afterSubmitForm(data, entity) {
      this.template.show = false
      this.success('编辑成功')
      messageEventBus.$emit('list.update', data, entity)
    },
    cancelForm() {
      this.template.show = false
    },
    showDel(id, content = '删除操作不可恢复，确认继续删除?') {
      this.$Modal.confirm({
        title: '确认删除',
        content,
        onOk: (action, instance) => {
          messageTemplateApi.deleteTemplate(id).then(() => {
            this.success('删除成功')
            messageEventBus.$emit('list.update')
          })
        }
      })
    }
  }
}
</script>