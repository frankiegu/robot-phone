<template>
  <div>

    <div class="panel">
        <Form class="panel-form"
              inline
              :lable-width="78"
              >
           
          <FormItem>
            <city-select placeholder="选择城市" widths="162px" v-model="params.cityId"
                         @change="search" />
          </FormItem>
          <FormItem>
            <DatePicker type="daterange"
                        placeholder="选择日期"
                        style="width: 162px;"
                        v-model="dateRange"
                        @on-change="delaySearch" />
          </FormItem>
          <FormItem >
            <Select 
                    v-model="params.useType"
                    placeholder="收支类型"
                    clearable
                    style="width:162px;"
                    @on-change="search">
              <Option value="1">收入</Option>
              <Option value="2">支出</Option>
            </Select>
          </FormItem>
           <FormItem>
              <i-input type="text"
              search
              @on-search="search"
                       placeholder="搜索ID"
                       style="width: 162px;"
                       v-model.trim="params.id"
                       @keyup.enter="search">
               
              </i-input>
            </FormItem>
        </Form>
    </div>
    <div class="panel">
         <div class="middleboxWrap fleX mb-30" style="padding-left:3rem;padding-right:3rem">
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
        
        <Table stripe :columns="table.columns"
               :data="table.list"
               ref="table" />
        <ms-pagination :pageNum="params.pageNum"
                       :pageSize="params.pageSize"
                       :total="page.totalNum"
                       @change="list" />
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