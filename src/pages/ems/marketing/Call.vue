<template>
  <div>
    <Breadcrumb separator=">">
        <span class="home" @click="linkTo('emsHomeIndex')">
          <BreadcrumbItem>首页</BreadcrumbItem>
        </span>
        <BreadcrumbItem>AI外呼</BreadcrumbItem>
        <BreadcrumbItem>呼叫记录</BreadcrumbItem>
    </Breadcrumb>
    <div style=" height: calc(100vh - 125px);
    overflow: auto;">
    <div class="panel">
      <div class="panel-body">
        <Form class="panel-form" inline>
          <div style="margin-bottom:20px;white-space: nowrap;width:100%;">
                        <FormItem style="width:15%">
            <Select
              
              v-model="params.status"
              placeholder="请选择分配状态"
              clearable
              @on-change="search"
            >
              <Option value="1">已分配</Option>
              <Option value="0">未分配</Option>
            </Select>
          </FormItem>
          <FormItem style="width:15%">
            <Select
              v-model="params.isTransfer"
              placeholder="是否转接"
              clearable
              @on-change="search"
            >
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          </FormItem>
          <FormItem style="width:15%">
            <Select
              v-model="params.userLevel"
              placeholder="请选择客户等级"
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
          <FormItem style="width:15%">
            <Select
              v-model="params.callResult"
              placeholder="请选择客户结果"
              clearable
              @on-change="search"
            >
              <Option v-for="(v, k) in CALL_RESULT" :key="k" :value="k">{{v}}</Option>
            </Select>
          </FormItem>
          <FormItem style="width:15%">
            <Select
              
              v-model="params.taskId"
              placeholder="请选择营销任务"
              clearable
              @on-change="search"
            >
              <Option v-for="(v, i) in taskList" :key="i" :value="v.id">{{v.taskName}}</Option>
            </Select>
          </FormItem>
          <FormItem style="width:15%;">
            <DatePicker
              type="daterange"
              style="width:100%;"
              placeholder="请选择呼叫日期"
              @on-change="delaySearch"
              v-model="dateRange"
            />
          </FormItem>
          </div>
          <div style="white-space: nowrap;width:100%;">
            <FormItem style="width:18%;">
               <InputNumber
              placeholder="最小通话秒数"
              style="width:38%;"
              v-model.trim="params.startCallAllTime"
             
            ></InputNumber>
           <span>—</span>
             <InputNumber
              placeholder="最大通话秒数"
              style="width:38%;"
              v-model.trim="params.endCallAllTime"
             
            ></InputNumber>
             <Button @click="inputVerify1" shape="circle" icon="ios-search"></Button>
            </FormItem>
            <FormItem style="width:18%;">
               <InputNumber
              placeholder="最小通话轮次"
              style="width:38%;"
              v-model.trim="params.startCallCount"
            ></InputNumber>
           <span>—</span>
             <InputNumber
              placeholder="最大通话轮次"
              style="width:38%;"
              v-model.trim="params.endCallCount"            
            ></InputNumber>
             <Button @click="inputVerify2" shape="circle" icon="ios-search"></Button>
            </FormItem>
          
          <FormItem style="width:15%;">
            <i-input
              type="text"
              search
              placeholder="主叫号码/客户号码/日期"
              v-model.trim="params.idOrMobileOrCardMobile"
              @on-enter="search"
              @on-search="search"
            ></i-input>
          </FormItem>
          </div>
        </Form>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <div class="mb10 tool">
          <div class="tool-btns">
            <Dropdown>
              <Button ghost  type="primary">导出
                <Icon type="md-arrow-dropdown" />
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
        <Table :border="false" :columns="table.columns" :data="table.list" ref="table"/>
        <ms-pagination
          :pageNum="params.pageNum"
          :pageSize="params.pageSize"
          :total="page.totalNum"
          @change="list"
        />
      </div>
    </div>
    </div>
    <Modal
        class-name="vertical-center-modal"
        width="850px"
        :footer-hide = "true"
        v-model="detail.show"
        title="通话详情"
        >
        <call-record-detail :isShow="false" :data="detail.entity" v-if="detail.show"/>
    </Modal>
    
  </div>
</template>
<script>
import { indexMixin } from "@/mixins";
import callRecordApi from "@/api/ems/callRecord";
import clientApi from "@/api/ems/client";
import {
  duration,
  fmt,
  downloadFileUrl,
  watchDateRangeToTimestamp
} from "@/util";
import { CallRecordDetail } from "@/components/packages/ems/callRecord";
import { getCallResultLabel, CALL_RESULT } from "@/constants";
import Util from '@/util/util'
export default {
  name: "marketingCall",
  mixins: [indexMixin],
  components: {
    CallRecordDetail
  },
  data() {
    return {
      params: {
        status: "",
        userLevel: "",
        callResult: "",
        idOrMobileOrCardMobile: "",
        taskId: "",
        callAllTime: "",
        callCount: "",
        isTransfer: "",
        startTime: "",        
        endTime: "",
        startCallAllTime:null,
        endCallAllTime:null,
        startCallCount:null,
        endCallCount:null

      },
      dateRange: [],
      taskList: [],
      CALL_RESULT,
      table: {
        columns: [
         
          {
            title: "主叫号码",
            key: "cardMobile"
          },
          {
            title: "客户号码",
            key: "mobile"
          },
          {
            title: "呼叫结果",
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
             width: 110,
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
            key: "transferName",
            render: (h, { row, column, index }) => {
              return h("span", row.transferName ? row.transferName : "无");
            }
          },
          {
            title: "通话时长",
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
            key: "callCount"
          },
          {
            title: "呼叫时间",
            key: "callStartTime",
            value: row => {
              return fmt.date(row.callStartTime);
            },
            render: (h, { row, column, index }) => {
              return h("span", column.value(row));
            }
          },
          {
            title: "营销任务",
            key: "taskName"
          },
          {
            title: "分配状态",
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
            render: (h, { row }) => {
              if (row.isRead === 0) {
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
                        this.showDetail(row.id);
                        if (row.isRead === 0) {
                          callRecordApi.isRead({ callId: row.id }).then(res => {
                            this.listAndDetail(row.id);
                          });
                        }
                      }
                    }
                  },
                  "已读"
                );
              }
            }
          }
        ]
      }
    };
  },
  created() {
    clientApi.getFirmTaskList().then(data => {
      this.taskList = data;
    });
    this.$watch(
      "dateRange",
      watchDateRangeToTimestamp(this.params, "startTime", "endTime")
    );
  },
  methods: {
    linkTo(name) {
      Util.openPage(this, name);
    },
    inputVerify1(){
       if(this.params.startCallAllTime==null){
         this.$Message.warning({content:'请输入最小通话秒数',duration: 1});
         return
       }
       else if(this.params.endCallAllTime==null){
         this.$Message.warning({content:'请输入最大通话秒数',duration: 1});
         return
       }
       else if(this.params.startCallAllTime>this.params.endCallAllTime){
           this.$Message.warning({content:'起始值不能小于结束值',duration: 1});
         return
       }
       else{
          this.search();
       }
      
    },
    inputVerify2(){
       if(this.params.startCallCount==null){
         this.$Message.warning({content:'请输入最小通话轮次',duration: 1});
         return
       }
       else if(this.params.endCallCount==null){
         this.$Message.warning({content:'请输入最大通话轮次',duration: 1});
         return
       }
       else if(this.params.startCallAllTime>this.params.endCallAllTime){
           this.$Message.warning({content:'起始值不能小于结束值',duration: 1});
         return
       }
       else{
          this.search();
       }
      
    },
    getApi() {
      return callRecordApi;
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
    exportFile(pageSize) {
      let params = Object.assign({}, this.params);
      params.pageNum = 1;
      params.pageSize = pageSize;
      callRecordApi.exportFile(params).then(data => {
        downloadFileUrl(data, "呼叫记录.xls");
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
<style lang="less">
.ivu-table .demo-table-info-row td {
  background-color: #dbe0e1;
  color: #3c3b3b;
}
</style>