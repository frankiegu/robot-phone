<template>
  <div>
    <div class="divide"
         :class="{full: fullScreen}">
      <div class="divide-item">
        <div class="panel">
          <div class="panel-body">
            <Form class="panel-form"
                  inline
                  ref="formSearch"
                  :model="formSearch">
              <div class="fr">
                <FormItem prop="name_mobile">
                  <Input v-model="formSearch.name_mobile"
                         @on-enter="handleSearch"
                         type="text"
                         placeholder="搜索管理员姓名/手机号">
                  <Icon type="search"
                        slot="prepend"></Icon>
                  </Input>
                </FormItem>
                <FormItem>
                  <Button type="primary"
                          @click="handleSearch">查询</Button>
                </FormItem>
              </div>
              <FormItem prop="status"
                        label=""
                        :label-width="0">
                <Select v-model="formSearch.status"
                        placeholder="选择状态"
                        @on-change="getClients"
                        style="width: 150px;">
                  <Option value="">请选择</Option>
                  <Option value="0">关闭</Option>
                  <Option value="1">开启</Option>
                </Select>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              管理员列表
              <div class="panel-header-tools">
                <Button type="primary"
                        icon="plus"
                        @click="addManage">添加管理员</Button>
              </div>
            </div>
            <div class="panel-body"
                 v-if="dataList.length">
              <ul class="list">
                <li v-for="(item, index) in dataList"
                    :key="index"
                    @click="handleClick(item.id)"
                    :class="{ active: item.id === selectedId }">
                  <div class="list-item">
                    <div class="list-item-ext">
                      <div class="list-item-ext-text">
                        姓名: {{ item.name }}
                      </div>
                    </div>
                    <div class="list-item-main">
                      <p class="list-item-title">{{ item.mobile }}</p>
                      <div class="list-item-info">
                        <span>{{ item.employeeName }}</span>
                        <i class="icon"
                           :class="{ 'icon-female': item.sex === 0, 'icon-male': item.sex === 1 }"></i>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <Page class="pagination"
                    show-sizer
                    simple
                    :total="totalNum"
                    :pageNum="pager.pageNum"
                    :pageSize="pager.pageSize"
                    @on-change="handleChangePageNum" />
            </div>
            <div class="tc pd20"
                 v-else>
              <span>暂无数据</span>
            </div>
          </div>
        </div>
        <div class="task-r divide-main">
          <div class="panel">
            <div class="panel-header">
              <i class="icon icon-enlarge panel-header-icon"
                 :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'"
                 @click="() => fullScreen = !fullScreen"></i>
              管理人员详情
              <div v-show="dataList.length>0"
                   class="panel-header-tools">
                <Button type="primary"
                        :disabled="!client.id"
                        @click="handleSetting">权限设置</Button>
                <Button type="primary"
                        :disabled="!client.id"
                        @click="handleEdit">编辑</Button>
                <Button type="error"
                        :disabled="!client.id"
                        @click="handleDelete">删除</Button>
              </div>
            </div>
            <div class="panel-body"
                 v-show="dataList.length==0  ">
              <p class="nodata">暂无数据!!</p>
            </div>
            <div class="panel-body"
                 v-show=" dataList.length >0">

              <Tabs value="1">
                <TabPane label="基础信息"
                         name="1">
                  <div class="task-detail">
                    <h1>{{ client.mobile }}
                      <div class="fr">
                        <p>状态：{{ client.status ? '开启' : '关闭' }}</p>
                        <i-switch v-model="client.status"
                                  size="large"
                                  :true-value="1"
                                  :false-value="0"
                                  @on-change="handleSwitchChange">
                          <span slot="open">开启</span>
                          <span slot="close">关闭</span>
                        </i-switch>
                      </div>
                    </h1>
                    <hr class="mt-20">
                    <div class="mt-20">
                      <Row>
                        <Col span="10">
                        <p>管理员账号: {{ client.account}}</p>
                        </Col>
                        <Col span="10">
                        <p>管理员密码: {{ client.password }}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span="10">
                        <p>管理员名字: {{ client.name }}</p>
                        </Col>
                        <Col span="10">
                        <p>管理员电话: {{ client.mobile }}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span="10">
                        <p>联系人地址: {{ client.contactsAddress || '无' }}</p>
                        </Col>
                        <Col span="10">
                        <p>备注: {{ client.remarks || '无' }}</p>
                        </Col>
                      </Row>

                    </div>
                    <div class="block mt20">
                      <div class="block-header">
                        账号权限
                      </div>
                    </div>
                    <div class="keyword">
                      <ins class="keyword-item2"
                           v-for="label in client.menus"
                           :key='label.id'>{{label }}</ins>
                      <h3 class="information text-c"
                          v-show="client.menus && client.menus.length==0">
                        <Icon type="information-circled"></Icon>暂无权限</h3>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
    <manageEdit v-show="editVisible"
                ref="edit"
                :confirm="editConfirm"
                :close="editClose"></manageEdit>
    <Setting v-show="settingVisible"
             ref="setting"
             :confirm="settingConfirm"
             :close="settingClose"></Setting>

  </div>
</template>
<script>
import API from "@/api/index";
import manageEdit from "./manageEdit.vue";
import Setting from "./setting.vue";

const API_AdminManage = API.sms.adminManage;

export default {
  name: "adminManage",
  components: {
    manageEdit,
    Setting
  },
  data() {
    return {
      fullScreen: false,
      pager: {
        pageNum: 1,
        pageSize: 10
      },
      totalNum: 0, // 数据总数
      dataList: [], // 管理员列表数据
      formSearch: {
        id: "",
        status
      },
      selectedId: "",
      client: {},
      updateId: "updateId", //编辑时的Id
      editVisible: false,
      settingVisible: false
    };
  },
  mounted() {
    this.getClients();
    //  API_AdminManage.getMenu()
  },
  methods: {
    getClients() {
      const obj = Object.assign({}, this.formSearch, this.pager);
      API_AdminManage.list(obj).then(res => {
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
      // 根据选中id 获取管理员详情
      API_AdminManage.get(id).then(res => {
        this.client = res;
      });
    },
    deleteClient() {
      API_AdminManage.del(this.client.id).then(res => {
        this.$Message.success("删除成功");
        // 刷新数据
        this.getClients();
      });
    },
    editClose() {
      this.editVisible = false;
    },
    editConfirm(type, obj) {
      if (type === "add") {
        return API_AdminManage.save(obj).then(res => {
          this.$Message.success("添加成功");
          this.editClose();
          this.getClients();
        })
      } else if (type === "edit") {
        return API_AdminManage.update(obj).then(res => {
          this.$Message.success("修改成功");
          this.updateId = obj.id;
          this.getClients();
          this.editClose();
        });
      }
    },
    addManage() {
      this.editVisible = true;
      this.$refs.edit.init("add");
    },
    handleEdit() {
      this.editVisible = true;
      this.$refs.edit.init("edit", this.client);
    },
    handleSetting() {
      this.settingVisible = true;
      this.$refs.setting.init(this.client.id);
    },

    handleDelete() {
      // 删除当前管理员
      const clt = this.client;
      if (clt && clt.id) {
        this.$Modal.confirm({
          content: `您确认删除 ${clt.name} 管理员？`,
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

    handleSwitchChange(status) {
      API_AdminManage.updateStatu({
        id: this.client.id,
        status: status
      }).then(res => {
        this.$Message.success({
          content: `更改状态为：${this.client.status ? "开启" : "关闭"}`,
          onClose: this.getClientDetail(this.client.id)
        });
      });
    }
  }
};
</script>
