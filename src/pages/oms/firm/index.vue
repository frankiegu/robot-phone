<template>
  <div>
    <Breadcrumb separator=">">
      <span class="home" @click="linkTo('emsHomeIndex')">
        <BreadcrumbItem>首页</BreadcrumbItem>
      </span>
      <BreadcrumbItem>企业管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="divide" :class="{full: fullScreen}">
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              <Icon class="v-before fs18 mr10"></Icon>
              <span class="vm">企业列表</span>
            </div>
            <div class="padding-10" style="padding-bottom:0;">
              <DatePicker
                v-model="queryCreateTime"
                style="width:100%;"
                type="daterange"
                placeholder="选择创建时间"
              ></DatePicker>
              <i-input
                v-model="query.name"
                type="text"
                class="mt-10"
                @on-search="handlerSearch"
                search
                placeholder="搜索企业名称"
                @on-enter="handlerSearch"
              ></i-input>
            </div>
            <div class="panel-body">
              <ul class="list">
                <li
                  v-for="(item,i) in firmList"
                  :key="i"
                  :class="{'active' : current.id == item.id }"
                  @click="handlerChangeCurrent(item)"
                >
                  <div class="mb-5">{{item.name}}</div>
                  <div class="list-item-info fleX">
                    <span>AI: {{item.robotCount}}</span>
                    <span>人: {{item.employeeCount}}</span>
                    <span>智能: {{item.fixedCount}}</span>
                  </div>
                </li>
              </ul>

              <Page
                class="pagination"
                show-sizer
                simple
                :total="firmTotal"
                :current="currentPage"
                @on-change="onPageChange"
              />
            </div>
          </div>
        </div>

        <div class="task-r divide-main">
          <div class="panel">
            <div class="panel-body" v-if="!current || !current.id">
              <p class="nodata">暂无数据!!</p>
            </div>
            <div class="panel-body" v-show="current && current.id">
              <div class="fleX mt-30 mb-10">
 <div class="title contentAfter">
                     企业详情
                 </div>
                 <div class="panel-header-tools">
                <Button type="primary" @click.native="openMessageCount">添加短信条数</Button>
                <Button type="primary" @click.native="openKey">修改讯飞Key</Button>
              </div>
              </div>
              
                 
              <firm-detail ref="detail" :current-id="current ? current.id : ''"></firm-detail>
               <div class="title contentAfter">
                     坐席列表
                 </div>
              <seat-list :current-id="current ? current.id : ''"></seat-list>
            </div>
          </div>
        </div>
      </div>
    </div>
    <message-modal
      v-model="messageModal.visible"
      :id="current.id"
      :firmData="messageModal.entity"
      @after-submit="afterSubmitMessageModal"
    />
    <change-Key
      v-model="keyShow"
      :id="current.id"
      :keyData="keyData"
      ref="key"
      @after-cancel="cancelKeyModal"
      @after-submit="afterSubmitKeyModal"
    />
  </div>
</template>

<script>
import tableMixin from "@/mixins/table-mixin.js";
import firmDetail from "./detail";
import seatList from "./seat-list";
import MessageModal from "./components/message-modal";
import changeKey from "./components/changeKey";
const status = [{ label: "禁用", value: 0 }, { label: "启用", value: 1 }];

export default {
  data() {
    return {
      tabName: "1",
      fullScreen: false,
      query: {
        startTime: "",
        endTime: "",
        name: "",
        pageSize: 10,
        pageNum: 1
      },
      queryCreateTime: [],
      iflyAsrKey: "",
      firmList: [],
      firmTotal: 0,

      current: {}, // 保存当前企业
      // 新增企业
      newFirm: {},
      newFirmShow: false,
      messageModal: {
        visible: false,
        entity: {
          messageAllCount: 0,
          messageUseCount: 0
        }
      },
      keyShow: false,
      keyData: ""
    };
  },
  components: {
    firmDetail,
    seatList,
    MessageModal,
    changeKey
  },
  computed: {
    currentPage() {
      return this.query.pageNum;
    }
  },
  watch: {
    queryCreateTime: {
      handler(n) {
        this.query.startTime = n[0] ? n[0].getTime() : "";
        this.query.endTime = n[1] ? n[1].getTime() : "";
        this.handlerSearch();
      },
      deep: true
    }
  },
  methods: {
    linkTo(name) {
      Util.openPage(this, name);
    },
    async init() {
      this.current = await this.loadFirmList();
    },
    async loadFirmList() {
      return this.$omsApi.firm
        .getList(this.query)
        .then(data => {
          this.firmList = data.dataList;
          this.firmTotal = data.totalNum;
          return data.dataList.length ? data.dataList[0] : {};
        })
        .catch(() => {
          return {};
        });
    },
    handlerSearch() {
      this.onPageChange(1);
    },
    onPageChange(n) {
      this.query.pageNum = n;
      this.init();
    },
    handlerChangeCurrent(obj) {
      this.current = obj;
    },
    // 增加短信条数
    openMessageCount() {
      this.$omsApi.firm.getDetail(this.current.id).then(data => {
        this.messageModal.entity = data;
        this.messageModal.visible = true;
      });
    },
    openKey() {
      this.keyShow = true;
      // debugger
      this.keyData = this.$refs.detail.detail;
    },
    afterSubmitMessageModal() {
      this.messageModal.visible = false;
      this.$refs.detail.loadDetail();
    },
    afterSubmitKeyModal() {
      this.keyShow = false;
      this.$refs.detail.loadDetail();
    },
    cancelKeyModal() {
      this.keyShow = false;
    },
    cancelMessageModal() {
      this.messageModal.visible = false;
    }
  },
  created() {
    this.init();
  }
};
</script>
