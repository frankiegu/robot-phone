<template>
  <div>
    <Table :columns="table.columns"
           :data="table.list"
           ref="table" />
    <ms-pagination :pageNum="params.pageNum"
                   :pageSize="params.pageSize"
                   :total="page.totalNum"
                   @change="list" />
  </div>
</template>

<script>
import { indexMixin } from '@/mixins'
import whisperingDetailMixin from './whisperingDetailMixin'
import whisperingApi from '@/api/ems/whispering'
import { fmt } from '@/util'
import whisperingEventBus from '../../src/whisperingEventBus'

export default {
  mixins: [indexMixin, whisperingDetailMixin],
  data() {
    return {
      params: {
        whisperingId: this.data.id
      },
      table: {
        columns: [{
          title: '序号',
          key: 'id'
        }, {
          title: '操作人',
          key: 'adminName'
        }, {
          title: '话术节点',
          key: 'whisperingNodesName'
        }, {
          title: '日志内容',
          key: 'content'
        }, {
          title: '操作时间',
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
      return whisperingApi
    },
    refreshTaskDetail(data) {
      this.params.whisperingId = data.id
      this.search()
    },
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params)
      whisperingApi.listLog(params).then(page => {
        this.setTableList(page.dataList)
        this.setPagination(page)
      })
    }
  }
}
</script>
