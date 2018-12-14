
<template>
    <div>
        <div class="divide"
             :class="{full: fullScreen}">
            <div class="divide-item">
                <div class="panel">
                    <div class="panel-body">
                        <Form class="panel-form"
                              inline>
                            <div class="fr">
                                <FormItem>
                                    <Input type="text"
                                           placeholder="搜索代理商"
                                           v-model="query.name"
                                           @on-enter='onSearch'>
                                    <Icon type="search"
                                          slot="prepend"></Icon>
                                    </Input>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary"
                                            @click="onSearch">查询</Button>
                                </FormItem>
                            </div>
                            <FormItem label=""
                                      :label-width="50">
                                <Select style="width: 120px;"
                                        placeholder="选择运营商状态"
                                        @on-change="onSearch"
                                        v-model="query.status">
                                    <Option v-for="(item,index) in statusOption"
                                            :key="index"
                                            :value="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>
            <div class="task">
                <div class="task-l divide-item">
                    <div class="panel">
                        <div class="panel-header">
                            <Icon type="ios-list-outline"
                                  class="vm fs18 mr10"></Icon>
                            <span class="vm">运营商列表</span>
                            <div class="panel-header-tools">
                                <Button type="primary"
                                        icon="plus"
                                        @click.native="openNewModal('new')">开通运营商</Button>
                            </div>
                        </div>
                        <div class="panel-body">
                            <ul class="list">
                                <li :class="{active:item.id==activedId}"
                                    v-for="(item,index) in itemList"
                                    :key="item.id"
                                    @click="selectItem(item.id)">
                                    <div class="list-item">
                                        <div class="list-item-ext">
                                            {{item.remainPort}}/{{item.totalPort}}
                                            <!-- <div class="list-item-ext-text">
                                            </div> -->
                                        </div>
                                        <div class="list-item-main">
                                            <p class="list-item-title">{{item.name}}</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="cf">
                                <div class="fl simple-total">共
                                    <span class="c-primary fs14">{{itemPage.totalNum}}</span>条数据</div>
                                <Page class="pagination fr"
                                      :total="itemPage.totalNum"
                                      show-sizer
                                      simple
                                      @on-change="onItemPageChange"
                                      :page-size="itemPage.pageSize"></Page>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="task-r divide-main">
                    <div class="panel">
                        <div class="panel-header">
                            <i class="icon icon-enlarge panel-header-icon"
                               :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'"
                               @click="() => fullScreen = !fullScreen"></i> 运营商详情
                            <div class="panel-header-tools"
                                 v-show="itemList.length">
                                <Button type="primary"
                                        @click.native="openNewModal('edit')">编辑</Button>
                                <Button type="primary"
                                        @click.native="openBuyPort">出售端口</Button>
                                <Button type="primary"
                                        @click.native="openMessageCount">添加短信条数</Button>
                                <Button type="error"
                                        @click="deleteOperator">删除</Button>
                            </div>
                        </div>
                        <div class="panel-body"
                             v-show="!itemList.length">
                            <p class="nodata">暂无数据!!</p>
                        </div>
                        <div class="panel-body"
                             v-show="itemList.length">
                            <Tabs value="1"
                                  v-model="tabName">
                                <TabPane label="基础信息"
                                         name="1">
                                    <base-detail :id="activedId"
                                                 @detail="detailObj"
                                                 ref="baseInfo"></base-detail>
                                </TabPane>
                                <TabPane label="省级代理"
                                         name="2">
                                    <provin-list v-if="tabName=='2'"
                                                 :id="activedId"
                                                 ref="provinList"></provin-list>
                                </TabPane>
                                <TabPane label="市级代理"
                                         name="3">
                                    <city-list v-if="tabName=='3'"
                                               :id="activedId"
                                               ref="cityList"></city-list>
                                </TabPane>
                                <TabPane label="端口记录"
                                         name="4">
                                    <port-record v-if="tabName=='4'"
                                                 :id="activedId"
                                                 ref="portRecord"></port-record>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <buy-port v-model="buyModalVisible"
                  :pObj="detail"
                  @reload="buyReload"></buy-port>
        <new-modal v-model="newModalVisible"
                   :pObj="newModalForm"
                   @reload="newReload"></new-modal>
        <message-modal v-model="messageModal.visible"
                       :id="detail.id"
                       @after-submit="afterSubmitMessageModal" />
    </div>
</template>

<script>
import baseDetail from "./baseDetail";
import cityList from "./cityList";
import provinList from "./provinList";
import portRecord from "./portRecord";
import leftListMixin from "@/mixins/leftListMixin";
import buyPort from "./buyPortModal";
import newModal from "./newModal";
import MessageModal from './messageModal';
// let restNewForm = {
//     account: "",
//     card_init_count: 0,
//     contacts_address: "",
//     contacts_mobile: "",
//     contacts_name: "",
//     mobile: "",
//     name: "",
//     password: "",
//     proxy_price: 0,
//     remarks: "",
//     verif_code: ""
// };
export default {
    data() {
        return {
            tabName: '1',
            fullScreen: false,
            query: {
                status: "",
                name: ""
            },
            detail: {},
            newModalForm: {
                account: "1111",
                proxyPort: 0,
                contactsAddress: "1111",
                contactsMobile: "1111",
                contactsName: "111",
                mobile: "1111",
                name: "",
                password: "",
                proxyPice: 0,
                remarks: "",
                verifCode: ""
            },
            buyModalVisible: false,
            newModalVisible: false,
            activedId: '',
            statusOption: [{
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
            messageModal: {
                visible: false
            }
        };
    },
    components: {
        baseDetail,
        cityList,
        provinList,
        portRecord,
        buyPort,
        newModal,
        MessageModal
    },
    mixins: [leftListMixin],
    mounted() {
        this.pageInit();
    },
    methods: {
        pageInit() {
            this.getItemList();
        },
        openBuyPort() {
            this.buyModalVisible = true;
        },
        openNewModal(type) {
            this.newModalVisible = true;
            if (type == "edit") {
                this.newModalForm = Object.assign({}, this.detail, { modalTitle: '编辑运营商', modalType: type })
            } else {
                this.newModalForm = Object.assign({}, { modalTitle: '开通运营商', modalType: type })
            }
        },
        async getItemList() {
            let result = await this.$smsApi.operator.getList(
                this.assignItemQuery(this.query)
            );
            if (result.dataList && result.dataList.length > 0) {
                this.selectItem(result.dataList[0].id);

            }
            this.initItemData(result.totalNum || 0, result.dataList || []);
        },
        // 修改bug: 编辑后左侧列表未刷新，仅新增改方法在 编辑回调调用，其他方法未做改变: 2018-05-12
        reloadItemList() {
            return $smsApi.operatort(this.assignItemQuery(this.query)).then((data) => {
                this.initItemData(data.totalNum || 0, data.dataList || []);
                return data
            })
        },
        ////
        detailObj(obj) {
            this.detail = obj;
        },
        selectItem(id) {
            this.activedId = id;
        },
        buyReload(isReLoad) {
            this.buyModalVisible = false;
            if (isReLoad) {
                // this.getItemList(); 
                this.$refs.baseInfo.getDetail();
                this.$refs.portRecord.loadList();
            }
        },
        //接收新建编辑事件
        newReload(obj, isReLoad) {
            this.newModalVisible = false;
            this.newModalForm = obj
            if (isReLoad) {
                if (this.newModalForm.modalType == 'new') {

                    this.getItemList()
                } else {
                    // 编辑也要重新加载左侧列表，但不做选中修改
                    // 修改编辑未刷新左侧列表bug
                    this.reloadItemList()
                }
                this.$refs.baseInfo.getDetail();
                this.$refs.portRecord.loadList();
            }

        },
        //刷新当前数据
        reloadChildData() {
            this.$refs.baseInfo.getDetail();
            // this.$refs.provinList.loadList();
            // this.$refs.cityList.loadList();
            // this.$refs.portRecord.loadList();
        },
        // 增加短信条数
        openMessageCount() {
            this.messageModal.visible = true
        },
        deleteOperator() {
            this.$Modal.confirm({
                title: "确认删除",
                content: `删除运营商会将此账号下级<span class='vma-wanming'> 省代、市代、企业的数据一并删除，删除后 数据不可恢复！</span>`,
                onOk: (action, instance) => {
                    this.$smsApi.operator.deleteOperator(this.activedId).then(() => {
                        this.getItemList()
                        this.success("删除成功");
                    })
                }
            })
        },
        afterSubmitMessageModal() {
            this.messageModal.visible = false
            this.reloadChildData()
        },
        cancelMessageModal() {
            this.messageModal.visible = false
        }
    }
};
</script>
<style lang="scss" scoped>
.list .list-item-ext {
  height: 2rem;
  line-height: 2rem;
}
</style>