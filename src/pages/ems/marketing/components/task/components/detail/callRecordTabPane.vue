<template>
  <div class="call_record">
    <div class="title">通话记录</div>
    <Form inline>
      <FormItem label="分配状态" :label-width="80">
        <Select
          style="width: 150px;"
          v-model="params.status"
          placeholder="全部"
          clearable
          @on-change="search"
        >
          <Option value="1">已分配</Option>
          <Option value="0">未分配</Option>
        </Select>
      </FormItem>
      <FormItem label="是否转接" :label-width="80">
        <Select
          style="width: 150px;"
          v-model="params.isTransfer"
          placeholder="全部"
          clearable
          @on-change="search"
        >
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>
      </FormItem>
      <FormItem label="客户等级" :label-width="80">
        <Select
          style="width: 150px;"
          v-model="params.userLevel"
          placeholder="全部"
          clearable
          @on-change="search"
        >
          <Option value="A">A</Option>
          <Option value="B">B</Option>
          <Option value="C">C</Option>
          <Option value="D">D</Option>
          <Option value="E">E</Option>
          <Option value="F">F</Option>
        </Select>
      </FormItem>
      <FormItem>
        <div style="cursor: pointer;padding: 5px 10px;" @click="showOrHidden">
          <span>
            {{isShow?"收起":"展开"}}
            <Icon type="ios-arrow-up" v-if="isShow"/>
            <Icon v-else type="ios-arrow-down"/>
          </span>
        </div>
      </FormItem>
      <collapse-transition>
        <div v-show="isShow">
          <FormItem label="通话时长" :label-width="80">
            <Select
              style="width: 150px;"
              v-model="params.callAllTime"
              placeholder="全部"
              clearable
              @on-change="search"
            >
              <Option value="1">小于10秒</Option>
              <Option value="2">10秒～20秒</Option>
              <Option value="3">20秒～30秒</Option>
              <Option value="4">30秒～40秒</Option>
              <Option value="5">40秒～50秒</Option>
              <Option value="6">50秒～1分钟</Option>
              <Option value="7">1分钟～2分钟</Option>
              <Option value="8">大于2分钟</Option>
            </Select>
          </FormItem>
          <FormItem label="呼叫结果" :label-width="80">
            <Select
              style="width: 150px;"
              v-model="params.callResult"
              placeholder="全部"
              clearable
              @on-change="search"
            >
              <Option v-for="(v, k) in CALL_RESULT" :key="k" :value="k">{{v}}</Option>
            </Select>
          </FormItem>
          <FormItem label="通话轮次" :label-width="80">
            <Select
              style="width: 150px;"
              v-model="params.callCount"
              placeholder="全部"
              clearable
              @on-change="search"
            >
              <Option value="1">0~少于3轮</Option>
              <Option value="2">4～6轮</Option>
              <Option value="3">7～10轮</Option>
              <Option value="4">11～20轮</Option>
              <Option value="5">21～30轮</Option>
              <Option value="6">大于30轮</Option>
            </Select>
          </FormItem>
          <FormItem label="关键字" :label-width="80">
            <Select
              style="width: 150px;"
              v-model="params.keyType"
              placeholder="全部"
              clearable
              @on-change="search"
            >
              <Option value="1">有效</Option>
              <Option value="0">无效</Option>
            </Select>
          </FormItem>
          <FormItem label="呼叫时间" :label-width="80">
            <DatePicker
              v-model="queryCreateTime"
              type="daterange"
              placeholder="呼叫时间"
              style="width: 150px;"
            ></DatePicker>
          </FormItem>
          <FormItem label :label-width="15">
            <i-input
              type="text"
              search
              enter-button
              placeholder="搜索关键字,多个英文逗号分隔"
              v-model.trim="params.keyWords"
              @on-enter="search"
              @on-search="search"
              style="width: 214px;"
            ></i-input>
          </FormItem>
        </div>
      </collapse-transition>
    </Form>
    <div class="tool">
        <Dropdown>
          <Button ghost  type="primary">导出
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
      <Button ghost class="ml10" type="primary" @click="showAllot"
        v-if="[3, 4].indexOf(data.status) > -1">分配
            <Icon type="arrow-down-b"></Icon>
          </Button>
      <!-- <a
        class="distribute"
        href="javascript: void(0)"
        @click="showAllot"
        v-if="[3, 4].indexOf(data.status) > -1"
      >分配</a> -->
    </div>
    <Table
      :columns="table.columns"
      :data="table.list"
      @on-selection-change="handleTableSelection"
      ref="table"
    />
    <ms-pagination
      :pageNum="params.pageNum"
      :pageSize="params.pageSize"
      :total="page.totalNum"
      @change="list"
    />

    <Modal width="850px" v-model="detail.show" title="通话详情" :footer-hide="true" class="vertical-center-modal">
      <call-record-detail :data="detail.entity" v-if="detail.show"/>
    </Modal>
    <!-- <ms-panel v-model="detail.show"
              title="通话详情">
      <call-record-detail :data="detail.entity"
                          v-if="detail.show" />
    </ms-panel>-->
    <Modal @on-ok="asyncOK" width="425" v-model="allot.show" title="分配客户给销售人员">
      <ms-lazy :initial="allot.show">
        <allot
          :clientList="allot.list"
          @on-cancel="cancelAllot"
          @after-submit="afterSubmitAllot"
          ref="myallot"
        />
      </ms-lazy>
    </Modal>
  </div>
</template>

<script>
import { indexMixin } from "@/mixins";
import taskDetailMixin from "./taskDetailMixin";
import callRecordApi from "@/api/ems/callRecord";
import clientApi from "@/api/ems/client";
import { CallRecordDetail } from "@/components/packages/ems/callRecord";
import { duration, fmt, downloadFileUrl } from "@/util";
import Allot from "./components/allot";
import { getCallResultLabel, CALL_RESULT } from "@/constants";
import CollapseTransition from "~/iview/src/components/base/collapse-transition";
export default {
  mixins: [indexMixin, taskDetailMixin],
  components: {
    CallRecordDetail,
    Allot,
    CollapseTransition
  },
  data() {
    return {
      isShow: false,
      params: {
        taskId: this.data.id,
        status: "",
        userLevel: "",
        callAllTime: "",
        callCount: "",
        keyType: "",
        keyWords: "",
        isTransfer: "",
        startTime: "",
        endTime: ""
      },
      queryCreateTime: [],
      CALL_RESULT,
      table: {
        columns: [
          {
            type: "selection",
            width: 60,
            fixed: "left"
          },
          {
            title: "通话ID",
            minWidth: 100,
            align: "center",
            key: "id"
          },
          {
            title: "客户号码",
            align: "center",
            width: 110,
            key: "mobile"
          },
          {
            title: "客户姓名",
            align: "center",
            minWidth: 100,
            key: "userName"
          },
          {
            title: "呼叫结果",
            align: "center",
            minWidth: 100,
            key: "callResult",
            value: row => {
              return getCallResultLabel(row.callResult);
            },
            render: (h, { row, column, index }) => {
              return h("span", column.value(row));
            }
          },
          {
            title: "客户等级",
            align: "center",
            minWidth: 110,
            key: "userLevel",
            render: (h, { row, column, index }) => {
              return (
                <select
                  style="width: 40px;"
                  onChange={e => this.changeUserLevel(row, e.target.value)}
                >
                  <option value="">无</option>
                  <option value="A" selected={row.userLevel === "A"}>
                    A
                  </option>
                  <option value="B" selected={row.userLevel === "B"}>
                    B
                  </option>
                  <option value="C" selected={row.userLevel === "C"}>
                    C
                  </option>
                  <option value="D" selected={row.userLevel === "D"}>
                    D
                  </option>
                  <option value="E" selected={row.userLevel === "E"}>
                    E
                  </option>
                  <option value="F" selected={row.userLevel === "F"}>
                    F
                  </option>
                </select>
              );
            }
          },
          {
            title: "是否转接人工",
            align: "center",
            minWidth: 110,
            key: "isTransfer",
            value: row => {
              return ["否", "是"][row.isTransfer];
            },
            render: (h, { row, column, index }) => {
              return h("span", column.value(row));
            }
          },
          {
            title: "转接对象",
            align: "center",
            minWidth: 100,
            key: "transferName",
            render: (h, { row, column, index }) => {
              return h("span", row.transferName ? row.transferName : "无");
            }
          },
          {
            title: "通话时长",
            align: "center",
            minWidth: 110,
            key: "callAllTime",
            value: row => {
              return duration(row.callAllTime);
            },
            render: (h, { row, column, index }) => {
              return h("span", column.value(row));
            }
          },
          {
            title: "通话轮次",
            align: "center",
            minWidth: 110,
            key: "callCount"
          },
          {
            title: "呼叫时间",
            align: "center",
            minWidth: 180,
            key: "callStartTime",
            value: row => {
              return fmt.date(row.callStartTime);
            },
            render: (h, { row, column, index }) => {
              return h("span", column.value(row));
            }
          },
          {
            title: "分配状态",
            align: "center",
            minWidth: 100,
            key: "status",
            value: row => {
              return ["未分配", row.employeeName || "已分配"][row.status];
            },
            render: (h, { row, column, index }) => {
              return h("span", column.value(row));
            }
          },
          {
            title: "操作",
            align: "center",
            width: 90,
            fixed: "right",
            render: (h, { row }) => {
              if (row.isRead == 0) {
                return h(
                  "a",
                  {
                    on: {
                      click: () => {
                        this.showDetail(row.id);
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
                         alert(2)
                        this.showDetail(row.id);
                      }
                    }
                  },
                  "已读"
                );
              }
            }
          }
        ]
      },
      allot: {
        show: false,
        list: []
      }
    };
  },
  watch: {
    queryCreateTime: {
      handler(n) {
        this.params.startTime = n[0] ? n[0].getTime() : "";
        this.params.endTime = n[1] ? n[1].getTime() : "";
        this.search();
      },
      deep: true
    }
  },
  methods: {
    asyncOK() {
      this.$refs.myallot.submit();
    },
    showOrHidden() {
      this.isShow = !this.isShow;
    },
    initData(resolve) {
      // Tab 切换结束后再执行请求
      setTimeout(() => {
        resolve();
      }, 350);
    },
    getApi() {
      return callRecordApi;
    },
    refreshTaskDetail(data) {
      this.params.taskId = data.id;
      this.search();
    },
    showAllot() {
      let selection = this.table.selection;
      if (selection.length === 0) {
        return this.warning("请选择未分配的客户");
      }
      let unAllotList = selection.filter(v => v.status === 0);
      if (unAllotList.length === 0) {
        return this.warning(
          `当前选择 ${selection.length} 条数据, 其中未分配通话数据 ${
            unAllotList.length
          } 条, 请选择未分配通话数据`
        );
      }
      if (selection.length > unAllotList.length) {
        this.info(
          `当前选择 ${selection.length} 条数据, 其中未分配通话数据 ${
            unAllotList.length
          } 条`
        );
      }
      this.allot.list = unAllotList;
      this.allot.show = true;
    },
    cancelAllot() {
      this.allot.show = false;
    },
    afterSubmitAllot() {
      this.allot.show = false;
      this.list();
    },
    exportFile(pageSize) {
      let params = Object.assign({}, this.params);
      params.pageNum = 1;
      params.pageSize = pageSize;
      callRecordApi.exportFile(params).then(data => {
        downloadFileUrl(data, "通话记录.xls");
      });
    },
    changeUserLevel(entity, userLevel) {
      clientApi
        .updateUserLevel({
          id: entity.id,
          userLevel
        })
        .then(() => {
          this.success("更新用户等级成功");
        });
    },
    //Change the color of the table row
    rowClassName(row) {
      if (row.isRead === 1) {
        return "demo-table-info-row";
      }
      return "";
    }
  }
};
</script>

<style lang="less" scoped>
.ivu-table .demo-table-info-row td {
  background-color: #dbe0e1;
  color: #3c3b3b;
}
.ivu-table-body::-webkit-scrollbar {
  height: 10px;
}
</style>
