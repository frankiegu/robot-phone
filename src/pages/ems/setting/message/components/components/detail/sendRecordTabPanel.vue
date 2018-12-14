<template>
	<div>
		<i-table :columns="table.columns"
							:data='table.list'
							ref="table">
		</i-table>
    <div class="page-wrapper cf">
      <Page simple show-sizer 
        		:pageSize="params.pageSize" 
        		:pageNum="params.pageNum" 
            :total="page.totalNum"
            :current="params.pageNum"
        		@on-change="list" />
      <span class="fr">共 {{page.totalNum}} 条数据</span>
    </div>
	</div>
</template>

<script>
import { indexMixin } from '@/mixins'
import messageDetailMixin from './messageDetailMixin.js'
import MessageTemplateApi from '@/api/ems/messageTemplate'
import { duration, fmt } from '@/util'

export default {
	mixins: [indexMixin,messageDetailMixin],
	//props: {},
	data() {
		return {
      params: {
        id: ''
      },
			template: {},
			table: {
				columns: [{
					title: '序号',
					key: 'id',
          width: 60,
          align: 'center',
          fixed: 'left'
				},{
					title: '任务名称',
					key: 'taskName'
				},{
					title: '主叫号码',
					key: 'cardMobile'
				},{
					title: '客户号码',
					key: 'mobile'
				},{
					title: '客户等级',
					key: 'userLevel',
          align: 'center'
				},{
					title: '通话时长',
					key: 'callAllTime',
          value: row => {
            return duration(row.callAllTime)
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
				},{
					title: '通话轮次',
					key: 'callCount',
          align: 'center'
				},{
					title: '发送时间',
					key: 'createTime',
          value: row => {
            return fmt.date(row.createTime)
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
				}]
			}
		}
	},
	methods: {
    getApi() {
      return MessageTemplateApi
    },
		refreshMessageDetail(data) {
			this.params.id = data.id;
			if(this.params.pageNum > 1) {
    		this.$set(this.params, 'pageNum', 1);
			}
			this.search();
		},
    /**
     * 查询列表数据
     * @param {any} pageNum
     * @param {any} pageSize
     */
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      //this.params = Object.assign({}, this.params, this.data)
      if(!this.params.id){
				this.params = Object.assign({}, this.params, this.data);
      }
      let send = {
      	id: this.params.id,
      	pageNum: this.params.pageNum,
      	pageSize: this.params.pageSize
      };
      if (this.beforeList(send) !== false) {
        return this.getApi().getMessageTemplateSendRecordList(send).then(page => {
          this.afterList(page.dataList)
          this.setTableList(page.dataList)
          this.setPagination(page)
        })
      } else {
        return Promise.resolve()
      }
    }
	}
}
</script>