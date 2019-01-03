<template>
  <div>
     <Breadcrumb separator=">">
        <span class="home" @click="linkTo('emsHomeIndex')">
          <BreadcrumbItem>首页</BreadcrumbItem>
        </span>
        <BreadcrumbItem>AI外呼</BreadcrumbItem>
        <BreadcrumbItem>{{cardTypeName}}坐席</BreadcrumbItem>
    </Breadcrumb>
    <div class="divide" :class="{full: fullScreen}">
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel" style="border-radius: 0px; box-shadow: none;">
            <div class="panel-header">
              <span class="vm">{{cardTypeName}}坐席列表</span>
            </div>
            <div>
              <div class="fleX pd10">
                <Select  placeholder="请选择机器人状态" style="width: 50%;" @on-change="getSeatList" v-model="query.status">
                  <Option
                    v-for="(item,index) in statusOption"
                    :value="item.value"
                    :key="index"
                  >{{item.label}}</Option>
                </Select>
                <DatePicker
                  type="daterange"
                  style="width: 50%;"
                  placeholder="请选择创建日期"
                  v-model="dateRange"
                  format="yyyy-MM-dd"
                  @on-change="delaySearch"
                ></DatePicker>
              </div>
              <div class="pd10" style="padding-top:0;">
                <i-input
                    search 
                    @on-search="getSeatList"
                    v-model="query.mobile_or_name"
                    type="text"
                    @on-enter="getSeatList"
                    :placeholder='"搜索" + cardTypeName + "坐席名称／手机号"'
                  >
                  </i-input>
              </div>
            </div>
            <div class="panel-body">
              <ul class="list" v-if="seatList.length">
                <li
                  v-for="(item,index) in seatList"
                  :key="index"
                  :class="{active:(item.id==activedId)}"
                  @click="selectSeat(item)"
                  v-if="seatList.length"
                >
                  <div class="list-item">
                    <div class="list-item-ext">
                      <div class="list-item-ext-text">
                        <i class="icon icon-phone"></i>
                        {{item.calledCount}}次
                        <p v-if="item.timeoutTip">
                          <span class="c-danger">{{item.timeoutTip}}</span>天后到期
                        </p>
                      </div>
                    </div>
                    <div class="list-item-main">
                      <p>{{item.mobile}}</p>
                      <!-- <div class="list-item-info">{{item.nickName}}</div> -->
                    </div>
                  </div>
                </li>
              </ul>
              <div class="cf">
                <div class="fl simple-total">
                  共
                  <span class="c-primary fs14">{{seatPage.totalNum}}</span>条数据
                </div>
                <Page
                  class="pagination fr"
                  :total="seatPage.totalNum"
                  simple
                  @on-change="onSeatPageChange"
                  :current="seatPage.pageNum"
                  :page-size="seatPage.pageSize"
                ></Page>
              </div>
            </div>
          </div>
        </div>
        <div class="task-r divide-main">
          <div class="panel" style="border-radius: 0px; box-shadow: none;">
            <div class="panel-header">
              {{cardTypeName}}坐席详情
              <template v-if="detail && detail.id">
                <slot name="detailOperator" :data="detail"/>
              </template>
            </div>
            <div class="panel-body" v-show="!dataList.length">
              <p class="nodata">暂无数据!!</p>
            </div>
            <div class="panel-body" v-show="dataList.length">
              <Tabs v-model="tabName" v-show="detail && detail.id">
                <TabPane label="基础信息" name="1">
                  <!-- 基础信息 -->
                  <slot name="baseInfo" :data="detail">
                    <base-info  :detail="detail" v-if="seatList.length>0"></base-info>
                  </slot>
                </TabPane>
                <TabPane label="通话记录" name="2">
                  <slot name="callRecord" :data="detail" v-if="tabName === '2'">
                    <!-- 通话记录 -->
                    <call-record :id="activedId" :card-type="query.cardType"></call-record>
                  </slot>
                </TabPane>
              </Tabs>
              <p class="nodata" v-show="!(detail && detail.id)">请先选择坐席</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import seatMixin from "@/mixins/seatMixin";
import baseInfo from "./baseInfo";
import callRecord from "./callRecord";
import { watchDateRangeToTimestamp } from "@/util";
import Util from '@/util/util'
export default {
  data() {
    return {
      fullScreen: false,
      activedId: null, //侧栏选中id
      activedMobile: "",
      query: {
        status: "",
        createTimeBegin: "",
        createTimeEnd: "",
        mobileOrName: "",
        cardType: 1
      },
      dateRange: [],
      dataList: "",
      statusOption: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "未开始",
          value: 0
        },
        {
          label: "正常",
          value: 1
        },
        {
          label: "已过期",
          value: 2
        },
        {
          label: "使用中",
          value: 3
        }
      ],
      detail: {
        id: "",
        card_id: 1,
        mobile: "",
        endTime: "",
        createTime: "",
        status: 1,
        calledCount: null,
        receivingStatus: [],
        userLevel: [],
        callTime: [],
        callCount: [],
        nickName: ""
      },
      tabName: "1"
    };
  },
  props: {
    cardType: {
      type: Number,
      default: 1
    }
  },
  computed: {
    cardTypeName() {
      return ["", "机器", "人工", "固定"][this.cardType];
    }
  },
  mounted() {
    this.pageInit();
  },
  created() {
    this.$watch(
      "dateRange",
      watchDateRangeToTimestamp(this.query, "createTimeBegin", "createTimeEnd")
    );
  },
  watch: {
    activedId: function(nv, ov) {
      this.getSeatDetail();
    },
    $route() {
      this.pageInit();
    }
  },

  components: {
    baseInfo,
    callRecord
  },
  mixins: [seatMixin],
  methods: {
    linkTo(name) {
      Util.openPage(this, name);
    },
    pageInit() {
      this.query.cardType = this.cardType;
      this.getSeatList();
    },
    async getSeatList() {
      let vm = this;
      let result = await this.$emsApi.cardSlot.getList(
        vm.assignSeatQuery(vm.query)
      );
      this.dataList = result.dataList;
      if (result.dataList.length > 0) {
        vm.activedId = result.dataList[0].id;
      }
      vm.initSeatData(result.totalNum, result.dataList);
    },
    delaySearch() {
      setTimeout(() => {
        this.getSeatList();
      }, 0);
    },
    async getSeatDetail() {
      let vm = this;
      switch (this.cardType) {
        case 3:
          vm.detail = await this.$emsApi.cardSlot.getFixedDetail(vm.activedId);
          break;
        default:
          vm.detail = await this.$emsApi.cardSlot.getDetail(vm.activedId);
      }
    },
    //侧栏点击事件
    selectSeat(item) {
      this.activedId = item.id;
    }
  }
};
</script>
