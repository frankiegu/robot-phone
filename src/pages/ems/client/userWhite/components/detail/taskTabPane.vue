<template>
  <div>
    <div class="title" style="border-bottom:1px solid #f1f1f1;padding-bottom:10px;">营销任务</div>
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
import { indexMixin, detailMixin } from '@/mixins'
import userWhiteApi from '@/api/ems/userWhite'
import { fmt } from '@/util'

export default {
  mixins: [indexMixin, detailMixin],
  data() {
    return {
      params: {
        id: this.data.id
      },
      table: {
        columns: [{
          title: '序号',
          key: 'id'
        }, {
          title: '任务名称',
          key: 'taskName'
        }, {
          title: '创建时间',
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
      return userWhiteApi
    },
    get() {
      this.params.id = this.data.id
      this.search()
    },
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params)
      userWhiteApi.listTask(params).then(page => {
        this.setTableList(page.dataList)
        this.setPagination(page)
      })
    }
  }
}
</script>
