<template>
  <div>
    <Breadcrumb separator=">">
        <span class="home" @click="linkTo('emsHomeIndex')">
          <BreadcrumbItem>首页</BreadcrumbItem>
        </span>
        <BreadcrumbItem>团队管理</BreadcrumbItem>
        <BreadcrumbItem>团队管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="divide" :class="{full: fullScreen}">
      <div class="task">
        <div class="task-r divide-main" style="margin-left:0;">
          <div class="panel">
           
            <div class="panel-body">
              <Tabs value="1" v-model="tabName" style="margin-bottom:0;">
                <TabPane label="成员列表" name="info">
                  <div class="fleX" style="flex：1;">
                    <div
                      class="task-l divide-item"
                      style="width:15rem;border-radius:0;box-shadow:none;border-right: .7rem solid #f3f4f8;"
                    >
                      <div class="panel">
                        <div class="panel-header">销售人员列表
                          <div class="panel-header-tools">
                            <Button type="primary" icon="plus" @click="addEmployee">添加员工</Button>
                          </div>
                        </div>
                        <div class="mt10 pd10">
                          <Select
                            v-model="formSearch.status"
                            @on-change="getClients"
                            placeholder="选择状态"
                            style="width: 47%;"
                          >
                            <Option value="0">关闭</Option>
                            <Option value="1">开启</Option>
                          </Select>
                          <DatePicker
                            type="daterange"
                            placeholder="选择日期"
                            style="width: 47%;"
                            v-model="dateRange"
                            @on-change="delaySearch"
                          />
                          <div class="mt10">
                            <i-input
                              v-model="formSearch.name_mobile"
                              type="text"
                              search
                              style="width:95%;"
                              @on-search="handleSearch"
                              @on-enter="handleSearch"
                              placeholder="搜索员工姓名/手机号"
                            ></i-input>
                          </div>
                        </div>
                        <div class="panel-body" v-if="dataList.length">
                          <ul class="list">
                            <li
                              v-for="(item, index) in dataList"
                              :key="index"
                              @click="handleClick(item.id)"
                              :class="{ active: item.id === selectedId }"
                            >
                              <div class="list-item">
                                <div class="list-item-ext">
                                  <div class="list-item-ext-text">分配: {{ item.callNum || 0 }}</div>
                                </div>
                                <div class="list-item-main">
                                  <p>{{ item.mobile }}</p>
                                  <div class="list-item-info">
                                    <span>{{ item.employeeName }}</span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                          <Page
                            class="pagination"
                            show-sizer
                            simple
                            :total="totalNum"
                            :pageNum="pager.pageNum"
                            :pageSize="pager.pageSize"
                            @on-change="handleChangePageNum"
                          />
                        </div>
                        <div class="tc pd20" v-else>
                          <span>暂无数据</span>
                        </div>
                      </div>
                    </div>
                    <div class="task-detail task-r" style="border-radius:0;box-shadow:none;"  v-if="dataList.length">
                      <div
                        class="title fleX"
                        style="border-bottom:1px solid #f1f1f1;padding-bottom:13px;margin-top:15px;"
                      >
                        <span>基础信息</span>
                        <div class="panel-header-tools" v-show="dataList.length>0">
                          <Button type="primary" :disabled="!client.id" @click="handleBindWX">绑定微信</Button>
                          <Button type="primary" :disabled="!client.id" @click="handleSetting">权限设置</Button>
                          <Button type="primary" :disabled="!client.id" @click="handleReset">重置密码</Button>
                          <Button type="primary" :disabled="!client.id" @click="handleEdit">编辑</Button>
                          <Button type="error" :disabled="!client.id" @click="handleDelete">删除</Button>
                        </div>
                      </div>
                      <div>
                        <Row>
                          <i-col span="8">
                            <p>电话: {{ client.mobile }}</p>
                          </i-col>
                          <i-col span="8">
                            <p>姓名: {{ client.employeeName }}/{{ client.sex === 0 ? '女' : ''}}{{ client.sex === 1 ? '男' : '' }}{{client.sex === 2 ? '未设定性别' : ''}}</p>
                          </i-col>
                          <i-col span="8">
                            <p>创建时间: {{ client.createTime | msToDate }}</p>
                          </i-col>
                        </Row>
                        <Row>
                          <i-col span="8">
                            <p>
                              最后登录时间: {{ client.lastLoginTime | msToDate }}
                              <span
                                v-show="client==null || client.lastLoginTime==null"
                              >暂未登录</span>
                            </p>
                          </i-col>

                          <i-col span="8">
                            <p>绑定微信: {{client.wxName || '未绑定'}}</p>
                          </i-col>
                          <i-col span="8">
                            <p>绑定微信: {{client.wxName || '未绑定'}}</p>
                          </i-col>
                        </Row>
                        <Row>
                          <i-col span="8">
                            <p>状态：{{ client.status ? '开启' : '关闭' }}</p>
                          </i-col>
                          <i-col span="8">
                            <p>
                              <i-switch
                                v-model="client.status"
                                size="large"
                                :true-value="1"
                                :false-value="0"
                                @on-change="handleSwitchChange"
                              >
                                <span slot="open">开启</span>
                                <span slot="close">关闭</span>
                              </i-switch>
                            </p>
                          </i-col>
                          <i-col span="8">
                            <p>备注: {{ client.remarks || '无' }}</p>
                          </i-col>
                        </Row>
                      </div>
                      <div
                        class="title"
                        style="border-bottom:1px solid #f1f1f1;padding-bottom:5px;"
                      >账号权限</div>
                      <div class="keyword">
                        <ins
                          v-for="label in client.menus"
                          class="keyword-item2"
                          :key="label.id"
                        >{{ label }}</ins>
                        <h3
                          class="information text-c"
                          v-show="client.menus && client.menus.length==0"
                        >
                          <Icon type="information-circled"></Icon>暂无权限
                        </h3>
                      </div>
                      <client-list ref="client" :id="client.id" v-if="tabName === 'info'"></client-list>
                    </div>
                   <p class="nodata" style="width:100%" v-else>
                     暂无数据
                   </p>
                  </div>
                </TabPane>
                <TabPane label="绑定微信推送" name="wx">
                  <Wx v-if="tabName === 'wx'"></Wx>
                </TabPane>
                <TabPane label="操作日志" name="log" v-if="dataList.length">
                  <OperationList ref="operation" :id="client.id" v-if="tabName === 'log'"></OperationList>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
    <EmployeeEdit v-show="editVisible" ref="edit" :confirm="editConfirm" :close="editClose"></EmployeeEdit>
    <Setting v-show="settingVisible" ref="setting" :confirm="settingConfirm" :close="settingClose"></Setting>
    <Modal v-model="bindWX.visible" title="绑定微信">
      <bind-w-x
        v-if="bindWX.visible"
        :id="client.id"
        ref="myWx"
        @on-cancel="cancelBindWX"
        @after-submit="afterSubmitBindWX"
      />
      <div slot="footer">
        <Button 
                style="margin-right: 8px"
                @click="cancelBindWX">取消</Button>
        <Button type="primary"
                @click="submitFrom">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { indexMixin } from "@/mixins";
import API from "@/api/index";
import OperationList from "./OperationList.vue";
import EmployeeEdit from "./EmployeeEdit.vue";
import Setting from "./Setting.vue";
import { watchDateRangeToTimestamp } from "@/util";
import ClientList from "./ClientList.vue";
import BindWX from "./BindWX.vue";
import Wx from "../wx";
import Util from '@/util/util';
const API_EMPLOYEE = API.ems.employee;

export default {
  name: "clientManager",
  components: {
    OperationList,
    EmployeeEdit,
    Setting,
    ClientList,
    BindWX,
    Wx
  },
  data() {
    return {
      tabName: "info",
      fullScreen: false,
      pager: {
        pageNum: 1,
        pageSize: 10
      },
      totalNum: 0, // 数据总数
      dataList: [], // 客户列表数据
      taskList: [], // 选择来源（营销任务）
      formSearch: {
        name_mobile: "",
        task_id: "",
        user_level: "",
        status: "",
        start_time: "",
        end_time: ""
      },
      dateRange: [],
      date: {
        begin: "",
        end: ""
      },
      selectedId: "",
      updateId: "1", //编辑时的id
      client: {},
      editVisible: false,
      settingVisible: false,
      bindWX: {
        visible: false
      },
      editOrReset: "修改成功"
    };
  },
  created() {
    this.$watch(
      "dateRange",
      watchDateRangeToTimestamp(this.formSearch, "startTime", "endTime")
    );
  },
  mounted() {
    this.getClients();
  },
  methods: {
     linkTo(name) {
      Util.openPage(this, name);
    },
    submitFrom(){
      this.$refs.myWx.submit();
    },
    getClients() {
      const obj = Object.assign({}, this.formSearch, this.pager);

      API_EMPLOYEE.list(obj).then(res => {
        this.dataList = res.dataList;
        this.totalNum = res.totalNum;

        if (this.dataList.length > 0) {
          if (this.selectedId !== this.updateId) {
            this.selectedId = this.dataList[0].id;
          }
          this.getClientDetail(this.selectedId);
        }
      });
    },
    getClientDetail(id) {
      API_EMPLOYEE.get(id).then(res => {
        this.client = res;
      });
    },
    deleteClient() {
      API_EMPLOYEE.del(this.client.id).then(res => {
        this.$Message.success("删除成功");
        // 刷新数据
        this.getClients();
      });
    },
    updateEmployee(data) {
      API_EMPLOYEE.update(data).then(res => {
        this.$Message.success(this.editOrReset);
        this.getClientDetail(data.id);
      });
    },
    editClose() {
      this.editVisible = false;
    },
    editConfirm(type, obj) {
      if (type === "add") {
        return API_EMPLOYEE.save(obj).then(res => {
          this.$Message.success("添加成功");
          this.editClose();
          this.getClients();
        });
      } else if (type === "edit") {
        return API_EMPLOYEE.update(obj).then(res => {
          this.$Message.success("修改成功");
          this.updateId = obj.id;
          this.getClients();
          this.editClose();
        });
      }
    },
    handleEdit() {
      this.editVisible = true;
      this.$refs.edit.init("edit", this.client);
    },
    handleSetting() {
      this.settingVisible = true;
      this.$refs.setting.init(this.client.id, this.client.menus);
    },
    handleReset() {
      let clt = this.client;
      clt.password = "123456";
      this.editOrReset = `重置成功，当前密码为：${clt.password}`;
      this.$Modal.confirm({
        content: `确认重置 ${clt.employeeName} 员工密码？`,
        width: 300,
        onOk: () => this.updateEmployee(clt)
      });
    },
    handleDelete() {
      // 删除当前客户
      const clt = this.client;
      if (clt && clt.id) {
        this.$Modal.confirm({
          content: `确认删除 ${clt.employeeName} 员工？`,
          width: 300,
          onOk: this.deleteClient
        });
      }
    },
    handleChangePageNum(toPage) {
      this.pager.pageNum = toPage;
      this.getClients();
    },
    handleSearch() {
      this.getClients();
    },
    delaySearch() {
      setTimeout(() => {
        this.handleSearch();
      }, 0);
    },
    handleClick(id) {
      this.selectedId = id;
      this.getClientDetail(id);
    },
    settingClose() {
      this.settingVisible = false;
    },
    settingConfirm(id) {
      this.getClientDetail(id);
      this.settingVisible = false;
    },
    addEmployee() {
      this.editVisible = true;
      this.$refs.edit.init("add");
    },
    handleSwitchChange(status) {
      API_EMPLOYEE.updateStatu({
        id: this.client.id,
        status: status
      }).then(() => {
        this.$Message.success({
          content: `更改状态为：${this.client.status ? "开启" : "关闭"}`,
          onClose: this.getClientDetail(this.client.id)
        });
      });
    },
    handleBindWX() {
      this.bindWX.visible = true;
    },
    cancelBindWX() {
      this.bindWX.visible = false;
    },
    afterSubmitBindWX() {
      this.getClientDetail(this.client.id);
      this.bindWX.visible = false;
    }
  }
};
</script>
