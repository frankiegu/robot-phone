<template>
  <div class="fin">
    <div class="fin-r">
      <div class="panel">
        <div class="panel-header">
          <b>销售坐席数： {{statis.totalConsumePortCount}}</b>
        </div>
        <div class="panel-body">
          <div class="nail">
            <div class="nail-item">
              <h3 class="c-primary">{{statis.totalProfit | currency}}</h3>
              <p>销售利润</p>
            </div>
          </div>
          <br>
          <div class="nail">
            <div class="nail-item">
              <h3>{{statis.totalSalePrice | currency}}</h3>
              <p>销售额</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fin-l">
      <div class="panel">
        <div class="panel-body">
          <Form class="panel-form"
                inline
                :label-width="80">
            <div class="fr">
              <FormItem :label-width="1">
                <Button type="primary"
                        @click="search">查询</Button>
              </FormItem>
            </div>
            <FormItem :label-width="1">
              <RadioGroup v-model="params.type">
                <Radio :label="1">按日</Radio>
                <Radio :label="2">按月</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="选择时间段"
                      v-show="params.type === 1">
              <DatePicker type="daterange"
                          placeholder="选择日期"
                          style="width: 200px;"
                          v-model="date.dateRange"
                          @on-change="delaySearch" />
            </FormItem>
            <FormItem label="选择时间段"
                      v-show="params.type === 2">
              <DatePicker type="month"
                          placeholder="开始月份"
                          v-model="date.begin" />
              <DatePicker type="month"
                          placeholder="结束月份"
                          v-model="date.end" />
            </FormItem>
          </Form>
        </div>
      </div>
      <div class="panel">
        <div class="panel-body">
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
  </div>
</template>

<script>
import { indexMixin } from '@/mixins'
import { watchDateRangeToTimestamp, fmt } from '@/util'
import cardUseLogApi from '@/api/pms/cardUseLog'

export default {
  mixins: [indexMixin],
  data() {
    return {
      params: {
        type: 1,
        createTimeBegin: '',
        createTimeEnd: ''
      },
      date: {
        dateRange: [],
        begin: '',
        end: ''
      },
      table: {
        columns: [{
          title: '日期',
          key: 'dateStr'
        }, {
          title: '销售坐席数',
          key: 'consumePortCount'
        }, {
          title: '销售额',
          key: 'allPrice',
          value: row => {
            return fmt.currency(row.allPrice)
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }, {
          title: '利润',
          key: 'profit',
          value: row => {
            return fmt.currency(row.profit)
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }]
      },
      statis: {
        // 销售坐席数
        totalConsumePortCount: 0,
        // 销售利润
        totalProfit: 0,
        // 销售额
        totalSalePrice: 0
      }
    }
  },
  watch: {
    'params.type'() {
      this.date.dateRange = []
    },
    'date.begin'(val) {
      this.params.createTimeBegin = val ? val.getTime() : ''
    },
    'date.end'(val) {
      this.params.createTimeEnd = val ? val.getTime() : ''
    }
  },
  created() {
    this.$watch('date.dateRange', watchDateRangeToTimestamp(this.params, 'createTimeBegin', 'createTimeEnd'))
  },
  methods: {
    search() {
      this.table.selection = []
      this.list(1)
      this.getTotalStatis()
    },
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params)
      return cardUseLogApi.listStatis(params).then(page => {
        this.setTableList(page.dataList)
        this.setPagination(page)
      })
    },
    getTotalStatis() {
      cardUseLogApi.getTotalStatis().then(data => {
        this.statis = data
      })
    }
  }
}
</script>
<style scoped lang="scss">
.nail-item {
  display: block;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>
