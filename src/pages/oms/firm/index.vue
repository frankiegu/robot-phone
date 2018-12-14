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
                <DatePicker v-model="queryCreateTime"
                            type="daterange"
                            placeholder="选择创建时间"
                            class="w200"></DatePicker>
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
                   v-if="current && current.id">
                <Button type="primary"
                        @click.native="openMessageCount">添加短信条数</Button>
                <Button type="primary"
                        @click.native="openKey">修改讯飞Key</Button>
              </div>
            </div>
            <div class="panel-body"
                 v-if="!current || !current.id">
              <p class="nodata">暂无数据!!</p>
            </div>
            <div class="panel-body"
                 v-show='current && current.id'>
              <Tabs value="1" v-model="tabName">
                <TabPane label="基础信息"
                         name="1">
                  <firm-detail ref="detail"
                               :current-id="current ? current.id : ''"></firm-detail>
                </TabPane>
                <TabPane label="坐席列表"
                         name="2">
                  <seat-list v-if="tabName=='2'" :current-id="current ? current.id : ''"></seat-list>
                </TabPane>

              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
    <message-modal v-model="messageModal.visible"
                   :id="current.id"
                   :firmData="messageModal.entity"
                   @after-submit="afterSubmitMessageModal" />
    <change-Key v-model="keyShow"
                   :id="current.id"
                   :keyData="keyData"
                   ref="key"
                   @after-cancel="cancelKeyModal"
                   @after-submit="afterSubmitKeyModal" />

  </div>
</template>

<script>
import tableMixin from "@/mixins/table-mixin.js";
import firmDetail from "./detail";
import seatList from "./seat-list";
import MessageModal from './components/message-modal'
import changeKey from './components/changeKey'
const status = [{ label: '禁用', value: 0 }, { label: '启用', value: 1 }]


export default {
  data() {
    return {
      tabName:'1',
      fullScreen: false,
      query: {
        startTime: '',
        endTime: '',
        name: '',
        pageSize: 10,
        pageNum: 1
      },
      queryCreateTime: [],
      iflyAsrKey:'',
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
      keyData:''
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
      return this.$omsApi.firm.getList(this.query).then(data => {
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
    onPageChange(n) {
      this.query.pageNum = n;
      this.init();
    },
    handlerChangeCurrent(obj) {
      this.current = obj
    },
    // 增加短信条数
    openMessageCount() {
      this.$omsApi.firm
        .getDetail(this.current.id).then(data => {
          this.messageModal.entity = data
          this.messageModal.visible = true
        })
    },
    openKey() {
      this.keyShow = true
      // debugger
      this.keyData=this.$refs.detail.detail
    },
    afterSubmitMessageModal() {
      this.messageModal.visible = false
      this.$refs.detail.loadDetail()
    },
      afterSubmitKeyModal() {
      this.keyShow = false
      this.$refs.detail.loadDetail()
    },
cancelKeyModal(){
  this.keyShow = false
},
    cancelMessageModal() {
      this.messageModal.visible = false
    }
  },
  created() {
    this.init()
  }
};
</script>
