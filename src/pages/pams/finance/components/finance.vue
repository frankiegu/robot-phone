<template>
  <div class="fin">
    <div class="middleboxWrap fleX mb-30">
                 <div>
                    <p class="text">
                        <span class="red w115">{{statis.totalSalePrice | currency}}</span> <span class="fc-blue w115">{{statis.totalProfit | currency}}</span><span class="fc-blue w115">{{statis.totalConsumePortCount}}</span>
                    </p>
                     <p class="text">
                        <span class="w115">销售额</span> <span class="w115">利润</span><span class="w115">销售坐席数</span>
                    </p>
                </div>
            </div> 
      <div class="panel">
        <div class="panel-body">
          <Form class="panel-form"
                inline
               >
            <!-- <div class="fr">
              <FormItem :label-width="1">
                <Button type="primary"
                        @click="search">查询</Button>
              </FormItem>
            </div> -->
            <!-- <FormItem :label-width="1">
              <RadioGroup v-model="params.type">
                <Radio :label="1">按日</Radio>
                <Radio :label="2">按月</Radio>
              </RadioGroup>
            </FormItem> -->
            <FormItem 
                      v-show="params.type === 1">
              <DatePicker type="daterange"
                          placeholder="选择时间段"
                          style="width: 200px;"
                          v-model="date.dateRange"
                          @on-change="delaySearch" />
            </FormItem>
            <FormItem 
                      v-show="params.type === 2">
              <DatePicker type="month"
                          placeholder="开始月份"
                          v-model="date.begin" />
              <DatePicker class="ml-40" type="month"
                          placeholder="结束月份"
                          v-model="date.end"/>
            </FormItem>
          </Form>
        </div>
      </div>
      <div class="panel">
        <div class="panel-body">
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
