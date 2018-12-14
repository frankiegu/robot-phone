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
                  <!-- 本页面不会出现审核中的状态 -->
                  <i-option v-for="(item,i) in statusList"
                            :value="i"
                            :key="i"
                            v-if="!!i">{{ item }}</i-option>
                </i-select>
              </FormItem>

              <FormItem>
                <i-select v-model="query.adminId"
                          class="w200"
                          @on-change='handlerSearch'
                          placeholder="请选择企业">
                  <i-option value="">全部</i-option>
                  <i-option v-for="item in firmList"
                            :key="item.adminId"
                            :value="item.adminId">{{item.name}}</i-option>
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
                  <i-input v-model="query.mobile"
                           type="text"
                           @on-enter='handlerSearch'
                           placeholder="搜索坐席号码"></i-input>
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
              坐席列表
              <div class="panel-header-tools">
                <i-button type="primary"
                          icon="plus"
                          @click="handlerAdd">开通坐席</i-button>
              </div>
            </div>
            <div class="panel-body">
              <ul class="list">
                <li v-for="(item,i) in seatList"
                    :key="i"
                    :class="{'active' : current.id == item.id }"
                    @click="handlerChangeCurrent(item)">
                  <div class="list-item df">
                    <div class="list-item-main flex1">
                      <div class="list-item-title flex1">{{item.mobile}} </div>
                      <div class="list-item-info">
                        <span class="mr10">{{item.cardType | cardType}}</span>
                        <span v-show="item.remainDays">{{item.remainDays}}天后到期</span>
                      </div>
                    </div>
                    <span class="mt15">{{item.status | status}}</span>
                  </div>
                </li>
              </ul>

              <Page class="pagination"
                    show-sizer
                    simple
                    :total="seatTotal"
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
              坐席详情
            </div>
            <div class="panel-body">
              <Tabs value="1">
                <TabPane label="基础信息"
                         name="1">
                  <seat-detail ref="detail"
                               :current-id="current ? current.id : ''"></seat-detail>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ms-panel v-model="newSeatShow"
              title="开通坐席">
      <seat-apply :visible="newSeatShow"
                  @after-save="afterSave"
                  @on-cancel="afterCancel"></seat-apply>
    </ms-panel>

  </div>
</template>

<script>
import seatDetail from "./detail";
import seatApply from "./components/seat-apply";
const status = ['审核中', '空闲', '已过期', '使用中', '异常']
const cardType = { '1': '机器人坐席', '2': '人工坐席', '3': '固定坐席' }



export default {
  data() {
    return {
      fullScreen: false,
      query: {
        startTime: '',
        endTime: '',
        status: '',
        mobile: '',
        adminId: '',
        cardType: '', // 为空
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
      newSeatId: '',

    };
  },
  components: {
    seatDetail,
    seatApply
  },
  filters: {
    cardType(input) {
      return cardType[`${input}`]
    },
    status(input) {
      return status[input]
    },
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
      this.current = await this.loadSeatList()
    },
    loadFirmList() {
      this.$pmsApi.seat.getFirmList().then(data => {
        this.firmList = data
      })
    },
    async loadSeatList() {
      return this.$pmsApi.seat.getSeatList(this.query).then(data => {
        this.seatList = data.dataList
        this.seatTotal = data.totalNum
        return data.dataList.length ? data.dataList[0] : {}
      }).catch(() => {
        return {}
      })
    },
    handlerSearch() {
      this.onPageChange(1)
    },
    onPageChange(n) {
      this.query.pageNum = n;
      this.init();
    },
    handlerChangeCurrent(obj) {
      this.current = obj
    },
    handlerAdd() {
      this.newSeatId = ''
      this.newSeatShow = true
    },
    afterSave() {
      // 新增 在请求列表，本页面不做重载
      this.newSeatShow = false
    },
    afterCancel() {
      this.newSeatShow = false
    },


  },
  created() {
    this.init()
    this.loadFirmList() // 搜素条件
  }
};
</script>
