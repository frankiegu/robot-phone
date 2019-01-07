<template>
  <div>
    <Breadcrumb separator=">">
      <span class="home" @click="linkTo('camsHomeIndex')">
        <BreadcrumbItem>首页</BreadcrumbItem>
      </span>
      <BreadcrumbItem>坐席管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="divide" :class="{full: fullScreen}">
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              <Icon type="ios-list-outline" class="vm fs18 v-before mr10"></Icon>
              <span class="vm">坐席列表</span>
              <div class="panel-header-tools">
                <i-button type="primary" @click="handlerAdd">
                  <Icon type="md-add" size="16" style="margin-top:-4px;"/>开通坐席
                </i-button>
              </div>
            </div>
            <div class="pl-10 pr-10">
              <div class="fleX mt-10">
                <i-select v-model="query.status" @on-change="handlerSearch" placeholder="请选择状态">
                  <i-option value>全部状态</i-option>
                  <!-- 本页面不会出现审核中的状态 -->
                  <i-option v-for="(item,i) in statusList" :value="i" :key="i" v-if="!!i">{{ item }}</i-option>
                </i-select>
                <i-select v-model="query.adminId" @on-change="handlerSearch" placeholder="请选择企业">
                  <i-option value>全部</i-option>
                  <i-option
                    v-for="item in firmList"
                    :key="item.adminId"
                    :value="item.adminId"
                  >{{item.name}}</i-option>
                </i-select>
              </div>
              <div class="fleX mt-15">
                <DatePicker
                  v-model="queryCreateTime"
                  type="daterange"
                  style="width:50%"
                  placeholder="选择创建时间"
                ></DatePicker>
                <i-input
                  v-model="query.mobile"
                  type="text"
                  style="width:50%;"
                  search
                  @on-search="handlerSearch"
                  @on-enter="handlerSearch"
                  placeholder="搜索坐席号码"
                ></i-input>
              </div>
            </div>
            <div class="panel-body">
              <ul class="list">
                <li
                  v-for="(item,i) in seatList"
                  :key="i"
                  :class="{'active' : current.id == item.id }"
                  @click="handlerChangeCurrent(item)"
                >
                  <div class="fleX alCenter">
                    <div class="list-item-info">
                      <div class="titles">{{item.mobile}}</div>
                      <div class="mr10">{{item.cardType | cardType}}</div>
                      <div v-show="item.remainDays">{{item.remainDays}}天后到期</div>
                    </div>
                    <span>{{item.status | status}}</span>
                  </div>
                </li>
              </ul>

              <Page
                class="pagination"
                show-sizer
                simple
                :total="seatTotal"
                :current="currentPage"
                @on-change="onPageChange"
              />
            </div>
          </div>
        </div>

        <div class="task-r divide-main">
          <div class="panel">
            <div class="panel-body">
              <div class="title contentAfter mt-10 mb-10">基础信息</div>
              <seat-detail ref="detail" :current-id="current ? current.id : ''"></seat-detail>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal  :mask-closable="false" width="700" class-name="vertical-center-modal" v-model="newSeatShow" title="开通坐席">
      <seat-apply ref="seatapply" :visible="newSeatShow" @after-save="afterSave" @on-cancel="afterCancel"></seat-apply>
      <div slot="footer">
        <i-button type="text" @click="afterCancel">取消</i-button>
         <i-button type="primary" @click="handlerSaveForm">保存</i-button>
      </div>
    </Modal>
  </div>
</template>

<script>
import seatDetail from "./detail";
import seatApply from "./components/seat-apply";
import Util from "@/util/util";
const status = ["审核中", "空闲", "已过期", "使用中", "异常"];
const cardType = { "1": "机器人坐席", "2": "人工坐席", "3": "固定坐席" };

export default {
  data() {
    return {
      fullScreen: false,
      query: {
        startTime: "",
        endTime: "",
        status: "",
        mobile: "",
        adminId: "",
        cardType: "", // 为空
        pageSize: 10,
        pageNum: 1
      },
      queryCreateTime: [],
      seatList: [],
      seatTotal: 0,
      current: {}, // 保存当前企业

      statusList: status,
      firmList: [], // 条件： 企业列表
      // 新增企业

      // 开通坐席：考虑新增编辑公共，根据newSeatId 区分新增、编辑
      newSeatShow: false,
      newSeatId: ""
    };
  },
  components: {
    seatDetail,
    seatApply
  },
  filters: {
    cardType(input) {
      return cardType[`${input}`];
    },
    status(input) {
      return status[input];
    }
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
    handlerSaveForm(){
      this.$refs.seatapply.handlerSave();
    },
    async init() {
      this.current = await this.loadSeatList();
    },
    loadFirmList() {
      this.$pmsApi.seat.getFirmList().then(data => {
        this.firmList = data;
      });
    },
    async loadSeatList() {
      return this.$pmsApi.seat
        .getSeatList(this.query)
        .then(data => {
          this.seatList = data.dataList;
          this.seatTotal = data.totalNum;
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
    handlerAdd() {
      this.newSeatId = "";
      this.newSeatShow = true;
    },
    afterSave() {
      // 新增 在请求列表，本页面不做重载
      this.newSeatShow = false;
    },
    afterCancel() {
      this.newSeatShow = false;
    }
  },
  created() {
    this.init();
    this.loadFirmList(); // 搜素条件
  }
};
</script>
