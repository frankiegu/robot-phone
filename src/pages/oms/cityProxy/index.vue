<template>
  <div>
    <Breadcrumb separator=">">
      <span class="home" @click="linkTo('emsHomeIndex')">
        <BreadcrumbItem>首页</BreadcrumbItem>
      </span>
      <BreadcrumbItem>市级代理</BreadcrumbItem>
    </Breadcrumb>
    <div class="divide" :class="{full: fullScreen}">
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              <Icon type="ios-list-outline" class="vm fs18 v-before mr10"></Icon>
              <span class="vm">代理商列表</span>
              <div class="panel-header-tools"> 
                <i-button type="primary"  @click="handlerAddProxy">
                   <Icon type="md-add" />新增市代
                </i-button>
              </div>
            </div>
            <div class="pl-10 pr-10">
              <div class="fleX mt-15">
                <i-select
                  clearable
                  v-model="query.provinceId"
                  @on-change="getItemList"
                  style="width: 50%;"
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
                  style="width: 50%;"
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
                  style="width: 50%;"
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
                  @on-enter="getItemList"
                  type="text"
                  search
                  style="width:50%;"
                  @on-search="getItemList"
                  placeholder="搜索代理商"
                ></i-input>
              </div>
            </div>
            <div class="panel-body" v-if="itemList.length">
              <ul class="list">
                <li
                  v-for="(item,index) in itemList"
                  :key="index"
                  :class="{active:(item.id==activedId)}"
                  @click="selectItem(item)"
                  v-if="itemList.length"
                >
                  <div class="fleX" style="align-items: center">
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
                <TabPane label="代理商详情" name="1">
                  <!-- 基础信息 -->
                  <base-info :id="activedId" ref="baseInfo"></base-info>
                  <firm-list  :id="activedId" ref="firmList"></firm-list>
                </TabPane>
                <!-- <TabPane label="企业列表" name="2">
                  <firm-list v-if="tabName=='2'" :id="activedId" ref="firmList"></firm-list>
                </TabPane> -->
                <TabPane label="使用记录" name="3">
                  <!-- 通话记录 -->
                  <port-record v-if="tabName=='3'" :id="activedId" ref="portRecord"></port-record>
                </TabPane>
                <div slot="extra" class="panel-header-tools" v-show="itemList.length">
                  <Button type="primary" @click="openBuyPort">购买端口</Button>
                  <!-- <Button type="primary" @click="openProxyUp">代理升级</Button> -->
                  <Button type="primary" @click="handlerEditProxy">编辑</Button>
                  <Button type="error" @click="deleteCityProxy">删除</Button>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>

    <buy-port v-model="buyModalVisible" :entry="currentProxy" @after-save="afterSaveBuyPort"></buy-port>

    <!-- 新增 代理-->
    <Modal
      class-name="vertical-center-modal"
      v-model="newProxyShow"
      :mask-closable="false"
      title="新增市代"
    >
      <new-proxy
        :visible="newProxyShow"
        ref="newProxy"
        @after-save="afterAddProxySave"
        @on-cancel="afterAddProxyCancel"
      ></new-proxy>
      <div slot="footer">
        <i-button @click="afterAddProxyCancel" type="text">取消</i-button>
        <i-button type="primary" @click="handlerSaveNewproxy">确定</i-button>
      </div>
    </Modal>

    <!-- 编辑 代理-->
    <Modal
      class-name="vertical-center-modal"
      v-model="editProxyShow"
      :mask-closable="false"
      title="编辑市代"
    >
      <edit-proxy
        :visible="editProxyShow"
        ref="editeProxy"
        :proxy-id="editProxyId"
        @after-save="afterEditProxySave"
        @on-cancel="afterEditProxyCancel"
      ></edit-proxy>
      <div slot="footer">
        <i-button @click="afterEditProxyCancel" type="text">取消</i-button>
        <i-button type="primary" @click="handlerSaveEditeproxy">确定</i-button>
      </div>
    </Modal>

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

      // 购买端口
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
    handlerSaveNewproxy() {
      this.$refs.newProxy.handlerSave();
    },
    handlerSaveEditeproxy() {
      this.$refs.editeProxy.handlerSave();
    },
    pageInit() {
      this.getProvince();
      this.getItemList();
    },
    async getItemList() {
      let vm = this;
      let result = await this.$omsApi.cityProxy.getCityProxyList(
        vm.assignItemQuery(vm.query)
      );
      if (result.dataList.length > 0) {
        this.selectItem(result.dataList[0]);
      }
      vm.initItemData(result.totalNum, result.dataList);
    },
    async getProvince() {
      let result = await this.$omsApi.cityProxy.listProvince();
      this.provinceList = result;
    },
    //侧栏点击事件
    selectItem(item) {
      this.activedId = item.id;
      this.currentProxy = item;
    },
    // 购买端口
    openBuyPort() {
      this.buyModalVisible = true;
    },
    afterSaveBuyPort() {
      this.reloadChildData();
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
      // this.$refs.firmList.loadList()
      this.$refs.baseInfo.getDetail();
      this.$refs.portRecord.loadList();
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
    deleteCityProxy() {
      this.$Modal.confirm({
        title: "确认删除",
        content: `确认删除${this.currentProxy.name}代理商`,
        onOk: (action, instance) => {
          this.$omsApi.cityProxy.deleteProxy(this.currentProxy.id).then(() => {
            this.pageInit();
            this.success("删除成功");
          });
        }
      });
    },
    afterEditProxySave() {
      this.editProxyId = "";
      this.$refs.baseInfo.getDetail();
    },
    afterEditProxyCancel() {
      this.editProxyShow = false;
    }
  }
};
</script>


