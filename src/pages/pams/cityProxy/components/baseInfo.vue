<template>
    <div class="task-detail">
        <div>
            <h1>{{detail.name}}
                 <span class="idText">ID: {{detail.id}}</span>
                <div class="fr">
                    <i-switch v-model="detail.status"
                              :true-value="1"
                              :false-value="0"
                              size="large"
                              @on-change="statusChange">
                        <span slot="open">开启</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </div>
            </h1>
             <div class="mt-5 ivu-row">
                 <div class="ivu-col ivu-col-span-5">
                    <p>代理等级: {{detail.cityProxyType|proxyType}}</p>
                </div>
                <div class="ivu-col ivu-col-span-5">
                    <p>代理城市: {{detail.cityName}}</p>
                </div>
                <div class="ivu-col ivu-col-span-5">
                    <p>上级代理: {{detail.superProxy}}</p>
                </div>
               
            </div>
            <div class="ivu-row">
                 <div class="ivu-col ivu-col-span-5">
                    <p>登录账号: {{detail.account}}</p>
                </div>
                <div class="ivu-col ivu-col-span-5">
                        <p>绑定手机号: {{detail.mobile||'--'}}</p>
                    </div>
                    <div class="ivu-col ivu-col-span-5">
                        <p>创建时间: {{detail.createTime|msToDate}}</p>
                    </div>
                     
            </div>
            <div class="middleboxWrap fleX mt-20">
                 <div class="">
                    <p class="text">
                        <span class="red w115">{{detail.remainPort}}</span> <span class="weq">=</span><span class="fc-blue w115">{{detail.totalPort}}</span><span class="weq">-</span><span class="fc-blue w115">{{detail.usePort}}</span>
                    </p>
                     <p class="text">
                        <span class="w115 mr-40">账户剩余年端口数</span> <span class="w115 mr-40">累计购买年端口数</span><span>累计使用年端口数</span>
                    </p>
                </div>
               <div class="">
                    <p class="text">
                        <span class="red w115">{{detail.monthCardRemainCount}}</span> <span class="weq">=</span><span class="fc-blue w115">{{detail.monthCardAllCount}}</span><span class="weq">-</span><span class="fc-blue w115">{{detail.monthCardUseCount}}</span>
                    </p>
                     <p class="text">
                        <span class="w115 mr-40">账户剩余月端口数</span> <span class="w115 mr-40">累计购买月端口数</span><span>累计使用月端口数</span>
                    </p>
                </div>
               
            </div>     
        </div>
    </div>
</template>

<script>

const proxyTypeMap = { '1': '铜牌代理', '2': '银牌代理', '3': '金牌代理' }
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
    filters: {
        proxyType(n) {
            return proxyTypeMap[`${n}`]
        }
    },
    mounted() { },
    methods: {
        async getDetail() {
            let vm = this;
            let result = await this.$pmsApi.cityProxy.getCityProxyDetail(vm.id);
            vm.detail = result;
        },
        statusChange(val) {
            this.$pmsApi.cityProxy.editStatus({
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
            let result = await this.$pmsApi.cityProxy.updateNickName({
                id: +vm.detail.id,
                nickName: vm.detail.nickName
            });
            this.update = false;
        }
    }
};
</script>
