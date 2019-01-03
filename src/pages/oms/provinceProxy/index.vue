<template>
  <div>
      <Breadcrumb separator=">">
      <span class="home" @click="linkTo('emsHomeIndex')">
          <BreadcrumbItem>首页</BreadcrumbItem>
        </span>
      <BreadcrumbItem>省代管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="divide" :class="{full: fullScreen}">
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              <Icon  class="v-before fs18 mr10"></Icon>
              <span class="vm">代理商列表</span>
              <div class="panel-header-tools fr">
                <i-button type="primary"  @click="handlerAddProxy"><Icon type="md-add" />新增省代</i-button>
              </div>
            </div>
            <div class="mt-15 pl-10 pr-10">
                <i-select
                  clearable
                  v-model="query.status"
                  @on-change="getItemList"
                  placeholder="选择代理商状态"
                >
                  <Option
                    v-for="(item,index) in statusOption"
                    :key="index"
                    :value="item.value"
                  >{{item.label}}</Option>
                </i-select>
            </div>
            <div class="mt-15 pl-10 pr-10">
                <i-input
                  v-model="query.name"
                  @on-enter="getItemList"
                  type="text"
                  search
                  @on-search="getItemList"
                  placeholder="搜索代理商"
                ></i-input>
            </div>
                
            <div class="panel-body" v-if="itemList.length">
              <ul class="list" v-if="itemList.length">
                <li
                  v-for="(item,index) in itemList"
                  :key="index"
                  :class="{active:(item.id==activedId)}"
                  @click="selectItem(item)"
                  v-if="itemList.length"
                >
                   
                      <div class="mb-10 titles">{{item.name}}</div>
                      <!-- <div class="list-item-info"><ins :class="['medal',{'medal-gold':item.proxyType==3,'medal-sliver':item.proxyType==2,'medal-bronze':item.proxyType==1}]">{{item.proxyType|proxyType}}牌代理</ins> {{item.cityName}}
                      </div>-->
                      <div class="list-item-info fleX">
                        <!-- <ins
                          :class="['medal',item.provinceName?'medal-gold':'medal-sliver']"
                        >{{item.provinceName||'无省份'}}</ins> -->
                        <span>{{item.provinceName||'无省份'}}</span>
                        <span>{{item.remainPort}}/{{item.totalPort}}</span>
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
                 <div class="fleX mt-30 mb-10">
                     <div class="title contentAfter">
                     基础信息
                 </div>
                 <div class="panel-header-tools" v-show="itemList.length">
                    <Button class="mr-10" type="primary" @click="openBuyPort">购买端口</Button>
                    <Button class="mr-10" type="primary" @click="handlerEditProxy">编辑</Button>
                    <Button type="error" @click="deleteProvinceProxy">删除</Button>
                  </div>
                 </div>
                <base-info :id="activedId" ref="baseInfo"></base-info>
                 <div class="title contentAfter mt-40 mb-10">
                     市代列表
                 </div>
                 <firm-list :id="activedId" ref="firmList"></firm-list>
                  <div class="title contentAfter mt-40 mb-10">
                     使用记录
                 </div>
                 <port-record  :id="activedId" ref="portRecord"></port-record>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    <buy-port v-model="buyModalVisible" :pObj="currentProxy" @reload="buyReload"></buy-port>

    <!-- 新增 代理-->
    <Modal
      v-model="newProxyShow"
      :mask-closable="false"
      class-name="vertical-center-modal"
      title="新增代理"
    >
      <new-proxy
        ref="myNewproxy"
        :visible="newProxyShow"
        @after-save="afterAddProxySave"
        @on-cancel="afterAddProxyCancel"
      ></new-proxy>
      <div slot="footer">
        <i-button type="text" @click="afterAddProxyCancel">取消</i-button>
        <i-button type="primary" @click="handlerSaveForm">确定</i-button>
      </div>
    </Modal>

    <!-- 编辑 代理-->
    <Modal
      v-model="editProxyShow"
      :mask-closable="false"
      class-name="vertical-center-modal"
      title="编辑代理"
    >
      <edit-proxy
        :visible="editProxyShow"
        ref="eidteproxy"
        :proxy-id="editProxyId"
        @after-save="afterEditProxySave"
        @on-cancel="afterEditProxyCancel"
      ></edit-proxy>
      <div slot="footer">
        <i-button type="text" @click="afterEditProxyCancel">取消</i-button>
        <i-button type="primary" @click="editehandlerSaveForm">确定</i-button>
      </div>
    </Modal>
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
export default {
  components: {
    baseInfo,
    portRecord,
    buyPort,
    newProxy,
    editProxy,
    firmList
  },
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
      // provinceList: [],
      // proxyTypeList: [{
      //     label: '全部',
      //     value: ''
      // }, {
      //     label: '铜',
      //     value: 1
      // }, {
      //     label: '银',
      //     value: 2
      // }, {
      //     label: '金',
      //     value: 3
      // }],
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
  mixins: [leftListMixin],
  methods: {
       linkTo(name) {
      Util.openPage(this, name);
    },
    handlerSaveForm() {
      this.$refs.myNewproxy.handlerSave();
    },
    editehandlerSaveForm() {
      this.$refs.eidteproxy.handlerSave();
    },
    pageInit() {
      // console.log(this.activedId);
      // this.getProvince()
      this.getItemList();
    },
    async getItemList() {
      let vm = this;
      let result = await this.$omsApi.provinceProxy.getProvinceProxyList(
        vm.assignItemQuery(vm.query)
      );

      if (result.dataList.length > 0) {
        this.selectItem(result.dataList[0]);
      }
      vm.initItemData(result.totalNum, result.dataList);
    },
    // async getProvince() {
    //     let result = await this.$omsApi.provinceProxy.listProvince()
    //     this.provinceList = result
    // },
    //侧栏点击事件
    selectItem(item) {
      this.activedId = item.id;
      this.currentProxy = item;
    },
    openBuyPort() {
      this.buyModalVisible = true;
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
      //   this.getItemList();
      // this.$refs.firmList.loadList();
      this.$refs.baseInfo.getDetail();
      //   this.$refs.portRecord.loadList();
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
    deleteProvinceProxy() {
      this.$Modal.confirm({
        title: "确认删除",
        content: `确认删除${this.currentProxy.name}代理商`,
        onOk: (action, instance) => {
          this.$omsApi.provinceProxy
            .deleteProxy(this.currentProxy.id)
            .then(() => {
              this.pageInit();
              this.success("删除成功");
            });
        }
      });
    },
    afterEditProxySave() {
      this.editProxyId = "";
      //   this.getItemList();
      this.$refs.baseInfo.getDetail();
    },
    afterEditProxyCancel() {
      this.editProxyShow = false;
    }
  },
  mounted() {
    this.pageInit();
  }
};
</script>

<style lang="scss" scoped>
.task {
  &-l {
    width: 19rem;
  }
  
}
</style>

