<template>
  <div>
    <div class="divide" :class="{full: fullScreen}">
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">客户列表</div>
            <div class="pd10" style="padding-bottom:0;">
                            <div class="fleX">
               <Select
                  v-model="formSearch.task_id"
                  filterable
                  :loading="loading"
                  @on-change="handleSearch"
                  placeholder="选择来源(营销任务)"
                  style="width: 50%"
                >
                  <Option value>请选择</Option>
                  <Option v-for="t in taskList" :key="t.id" :value="t.id">{{ t.taskName }}</Option>
                </Select>
                <Select
                  style="width: 50%"
                  v-model="formSearch.user_level"
                  placeholder="客户等级"
                  @on-change="handleSearch"
                >
                  <Option value>请选择</Option>
                  <Option value="A">A</Option>
                  <Option value="B">B</Option>
                  <Option value="C">C</Option>
                  <Option value="D">D</Option>
                  <Option value="E">E</Option>
                  <Option value="F">F</Option>
                </Select>
            </div>
             <div class="mt10">
               <Select
                  v-model="formSearch.status"
                  @on-change="handleSearch"
                  placeholder="分配状态"
                >
                  <Option value>请选择</Option>
                  <Option value="0">未分配</Option>
                  <Option value="1">已分配</Option>
                </Select>
             </div>
             <div class="mt10">
               <i-input
                    v-model="formSearch.name_mobile"
                    type="text"
                    search
                    @on-enter="handleSearch"
                    @on-search="handleSearch"
                    placeholder="搜索客户姓名/手机号"
                  ></i-input>
             </div>
            </div>
            <div class="panel-body" v-if="dataList.length">
              <ul class="list">
                <li
                  v-for="(item, index) in dataList"
                  :key="index"
                  @click="handleClientClick(item.mobile)"
                  :class="{ active: item.mobile === selectedMobile }"
                >
                  <div class="list-item">
                    <div class="list-item-main">
                      <p>{{ item.mobile }}</p>
                      <div class="list-item-info">
                        <span>任务数：{{ item.taskNum }}</span>
                        <i
                          class="icon"
                          :class="{ 'icon-female': item.sex === 0, 'icon-male': item.sex === 1 }"
                        ></i>
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
        <div class="task-r divide-main">
          <div class="panel">
            <div class="panel-body" v-show="!dataList.length">
              <p class="nodata">暂无数据!!</p>
            </div>
            <div v-show="dataList.length" class="panel-body">
              <div class="title fleX" style="border-bottom:1px solid #F1F1F1;padding-bottom:10px;">
                <div>基础信息</div>
                <div>
                  <span>
                    <Select
                      clearable
                      v-show="dataList.length"
                      placeholder
                      v-model="selectedTask"
                      @on-change="handleIdChange"
                      style="margin-left: 15px; width: 150px;"
                    >
                      <Option v-for="t in clientTaskList" :value="t.id" :key="t.id">{{ t.taskName }}</Option>
                    </Select>
                    <span v-show="dataList.length" style="margin-left:20px;">
                      <span @click="handleEdit" class="iconWap">
                        <Icon size="25" type="ios-create-outline"/>
                      </span>
                      <span @click="handleDelete" class="iconWap">
                        <Icon size="25" color="red" type="ios-trash-outline"/>
                      </span>
                      <!-- <Button type="primary" :disabled="!client.id" @click="handleEdit">编辑</Button>
                      <Button type="error" :disabled="!client.id" @click="handleDelete">删除</Button>-->
                    </span>
                  </span>
                </div>
              </div>
              <div class="task-detail">
                <h1>
                  <div class="fr">
                    <!--
                        <Button :disabled="!client.id"
                                type="primary"
                                @click="handleCall">
                          <i class="icon icon-phone"></i> 呼叫(累计{{ client.callNum }}次)
                        </Button>
                    -->
                    <Button
                      v-if="client.isAllot === 1"
                      type="default"
                    >已分配({{ client.employeeName }})</Button>
                  </div>
                </h1>
                <div class="keyword mt-30">
                  <ins v-for="(label, i) in client.labels" :key="i" class="keyword-item">{{ label }}</ins>
                </div>
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
              </div>

              <CallList ref="call"></CallList>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal :mask-closable="false" width="700px" title="编辑客户" v-model="editVisible">
      <Edit ref="edit" v-show="editVisible" :confirm="editConfirm" :close="editClose"></Edit>
      <div slot="footer">
        <Button style="margin-right: 8px" @click="editClose">取消</Button>
        <Button type="primary" @click="submitForm">确定</Button>
      </div>
    </Modal>

    <Modal v-model="callVisible" title="呼叫客户" class-name="modal-lg">
      <Distribute ref="distribute" @click="clickDistrubute"/>
      <div slot="footer"></div>
    </Modal>
    <call-modal v-model="callModal.visible" :data="callModal.data"/>
    <!-- <Detail ref="mineDetail" v-show="detailVisible" :hide="hideCallDetail"></Detail> -->
  </div>
</template>
<script>
import API from "@/api/index";
import CallList from "./CallList.vue";
import Edit from "./Edit.vue";
import Distribute from "./Distribute";
import CallModal from "@/components/packages/ems/call/modal";

const API_CLIENT = API.ems.client;
const API_TASK = API.ems.task;

export default {
  name: "clientManager",
  components: {
    CallList,
    Edit,
    Distribute,
    CallModal
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
        user_level: "",
        status: ""
      },
      selectedMobile: "",
      selectedTask: "",
      client: {},
      clientTaskList: [],
      editVisible: false,
      callVisible: false,
      loading: false, // 任务 select 数据获取
      callModal: {
        visible: false,
        data: {}
      },
      detailVisible: false
    };
  },
  mounted() {
    this.getClients();
    this.getTaskList();
  },
  methods: {
    submitForm() {
      this.$refs.edit.handleConfirm();
    },
    getClients() {
      const obj = Object.assign({}, this.formSearch, this.pager);
      this.loading = true;
      API_CLIENT.list(obj).then(res => {
        this.loading = false;
        this.dataList = res.dataList;
        this.totalNum = res.totalNum;
        this.handleClientClick(this.dataList[0].mobile);
        if (this.dataList.length > 0 && !this.client.mobile) {
          this.handleClientClick(this.dataList[0].mobile);
        }
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
    editConfirm(data) {
      API_CLIENT.update(data).then(res => {
        this.$Message.success("成功");
        this.editClose();
        this.getClients();
      });
    },
    handleEdit() {
      this.editVisible = true;
      this.$refs.edit.init(this.client);
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
    handleClientClick(mobile) {
      this.selectedMobile = mobile;
      this.client = {};
      this.selectedTask = "";
      this.clientTaskList = [];
      // 获取
      API_CLIENT.getTaskList(mobile).then(res => {
        this.clientTaskList = res;
        this.selectedTask = this.clientTaskList[0].id;
        if (this.clientTaskList.length > 0) {
          this.handleIdChange(this.selectedTask);
        }
      });
    },
    handleIdChange(id) {
      if (id) {
        this.getClientDetail(id);
        this.$refs.call.initCallList({ record_id: this.selectedTask });
      }
    },
    clickDistrubute(cardRelateId) {
      let client = this.client;
      API_CLIENT.getCall({
        callId: client.id,
        cardRelateId,
        taskId: this.selectedTask
      }).then(data => {
        this.callModal.data = {
          customerName: client.userName,
          customerMobile: data.mobile,
          machineNo: data.machineNo,
          slotNo: data.slotNo,
          token: data.token,
          fsAddr: data.fsAddr
        };
        this.callVisible = false;
        this.callModal.visible = true;
      });
    }
  }
};
</script>
