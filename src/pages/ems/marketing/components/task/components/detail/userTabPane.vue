<template>
  <div>
    <Form inline>
      <div class="fr">
        <FormItem>
          <i-input type="text"
                   placeholder="搜索客户号码"
                   v-model.trim="params.mobile"
                   @on-enter="search">
            <Icon type="search"
                  slot="prepend"></Icon>
          </i-input>
        </FormItem>
        <FormItem :label-width="1">
          <Button type="primary"
                  @click="search">查询</Button>
        </FormItem>
      </div>
      <FormItem label="拨打状态"
                :label-width="60">
        <Select style="width: 120px;"
                v-model="params.isCall"
                placeholder="全部"
                clearable
                @on-change="search">
          <Option value="0">未拨打</Option>
          <Option value="1">已拨打</Option>
        </Select>
      </FormItem>
    </Form>
    <div class="tool">
      <div class="tool-btns">
        <Dropdown>
          <Button type="success">
            导出
            <Icon type="arrow-down-b"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem @click.native="exportFile(index+1)"
                          v-for="(item,index) in exportNumList"
                          :key='index'>{{item}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
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
import taskDetailMixin from './taskDetailMixin'
import taskApi from '@/api/ems/task'
import { fmt, downloadFileUrl } from '@/util'

export default {
  mixins: [indexMixin, taskDetailMixin],
  data() {
    return {
      params: {
        taskId: this.data.id,
        isCall: '',
        mobile: ''
      },
      table: {
        columns: [{
          title: '客户号码',
          key: 'mobile'
        }, {
          title: '拨打状态',
          key: 'isCall',
          render: (h, { row }) => {
            return h('span', ['未拨打', '已拨打'][row.isCall])
          }
        }, {
          title: '呼叫时间',
          key: 'callStartTime',
          value: row => {
            return fmt.date(row.callStartTime)
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
      return taskApi
    },
    refreshTaskDetail(data) {
      this.params.taskId = data.id
      this.search()
    },
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params)
      taskApi.listUser(params).then(page => {
        this.dealTotalNum(page.totalNum)
        this.setTableList(page.dataList)
        this.setPagination(page)
      })
    },
    exportFile(pageSize) {
      let params = Object.assign({}, this.params)
      params.pageNum = 1
      params.pageSize = pageSize
      taskApi.exportUser(params).then(data => {
        downloadFileUrl(data, '营销对象.xls')
      })
    }
  }
}
</script>
