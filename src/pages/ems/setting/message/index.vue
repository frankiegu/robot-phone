<template>
	<div>
		<Breadcrumb separator=">">
        <span class="home" @click="linkTo('emsHomeIndex')">
          <BreadcrumbItem>首页</BreadcrumbItem>
        </span>
        <BreadcrumbItem>系统设置</BreadcrumbItem>
        <BreadcrumbItem>短信模板管理</BreadcrumbItem>
    </Breadcrumb>
		<div class="divide"
		     :class="{ full: fullScreen }">
			<div class="task">
				<!-- 左侧 -->
				<div class="task-l divide-item">
					<div class="panel">
						<div class="panel-header fleX" style="padding-left:0.5rem;padding-right:0.5rem;">
							<div>
								<Icon type="ios-list-outline" class="vm fs18 v-before mr10"></Icon>
              <span class="vm mr-40">短信模板</span>
							</div>
							<div class="panel-header-tools">
								<i-button type="primary"
								          @click="showForm()"><Icon type="md-add" size="16" class="mt--2"/>添加模板</i-button>
							</div>
						</div>
						<div class="pd10" style="padding-bottom:0;">
							<div class="mt10 fleX">
									<i-select 
									        style="width:100%;"
								          placehoder="审核状态"
								          v-model="params.type"
								          @on-change="search">
									<i-option value="">全部</i-option>
									<i-option value="0">待审核</i-option>
									<i-option value="1">通过</i-option>
									<i-option value="2">拒绝</i-option>
								</i-select>
									<i-select
									style="width:100%;"
								          placehoder="请选择模板分类"
								          v-model="params.type"
								          @on-change="search">
									<i-option value="">全部</i-option>
									<i-option value="1">初筛推送短信</i-option>
									<i-option value="2">关键字短信</i-option>
								</i-select>
							</div>
							<div class="mt10">
									<i-input placeholder="搜索模板ID/名称"
									search
									@on-search= "search"
									         v-model.trim="params.idName"
									         @keyup.native.enter="search">
									</i-input>
							</div>
						</div>
						<div class="panel-body">
							<p class="nodata"
							   v-show="!table.list.length">暂无数据</p>
							<div v-show="table.list.length">
								<ul class="list">
									<li v-for="( item, i ) in table.list"
									    :key="i"
									    :class="detail.entity.id === item.id ? 'active' : ''"
									    @click="showDetail(item)">
										<div class="list-item">
											<div class="list-item-main">
												<p>
													{{ item.name }}
												</p>
												<p>
													发送量：{{ item.sendCount }}
												</p>
											</div>
										</div>
									</li>
								</ul>
								<div class="page-wrapper cf">
									<ms-pagination simple
									               :pageNum="params.pageNum"
									               :pageSize="params.pageSize"
									               :total="page.totalNum"
									               @change="list" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 右侧 -->
				<div class="task-r divide-main">
					<message-detail @toggleFullScreen="toggleFullScreen"
					                :fullScreen="fullScreen"
					                :data="detail.entity" />
				</div>
					<!-- 弹窗 -->
			<Modal width="620px" :mask-closable="false" class-name="vertical-center-modal" v-model="form.show"
			          :title="form.entity.id ? '编辑短信模板' : '新增短信模板'">
				<template v-if="form.show">
					<message-form :data="form.entity"
					              @on-cancel="cancelForm"
												ref="mYform"
					              @after-submit="afterSubmitForm"></message-form>
				</template>
				<div slot="footer">
							<i-button 
				          style="margin-right: 8px"
				          @click="cancelForm">取消</i-button>
				<i-button type="primary"
				          @click="submitFrom">确定</i-button>
				</div>
			</Modal>
			</div>
		
		</div>
	</div>
</template>

<script>
import { indexMixin } from '@/mixins'
import messageTemplateApi from '@/api/ems/messageTemplate'
import MessageDetail from './components/detail.vue'
import MessageForm from './components/new.vue'
import messageEventBus from './components/messageEventBus'
import Util from '@/util/util'
export default {
	name: 'emsMessage',
	mixins: [indexMixin],
	components: { MessageDetail, MessageForm },
	data() {
		return {
			params: {
				idName: '',
				type: '',
				isCheck: ''
			},
			fullScreen: false
		}
	},
	created() {
		// 更新模板时触发，更新营销任务列表，并重新读取当前的详情
		messageEventBus.$on('message-update', (data, entity) => {
			this.afterSubmitForm(data, entity)
		})

		// 删除模板时触发，更新营销任务列表，并定位到第一个营销任务的详情
		messageEventBus.$on('message-delete', id => {
			this.listAndDetail(0)
		})
	},
	methods: {
		 linkTo(name) {
      Util.openPage(this, name);
    },
		submitFrom(){
			this.$refs.mYform.submit();
		},
		getApi() {
			return messageTemplateApi
		},
		toggleFullScreen(val) {
			this.fullScreen = val
		},
		search() {
			this.table.selection = []
			// 切换筛选条件时，默认获取第一页
			this.params.pageNum = 1
			this.listAndDetail(0)
		},
    /**
     * 新增/编辑成功后执行
     * @param {any} entity, 表单的数据
     * @param {any} data, 提交之后返回值
     */
		afterSubmitForm(data, entity) {
			this.form.show = false
			// 根据id是否为空，判断新增/编辑
			if (entity.id) {
				this.listAndDetail()
			} else {
				this.listAndDetail(0)
			}
			this.$Message.success(`${entity.id ? '编辑' : '新增'}成功`)
		}

	}
}
</script>