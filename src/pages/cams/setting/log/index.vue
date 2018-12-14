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
                       placeholder="搜索内容/电话"
                       style="width: 220px;"
                       v-model.trim="params.nameMobile"
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
          <FormItem label="创建日期">
            <DatePicker type="daterange"
                        placeholder="选择日期"
                        style="width: 200px;"
                        v-model="dateRange"
                        @on-change="delaySearch" />
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
</template>
<script>
import { indexMixin } from '@/mixins'
import logSystemUserApi from '@/api/common/logSystemUserApi'
import { fmt, watchDateRangeToTimestamp } from '@/util'

export default {
  name: 'marketingCall',
  mixins: [indexMixin],
  data() {
    return {
      params: {
        nameMobile: '',
        startTime: '',
        endTime: ''
      },
      table: {
        columns: [{
          title: '操作内容',
          key: 'content'
        }, {
          title: '操作人',
          key: 'name',
          width: 160
        }, {
          title: '联系电话',
          key: 'mobile',
          width: 160
        }, {
          title: '操作时间',
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
      dateRange: ''
    }
  },
  created() {
    this.$watch('dateRange', watchDateRangeToTimestamp(this.params, 'startTime', 'endTime'))
  },
  methods: {
    getApi() {
      return logSystemUserApi
    }
  }
}
</script>