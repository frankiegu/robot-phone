<template>
  <div>
    <div class="divide"
         :class="{full: fullScreen}">
      <div class="divide-item">
        <div class="panel">
          <div class="panel-body">
            <i-form class="panel-form clear"
                    inline>
              <FormItem>
                <i-select v-model="query.status"
                          @on-change='handlerSearch'
                          class="w200"
                          placeholder="请选择状态">
                  <i-option value="">全部状态</i-option>
                  <i-option v-for="(item,i) in status"
                            :value="item.value"
                            :key="item.value">{{ item.label }}</i-option>
                </i-select>
              </FormItem>

              <FormItem>
                <DatePicker v-model="queryCreateTime"
                            type="daterange"
                            placeholder="选择创建时间"
                            class="w200"></DatePicker>
              </FormItem>

              <div class="fr">
                <FormItem>
                  <i-input v-model="query.name"
                           type="text"
                           @on-enter='handlerSearch'
                           placeholder="搜索企业名称">
                  </i-input>
                </FormItem>
                <FormItem>
                  <i-button type="primary"
                            @click="handlerSearch">查询</i-button>
                </FormItem>
              </div>
            </i-form>
          </div>
        </div>
      </div>
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              企业列表
              <div class="panel-header-tools">
                <i-button type="primary"
                          icon="plus"
                          @click="handlerAdd">添加企业</i-button>
              </div>
            </div>
            <div class="panel-body">
              <ul class="list">
                <li v-for="(item,i) in firmList"
                    :key="i"
                    :class="{'active' : current.id == item.id }"
                    @click="handlerChangeCurrent(item)">
                  <div class="list-item">
                    <div class="list-item-main">
                      <p class="list-item-title">{{item.name}}</p>
                      <div class="list-item-info">
                        <span>机: {{item.robotCount}}</span>
                        <span class="ml-5">人: {{item.employeeCount}}</span>
                        <span class="ml-5">固: {{item.fixedCount}}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>

              <Page class="pagination"
                    show-sizer
                    simple
                    :total="firmTotal"
                    :current="currentPage"
                    @on-change="onPageChange" />
            </div>
          </div>
        </div>

        <div class="task-r divide-main">
          <div class="panel">
            <div class="panel-header">
              <i class="icon icon-enlarge panel-header-icon"
                 :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'"
                 @click="() => fullScreen = !fullScreen"></i>
              企业详情
              <div class="panel-header-tools"
                   v-show="current && current.id">
                <i-button type="error"
                          @click="deleteFirm">删除企业</i-button>
                <i-button type="primary"
                          @click="handlerEdit">编辑</i-button>
                <i-button type="primary"
                          @click="handlerOpenSeat">开通坐席</i-button>
              </div>
            </div>
            <div class="panel-body">
              <Tabs value="1"
                    v-model="tabName">
                <TabPane label="基础信息"
                         name="1">
                  <firm-detail ref="detail"
                               :current-id="current ? current.id : ''"></firm-detail>
                </TabPane>
                <TabPane label="坐席列表"
                         name="2">
                  <seat-list v-if="tabName=='2'"
                             :current-id="current ? current.id : ''"></seat-list>
                </TabPane>

              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增企业 -->
    <ms-panel v-model="newFirmShow"
              title="新增企业">
      <new-firm :entry="newFirm"
                @after-save="afterAddSave"
                @on-cancel="addClose"></new-firm>

    </ms-panel>

    <!-- 新增企业 -->
    <ms-panel v-model="editFirmShow"
              title="编辑企业">
      <template v-if="editFirmShow">
        <edit-firm :firm-id="editFirmId"
                   @after-save="afterSaveEdit"
                   @on-cancel="editCancel"></edit-firm>
      </template>
    </ms-panel>

    <!-- 开通坐席 -->
    <ms-panel v-model="newSeatShow"
              title="开通坐席">
      <seat-apply :visible="newSeatShow"
                  :admin-id="current.id"
                  @after-save="afterSeatSave"
                  @on-cancel="afterSeatCancel"></seat-apply>
    </ms-panel>

  </div>
</template>

<script>
import tableMixin from "@/mixins/table-mixin.js";
import firmDetail from "./detail";
import seatList from "./seat-list";
import newFirm from "./components/new-firm";
import editFirm from "./components/edit-firm";
import seatApply from "../seat/components/seat-apply";
const status = [{ label: '禁用', value: 0 }, { label: '启用', value: 1 }]

const newFirmEntry = {
  account: '',
  contactsAddress: '',
  contactsMobile: '',
  contactsName: '',
  mobile: '',
  name: '',
  password: '',
  remarks: '',
  verifCode: '',
}
export default {
  data() {
    return {
      tabName: '1',
      fullScreen: false,
      query: {
        startTime: '',
        endTime: '',
        status: '',
        name: '',
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
      editFirmId: '',
      // 开通坐席：考虑新增编辑公共，根据newSeatId 区分新增、编辑
      newSeatShow: false,
      newSeatId: '',

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
        this.query.startTime = n[0] ? n[0].getTime() : ''
        this.query.endTime = n[1] ? n[1].getTime() : ''
        this.handlerSearch()
      },
      deep: true
    },
  },
  methods: {
    async init() {
      this.current = await this.loadFirmList()
    },
    async loadFirmList() {
      return this.$pmsApi.firm.getList(this.query).then(data => {
        this.firmList = data.dataList
        this.firmTotal = data.totalNum
        return data.dataList.length ? data.dataList[0] : {}
      }).catch(() => {
        return {}
      })
    },
    handlerSearch() {
      this.onPageChange(1)
    },
    deleteFirm() {
      this.$Modal.confirm({
        title: '确认删除',
        content: `删除${this.current.name}企业会将此账号下级<span class='vma-wanming'>企业的数据一并删除，删除后 数据不可恢复！</span>`,
        onOk: this.deleteConfirm
      });
    },
    deleteConfirm() {
      this.$pmsApi.firm.deleteFirm(this.current.id).then(res => {
        this.$Message.success("删除成功");
        this.init()
      });
    },
    onPageChange(n) {
      this.query.pageNum = n;
      this.init();
    },
    handlerChangeCurrent(obj) {
      this.current = obj
    },
    // 新增企业
    handlerAdd() {
      this.newFirmShow = true
      this.newFirm = { ...newFirmEntry }
    },
    afterAddSave() {
      this.loadFirmList()
      this.newFirm = { ...newFirmEntry }
    },
    addClose() {
      this.newFirmShow = false
    },
    // 编辑企业
    handlerEdit() {
      if (this.current && this.current.id) {
        this.editFirmShow = true
        this.editFirmId = this.current.id
      }
    },
    afterSaveEdit() {
      this.loadFirmList()
      this.$refs.detail.loadDetail()
    },
    editCancel() {
      this.editFirmShow = false
      this.editFirmId = ''
    },

    handlerOpenSeat() {
      this.newSeatShow = true
    },
    afterSeatSave() {
      this.newSeatShow = false
    },
    afterSeatCancel() {
      this.newSeatShow = false
    },
  },
  created() {
    this.init()
  }
};
</script>
