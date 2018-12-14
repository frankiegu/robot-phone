<template>
  <div>
    <Form inline>
      <FormItem label="分配状态"
                :label-width="60">
        <Select style="width: 120px;"
                v-model="params.status"
                placeholder="全部"
                clearable
                @on-change="search">
          <Option value="1">已分配</Option>
          <Option value="0">未分配</Option>
        </Select>
      </FormItem>
      <FormItem label="客户等级"
                :label-width="60">
        <Select style="width: 120px;"
                v-model="params.userLevel"
                placeholder="全部"
                clearable
                @on-change="search">
          <Option value="A">A</Option>
          <Option value="B">B</Option>
          <Option value="C">C</Option>
          <Option value="D">D</Option>
          <Option value="E">E</Option>
          <Option value="F">F</Option>
        </Select>
      </FormItem>
      <FormItem label="通话时长"
                :label-width="60">
        <Select style="width: 120px;"
                v-model="params.callAllTime"
                placeholder="全部"
                clearable
                @on-change="search">
          <Option value="1">小于10秒</Option>
          <Option value="2">10秒～1分钟</Option>
          <Option value="3">1分钟～2分钟</Option>
          <Option value="4">大于2分钟</Option>
        </Select>
      </FormItem>
      <FormItem label="通话轮次"
                :label-width="60">
        <Select style="width: 120px;"
                v-model="params.callCount"
                placeholder="全部"
                clearable
                @on-change="search">
          <Option value="1">0~10轮</Option>
          <Option value="2">11～20轮</Option>
          <Option value="3">21～30轮</Option>
          <Option value="4">大于30轮</Option>
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
            <DropdownItem @click.native="exportFile(index+1)" v-for="(item,index) in exportNumList" :key='index'>{{item}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <Table :columns="table.columns"
           :data="table.list"
           @on-selection-change="handleTableSelection"
           ref="table" />
    <ms-pagination :pageNum="params.pageNum"
                   :pageSize="params.pageSize"
                   :total="page.totalNum"
                   @change="list" />

    <ms-panel v-model="detail.show"
              title="通话详情">
      <call-record-detail :data="detail.entity"
                          v-if="detail.show" />
    </ms-panel>

  </div>
</template>

<script>
import { indexMixin, detailMixin } from '@/mixins'
import callRecordApi from '@/api/ems/callRecord'
import { CallRecordDetail } from '@/components/packages/ems/callRecord'
import { duration, fmt, downloadFileUrl } from '@/util'
import { getCallResultLabel } from '@/constants'

export default {
  mixins: [indexMixin, detailMixin],
  components: {
    CallRecordDetail
  },
  data() {
    return {
      params: {
        cardRelateId: this.data.cardRelateId,
        status: '',
        userLevel: '',
        callAllTime: '',
        callCount: ''
      },
      table: {
        columns: [{
          type: 'selection',
          width: 60,
          fixed: 'left'
        }, {
          title: '序号',
          key: 'id'
        }, {
          title: '客户号码',
          key: 'mobile'
        }, {
          title: '客户姓名',
          key: 'userName'
        }, {
          title: '呼叫结果',
          key: 'callResult',
          value: row => {
            return getCallResultLabel(row.callResult)
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }, {
          title: '客户等级',
          key: 'userLevel'
        }, {
          title: '通话时长',
          key: 'callAllTime',
          value: row => {
            return duration(row.callAllTime)
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }, {
          title: '通话轮次',
          key: 'callCount'
        }, {
          title: '呼叫时间',
          key: 'callStartTime',
          value: row => {
            return fmt.date(row.callStartTime)
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }, {
          title: '分配状态',
          key: 'status',
          value: row => {
            return ['未分配','已分配'][row.status]
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }, {
          title: '操作',
          render: (h, { row }) => {
            return h('a', {
              on: {
                click: () => {
                  this.showDetail(row.id)
                }
              }
            }, '详情')
          }
        }]
      }
    }
  },
  methods: {
    init() { },
    initData(resolve) {
      // Tab 切换结束后再执行请求
      setTimeout(() => {
        resolve()
      }, 350)
    },
    getApi() {
      return callRecordApi
    },
    afterEntity(data) {
      this.params.cardRelateId = data.cardRelateId
      this.search()
    },
    exportFile(pageSize) {
      let params = Object.assign({}, this.params)
      params.pageNum = 1
      params.pageSize = pageSize
      callRecordApi.exportFile(params).then(data => {
        downloadFileUrl(data, '通话记录.xls')
      })
    }
  }
}
</script>
