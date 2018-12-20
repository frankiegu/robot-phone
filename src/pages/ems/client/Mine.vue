<template>
  <div>
    <Breadcrumb separator=">">
        <span class="home" @click="linkTo('emsHomeIndex')">
          <BreadcrumbItem>首页</BreadcrumbItem>
        </span>
        <BreadcrumbItem>客户中心</BreadcrumbItem>
        <BreadcrumbItem>我的客户</BreadcrumbItem>
    </Breadcrumb>
    <div class="divide" :class="{full: fullScreen}">
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">客户列表</div>
            <div class="pl10 pr10 mt10">
              <div class="fleX mb10">
                <Select
                  style="width:50%"
                  v-model="formSearch.task_id"
                  @on-change="handleSearch"
                  placeholder="选择来源(营销任务)"
                >
                  <Option value>全部</Option>
                  <Option v-for="t in taskList" :key="t.id" :value="t.id">{{ t.taskName }}</Option>
                </Select>
                <Select
                  v-model="formSearch.user_level"
                  @on-change="handleSearch"
                  placeholder="客户等级"
                  style="width:50%;"
                >
                  <Option value>不限</Option>
                  <Option value="A">A</Option>
                  <Option value="B">B</Option>
                  <Option value="C">C</Option>
                  <Option value="D">D</Option>
                  <Option value="E">E</Option>
                  <Option value="F">F</Option>
                </Select>
              </div>
              <div>
                <i-input
                  search
                  v-model="formSearch.name_mobile"
                  @on-enter="handleSearch"
                  @on-search="handleSearch"
                  type="text"
                  placeholder="搜索客户姓名/手机号"
                ></i-input>
              </div>
            </div>
            <div class="panel-body">
              <ul v-if="dataList.length" class="list">
                <li
                  v-for="(item, index) in dataList"
                  :key="index"
                  @click="handleClientClick(item)"
                  :class="{ active: item.id === selectedId }"
                >
                  <div class="list-item">
                    <div class="list-item-main">
                      <p>{{ item.mobile }}</p>
                      <p class="list-item-info">
                        <span>任务数：{{ item.taskNum }}</span>
                        <i
                          class="icon"
                          :class="{ 'icon-female': item.sex === 0, 'icon-male': item.sex === 1 }"
                        ></i>
                      </p>
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
          </div>
        </div>
        <div class="task-r divide-main">
          <div class="panel">
            <div class="panel-body" v-if="!dataList.length">
              <p class="nodata">暂无数据!!</p>
            </div>
            <div class="panel-body" v-else>
              <Tabs value="1">
                <TabPane label="基础信息" name="1">
                  <div class="task-detail">
                    <div class="mt-20">
                      <Row>
                        <i-col span="8">
                          <p>客户：{{ client.userName }}{{ client.sex === 0 ? '/女' : ''}}{{ client.sex === 1 ? '/男' : '' }}</p>
                        </i-col>
                        <i-col span="8">
                          <p>年龄: {{ client.age||'--' }}</p>
                        </i-col>
                        <i-col span="8">
                          <p>出生日期: {{ client.bronTime | msToDate('yyyy-MM-dd') }}</p>
                        </i-col>
                      </Row>
                      <Row>
                        <i-col span="8">
                          <p>QQ号: {{ client.qq ||'--' }}</p>
                        </i-col>
                        <i-col span="8">
                          <p>微信号: {{ client.weixin ||'--' }}</p>
                        </i-col>
                        <i-col span="8">
                          <p>来源: {{ client.taskName ||'--' }}</p>
                        </i-col>
                      </Row>
                      <Row>
                        <i-col span="8">
                          <p>单位电话: {{ client.companyMobile ||'--' }}</p>
                        </i-col>
                        <i-col span="8">
                          <p>客户单位: {{ client.companyName ||'--' }}</p>
                        </i-col>
                        <i-col span="8">
                          <p>
                            客户等级:
                            <span class="keyword-item keyword-warning">{{client.userLevel}}</span>
                          </p>
                        </i-col>
                      </Row>
                      <Row>
                        <i-col span="8">
                          <p>家庭电话: {{ client.homeMobile ||'--'}}</p>
                        </i-col>
                        <i-col span="8">
                          <p>备注: {{ client.remarks || '--' }}</p>
                        </i-col>
                        <i-col span="8">
                          <p>创建时间: {{ client.callStartTime | msToDate }}</p>
                        </i-col>
                      </Row>
                    </div>
                    <div class="mt10">
                        <Button :disabled="!client.id" type="primary" @click="handleCall">
                          <i class="icon icon-phone"></i>
                          呼叫(累计{{ client.callNum }}次)
                        </Button>
                        <Button
                        class="ml10"
                          v-if="client.isAllot === 1"
                          type="default"
                        >已分配({{ client.employeeName }})</Button>
                      </div>
                  </div>
                </TabPane>
                <TabPane label="通话记录" name="2">
                  <CallList ref="mineCall"></CallList>
                </TabPane>
                <div class="panel-header-tools" v-if="dataList.length" slot="extra">
                  <Select
                    placeholder="请选择"
                    v-if="dataList.length"
                    v-model="selectedTask"
                    @on-change="handleIdChange"
                    style="margin-right: 10px; width: 150px;"
                  >
                    <Option v-for="t in clientTaskList" :value="t.id" :key="t.id">{{ t.taskName }}</Option>
                  </Select>
                  <Button class="mr10" type="primary" :disabled="!client.id" @click="handleEdit">编辑</Button>
                  <Button class="mr10" type="error" :disabled="!client.id" @click="handleDelete">删除</Button>
                  <Button type="primary" :disabled="!client.id" @click="handleCall">
                    <i class="icon icon-phone"></i> 呼叫
                  </Button>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Edit ref="mineEdit" v-show="editVisible" :confirm="editConfirm" :close="editClose"></Edit>
    <Modal :mask-closable="false" v-model="callVisible" title="呼叫客户" class-name="modal-lg" @on-ok="callOk">
      <Distribute ref="distribute"/>
    </Modal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import API from "@/api/index";
import CallList from "./CallList.vue";
import Edit from "./Edit.vue";
import Distribute from "./Distribute";
import Util from '@/util/util';
const API_CLIENT = API.ems.client;

export default {
  name: "clientManager",
  components: {
    CallList,
    Edit,
    Distribute
  },
  computed: {
    ...mapGetters(["userId"])
  },
  data() {
    return {
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
        user_level: ""
      },
      selectedMobile: "",
      selectedTask: "",
      selectedId: "",
      client: {},
      clientTaskList: [],
      editVisible: false,
      callVisible: false,
      detailVisible: false
    };
  },
  mounted() {
    this.getClients();
    this.getTaskList();
  },
  methods: {
    linkTo(name) {
      Util.openPage(this, name);
    },
    getClients() {
      const obj = Object.assign(
        { employee_id: this.userId },
        this.formSearch,
        this.pager
      );

      API_CLIENT.getClientListByEmployeeId(obj)
        .then(res => {
          this.dataList = res.dataList;
          this.totalNum = res.totalNum;
          this.selectedId = this.dataList[0].id;
          this.getClientDetail(this.selectedId);
          // if (this.dataList.length > 0 && !this.client.mobile) {
          //   this.handleClientClick(this.dataList[0])
          // }
          if (this.dataList.length > 0 && !this.client.id) {
            this.client = this.dataList[0];
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    getClientDetail(id) {
      // 根据选中id 获取客户详情
      API_CLIENT.get(id).then(res => {
        this.client = res;
      });
    },
    getTaskList() {
      API_CLIENT.getFirmTaskList().then(res => {
        this.taskList = res;
      });
    },
    deleteClient() {
      API_CLIENT.del(this.client.id).then(res => {
        this.$Message.success("删除成功");
        // 刷新数据
        this.client = {};
        this.getClients();
      });
    },
    editClose() {
      this.editVisible = false;
    },
    editConfirm(obj) {
      API_CLIENT.update(obj).then(res => {
        this.$Message.success("成功");
        this.editClose();
        this.getClients();
      });
    },
    handleEdit() {
      this.editVisible = true;
      this.$refs.mineEdit.init(this.client);
    },
    handleDelete() {
      // 删除当前客户
      const clt = this.client;
      if (clt && clt.id) {
        this.$Modal.confirm({
          content: `确认删除 ${clt.userName} 客户？`,
          width: 300,
          onOk: this.deleteClient
        });
      }
    },
    handleCall() {
      this.callVisible = true;
      // 获取人工坐席列表
      this.$refs.distribute.getArtList();
    },
    handleChangePageNum(toPage) {
      this.pager.pageNum = toPage;
      this.getClients();
    },
    handleSearch() {
      this.pager = {
        pageNum: 1,
        pageSize: 10
      };
      this.totalNum = 0;
      this.getClients();
    },
    handleClientClick(item) {
      this.selectedMobile = item.mobile;
      this.client = {};
      this.selectedTask = "";
      this.clientTaskList = [];
      // 获取
      API_CLIENT.getEmployeeTaskList(item.id).then(res => {
        this.clientTaskList = res;
        this.selectedTask = this.clientTaskList[0].id;
        if (this.clientTaskList.length > 0) {
          this.selectedTask = this.clientTaskList[0].id;
          this.handleIdChange(this.selectedTask);
        }
      });
    },
    handleIdChange(id) {
      if (id) {
        this.getClientDetail(id);
        this.$refs.mineCall.initCallList({ mobile: this.selectedMobile });
      }
    },
    callOk() {
      this.$refs.distribute.calling();
    }
  }
};
</script>
