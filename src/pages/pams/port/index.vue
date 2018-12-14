<template>
  <div>
    <div class="panel">
      <div class="panel-body">
        <Form class="panel-form"
              inline
              :label-width="60">
          <div class="fr">
            <FormItem>
              <i-input type="text"
                       placeholder="搜索ID"
                       style="width: 220px;"
                       v-model.trim="params.id"
                       @keyup.enter="search">
                <Icon type="search"
                      slot="prepend"></Icon>
              </i-input>
            </FormItem>
            <FormItem :label-width="1">
              <Button type="primary"
                      @click="search">查询</Button>
            </FormItem>
          </div>
          <FormItem label="城市">
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
        <Table :columns="table.columns"
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