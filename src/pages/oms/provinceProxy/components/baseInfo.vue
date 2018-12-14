<template>
    <div class="task-detail">
        <div v-if="detail.id">
            <h1>{{detail.name}}
                <ins :class="['medal',{'medal-gold':detail.cityProxyType==3,'medal-sliver':detail.cityProxyType==2,'medal-bronze':detail.cityProxyType==1}]">{{detail.cityProxyType | proxyType}}</ins>
                <div class="fr">
                    <i-switch v-model="detail.status" :true-value="1" :false-value="0" @on-change="statusChange">
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
                    <p>{{detail.provinceName}}</p>
                </div>
            </div>
            <hr class="mt-20">
    
            <div class="mt-20 ivu-row">
                <div class="ivu-col ivu-col-span-6">
                    <p>累计认领年端口数: {{detail.totalPort}}</p>
                </div>
                <div class="ivu-col ivu-col-span-6">
                    <p>初始年端口数: {{detail.initPort}}</p>
                </div>
                <div class="ivu-col ivu-col-span-6">
                    <p>已开通年端口数: {{detail.usePort}}</p>
                </div>
                <div class="ivu-col ivu-col-span-6">
                    <p>剩余可开通年端口数: {{detail.remainPort}}</p>
                </div>
            </div>
            <div class="ivu-row">
                 <div class="ivu-col ivu-col-span-6">
                    <p>累计认领月端口数: {{detail.monthCardAllCount}}</p>
                </div>
                <div class="ivu-col ivu-col-span-6">
                    <p>初始月端口数: {{detail.monthCardInitCount}}</p>
                </div>
                <div class="ivu-col ivu-col-span-6">
                    <p>已开通月端口数: {{detail.monthCardUseCount}}</p>
                </div>
                <div class="ivu-col ivu-col-span-6">
                    <p>剩余可开通月端口数: {{detail.monthCardRemainCount}}</p>
                </div>
            </div>
            <div class="ivu-row">
                <div class="ivu-col ivu-col-span-6">
                    <p>机器坐席数: {{detail.robotNum}}</p>
                </div>
                <div class="ivu-col ivu-col-span-6">
                    <p>人工坐席数: {{detail.humanNum}}</p>
                </div>
                <div class="ivu-col ivu-col-span-6">
                    <p>固定坐席数: {{detail.fixedNum}}</p>
                </div>
            </div>
            <hr class="mt-20">
            <div class="mt-20 padding-20">
                <div class="ivu-row">
                    <div class="ivu-col ivu-col-span-8">
                        <p>创建时间: {{detail.createTime|msToDate}}</p>
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
                    <div class="ivu-col">
                        <p>联系地址: {{detail.contactsAddress}}</p>
                    </div>
                </div>
                 <div class="ivu-row">
                    <div class="ivu-col">
                        <p>备注: {{detail.remarks}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="tc pd50" v-else>
            <span>暂无数据</span>
        </div>
    </div>
</template>

<script>
    const proxyMaps = {
        '1': '铜牌代理',
        '2': '银牌代理',
        '3': '金牌代理',
    }
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
                    usePort: 0

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
            id: function(val, oval) {
                this.getDetail();
            }
        },
        filters: {
            proxyType (num){  
                return proxyMaps[`${num}`]
            }
        },
        mounted() {},
        methods: {
            async getDetail() {
                let vm = this;
                let result = await this.$omsApi.provinceProxy.getProvinceProxyDetail(vm.id);
                vm.detail = result;
            },
            statusChange(val) {
                this.$omsApi.provinceProxy.editStatus({
                    id: this.detail.id,
                    status: this.detail.status
                }).then(() => {
                    this.getDetail()
                }).catch(() => {
                    this.getDetail()
                })
            }
        }
    };
</script>
