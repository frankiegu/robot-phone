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
import { indexMixin, detailMixin } from '@/mixins'
import systemConfigApi from '@/api/oms/systemConfig'
import { fmt } from '@/util'

export default {
  mixins: [indexMixin, detailMixin],
  data() {
    return {
      params: {
        level: this.data.level
      },
      table: {
        columns: [{
          title: '序号',
          key: 'id'
        }, {
          title: '城市名称',
          key: 'cityName'
        }, {
          title: '企业名称',
          key: 'name'
        }, {
          title: '代理类型',
          key: 'cityProxyType',
          value: row => {
            return fmt.value(row.cityProxyType, ['', '金牌代理', '银牌代理', '铜牌代理'])
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
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
    initData(resolve) {
      // Tab 切换结束后再执行请求
      setTimeout(() => {
        resolve()
      }, 350)
    },
    afterEntity(data) {
      this.params.level = data.level
      this.search()
    },
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params)
      systemConfigApi.listAgentPage(params).then(page => {
        this.setTableList(page.dataList)
        this.setPagination(page)
      })
    }
  }
}
</script>
