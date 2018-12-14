<template>
    <div class="task-detail">
        <div>
            <h1>{{detail.name}}
                <ins :class="['medal',{'medal-gold':detail.cityProxyType==3,'medal-sliver':detail.cityProxyType==2,'medal-bronze':detail.cityProxyType==1}]">{{detail.cityProxyType|proxyType}}牌代理</ins>
                <div class="fr">
                    <i-switch v-model="detail.status"
                              :true-value="1"
                              :false-value="0"
                              @on-change="statusChange">
                        <span slot="open">开启</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </div>
            </h1>
            <div class="mt-20 ivu-row">
                <div class="ivu-col ivu-col-span-4">
                    <p>ID: {{detail.id}}</p>
                </div>
                <div class="ivu-col ivu-col-span-4">
                    <p>{{detail.cityName}}</p>
                </div>
                <div class="ivu-col ivu-col-span-4">
                    <p>上级代理: {{detail.superProxy}}</p>
                </div>
            </div>
            <hr class="mt-20">
            <div class="mt-20 nail nail-f-lg ivu-row"
                 style="margin-left: -30px; margin-right: -30px;">
                <div class="ivu-col ivu-col-span-6"
                     style="padding-left: 25px; padding-right: 25px;">
                    <div class="nail-item"
                         style="width: 100%;">
                        <h3>{{detail.remainPort}}</h3>
                        <p>剩余可开通年端口数(个)</p>
                    </div>
                </div>
                <div class="ivu-col ivu-col-span-6"
                     style="padding-left: 30px; padding-right: 30px;">
                    <div class="nail-item"
                         style="width: 100%;">
                        <h3>{{detail.usePort}}</h3>
                        <p>已开通年端口数(个)</p>
                    </div>
                </div>
                <div class="ivu-col ivu-col-span-6"
                     style="padding-left: 30px; padding-right: 30px;">
                    <div class="nail-item"
                         style="width: 100%;">
                        <h3>{{detail.totalPort}}</h3>
                        <p>累计购买年端口数(个)</p>
                    </div>
                </div>
                <div class="ivu-col ivu-col-span-6"
                     style="padding-left: 30px; padding-right: 30px;">
                    <div class="nail-item"
                         style="width: 100%;">
                        <h3>{{detail.initPort}}</h3>
                        <p>初始代理年端口数(个)</p>
                    </div>
                </div>
            </div>
            <div class="mt-20 nail nail-f-lg ivu-row"
                 style="margin-left: -30px; margin-right: -30px;">
                <div class="ivu-col ivu-col-span-6"
                     style="padding-left: 25px; padding-right: 25px;">
                    <div class="nail-item"
                         style="width: 100%;">
                        <h3>{{detail.monthCardRemainCount}}</h3>
                        <p>剩余可开通月端口数(个)</p>
                    </div>
                </div>
                <div class="ivu-col ivu-col-span-6"
                     style="padding-left: 30px; padding-right: 30px;">
                    <div class="nail-item"
                         style="width: 100%;">
                        <h3>{{detail.monthCardUseCount}}</h3>
                        <p>已开通月端口数(个)</p>
                    </div>
                </div>
                <div class="ivu-col ivu-col-span-6"
                     style="padding-left: 30px; padding-right: 30px;">
                    <div class="nail-item"
                         style="width: 100%;">
                        <h3>{{detail.monthCardAllCount}}</h3>
                        <p>累计购买月端口数(个)</p>
                    </div>
                </div>
                <div class="ivu-col ivu-col-span-6"
                     style="padding-left: 30px; padding-right: 30px;">
                    <div class="nail-item"
                         style="width: 100%;">
                        <h3>{{detail.monthCardInitCount}}</h3>
                        <p>初始代理月端口数(个)</p>
                    </div>
                </div>
            </div>
            <div class="mt-20 ivu-row"
                 style="margin-left: -30px; margin-right: -30px;">
                <div class="ivu-col ivu-col-span-12"
                     style="padding-left: 30px; padding-right: 30px;">
                    <div class="case">
                        <div class="case-item">
                            <h3>{{detail.totalAmt}}</h3>
                            <p>代理商总营业额(万)</p>
                        </div>
                        <div class="case-item">
                            <h3>{{detail.profitAmt}}</h3>
                            <p>代理商利润(万)</p>
                        </div>
                    </div>
                </div>
                <div class="ivu-col ivu-col-span-12"
                     style="padding-left: 30px; padding-right: 30px;">
                    <div class="case">
                        <div class="case-item">
                            <h3>{{detail.robotNum}}</h3>
                            <p>机器坐席数(个)</p>
                        </div>
                        <div class="case-item">
                            <h3>{{detail.humanNum}}</h3>
                            <p>人工坐席数(个)</p>
                        </div>
                        <div class="case-item">
                            <h3>{{detail.fixedNum}}</h3>
                            <p>固定坐席数(个)</p>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="mt-20">
            <div class="mt-20 padding-20">
                <div class="ivu-row">
                    <div class="ivu-col ivu-col-span-8">
                        <p>登录账号: {{detail.account}}</p>
                    </div>
                    <div class="ivu-col ivu-col-span-8">
                        <p>绑定手机号: {{detail.mobile}}</p>
                    </div>
                </div>
                <div class="ivu-row">
                    <div class="ivu-col ivu-col-span-8">
                        <p>联系人: {{detail.contactsName}}</p>
                    </div>
                    <div class="ivu-col ivu-col-span-8">
                        <p>联系号码: {{detail.contactsMobile}}</p>
                    </div>
                </div>
                <div class="ivu-row">
                    <div class="ivu-col ivu-col-span-8">
                        <p>联系地址: {{detail.contactsAddress}}</p>
                    </div>
                    <div class="ivu-col ivu-col-span-8">
                        <p>创建时间: {{detail.createTime|msToDate}}</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="tc pd50" v-else>
            <span>暂无数据</span>
        </div> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            isEditNick: false,
            update: false,
            detail: {
                account: "",
                cityName: "",
                cityProxyType: null,
                contactsAddress: null,
                contactsMobile: null,
                contactsName: null,
                createTime: null,
                humanNum: 0,
                id: null,
                initPort: 0,
                mobile: "",
                name: "",
                profitAmt: null,
                remainPort: 0,
                remarks: null,
                robotNum: 0,
                status: 0,
                superProxy: null,
                totalAmt: null,
                totalPort: 0,
                usePort: 0,
            }
        };
    },
    props: {
        id: {
            type: Number,
            default: 0
        },
    },
    watch: {
        id: function (val, oval) {
            this.getDetail();
        }
    },
    mounted() { },
    methods: {
        async getDetail() {
            let vm = this;
            let result = await this.$omsApi.cityProxy.getCityProxyDetail(vm.id);
            vm.detail = result;
        },
        statusChange(val) {
            this.$omsApi.cityProxy.editStatus({
                id: this.detail.id,
                status: this.detail.status
            }).then(() => {
                this.getDetail()
            }).catch(() => {
                this.getDetail()
            })
        },
        async updateNickName() {
            let vm = this;
            let result = await this.$omsApi.cityProxy.updateNickName({
                id: +vm.detail.id,
                nickName: vm.detail.nickName
            });
            this.update = false;
        }
    }
};
</script>
