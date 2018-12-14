<template>
  <div>
    <Form inline>
      <FormItem label="状态"
                :label-width="60">
        <Select style="width: 120px;"
                v-model="params.status"
                placeholder="全部"
                clearable
                @on-change="search">
          <Option value="0">待学习</Option>
          <Option value="1">已学习</Option>
          <Option value="2">已忽略</Option>
        </Select>
      </FormItem>
    </Form>
    <Table :columns="table.columns"
           :data="table.list"
           ref="table" />
    <ms-pagination :pageNum="params.pageNum"
                   :pageSize="params.pageSize"
                   :total="page.totalNum"
                   @change="list" />

    <call-record-detail-panel :id="callRecord.id"
                              v-model="callRecord.show" />

    <ms-panel v-model="study.show">
      <div slot="header"
           style="margin-right: 100px;">
        学习问题: {{study.entity.content}}({{study.entity.createTime | date}})
        <Button type="success"
                size="small"
                @click="updateStatusStudy"
                class="ml-20">标为已学习</Button>
        <Button type="primary"
                size="small"
                @click="showCallRecord(study.entity)">通话记录</Button>
      </div>
      <ms-lazy :initial="study.show">
        <study :data="study.entity" />
      </ms-lazy>
    </ms-panel>
  </div>
</template>

<script>
import { indexMixin } from '@/mixins'
import { whisperingDetailMixin } from '@/components/packages/common/whisperingNew'
import studyApi from '@/api/ems/study'
import callRecordApi from '@/api/ems/callRecord'
import { fmt } from '@/util'
import { CallRecordDetailPanel } from '@/components/packages/ems/callRecord'
import Study from './components/study'

export default {
  mixins: [indexMixin, whisperingDetailMixin],
  components: {
    CallRecordDetailPanel,
    Study
  },
  data() {
    return {
      params: {
        whisperingId: this.data.id,
        status: ''
      },
      table: {
        columns: [{
          title: '序号',
          key: 'id'
        }, {
          title: '待学习问题',
          key: 'content'
        }, {
          title: '记录时间',
          key: 'create_time',
          value: row => {
            return fmt.date(row.createTime)
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }, {
          title: '状态',
          key: 'status',
          value: row => {
            return fmt.value(row.status, ['待学习', '已学习', '已忽略'])
          },
          render: (h, { row, column, index }) => {
            if(row.status===1){
                   return h("span",{style:{color:"#26a526"}}, column.value(row));
              }
             else{
               return h("span", column.value(row));
             }
          }
        }, {
          title: '操作',
          key: 'opts',
          render: (h, { row }) => {
            var btns = []
            switch (row.status) {
              case 0:
                btns.push(<a href="javascript: void(0);" class="ml-10" onClick={() => this.showStudy(row)}>学习</a>)
                btns.push(<a href="javascript: void(0);" class="ml-10" onClick={() => this.showIgnore(row)}>忽略</a>)
                break
            }
            return (<span>
              <a href="javascript: void(0);"  onClick={() => this.showCallRecord(row)}>通话记录</a>
              {btns}
            </span>)
          }
        }]
      },
      callRecord: {
        show: false,
        id: ''
      },
      study: {
        show: false,
        entity: {}
      }
    }
  },
  methods: {
    getApi() {
      return studyApi
    },
    refreshTaskDetail(data) {
      this.params.whisperingId = data.id
      this.search()
    },
    showStudy(entity) {
      studyApi.get(entity.id).then(data => {
        this.study.entity = data
        this.study.show = true
      })
    },
    showIgnore(entity) {
      this.$Modal.confirm({
        title: '确认忽略',
        content: '是否确定忽略该学习问题?',
        onOk: (action, instance) => {
          studyApi.updateStatus({
            id: entity.id,
            status: 2
          }).then(() => {
            this.success(`胡咧成功`)
            this.list()
          })
        }
      })
    },
    updateStatusStudy() {
      studyApi.updateStatus({
        id: this.study.entity.id,
        status: 1
      }).then(() => {
        this.success(`标为已学习成功`)
        this.list()
        this.study.show = false
      })
    },
    showCallRecord(entity) {
      this.callRecord.id = entity.callId
      this.callRecord.show = true
    }
  }
}
</script>
