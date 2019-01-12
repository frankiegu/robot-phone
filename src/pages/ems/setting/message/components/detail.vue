<template>
	<div>
	  <div class="panel" >
			<div class="panel-body" 
						v-show="!entity || !entity.id">
				<p class="nodata">暂无数据</p>
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
					<TabPane label="发送记录"
										name="record">
          	<ms-lazy :initial="tabName === 'record'">
							<send-record-tab-panel  v-if="tabName === 'record'" :data="entity"/>
          	</ms-lazy>
					</TabPane>
				
					 <div class="panel-header-tools fr"  slot="extra" v-if="entity && entity.id">
          <i-button type="primary" class="mr10" @click="showEdit">编辑</i-button>
          <i-button type="error" @click="showDel(entity.id)">删除</i-button>
        </div>
				</Tabs>
			</div>
		</div>
		<!-- 弹窗 -->
    <Modal width="620px" :mask-closable="false" class-name="vertical-center-modal" v-model="template.show"
              :title="entity.id ? '编辑短信模板' : '新增短信模板'">
      <template v-if="template.show">
        <message-form :data="entity"
				          ref="mYform"
                  @on-cancel="cancelForm"
                  @after-submit="afterSubmitForm"></message-form>
      </template>
			<div slot="footer">
							<i-button 
							type="text"
				          style="margin-right: 8px"
				          @click="cancelForm">取消</i-button>
				<i-button type="primary"
				          @click="submitFrom">确定</i-button>
				</div>
    </Modal>
	</div>
</template>

<script>
import { detailMixin } from '@/mixins'
import messageTemplateApi from '@/api/ems/messageTemplate'
import messageDetailMixin from './components/detail/messageDetailMixin.js'
import InfoTabPanel from './components/detail/infoTabPanel.vue'
import SendRecordTabPanel from './components/detail/sendRecordTabPanel.vue'
import MessageForm from './new.vue'
import messageEventBus from './messageEventBus'

export default {
	mixins: [detailMixin],
	components: {
		InfoTabPanel,
		SendRecordTabPanel,
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
			template: {
				show: false
			}
		}
	},
	methods: {
			submitFrom(){
			this.$refs.mYform.submit();
		},
    getApi() {
    	return messageTemplateApi
    },
    toggleFullScreen() {
      this.$emit('toggleFullScreen', !this.fullScreen)
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
      messageEventBus.$emit('message-update', data, entity)
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
            messageEventBus.$emit('message-delete')
          })
        }
      })
    }
	}
}
</script>