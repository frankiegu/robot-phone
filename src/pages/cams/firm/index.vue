<template>
  <div>
    <Breadcrumb separator=">">
      <span class="home" @click="linkTo('camsHomeIndex')">
        <BreadcrumbItem>首页</BreadcrumbItem>
      </span>
      <BreadcrumbItem>企业管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="divide" :class="{full: fullScreen}">
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              <Icon type="ios-list-outline" class="vm fs18 v-before mr10"></Icon>
              <span class="vm">企业管理</span>
              <div class="panel-header-tools">
                <i-button type="primary" @click="handlerAdd">
                  <Icon type="md-add" size="16" style="margin-top:-4px;"/>添加企业
                </i-button>
              </div>
            </div>
            <div class="pl-10 pr-10">
              <div class="fleX mt-10">
                <i-select
                  style="width:50%;"
                  v-model="query.status"
                  @on-change="handlerSearch"
                  placeholder="请选择状态"
                >
                  <i-option value>全部状态</i-option>
                  <i-option
                    v-for="(item) in status"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</i-option>
                </i-select>
                <DatePicker
                  style="width:50%;"
                  v-model="queryCreateTime"
                  type="daterange"
                  placeholder="选择创建时间"
                ></DatePicker>
              </div>
              <div class="mt-10">
                <i-input
                  v-model="query.name"
                  search
                  @on-search="handlerSearch"
                  type="text"
                  @on-enter="handlerSearch"
                  placeholder="搜索企业名称"
                ></i-input>
              </div>
            </div>
            <div class="panel-body">
              <ul class="list">
                <li
                  v-for="(item,i) in firmList"
                  :key="i"
                  :class="{'active' : current.id == item.id }"
                  @click="handlerChangeCurrent(item)"
                >
                  <p class="mt-5 titles">{{item.name}}</p>
                  <div class="fleX">
                    <span>机: {{item.robotCount}}</span>
                    <span class="ml-5">人: {{item.employeeCount}}</span>
                    <span class="ml-5">固: {{item.fixedCount}}</span>
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
            <div class="panel-body">
              <div class="fleX">
                <div class="title contentAfter mt-10 mb-10">基础信息</div>
                <div class="panel-header-tools" v-show="current && current.id">
                  <i-button type="error" @click="deleteFirm">删除企业</i-button>
                  <i-button type="primary" @click="handlerEdit">编辑</i-button>
                  <i-button type="primary" @click="handlerOpenSeat">开通坐席</i-button>
                </div>
              </div>
              <firm-detail ref="detail" :current-id="current ? current.id : ''"></firm-detail>
              <div class="title contentAfter mt-10 mb-10">坐席列表</div>
              <seat-list :current-id="current ? current.id : ''"></seat-list>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增企业 -->
    <Modal
      v-model="newFirmShow"
      title="新增企业"
      :mask-closable="false"
      width="630"
      class-name="vertical-center-modal"
    >
      <new-firm :entry="newFirm" ref="newFirmShow" @after-save="afterAddSave" @on-cancel="addClose"></new-firm>
      <div slot="footer">
        <i-button type="text" @click="addClose">取消</i-button>
        <i-button type="primary" @click="handlerNewForm">保存</i-button>
      </div>
    </Modal>

    <!-- 编辑企业 -->
    <Modal
      v-model="editFirmShow"
      title="编辑企业"
      :mask-closable="false"
      width="630"
      class-name="vertical-center-modal"
    >
      <template v-if="editFirmShow">
        <edit-firm
          ref="eidteFirm"
          :firm-id="editFirmId"
          @after-save="afterSaveEdit"
          @on-cancel="editCancel"
        ></edit-firm>
      </template>
      <div slot="footer">
        <i-button type="text" @click="editCancel">取消</i-button>
        <i-button type="primary" @click="handlerEditeForm">保存</i-button>
      </div>
    </Modal>

    <!-- 开通坐席 -->
    <Modal
      v-model="newSeatShow"
      title="开通坐席"
      :mask-closable="false"
      width="700"
      class-name="vertical-center-modal"
    >
      <seat-apply
        ref="seatapply"
        :visible="newSeatShow"
        :admin-id="current.id"
        @after-save="afterSeatSave"
        @on-cancel="afterSeatCancel"
      ></seat-apply>
      <div slot="footer">
        <i-button type="text" @click="afterSeatCancel">取消</i-button>
        <i-button type="primary" @click="handlerSaveForm">保存</i-button>
      </div>
    </Modal>
  </div>
</template>

<script>
import tableMixin from "@/mixins/table-mixin.js";
import firmDetail from "./detail";
import seatList from "./seat-list";
import newFirm from "./components/new-firm";
import editFirm from "./components/edit-firm";
import seatApply from "../seat/components/seat-apply";
import Util from "@/util/util";
const status = [{ label: "禁用", value: 0 }, { label: "启用", value: 1 }];

const newFirmEntry = {
  account: "",
  contactsAddress: "",
  contactsMobile: "",
  contactsName: "",
  mobile: "",
  name: "",
  password: "",
  remarks: "",
  verifCode: ""
};
export default {
  data() {
    return {
      tabName: "1",
      fullScreen: false,
      query: {
        startTime: "",
        endTime: "",
        status: "",
        name: "",
        pageSize: 10,
        pageNum: 1
      },
      queryCreateTime: [],
      status,

      firmList: [],
      firmTotal: 0,

      current: {}, // 保存当前企业
      // 新增企业
      newFirm: {},
      newFirmShow: false,

      // 编辑企业,和新增企业差别较大 不做复用
      editFirmShow: false,
      editFirmId: "",
      // 开通坐席：考虑新增编辑公共，根据newSeatId 区分新增、编辑
      newSeatShow: false,
      newSeatId: ""
    };
  },
  components: {
    firmDetail,
    seatList,
    newFirm,
    editFirm,
    seatApply
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
    handlerSaveForm() {
      this.$refs.seatapply.handlerSave();
    },
    //新增企业
    handlerNewForm() {
      this.$refs.newFirmShow.handlerSave();
    },
    //编辑企业保存
    handlerEditeForm() {
      this.$refs.eidteFirm.handlerSave();
    },
    async init() {
      this.current = await this.loadFirmList();
    },
    async loadFirmList() {
      return this.$pmsApi.firm
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
    deleteFirm() {
      this.$Modal.confirm({
        title: "确认删除",
        content: `删除${
          this.current.name
        }企业会将此账号下级<span class='vma-wanming'>企业的数据一并删除，删除后 数据不可恢复！</span>`,
        onOk: this.deleteConfirm
      });
    },
    deleteConfirm() {
      this.$pmsApi.firm.deleteFirm(this.current.id).then(res => {
        this.$Message.success("删除成功");
        this.init();
      });
    },
    onPageChange(n) {
      this.query.pageNum = n;
      this.init();
    },
    handlerChangeCurrent(obj) {
      this.current = obj;
    },
    // 新增企业
    handlerAdd() {
      this.newFirmShow = true;
      this.newFirm = { ...newFirmEntry };
    },
    afterAddSave() {
      this.loadFirmList();
      this.newFirm = { ...newFirmEntry };
    },
    addClose() {
      this.newFirmShow = false;
    },
    // 编辑企业
    handlerEdit() {
      if (this.current && this.current.id) {
        this.editFirmShow = true;
        this.editFirmId = this.current.id;
      }
    },
    afterSaveEdit() {
      this.loadFirmList();
      this.$refs.detail.loadDetail();
    },
    editCancel() {
      this.editFirmShow = false;
      this.editFirmId = "";
    },

    handlerOpenSeat() {
      this.newSeatShow = true;
    },
    afterSeatSave() {
      this.newSeatShow = false;
    },
    afterSeatCancel() {
      this.newSeatShow = false;
    }
  },
  created() {
    this.init();
  }
};
</script>
