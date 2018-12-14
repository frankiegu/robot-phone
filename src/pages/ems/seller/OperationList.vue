<template>
  <div>
    <Table :columns="table.columns"
      :data="dataList"
      class="table"></Table>
    <Page class="pagination"
      :total="totalNum"
      :pageNum="pager.pageNum"
      :pageSize="pager.pageSize"
      @on-change="handleChangePageNum"
      @on-page-size-change="handleChangePageSize" />
  </div>
</template>
<script>
import API from '@/api/index'
import Util from '@/util/util'

const API_LOG = API.common.logSystemUserApi

export default {
  name: 'callList',
  data() {
    return {
      pager: {
        pageNum: 1,
        pageSize: 10
      },
      totalNum: 0,
      dataList: [],
      params: {},
      table: {
        columns: [{
          type: 'index',
          width: 60,
          align: 'center',
          title: '序号',
          key: '1'
        }, {
          title: '联系电话',
          align: 'center',
          key: 'mobile'
        }, {
          title: '管理员',
          align: 'center',
          key: 'name'
        }, {
          title: '操作内容',
          align: 'center',
          key: 'content'
        }, {
          title: '操作时间',
          align: 'center',
          key: 'createTime',
          render: (h, param) => {
            return h('span', Util.msToDate(param.row.createTime))
          }
        }]
      }
    }
  },
   mounted() {
    let id =this.id
    this.initList({id})
  },
  methods: {
    initList(param){
      this.params = Object.assign({}, param)
      this.getList()
    },
    getList() {
      const obj = Object.assign({}, this.pager, this.params)
      API_LOG.list(obj)
        .then(res => {
          this.dataList = res.dataList
        })
    },
    handleChangePageNum(toPage) {
      this.pager.pageNum = toPage
      this.getCallList()
    },
    handleChangePageSize(newSize) {
      this.pager.pageSize = newSize
      this.pager.pageNum = 1
      this.getCallList()
    }
  }
}
</script>
