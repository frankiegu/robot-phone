<template>
  <div>
      <Breadcrumb separator=">">
      <span class="home" @click="linkTo('pamsHomeIndex')">
        <BreadcrumbItem>首页</BreadcrumbItem>
      </span>
      <BreadcrumbItem>市级代理管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="divide" :class="{full: fullScreen}">
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              <Icon type="ios-list-outline" class="vm fs18 v-before mr10"></Icon>
              <span class="vm">代理商列表</span>
              <div class="panel-header-tools">
                <i-button type="primary"  @click="handlerAddProxy"><Icon type="md-add" />开通市代</i-button>
              </div>
            </div>
             <div class="pl-10 pr-10">
                 <div class="fleX mt-15">
                     <i-select
                  clearable
                  v-model="query.provinceId"
                  @on-change="getItemList"
                  placeholder="选择省份"
                >
                  <Option
                    v-for="(item,index) in provinceList"
                    :key="index"
                    :value="item.provinceId"
                  >{{item.provinceName}}</Option>
                </i-select>
                <i-select
                  clearable
                  v-model="query.cityProxyType"
                  @on-change="getItemList"
                  placeholder="选择代理类型"
                >
                  <Option
                    v-for="(item,index) in proxyTypeList"
                    :key="index"
                    :value="item.value"
                  >{{item.label}}</Option>
                </i-select>
                 </div>
                 <div class="fleX mt-15">
                     <i-select
                  clearable
                  v-model="query.status"
                  @on-change="getItemList"
                  placeholder="选择状态"
                >
                  <Option
                    v-for="(item,index) in statusOption"
                    :key="index"
                    :value="item.value"
                  >{{item.label}}</Option>
                </i-select>
                <i-input
                    v-model="query.name"
                    type="text"
                    search
                    @on-search="getItemList"
                    @on-enter="getItemList"
                    placeholder="搜索代理商"
                  ></i-input>
                 </div>
            </div>
            <div class="panel-body" v-if="itemList.length">
              <ul class="list" v-if="itemList.length">
                <li
                  v-for="(item,index) in itemList"
                  :key="index"
                  :class="{active:(item.id==activedId)}"
                  @click="selectItem(item)"
                >   
                <div  class="fleX alCenter">
                     <ins
                          :class="['medal',{'medal-gold':item.proxyType==3,'medal-sliver':item.proxyType==2,'medal-bronze':item.proxyType==1}]"
                        >{{item.proxyType|proxyType}}</ins>
                        <div>
                      <div>
                        <span>{{item.name}}</span>
                      </div>
                      <div class="fleX" style="min-width:10.5rem">
                        <span>{{item.cityName}}</span>
                        <span>{{item.remainPort}}/{{item.totalPort}}</span>
                      </div>
                    </div>
                    </div>       
                </li>
              </ul>
              <div class="cf">
                <div class="fl simple-total">
                  共
                  <span class="c-primary fs14">{{itemPage.totalNum}}</span>条数据
                </div>
                <Page
                  class="pagination fr"
                  :total="itemPage.totalNum"
                  simple
                  @on-change="onItemPageChange"
                  :current="itemPage.pageNum"
                  :page-size="itemPage.pageSize"
                  v-if="itemPage.totalNum"
                ></Page>
              </div>
            </div>
            <div class="tc pd20" v-else>
              <span>暂无数据</span>
            </div>
          </div>
        </div>
        <div class="task-r divide-main">
          <div class="panel">
            <div class="panel-body" v-show="!itemList.length">
              <p class="nodata">暂无数据!!</p>
            </div>
            <div class="panel-body" v-show="itemList.length">
              <Tabs value="1" v-model="tabName">
                <TabPane label="基础信息" name="1">
                  <!-- 基础信息 -->
                  <base-info :id="activedId" ref="baseInfo"></base-info>
                  <firm-list  :id="activedId" ref="firmList"></firm-list>
                </TabPane>
                
                <TabPane label="使用记录" name="2">
                  <!-- 通话记录 -->
                  <port-record v-if="tabName=='2'" :id="activedId" ref="portRecord"></port-record>
                </TabPane>
                <div slot="extra">
                    <div class="panel-header-tools" v-show="itemList.length">
                <Button type="primary" @click="openBuyPort">购买端口</Button>
                <Button type="primary" @click="openProxyUp">代理升级</Button>
                <Button type="primary" @click="handlerEditProxy">编辑</Button>
                <Button type="error" @click="deletProxy">删除</Button>
              </div>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
    <buy-port
      v-model="buyModalVisible"
      :proxy-id="currentProxy ? currentProxy.id : ''"
      @reload="buyReload"
    ></buy-port>
    <!-- <buy-port v-model="buyModalVisible" :pObj="currentProxy" @reload="buyReload"></buy-port> -->
    <!-- 新增 代理-->
    <ms-panel v-model="newProxyShow" title="开通代理">
      <new-proxy
        :visible="newProxyShow"
        @after-save="afterAddProxySave"
        @on-cancel="afterAddProxyCancel"
      ></new-proxy>
    </ms-panel>

    <!-- 编辑 代理-->
    <ms-panel v-model="editProxyShow" title="编辑代理">
      <edit-proxy
        :visible="editProxyShow"
        :proxy-id="editProxyId"
        @after-save="afterEditProxySave"
        @on-cancel="afterEditProxyCancel"
      ></edit-proxy>
    </ms-panel>
    <proxy-up v-model="proxyUpvisible" :pObj="currentProxy" @reload="proxyUpReload"></proxy-up>
  </div>
</template>

<script>
import leftListMixin from "@/mixins/leftListMixin";
import baseInfo from "./components/baseInfo";
import portRecord from "./components/portRecord";
import buyPort from "./components/buyPort";
import newProxy from "./components/newProxy";
import editProxy from "./components/editProxy";
import firmList from "./components/firmList";
import proxyUp from "./components/proxyUp";
import Util from '@/util/util'
export default {
  data() {
    return {
      tabName: "1",
      fullScreen: false,
      activedId: null, //侧栏选中id
      currentProxy: {},
      query: {
        operatorId: null,
        provinceId: null,
        cityProxyType: null,
        status: null,
        name: ""
      },
      buyModalVisible: false,
      newModalVisible: false,
      proxyUpvisible: false,
      provinceList: [],
      proxyTypeList: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "铜",
          value: 1
        },
        {
          label: "银",
          value: 2
        },
        {
          label: "金",
          value: 3
        }
      ],
      statusOption: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "禁用",
          value: 0
        },
        {
          label: "启用",
          value: 1
        }
      ],
      detail: {},

      // 新增代理
      newProxyShow: false,
      // 编辑代理
      editProxyShow: false,
      editProxyId: ""
    };
  },
  mounted() {
    this.pageInit();
  },
  components: {
    baseInfo,
    portRecord,
    buyPort,
    newProxy,
    editProxy,
    firmList,
    proxyUp
  },
  mixins: [leftListMixin],
  methods: {
      linkTo(name) {
      Util.openPage(this, name);
    },
    pageInit() {
      this.getProvince();
      this.getItemList();
    },
    async getItemList() {
      let vm = this;
      let result = await this.$pmsApi.cityProxy.getCityProxyList(
        vm.assignItemQuery(vm.query)
      );
      if (result.dataList.length > 0) {
        this.selectItem(result.dataList[0]);
      }
      vm.initItemData(result.totalNum, result.dataList);
    },
    async getProvince() {
      let result = await this.$commonApi.provinceCity.provinceList();
      this.provinceList = result;
    },
    //侧栏点击事件
    selectItem(item) {
      this.activedId = item.id;
      this.currentProxy = item;
    },
    openBuyPort() {
      this.buyModalVisible = true;
    },
    openProxyUp() {
      this.proxyUpvisible = true;
    },
    openNewModal(type) {
      this.newModalVisible = true;
      if (type == "edit") {
        this.newModalForm = Object.assign({}, this.detail, {
          modalTitle: "编辑运营商",
          modalType: type
        });
      } else {
        this.newModalForm = Object.assign(
          {},
          {
            modalTitle: "开通运营商",
            modalType: type
          }
        );
      }
    },
    buyReload(isReLoad) {
      this.buyModalVisible = false;
      if (isReLoad) {
        this.$refs.baseInfo.getDetail();
        this.$refs.portRecord.loadList();
      }
    },
    proxyUpReload(isReLoad) {
      this.proxyUpvisible = false;
      if (isReLoad) {
        this.reloadChildData();
      }
    },
    //接收新建编辑事件
    newReload(obj, isReLoad) {
      this.newModalVisible = false;
      this.newModalForm = obj;
      if (isReLoad) {
        if (this.newModalForm.modalType == "new") {
          this.getItemList();
        }
        this.$refs.firmList.loadList();
        this.$refs.baseInfo.getDetail();
        this.$refs.portRecord.loadList();
      }
    },
    //刷新当前数据
    reloadChildData() {
      this.getItemList();
      this.$refs.firmList.loadList();
      // this.$refs.baseInfo.getDetail();
      // this.$refs.portRecord.loadList();
    },

    // 新增编辑代理
    handlerAddProxy() {
      this.newProxyShow = true;
    },
    afterAddProxySave() {
      this.getItemList();
    },
    afterAddProxyCancel() {
      this.newProxyShow = false;
    },
    handlerEditProxy() {
      this.editProxyShow = true;
      this.editProxyId = this.currentProxy.id;
    },
    deletProxy() {
      this.$Modal.confirm({
        title: `确认删除`,
        content: `删除${
          this.currentProxy.name
        }代理商会将此账号下级<span class='vma-wanming'> 市代、企业的数据一并删除，删除后 数据不可恢复！</span>`,
        onOk: (action, instance) => {
          this.$pmsApi.cityProxy
            .deleteCityProxy(this.currentProxy.id)
            .then(() => {
              this.pageInit();
              this.success("删除成功");
            });
        }
      });
    },
    afterEditProxySave() {
      this.editProxyId = "";
      this.getItemList();
    },
    afterEditProxyCancel() {
      this.editProxyShow = false;
    }
  }
};
</script>
