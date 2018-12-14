<template>
  <div>
    <div class="panel">
      <div class="panel-body">
        <Form class="panel-form"
              inline
              :label-width="70">
          <div class="fr">
            <FormItem style="marginLeft:-70px;">
              <i-input type="text"
                       placeholder="搜索ID/主叫号码/客户号码/日期"
                       style="width: 210px;"
                       v-model.trim="params.idOrMobileOrCardMobile"
                       @on-enter="search">

              </i-input>
            </FormItem>
            <FormItem :label-width="1">
              <Button type="primary"
                      @click="search">查询</Button>
            </FormItem>
          </div>
          <FormItem label="运营商">
            <Select style="width: 100px;marginRight:0"
                    v-model="params.platform_id"
                    placeholder="全部"
                    clearable
                    @on-change="search">
              <Option :value="item.id"
                      v-for="item in operatorList"
                      @foucs="getFirmList(params.platform_id)"
                      :key='item.id'>{{item.name}}</Option>

            </Select>
          </FormItem>
          <FormItem :label-width="1">
            <Select style="width: 100px;"
                    :disabled="!params.platform_id"
                    v-model="params.admin_id"
                    placeholder="企业列表"
                    clearable
                    @on-change="search">
              <Option :value="item.id"
                      v-for="item in firmList"
                      :key='item.id'>{{item.name}}</Option>

            </Select>
          </FormItem>
          <FormItem :label-width="1">
            <Select style="width: 100px;"
                    :disabled="!params.admin_id"
                    v-model="params.task_id"
                    placeholder="任务名称"
                    clearable
                    @on-change="search">
              <Option :value="item.id"
                      v-for="item in  taskList"
                      :key='item.id'>{{item.taskName }}</Option>

            </Select>
          </FormItem>
          <FormItem label="分配状态">
            <Select style="width: 100px;"
                    v-model="params.status"
                    placeholder="全部"
                    clearable
                    @on-change="search">
              <Option value="1">已分配</Option>
              <Option value="0">未分配</Option>
            </Select>
          </FormItem>
          <FormItem label="是否转接">
            <Select style="width: 100px;"
                    v-model="params.isTransfer"
                    placeholder="全部"
                    clearable
                    @on-change="search">
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          </FormItem>
          <FormItem label="客户等级">
            <Select style="width: 100px;"
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
          <FormItem label="呼叫结果">
            <Select style="width: 100px;"
                    v-model="params.callResult"
                    placeholder="全部"
                    clearable
                    @on-change="search">
              <Option v-for="(v, k) in CALL_RESULT"
                      :key="k"
                      :value="k">{{v}}</Option>
            </Select>
          </FormItem>
          <FormItem label="通话时长">
            <Select style="width: 100px;"
                    v-model="params.callAllTime"
                    placeholder="全部"
                    clearable
                    @on-change="search">
              <Option value="1">小于10秒</Option>
              <Option value="2">10秒～20秒</Option>
              <Option value="3">20秒～30秒</Option>
              <Option value="4">30秒～40秒</Option>
              <Option value="5">40秒～50秒</Option>
              <Option value="6">50秒～1分钟</Option>
              <Option value="7">1分钟～2分钟</Option>
              <Option value="8">大于2分钟</Option>
            </Select>
          </FormItem>
          <FormItem label="通话轮次">
            <Select style="width: 100px;"
                    v-model="params.callCount"
                    placeholder="全部"
                    clearable
                    @on-change="search">
              <Option value="1">0~少于3轮</Option>
              <Option value="2">4～6轮</Option>
              <Option value="3">7～10轮</Option>
              <Option value="4">11～20轮</Option>
              <Option value="5">21～30轮</Option>
              <Option value="6">大于30轮</Option>
            </Select>
          </FormItem>
          <FormItem label="呼叫日期">
            <DatePicker type="daterange"
                        placeholder="选择日期"
                        style="width: 200px;"
                        @on-change="delaySearch"
                        v-model="dateRange" />
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
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
    </div>

    <ms-panel v-model="detail.show"
              title="通话详情">
      <call-record-detail :data="detail.entity"
                          v-if="detail.show" />
    </ms-panel>
  </div>
</template>
<script>
import { indexMixin } from '@/mixins'
import callRecordApi from '@/api/sms/callRecord'
import relayLineApi from "@/api/common/relayLineCount";
import { duration, fmt, downloadFileUrl, watchDateRangeToTimestamp } from '@/util'
import { CallRecordDetail } from '@/components/packages/ems/callRecord'
import { getCallResultLabel, CALL_RESULT } from '@/constants'

export default {
  name: 'marketingCall',
  mixins: [indexMixin],
  components: {
    CallRecordDetail
  },
  data() {
    return {
      params: {
        status: '',
        userLevel: '',
        callResult: '',
        idOrMobileOrCardMobile: '',
        taskId: '',
        callAllTime: '',
        callCount: '',
        isTransfer: '',
        startTime: '',
        endTime: '',
        platform_id: '',
        admin_id: '',
        task_id: ''
      },
      firmList: [], // 企业列表
      operatorList: [], // 运营商列表
      taskList: [],
      dateRange: [],
      CALL_RESULT,
      table: {
        columns: [{
          title: '通话ID',
          key: 'id'
        }, {
          title: '主叫号码',
          key: 'cardMobile',
        }, {
          title: '客户号码',
          key: 'mobile'
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
          key: 'userLevel',
          align: 'center'
        }, {
          title: '是否转接人工',
          key: 'isTransfer',
          align: 'center',
          value: row => {
            return ['否', '是'][row.isTransfer]
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }, {
          title: '转接对象',
          key: 'transferName',
          render: (h, { row, column, index }) => {
            return h('span', row.transferName ? row.transferName : '无')
          }
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
          title: '营销任务',
          key: 'taskName'
        }, {
          title: '分配状态',
          key: 'status',
          value: row => {
            return ['未分配', row.employeeName || '已分配'][row.status]
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }]
      }
    }
  },
  created() {
    this.$watch('params.platform_id', function (val) {
      if (val) {
        this.getFirmList(val)
      }
    }, { deep: true })

    this.$watch('params.admin_id', function (val) {
      if (val) {
        this.getTaskList(val)
      }
    }, { deep: true })
    this.$watch('dateRange', watchDateRangeToTimestamp(this.params, 'startTime', 'endTime'))
  },
  methods: {
    getApi() {
      return callRecordApi
    },
    getOperatorList() {
      callRecordApi.getOperatorList().then(res => {
        this.operatorList = res
      })
    },
    getFirmList(id) {
      callRecordApi.getFirmList({ id }).then(res => {
        this.firmList = res
      })
    },
    getTaskList(admin_id) {
      callRecordApi.getTaskList({ admin_id }).then(res => {
        this.taskList = res
      })
    },
    /**
  * 显示详情
  * @param {any} entity
  */
    showDetail(entityOrId) {
      if (typeof entityOrId !== 'object') {
        relayLineApi.getCallDetail(entityOrId).then(data => {
          this.detail.entity = data || {
            id: ''
          }
          this.detail.show = true
        })
      } else {
        this.detail.entity = entityOrId || {
          id: ''
        }
        this.detail.show = true
      }
    },
    exportFile(pageSize) {
      let params = Object.assign({}, this.params)
      params.pageNum = 1
      params.pageSize = pageSize
      callRecordApi.exportFile(params).then(data => {
        downloadFileUrl(data, '呼叫记录.xls')
      })
    },

  },
  mounted() {
    this.getOperatorList()
  }
}
</script>
