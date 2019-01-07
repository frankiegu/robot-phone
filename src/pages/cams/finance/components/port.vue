<template>
  <div>

    <div class="panel">
      <div class="middleboxWrap fleX mt-20" style="padding-left:3rem;padding-right:3rem">
                 <div>
                    <p class="text">
                        <span class="red w115">{{portDetail.accountRemainPort}}</span> <span class="weq">=</span><span class="fc-blue w115">{{portDetail.cumulativeBuyPort}}</span><span class="weq">-</span><span class="fc-blue w115">{{portDetail.salePort}}</span>
                    </p>
                     <p class="text">
                        <span class="w115 mr-40">账户剩余年端口数</span> <span class="w115 mr-40">累计购买年端口数</span><span>累计使用年端口数</span>
                    </p>
                </div>
               <div>
                    <p class="text">
                        <span class="red w115">{{portDetail.accountRemainMonthPort}}</span> <span class="weq">=</span><span class="fc-blue w115">{{portDetail.cumulativeBuyMonthPort}}</span><span class="weq">-</span><span class="fc-blue w115">{{portDetail.saleMonthPort}}</span>
                    </p>
                     <p class="text">
                        <span class="w115 mr-40">账户剩余月端口数</span> <span class="w115 mr-40">累计购买月端口数</span><span>累计使用月端口数</span>
                    </p>
                </div>
               
            </div> 
      <div class="panel-body">
           <div class="panel">
      <div class="panel-body">
        <Form class="panel-form"
              inline
              :label-width="40">
           
         
          <FormItem>
            <DatePicker type="daterange"
                        placeholder="选择日期"
                        style="width: 220px;"
                        v-model="dateRange"
                        @on-change="delaySearch" />
          </FormItem>
          <FormItem>
            <Select style="width: 220px;"
                    v-model="params.useType"
                    placeholder="开通类型"
                    clearable
                    @on-change="search">
              <Option value="1">收入</Option>
              <Option value="2">支出</Option>
            </Select>
          </FormItem>
           <FormItem>
              <i-input type="text"
                       placeholder="搜索ID"
                       style="width: 220px;"
                       search
                       @on-search="search"
                       v-model.trim="params.id"
                       @keyup.enter="search">
              
              </i-input>
            </FormItem>
        </Form>
      </div>
    </div>
        <Table stripe :columns="table.columns"
               :data="table.list"
               ref="table" />
        <ms-pagination :pageNum="params.pageNum"
                       :pageSize="params.pageSize"
                       :total="page.totalNum"
                       @change="list" />
      </div>
    </div>
  </div>
</template>
<script>
import { indexMixin } from '@/mixins'
import cardUseLogApi from '@/api/pms/cardUseLog'
import { fmt, watchDateRangeToTimestamp } from '@/util'

export default {
  name: 'marketingCall',
  mixins: [indexMixin],
  data() {
    return {
      params: {
        id: '',
        createTimeBegin: '',
        createTimeEnd: ''
      },
      table: {
        columns: [{
          title: 'ID',
          key: 'id',
          width: 80
        }, {
          title: '描述',
          key: 'describeContent'
        }, {
          title: '端口数',
          key: 'consumePortCount',
          width: 140
        }, {
          title: '剩余年可用端口数',
          key: 'curPortCount',
          width: 140
        }, {
          title: '剩余月可用端口数',
          key: 'curMonthPortCount',
          width: 140
        }, {
          title: '创建时间',
          key: 'createTime',
          width: 160,
          value: row => {
            return fmt.date(row.createTime)
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }]
      },
      dateRange: '',
      portDetail: {
        // 账户剩余端口数
        accountRemainPort: 0,
        // 累计购买端口数
        cumulativeBuyPort: 0,
        // 累计扣减端口数
        salePort: 0
      }
    }
  },
  created() {
    this.$watch('dateRange', watchDateRangeToTimestamp(this.params, 'createTimeBegin', 'createTimeEnd'))
  },
  methods: {
    initReady() {
      cardUseLogApi.getAccountPortDetail().then(data => {
        this.portDetail = data
      })
    },
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params)
      return cardUseLogApi.listPortSaleLog(params).then(page => {
        this.setTableList(page.dataList)
        this.setPagination(page)
      })
    }
  }
}
</script>