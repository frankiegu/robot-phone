<template>
  <div>
    <Breadcrumb separator=">">
        <span class="home" @click="linkTo('emsHomeIndex')">
          <BreadcrumbItem>首页</BreadcrumbItem>
        </span>
        <BreadcrumbItem>客户中心</BreadcrumbItem>
        <BreadcrumbItem>呼叫记录</BreadcrumbItem>
    </Breadcrumb>
<div style="height: calc(100vh - 125px);
    overflow: auto;background:#fff;">
      <div class="panel" style="margin-bottom:0;border-bottom:1rem solid #f3f4f8;">
      <div class="panel-body">
        <Form class="panel-form"
              inline
              :label-width="100">
          <div class="fr">
            <FormItem>
              <i-input type="text"
              search
                       placeholder="搜索ID/主叫号码/客户号码"
                       style="width: 230px;"
                       @on-search="search"
                       v-model.trim="params.idOrMobileOrCardMobile"
                       @keyup.enter="search">
                
              </i-input>
            </FormItem>
            
          </div>
          <FormItem label="营销任务"
                    >
            <Select style="width: 120px;"
                    v-model="params.taskId"
                    placeholder="全部"
                    clearable
                    @on-change="search">
              <Option v-for="v in taskList"
                      :key="v.id"
                      :value="v.id">{{v.taskName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="客户等级"
                    >
            <Select style="width: 120px;"
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
          <FormItem label="呼叫结果"
                    >
            <Select style="width: 120px;"
                    v-model="params.callResult"
                    placeholder="全部"
                    clearable
                    @on-change="search">
              <Option v-for="(v, k) in CALL_RESULT"
                      :key="k"
                      :value="k">{{v}}</Option>
            </Select>
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

    <Modal v-model="detail.show" width="850" :footer-hide="true" class-name="vertical-center-modal" 
              title="通话详情">
      <call-record-detail :data="detail.entity"
                          v-if="detail.show" />
    </Modal>
  </div>
</template>
<script>
import { indexMixin } from '@/mixins'
import clientApi from '@/api/ems/client'
import { duration, fmt } from '@/util'
import { CallRecordDetail } from '@/components/packages/ems/callRecord'
import { getCallResultLabel, CALL_RESULT } from '@/constants'
import Util from '@/util/util';
export default {
  name: 'marketingCall',
  mixins: [indexMixin],
  components: {
    CallRecordDetail
  },
  data() {
    return {
      params: {
        taskId: '',
        userLevel: '',
        callResult: '',
        idOrMobileOrCardMobile: ''
      },
      table: {
        columns: [{
          title: 'ID',
          key: 'id'
        }, {
          title: '主叫号码',
          key: 'cardMobile'
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
          render: (h, { row, column, index }) => {
            return (
              <select style="width: 40px;"
                onChange={e => this.changeUserLevel(row, e.target.value)} >
                <option value="">无</option>
                <option value="A" selected={row.userLevel === 'A'}>A</option>
                <option value="B" selected={row.userLevel === 'B'}>B</option>
                <option value="C" selected={row.userLevel === 'C'}>C</option>
                <option value="D" selected={row.userLevel === 'D'}>D</option>
                <option value="E" selected={row.userLevel === 'E'}>E</option>
                <option value="F" selected={row.userLevel === 'F'}>F</option>
              </select >
            )
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
          title: '所属任务',
          key: 'taskName'
        }, {
          title: '操作',
          render: (h, { row }) => {
            return h('a', {
              on: {
                click: () => {
                  this.showDetail(row.id)
                }
              }
            }, '详情')
          }
        }]
      },
      CALL_RESULT,
      taskList: []
    }
  },
  created() {
    clientApi.listTaskForCallRecord().then(data => {
      this.taskList = data
    })
  },
  methods: {
    linkTo(name) {
      Util.openPage(this, name);
    },
    getApi() {
      return clientApi
    },
    getListApi(params) {
      return clientApi.listCallRecord(params)
    },
    changeUserLevel(entity, userLevel) {
      clientApi.updateUserLevel({
        id: entity.id,
        userLevel
      }).then(() => {
        this.success('更新用户等级成功')
      })
    }
  }
}
</script>