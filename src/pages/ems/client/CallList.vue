<template>
  <div>
    <div class="title mt-20" style="border-bottom:1px solid #F1F1F1;padding-bottom:10px;">通话记录</div>
    <Table :columns="table.columns"
           :data="callDataList"
           class="table"></Table>
    <Page class="pagination"
          :total="totalNum"
          :pageNum="pager.pageNum"
          :pageSize="pager.pageSize"
          @on-change="handleChangePageNum"
          @on-page-size-change="handleChangePageSize" />
    <Modal width="1000" :footer-hide="true" class-name="vertical-center-modal" v-model="detail.show"
              title="通话详情">
      <call-record-detail :isShow="false"  :data="detail.entity"
                          v-if="detail.show" />
    </Modal>
  </div>
</template>
<script>
import API from '@/api/index'
import callRecordApi from '@/api/ems/callRecord'
import Util from '@/util/util'
import { CallRecordDetail } from '@/components/packages/ems/callRecord'
import { indexMixin } from '@/mixins'
import { duration } from '@/util'
import { getCallResultLabel } from '@/constants'

const API_CLIENT = API.ems.client

const callResult = status => {
  return getCallResultLabel(status)
}

export default {
  name: 'callList',
  mixins: [indexMixin],
  components: {
    CallRecordDetail
  },
  props: {
    show: Function
  },
  data() {
    return {
      pager: {
        pageNum: 1,
        pageSize: 10
      },
      totalNum: 0,
      callDataList: [],
      params: {},
      table: {
        columns: [{
          type: 'index',
          width: 60,
          align: 'center',
          title: '序号',
          key: '1'
        }, {
          title: '主叫类型',
          align: 'center',
          key: 'callType', // 1机器 2人工
          render: (h, param) => {
            return h('span', param.row.callType === 1 ? '机器坐席' : '人工坐席')
          }
        }, {
          title: '主叫号码',
          align: 'center',
          key: 'cardMobile'
        }, {
          title: '呼叫结果',
          align: 'center',
          key: 'callResult',
          render: (h, param) => {
            return h('span', callResult(param.row.callResult))
          }
        }, {
          title: '客户等级',
          align: 'center',
          key: 'userLevel'
        }, {
          title: '通话时长',
          align: 'center',
          key: 'callAllTime',
          render: (h, param) => {
            return h('span', duration(param.row.callAllTime))
          }
        }, {
          title: '通话轮次',
          align: 'center',
          key: 'callCount'
        }, {
          title: '呼叫时间',
          align: 'center',
          key: 'callStartTime',
          render: (h, param) => {
            return h('span', Util.msToDate(param.row.callStartTime))
          }
        }, {
          title: '操作',
          align: 'center',
          render: (h, { row,index }) => {
                   if (row.isRead == 0) {
                return h(
                  "a",
                  {
                    on: {
                      click: () => {                     
                        this.showDetail(row.id,index);
                        if (row.isRead === 0) {
                          callRecordApi.isRead({ callId: row.id }).then(res => {
                            this.listAndDetail(row.id);
                          });
                        }
                      }
                    }
                  },
                  "未读"
                );
              } else {
                return h(
                  "a",
                  {
                    style: {
                      color: "#32bd1b"
                    },
                    on: {
                      click: () => {
                        this.showDetail(row.id,index);                                             
                      }
                    }
                  },
                  "已读"
                );
              }
          }
        }]
      }
    }
  },
 
  methods: {
    getApi() {
      return callRecordApi
    },
    initCallList(param) {
      this.params = Object.assign({}, param)
      this.pager = {
        pageNum: 1,
        pageSize: 10
      }
      this.totalNum = 0
      this.getCallList()
    },
    getCallList() {
      const obj = Object.assign({}, this.pager, this.params)
      API_CLIENT.getRecordList(obj)
        .then(res => {
          this.callDataList = res.dataList
        })
    },
    handleChangePageNum(toPage) {
      this.pager.pageNum = toPage
      this.getCallList()
    },
    handleChangePageSize(newSize) {
      this.pager.pageSize = newSize
      this.pager.pageNum = 1
      this.getCallList()
    }
  }
}
</script>
