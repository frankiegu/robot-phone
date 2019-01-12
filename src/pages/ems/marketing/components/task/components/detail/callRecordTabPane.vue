<template>
  <div class="call_record">
    
    <Form inline>
      <FormItem label="分配状态" :label-width="80">
        <Select
          style="width: 150px;"
          v-model="params.status"
          placeholder="分配状态"
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
          <span class="blue_link">
            {{isShow?"收起":"展开"}}
            <Icon type="ios-arrow-up" v-if="isShow"/>
            <Icon v-else type="ios-arrow-down"/>
          </span>
        </div>
      </FormItem>
      <collapse-transition>
        <div v-show="isShow">
          <FormItem :label-width="10">
            <InputNumber
              placeholder="最小通话秒数"
              style="width: 85px;"
              v-model.trim="params.startCallAllTime"
            ></InputNumber>
            <span>—</span>
            <InputNumber
              placeholder="最大通话秒数"
              style="width: 85px;"
              v-model.trim="params.endCallAllTime"
            ></InputNumber>
            <Button @click="inputVerify1" shape="circle" icon="ios-search"></Button>
          </FormItem>
          <FormItem :label-width="5">
            <InputNumber
              placeholder="最小通话轮次"
              style="width: 85px;"
              v-model.trim="params.startCallCount"
            ></InputNumber>
            <span>—</span>
            <InputNumber
              placeholder="最大通话轮次"
              style="width: 85px;"
              v-model.trim="params.endCallCount"
            ></InputNumber>
            <Button @click="inputVerify2" shape="circle" icon="ios-search"></Button>
          </FormItem>

          <FormItem label="呼叫结果" :label-width="73">
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
      <div class="tool-btns">
        <Dropdown>
          <Button ghost type="primary">导出
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
        <Button
          ghost
          class="ml10"
          type="primary"
          @click="showAllot"
          v-if="[3, 4].indexOf(data.status) > -1"
        >分配
          <Icon type="arrow-down-b"></Icon>
        </Button>
      </div>
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

    <Modal
      class-name="vertical-center-modal"
      width="1000px"
      v-model="detail.show"
      title="通话详情"
      :footer-hide="true"
      class="vertical-center-modal"
    >
      <call-record-detail
        @showdetail="showDetail"
        @listdetail="listAndDetail"
        :data="detail.entity"
        v-if="detail.show"
      />
    </Modal>
    <Modal
      class-name="vertical-center-modal"
      :mask-closable="false"
      @on-ok="asyncOK"
      width="480"
      v-model="allot.show"
      title="分配客户给销售人员"
    >
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
        endTime: "",
        startCallAllTime: null,
        endCallAllTime: null,
        startCallCount: null,
        endCallCount: null
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
            render: (h, { row, index }) => {
              if (row.isRead == 0) {
                return h(
                  "a",
                  {
                    on: {
                      click: () => {
                        this.showDetail(row.id, index);
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
                        this.showDetail(row.id, index);
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
    inputVerify1() {
      if (this.params.startCallAllTime == null) {
        this.$Message.warning({ content: "请输入最小通话秒数", duration: 1 });
        return;
      } else if (this.params.endCallAllTime == null) {
        this.$Message.warning({ content: "请输入最大通话秒数", duration: 1 });
        return;
      } else if (this.params.startCallAllTime > this.params.endCallAllTime) {
        this.$Message.warning({ content: "起始值不能小于结束值", duration: 1 });
        return;
      } else {
        this.search();
      }
    },
    inputVerify2() {
      if (this.params.startCallCount == null) {
        this.$Message.warning({ content: "请输入最小通话轮次", duration: 1 });
        return;
      } else if (this.params.endCallCount == null) {
        this.$Message.warning({ content: "请输入最大通话轮次", duration: 1 });
        return;
      } else if (this.params.startCallAllTime > this.params.endCallAllTime) {
        this.$Message.warning({ content: "起始值不能小于结束值", duration: 1 });
        return;
      } else {
        this.search();
      }
    },
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
