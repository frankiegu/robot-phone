<template>
  <div>
     <Breadcrumb separator=">">
      <span class="home" @click="linkTo('emsHomeIndex')">
          <BreadcrumbItem>首页</BreadcrumbItem>
        </span>
      <BreadcrumbItem>系统消息</BreadcrumbItem>
    </Breadcrumb>
    <div class="panel">
      <div class="panel-body">
         <div class="fr">
            <Button type="primary"
                    @click="showForm()">发布新消息</Button>
          </div>
        <Form class="panel-form clear"
              inline
              :label-width="80">                    
          <FormItem label="发布时间">
            <DatePicker type="daterange"
                        placeholder="选择日期"
                        style="width: 230px;"
                        v-model="dateRange"
                        @on-change="delaySearch" />
          </FormItem>
           <FormItem>
              <i-input type="text"
                      search
                      style="width:230px"
                       placeholder="搜索ID"
                       v-model.trim="params.id"
                       @on-search="search"
                       @on-enter="search">
                
              </i-input>
            </FormItem>
        </Form>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <div class="tool">
         
          <Button type="error"
                  @click="showBatchDel">批量删除</Button>
        </div>
        <Table :columns="table.columns"
               :data="table.list"
               @on-selection-change="handleTableSelection"
               ref="table" />
        <ms-pagination :pageNum="params.pageNum"
                       :pageSize="params.pageSize"
                       :total="page.totalNum"
                       @change="list" />
      </div>
    </div>
    <ms-panel v-model="form.show"
              title="发布系统消息">
      <ms-lazy :initial="form.show">
        <mod-form :data="form.entity"
                  @on-cancel="cancelForm"
                  @after-submit="afterSubmitForm" />
      </ms-lazy>
    </ms-panel>
  </div>
</template>
<script>
import { indexMixin } from '@/mixins'
import noticeInfoApi from '@/api/common/noticeInfoApi'
import { fmt, watchDateRangeToTimestamp } from '@/util'
import ModForm from './form'

export default {
  mixins: [indexMixin],
  components: {
    ModForm
  },
  data() {
    return {
      params: {
        id: '',
        startTime: '',
        endTime: ''
      },
      table: {
        columns: [{
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        }, {
          title: '对象',
          key: 'adminType',
          value: row => {
            // 0 所有 3省级代理商 4市级代理 5企业 （多个逗号隔开）
            let arr = ['所有', '', '', '省级代理', '市级代理', '企业']
            let adminType = row.adminType
            if (adminType !== null) {
              let types = adminType.split(',')
              return types.map(v => arr[v]).filter(v => !!v).join(',')
            }
            return ''
          },
          render: (h, { row, column }) => {
            return h('span', column.value(row))
          }
        }, {
          title: '标题',
          key: 'title'
        }, {
          title: '发布时间',
          key: 'createTime',
          width: 200,
          value: row => {
            return fmt.date(row.createTime)
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }]
      },
      dateRange: []
    }
  },
  created() {
    this.$watch('dateRange', watchDateRangeToTimestamp(this.params, 'startTime', 'endTime'))
  },
  methods: {
     linkTo(name) {
      Util.openPage(this, name);
    },
    getApi() {
      return noticeInfoApi
    }
  }
}
</script>