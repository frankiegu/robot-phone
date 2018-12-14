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
                          class="w180"
                          @on-change='handlerSearch'
                          placeholder="请选择状态">
                  <i-option label="全部"
                            value=""></i-option>
                  <i-option v-for="(label,k) in firmStatus"
                            :key="k"
                            :label="label"
                            :value="k"></i-option>
                </i-select>
              </FormItem>
              <FormItem>
                <DatePicker v-model="queryCreateTime"
                            type="daterange"
                            placeholder="选择创建时间"
                            class="w200"
                            @on-change='delaySearch'></DatePicker>
              </FormItem>
              <div class="fr">
                <FormItem>
                  <i-input v-model="query.name"
                           type="text"
                           placeholder="搜索企业名称"
                           @on-enter="handlerSearch">
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
            </div>
            <div class="panel-body">
              <ul class="list">
                <li v-for="(item,i) in firmList"
                    :key="i"
                    :class="{'active' : currentFirm.id == item.id }"
                    @click="handlerChangeFirm(item)">
                  <div class="list-item">
                    <div class="list-item-main">
                      <p class="list-item-title">{{item.name}}</p>
                      <div class="list-item-info">
                        <span>
                          <Icon type="wrench"></Icon>: {{item.robotCount}}</span>
                        <span>
                          <Icon type="android-person"></Icon>: {{item.employeeCount}}</span>
                        <span>
                          <Icon type="android-person"></Icon>: {{item.fixedCount}}</span>
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
                   v-show="currentFirm && currentFirm.id">
                <i-button type="primary"
                          @click="handlerRelateWhispering">关联话术</i-button>
              </div>
            </div>
            <div class="panel-body"
                 v-if="!currentFirm || !currentFirm.id">
              <p class="nodata">暂无数据!!</p>
            </div>
            <div class="panel-body"
                 v-show="currentFirm && currentFirm.id">
              <Tabs value="1"
                    v-model="tabName">
                <TabPane label="基础信息"
                         name="1">
                  <firm-detail :firm-id="currentFirm ? currentFirm.id : ''"></firm-detail>
                </TabPane>
                <TabPane label="话术列表"
                         name="2">
                  <whispering-list v-show="tabName=='2'"
                                   ref="whispering"
                                   :firm-id="currentFirm ? currentFirm.id : ''"></whispering-list>
                </TabPane>
                <TabPane label="端口列表"
                         name="3">
                  <port-list v-if="tabName=='3'"
                             :firm-id="currentFirm ? currentFirm.id : ''"></port-list>
                </TabPane>
                <TabPane label="客户列表"
                         name="4">
                  <customer-list v-if="tabName=='4'"
                                 :firm-id="currentFirm ? currentFirm.id : ''"></customer-list>
                </TabPane>
                <TabPane label="任务列表"
                         name="5">
                  <task-list v-if="tabName=='5'"
                             :firm-id="currentFirm ? currentFirm.id : ''"></task-list>
                </TabPane>
                <TabPane label="通话记录"
                         name="6">
                  <call-list v-if="tabName=='6'"
                             :firm-id="currentFirm ? currentFirm.id : ''"></call-list>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import tableMixin from "@/mixins/table-mixin.js";
import { firmStatus } from "@/pages/sms/const";
import firmDetail from "./detail";
import whisperingList from "./whispering-list";
import portList from "./port-list";
import customerList from "./customer-list";
import taskList from "./task-list";
import callList from "./call-list";
import { watchDateRangeToTimestamp } from "@/util";

export default {
  data() {
    return {
      tabName: '1',
      fullScreen: false,
      query: {
        startTime: '',
        endTime: '',
        name: '',
        status: '',
        pageSize: 10,
        pageNum: 1
      },
      queryCreateTime: [],
      firmList: [],
      firmTotal: 0,
      firmStatus,
      currentFirm: {}, // 保存当前企业
    };
  },
  mixins: [tableMixin],
  components: {
    firmDetail,
    whisperingList,
    portList,
    customerList,
    taskList,
    callList,
  },
  computed: {
    currentPage() {
      return this.query.pageNum;
    }
  },
  created() {
    this.init()
    this.$watch('queryCreateTime', watchDateRangeToTimestamp(this.query, 'startTime', 'endTime'))
  },
  methods: {
    async init() {
      this.currentFirm = await this.loadFirmList()
    },
    async loadFirmList() {
      let query = Object.assign({}, this.query)
      return this.$smsApi.firm.getList(query).then(data => {
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
    delaySearch() {
      setTimeout(() => {
        this.handlerSearch()
      }, 0)
    },
    onPageChange(n) {
      this.query.pageNum = n;
      this.init();
    },
    handlerChangeFirm(firm) {
      this.currentFirm = firm
    },
    handlerRelateWhispering() {
      this.$refs.whispering.$emit('on-add-whispering')
    },
  }
};
</script>
