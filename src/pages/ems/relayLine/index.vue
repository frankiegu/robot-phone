<template>
  <div>
    <Breadcrumb separator=">">
        <span class="home" @click="linkTo('emsHomeIndex')">
          <BreadcrumbItem>首页</BreadcrumbItem>
        </span>
        <BreadcrumbItem>中继线计费</BreadcrumbItem>
        <BreadcrumbItem>中继线管理</BreadcrumbItem>
    </Breadcrumb>
    <!-- 上方,搜索 -->
    <div style="height: calc(100vh - 125px);
    overflow: auto;">
            <div class="panel">
      <div class="panel-body">
        <i-form class="panel-form clear" inline :label-width="0">
          <FormItem>
            <Select
              style="width: 230px;"
              v-model="params.chargingStatus"
              placeholder="计费状态"
              clearable
              @on-change="search"
            >
              <Option value="0">未结算</Option>
              <Option value="1">代付款</Option>
              <Option value="2">已付款</Option>
            </Select>
          </FormItem>
          <FormItem class="fr">
            <i-input
              placeholder="搜索任务名称/客户号码"
              search
              v-model.trim="params.namePhone"
              @on-search="search"
              @keyup.native.enter="search"
            ></i-input>
          </FormItem>

          <FormItem>
            <DatePicker
              :options="options1"
              type="daterange"
              placeholder="选择创建日期"
              style="width: 230px;"
              v-model="dateRange"
              @on-change="delaySearch"
            />
          </FormItem>
          <FormItem>
            <i-button type="primary" style="margin-top:-3px;" @click="doAcocunt">统计计费时间</i-button>
            <span class="dateBtn2">
              <span>{{allTime ? allTime :'0'}}</span>分
            </span>
          </FormItem>
        </i-form>
      </div>
    </div>

    <div class="panel" style="margin-bottom:0;">
      <div class="panel-body">
        <div class="tool">
          <div class="tool-btns">
            <Dropdown>
              <Button type="primary" ghost>导出
                <Icon type="arrow-down-b"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem
                  @click.native="exportFile(index+1)"
                  v-for="(item,index) in exportNumList"
                  :key="index"
                >{{item}}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div style="overflow:hidden;">
          <Table
            :columns="table.columns"
            :data="table.list"
            ref="table"
            @on-selection-change="handleTableSelection"
          />
          <Page
            :current="params.pageNum"
            :pageSize="params.pageSize"
            :total="page.totalNum"
            @on-change="list"
            @on-page-size-change="onPageSizeChange"
            show-sizer
            show-elevator
            style="float:right;margin:15px 0;"
          />
        </div>
      </div>
    </div>
    </div>
    <Modal class="vertical-center-modal"  width="1000px" :footer-hide="true" v-model="detail.show" title="通话详情">
      <call-record-detail :data="detail.entity" v-if="detail.show"/>
    </Modal>
  </div>
</template>
<script>
import { indexMixin, detailMixin } from "@/mixins";
import { CallRecordDetail } from "@/components/packages/ems/callRecord";
import { fmt, watchDateRangeToTimestamp, downloadFileUrl } from "@/util";
import relayLineApi from "@/api/common/relayLineCount";
import callRecordApi from "@/api/ems/callRecord";
import relayLineEvenBus from "./src/relayLine.js";
import Util from '@/util/util'
export default {
  name: "relayLine",
  components: {
    CallRecordDetail
  },
  mixins: [indexMixin, detailMixin],
  data() {
    let that = this;
    return {
      options1: {
        shortcuts: [
          {
            text: "今天",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime());
              return [start, end];
            }
          },
          {
            text: "昨天",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              return [start, end];
            }
          },
          {
            text: "本月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          }
        ]
      },
      params: {
        name_phone: "",
        status: "",
        start_time: "",
        end_time: "",
        chargingStatus: "" // 计费状态
      },
      allTime: "",
      dateRange: [],
      table: {
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            fixed: "left"
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
            minWidth: 110
          },
          {
            title: "主叫号码",
            key: "cardMobile",
            align: "center",
            minWidth: 110
          },
          {
            title: "客户号码",
            key: "mobile",
            align: "center",
            minWidth: 110
          },
          {
            title: "呼叫结果",
            align: "center",
            key: "callResult",
            minWidth: 100,
            render: (h, { row }) => {
              let result;
              if (row.callResult === 0) {
                result = "待呼叫";
              } else if (row.callResult === 1) {
                result = "已接通";
              } else if (row.callResult === 2) {
                result = "无法接通";
              } else if (row.callResult === 3) {
                result = "拒接";
              } else if (row.callResult === 4) {
                result = "外呼无效";
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
              return h(
                "span",
                row.chargingStatus === 1
                  ? "代付款"
                  : row.chargingStatus === 2
                  ? "已付款"
                  : "未结算"
              );
            }
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            fixed: "right",
            width: 100,
            render(h, { row }) {
              let btnAll;
              if (row.chargingStatus !== 3) {
                btnAll = [
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
                ];
              }
              return h("div", btnAll);
            }
          }
        ],
        list: [],
        selection: []
      }
    };
  },
  created() {
    this.$watch(
      "dateRange",
      watchDateRangeToTimestamp(this.params, "start_time", "end_time")
    );
    this.$watch(
      "params",
      function(val) {
        this.doAcocunt();
      },
      { deep: true }
    );
    relayLineEvenBus.$on("list.delete", id => {
      this.listAndDetail();
    });
    relayLineEvenBus.$on("list.update", id => {
      this.listAndDetail();
    });
  },
  methods: {
     linkTo(name) {
      Util.openPage(this, name);
    },
    getApi() {
      return relayLineApi;
    },
    /**
     * 显示详情
     * @param {any} entity
     */
    showDetail(entityOrId) {
      if (typeof entityOrId !== "object") {
        callRecordApi.get(entityOrId).then(data => {
          this.detail.entity = data || {
            id: ""
          };
          this.detail.show = true;
        });
      } else {
        this.detail.entity = entityOrId || {
          id: ""
        };
        this.detail.show = true;
      }
    },
    doAcocunt() {
      relayLineApi.getAllTime(this.params).then(res => {
        this.allTime = res;
      });
    },
    exportFile(pageSize) {
      let params = Object.assign({}, this.params);
      params.pageNum = 1;
      params.pageSize = pageSize;
      relayLineApi.doExport(params).then(data => {
        downloadFileUrl(data, "中继线计费管理.xls");
      });
    },
    // 更改每页数量
    onPageSizeChange(pz) {
      this.params.pageSize = pz;
      this.listAndDetail();
    }
  }
};
</script>

