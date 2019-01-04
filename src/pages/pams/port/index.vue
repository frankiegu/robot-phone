<template>
  <div>

    <div class="panel">
      
      <div class="panel-body">
        <Form class="panel-form"
              inline
              :label-width="80">
          <FormItem label="城市" :label-width="80">
            <city-select v-model="params.cityId"
                         @change="search" />
          </FormItem>
          <FormItem label="创建日期">
            <DatePicker type="daterange"
                        placeholder="选择日期"
                        style="width: 200px;"
                        v-model="dateRange"
                        @on-change="delaySearch" />
          </FormItem>
          <FormItem label="收支类型">
            <Select style="width: 60px;"
                    v-model="params.useType"
                    placeholder="全部"
                    clearable
                    @on-change="search">
              <Option value="1">收入</Option>
              <Option value="2">支出</Option>
            </Select>
          </FormItem>
           <FormItem :label-width="80">
              <i-input type="text"
              search
              @on-search="search"
                       placeholder="搜索ID"
                       style="width: 230px;"
                       v-model.trim="params.id"
                       @keyup.enter="search">
               
              </i-input>
            </FormItem>
        </Form>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <div>
          <span>账户剩余年端口数：{{portDetail.accountRemainPort}}</span>
          <span class="ml-20">累计购买年端口数：{{portDetail.cumulativeBuyPort}}</span>
          <span class="ml-20">累计使用年端口数：{{portDetail.salePort}}</span>
        </div>
        <div>
          <span>账户剩余月端口数：{{portDetail.accountRemainMonthPort}}</span>
          <span class="ml-20">累计购买月端口数：{{portDetail.cumulativeBuyMonthPort}}</span>
          <span class="ml-20">累计使用月端口数：{{portDetail.saleMonthPort}}</span>
        </div>
        <hr class="mt-10 mb-20" />
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
import { CitySelect } from '@/components/packages/pams/select'

export default {
  name: 'marketingCall',
  mixins: [indexMixin],
  components: {
    CitySelect
  },
  data() {
    return {
      params: {
        id: '',
        cityId: '',
        createTimeBegin: '',
        createTimeEnd: ''
      },
      table: {
        columns: [{
          title: 'ID',
          key: 'id',
        }, {
          title: '描述',
          key: 'describeContent'
        }, {
          title: '端口数',
          key: 'consumePortCount',
        }, {
          title: '剩余年可用端口数',
          key: 'curPortCount',
        }, {
          title: '剩余月可用端口数',
          key: 'curMonthPortCount',
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