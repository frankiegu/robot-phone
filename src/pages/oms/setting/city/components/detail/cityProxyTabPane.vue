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
import { OMS } from '@/constants'

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
          title: '企业名称',
          key: 'name'
        }, {
          title: '代理类型',
          key: 'cityProxyType',
          value: row => {
            return fmt.value(row.cityProxyType, OMS.CITY_PROXY_TYPE_MAP)
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
    afterEntity(data) {
      this.params.id = data.id
      this.search()
    },
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params)
      systemConfigApi.listCityAgent(params).then(page => {
        this.setTableList(page.dataList)
        this.setPagination(page)
      })
    }
  }
}
</script>
