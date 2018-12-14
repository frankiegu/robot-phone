<template>
  <div>
    <!-- 上方,搜索 -->
    <div class="panel">
      <div class="panel-body">
        <i-form class="panel-form clear"
                inline
                :label-width="0">
          <FormItem>
            <Select style="width: 100px;marginRight:0"
                    v-model="params.platform_id"
                    placeholder="运营商管理"
                    clearable
                    @on-change="search">
              <Option :value="item.id"
                      v-for="item in operatorList"
                      @foucs="getFirmList(params.platform_id)"
                      :key='item.id'>{{item.name}}</Option>

            </Select>
          </FormItem>
          <FormItem>
            <Select style="width: 100px;"
                    :disabled="!params.platform_id"
                    v-model="params.admin_id"
                    placeholder="企业管理"
                    clearable
                    @on-change="search">
              <Option :value="item.id"
                      v-for="item in firmList"
                      :key='item.id'>{{item.name}}</Option>

            </Select>
          </FormItem>
          <FormItem>
            <Select style="width: 100px;"
                    v-model="params.machineId"
                    placeholder="设备管理"
                    clearable
                    @on-change="search">
              <Option :value="item.id"
                      v-for="item in machineList"
                      :key='item.id'>{{item.machineName}}</Option>

            </Select>
          </FormItem>
          <FormItem>
            <Select style="width: 100px;"
                    v-model="params.chargingStatus"
                    placeholder="计费状态"
                    clearable
                    @on-change="search">
              <Option value="0">未结算</Option>
              <Option value="1">代付款</Option>
              <Option value="2">已付款</Option>
            </Select>
          </FormItem>
          <FormItem>
            <DatePicker type="daterange"
                        placeholder="选择创建日期"
                        style="width: 150px;"
                        v-model="dateRange"
                        @on-change='delaySearch' />
          </FormItem>
          <FormItem :label-width='0'>
            <i-button type="primary"
                      @click="doAcocunt">统计计费时间</i-button>
            <span class='ml10 accountTime'>{{allTime ? allTime :'0'}}（分）</span>
          </FormItem>
          <div class="fr">
            <FormItem>
              <i-input placeholder="搜索电话号码"
                       v-model.trim="params.namePhone"
                       @keyup.native.enter="search">
              </i-input>
            </FormItem>
            <FormItem :label-width='1'>
              <i-button type="primary"
                        @click="search">查询</i-button>
            </FormItem>
          </div>
        </i-form>
      </div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <div class="tool">
          <i-button type="error"
                    @click="deleteSelected">删除所选</i-button>
          <Dropdown>
            <Button type="success">
              全部状态变更
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="changeAllStatus(1)">未结算更改为待付款</DropdownItem>
              <DropdownItem @click.native="changeAllStatus(2)">代付款更改为已付款</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div class="tool-btns">
            <Dropdown>
              <Button type="success">
                导出
                <Icon type="arrow-down-b"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem @click.native="exportFile(index+1)" v-for="(item,index) in exportNumList" :key='index'>{{item}}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div style="overflow:hidden;">
          <Table :columns="table.columns"
                 :data="table.list"
                 ref="table"
                 @on-selection-change="handleTableSelection" />
          <Page :current="params.pageNum"
                :pageSize="params.pageSize"
                :total="page.totalNum"
                @on-change="list"
                @on-page-size-change="onPageSizeChange"
                show-sizer
                show-elevator
                style="float:right;margin:15px 0;" />
        </div>
      </div>
    </div>

    <ms-panel v-model="detail.show"
              title="通话详情">
      <call-record-detail :data="detail.entity"
                          v-if="detail.show" />
    </ms-panel>
  </div>
</template>
<script>
import { indexMixin, detailMixin } from "@/mixins";
import { CallRecordDetail } from '@/components/packages/ems/callRecord'
import { fmt, watchDateRangeToTimestamp, downloadFileUrl } from "@/util";
import relayLineApi from "@/api/common/relayLineCount";
import relayLineEvenBus from './src/relayLine.js'
export default {
  name: "relayLine",
  components: {
    CallRecordDetail
  },
  mixins: [indexMixin, detailMixin],
  data() {
    let that = this;
    return {
      params: {
        name_phone: "",
        status: "",
        start_time: '',
        end_time: '',
        chargingStatus: '',// 计费状态
        machineId: '',// 设备id
        platform_id: '',
        admin_id: '',
      },
      allTime: '',
      dateRange: [],
      machineList: [], // 设备列表
      firmList: [], // 企业列表
      operatorList: [], // 运营商列表
      operatorId: [],
      table: {
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            fixed: "left",
          },
          {
            title: "ID",
            align: "center",
            key: "id",
            minWidth: 100
          },
          {
            title: "通话ID",
            minWidth: 120,
            align: "center",
            key: "callId"
          },
          {
            title: "任务名称",
            key: "taskName",
            align: "center",
            minWidth: 110,
          },
          {
            title: "主叫号码",
            key: "cardMobile",
            align: "center",
            minWidth: 110,
          },
          {
            title: "客户号码",
            key: "mobile",
            align: "center",
            minWidth: 110,
          },
          {
            title: "呼叫结果",
            align: "center",
            key: "callResult",
            minWidth: 100,
            render: (h, { row }) => {
              let result
              if (row.callResult === 0) {
                result = '待呼叫'
              } else if (row.callResult === 1) {
                result = '已接通'
              } else if (row.callResult === 2) {
                result = '无法接通'
              } else if (row.callResult === 3) {
                result = '拒接'
              } else if (row.callResult === 4) {
                result = '外呼无效'
              }
              return h("span", result);
            }
          },
          {
            title: "设备名称",
            key: "machineName",
            align: "center",
            minWidth: 110,
            render: (h, { row }) => {
              return h("span", row.machineName || "无");
            }
          },
          {
            title: "呼叫时间",
            key: "callStartTime",
            align: "center",
            minWidth: 160,
            render: (h, { row }) => {
              return h("span", fmt.date(row.callStartTime));
            }
          },
          {
            title: "创建时间",
            key: "createTime",
            align: "center",
            minWidth: 160,
            render: (h, { row }) => {
              return h("span", fmt.date(row.createTime));
            }
          },
          {
            title: "计费时间(分)",
            key: "countTime",
            align: "center",
            minWidth: 120,
            render: (h, { row }) => {
              return h("span", row.countTime);
            }
          },
          {
            title: "计费状态",
            align: "center",
            key: "chargingStatus",
            minWidth: 100,
            render: (h, { row }) => {
              return h("span", row.chargingStatus === 1 ? '代付款' : row.chargingStatus === 2 ? '已付款' : '未结算');
            }
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            fixed: 'right',
            width: 190,
            render(h, { row }) {

              let btnAll
              if (row.chargingStatus !== 3) {
                btnAll = [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small"
                      },
                      style: {
                        margin: "0 2px"
                      },
                      on: {
                        click: () => {
                          that.showDel(row.id);
                        }
                      }
                    },
                    "删除"
                  ),
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      style: {
                        margin: "0 2px"
                      },
                      on: {
                        click: () => {
                          that.showDetail(row.callId);
                        }
                      }
                    },
                    "详情"
                  )
                ]
              }

              if (row.chargingStatus === 0) {
                let payWaitBtn = h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small"
                    },
                    style: {
                      margin: "0 5px"
                    },
                    on: {
                      click: () => {
                        that.changeStatus(row.id, 1);
                      }
                    }
                  },
                  "代付款"
                )
                btnAll.splice(1, 0, payWaitBtn)
              } else if (row.chargingStatus === 1) {
                let payDone = h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        that.changeStatus(row.id, 2);
                      }
                    }
                  },
                  "已付款"
                )
                btnAll.splice(1, 0, payDone)
              }
              return h("div", btnAll);
            }
          }
        ],
        list: [],
        selection: []
      },
    }
  },
  created() {
    this.$watch('params.platform_id', function (val) {
      if (val) {
        this.getFirmList(val)
      }
    })
    this.$watch('params', function (val) {
      this.doAcocunt()
    }, { deep: true })
    this.$watch('dateRange', watchDateRangeToTimestamp(this.params, 'start_time', 'end_time'))
    relayLineEvenBus.$on("list.delete", id => {
      this.listAndDetail()
    });
    relayLineEvenBus.$on("list.update", id => {
      this.listAndDetail()
    });
  },
  methods: {
    getApi() {
      return relayLineApi
    },
    getParamsList() {
      this.getMachineList()
      this.getOperatorList()
    },
    getMachineList() {
      relayLineApi.getMachineList().then(res => {
        this.machineList = res
      })
    },
    getFirmList(id) {
      relayLineApi.getFirmList({ id }).then(res => {
        this.firmList = res
      })
    },
    getOperatorList() {
      relayLineApi.getOperatorList().then(res => {
        this.operatorList = res
      })
    },

    doAcocunt() {
      relayLineApi.getAllTime(this.params).then(res => {
        this.allTime = res
      })
    },
    changeStatus(id, status) {
      let data = { id, status }
      relayLineApi.changeStatus(data).then(res => {
        this.success(`成功修改为${status ? '代付款' : '已付款'}`)
        relayLineEvenBus.$emit("list.update");
      })
    },
    changeAllStatus(status) {
      this.params.status = status
      this.$Modal.confirm({
        title: `确认修改`,
        content: `确认把${status === 1 ? '代付款改成已付款' : '未付款改成代付款'}`,
        onOk: (action, instance) => {
          relayLineApi.changeAllStatus(this.params).then(res => {
            this.success(`成功修改为${status === 1 ? '代付款' : '已付款'}`)
            relayLineEvenBus.$emit("list.update");
          })
        }
      });

    },
    /**
      * 显示详情
      * @param {any} entity
      */
    showDetail(entityOrId) {
      if (typeof entityOrId !== 'object') {
        relayLineApi.getCallDetail(entityOrId).then(data => {
          this.detail.entity = data || {
            id: ''
          }
          this.detail.show = true
        })
      } else {
        this.detail.entity = entityOrId || {
          id: ''
        }
        this.detail.show = true
      }
    },
    showDel(id) {
      let ids = [];
      ids.push(id);
      let content = "删除操作不可恢复，确认继续删除?";
      this.$Modal.confirm({
        title: "确认删除",
        content,
        onOk: (action, instance) => {
          this.getApi().deleteRelalLine(ids).then(() => {
            this.success("删除成功");
            this.listAndDetail();
            relayLineEvenBus.$emit("list.delete");
          });
        }
      });
    },
    deleteSelected() {
      let ids = [];
      let content = "删除操作不可恢复，确认继续删除";
      this.table.selection.forEach(val => {
        ids.push(val.id);
      });
      this.$Modal.confirm({
        title: "确认删除",
        content,
        onOk: (action, instance) => {
          this.getApi()
            .deleteRelalLine(ids)
            .then(() => {
              this.success("删除成功");
              this.table.selection = [];
              this.listAndDetail();
            });
        }
      });
    },
    exportFile(pageSize) {
      let params = Object.assign({}, this.params)
      params.pageNum = 1
      params.pageSize = pageSize
      relayLineApi.doExport(params).then(data => {
        downloadFileUrl(data, '中继线管理.xls')
      })
    },
    // 更改每页数量
    onPageSizeChange(pz) {
      this.params.pageSize = pz;
      this.listAndDetail();
    },
  },
  mounted() {
    this.getParamsList()
  }
}
</script>

<style>
.ivu-table-body::-webkit-scrollbar {
  height: 10px;
}
.accountTime {
  padding: 0 5px;
  border: 1px solid #ddd;
  display: inline-block;
  min-width: 20px;
}
</style>
