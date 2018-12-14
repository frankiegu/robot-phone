<template>
    <div>
        <div class="divide"
             :class="{full: fullScreen}"
             v-show="isPageShow">
            <div class="panel">
                <div class="panel-header">
                    开通端口
                    <div class="panel-header-tools"
                         v-if="!detailId">
                        <i-button type="default"
                                  @click="back">返回</i-button> 
                        <i-button type="primary"
                                  @click="machineApply">开通</i-button>
                    </div>
                </div>
                <div class="task panel-body">
                    <div class="task-l divide-item">
                        <div class="board board-primary">
                            <div class="board-header">
                                申请信息
                            </div>
                            <div class="board-body">
                                <i-form :label-width="140"
                                        class="layout-form">
                                    <Form-item label="企业名称:">
                                        {{detail.adminName}}
                                    </Form-item>
                                    <Form-item label="联系人：">
                                        {{detail.contactsName}}
                                    </Form-item>
                                    <Form-item label="联系电话：">
                                        {{detail.contactsMobile}}
                                    </Form-item>
                                    <Form-item label="开工机器坐席数：">
                                        {{detail.robotCount}}
                                    </Form-item>
                                    <Form-item label="开工人工坐席数：">
                                        {{detail.humanCount}}
                                    </Form-item>
                                    <Form-item label="开工固定坐席数：">
                                        {{detail.fixedCount}}
                                    </Form-item>
                                    <Form-item label="运营商：">
                                        {{detail.platformName}}
                                    </Form-item>
                                    <Form-item label="省级代理商：">
                                        {{detail.provinceProxyName}}
                                    </Form-item>
                                    <Form-item label="市级代理商：">
                                        {{detail.cityProxyName}}
                                    </Form-item>
                                    <Form-item label="联系人：">
                                        {{detail.cityProxyContactsName}}
                                    </Form-item>
                                    </Form-item>
                                    <Form-item label="联系电话：">
                                        {{detail.cityProxyContactsMobile}}
                                    </Form-item>
                                    </Form-item>
                                    <Form-item label="申请时间：">
                                        {{detail.createTime|msToDate}}
                                    </Form-item>
                                     <Form-item label="端口使用期限：">
                                        {{detail.serviceLife}}{{detail.portType ? "月" : "年"}}
                                    </Form-item>
                                </i-form>
                            </div>
                        </div>
                    </div>

                    <div class="task-r divide-main">
                        <div class="panel">
                            <div class="panel-header">
                                <i class="icon icon-enlarge panel-header-icon"
                                   :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'"
                                   @click="() => fullScreen = !fullScreen"></i> 选择端口

                            </div>
                            <div class="panel-body">
                                <div style="padding-bottom: 200px;">
                                    <div class="seat-table">
                                        <div class="seat-col">
                                            <h2>机器坐席：{{detail.robotCount}}个</h2>
                                            <div class="ivu-table-wrapper customer-table">
                                                <div class="ivu-table ivu-table-border">
                                                    <!---->
                                                    <div class="ivu-table-header">
                                                        <table cellspacing="0"
                                                               cellpadding="0"
                                                               border="0"
                                                               style="width: 100%;">
                                                            <colgroup>
                                                                <col width="30%">
                                                                <col width="40%">
                                                                <col width="30%">
                                                            </colgroup>
                                                            <thead>
                                                                <tr>
                                                                    <th class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span>坐席号码</span>
                                                                        </div>
                                                                    </th>
                                                                    <th class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span>设备号</span>
                                                                        </div>
                                                                    </th>
                                                                    <th class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span>端口号</span>
                                                                        </div>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                        </table>
                                                    </div>
                                                    <div class="ivu-table-body">
                                                        <table cellspacing="0"
                                                               cellpadding="0"
                                                               border="0"
                                                               style="width: 100%;">
                                                            <colgroup>
                                                                <col width="30%">
                                                                <col width="40%">
                                                                <col width="30%">
                                                            </colgroup>
                                                            <tbody class="ivu-table-tbody">
                                                                <tr class="ivu-table-row"
                                                                    v-for="(item,index) in detail.robotPorts"
                                                                    :key="index">
                                                                    <td class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span>{{item.mobile}}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span v-if="detailId">{{item.machineId}}</span>
                                                                            <Select @on-change="machineChange(item)"
                                                                                    v-model="item.machineId"
                                                                                    style="width:120px"
                                                                                    v-else>
                                                                                <Option v-for="machineItem in machineList"
                                                                                        :value="machineItem.id"
                                                                                        :key="machineItem.id">{{ machineItem.machineName }}</Option>
                                                                            </Select>
                                                                        </div>
                                                                    </td>
                                                                    <td class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span v-if="detailId">{{item.slotId}}</span>
                                                                            <Select v-model="item.slotId"
                                                                                    style="width:85px"
                                                                                    :disabled="!item.machineId"
                                                                                    v-else>
                                                                                <Option v-for="slotItem in item.slotList"
                                                                                        :value="slotItem.id"
                                                                                        :key="slotItem.id">{{ slotItem.slotNo }}</Option>
                                                                            </Select>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div class="ivu-table-tip"
                                                         v-if="detail.robotPorts.length==0">
                                                        <table cellspacing="0"
                                                               cellpadding="0"
                                                               border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <span>暂无数据</span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="seat-col">
                                            <h2>人工坐席：{{detail.humanCount}}个</h2>

                                            <div class="ivu-table-wrapper customer-table">
                                                <div class="ivu-table ivu-table-border">
                                                    <!---->
                                                    <div class="ivu-table-header">
                                                        <table cellspacing="0"
                                                               cellpadding="0"
                                                               border="0"
                                                               style="width: 100%;">
                                                            <colgroup>
                                                                <col width="30%">
                                                                <col width="40%">
                                                                <col width="30%">
                                                            </colgroup>
                                                            <thead>
                                                                <tr>
                                                                    <th class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span>坐席号码</span>
                                                                        </div>
                                                                    </th>
                                                                    <th class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span>设备号</span>
                                                                        </div>
                                                                    </th>
                                                                    <th class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span>端口号</span>
                                                                        </div>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                        </table>
                                                    </div>
                                                    <div class="ivu-table-body">
                                                        <table cellspacing="0"
                                                               cellpadding="0"
                                                               border="0"
                                                               style="width: 100%;">
                                                            <colgroup>
                                                                <col width="30%">
                                                                <col width="40%">
                                                                <col width="30%">
                                                            </colgroup>
                                                            <tbody class="ivu-table-tbody">
                                                                <tr class="ivu-table-row"
                                                                    v-for="(item,index) in detail.humanPorts"
                                                                    :key="index">
                                                                    <td class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span>{{item.mobile}}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span v-if="detailId">{{item.machineId}}</span>
                                                                            <Select @on-change="machineChange(item)"
                                                                                    v-model="item.machineId"
                                                                                    style="width:120px"
                                                                                    v-else>
                                                                                <Option v-for="machineItem in machineList"
                                                                                        :value="machineItem.id"
                                                                                        :key="machineItem.id">{{ machineItem.machineName }}</Option>
                                                                            </Select>
                                                                        </div>
                                                                    </td>
                                                                    <td class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span v-if="detailId">{{item.slotId}}</span>
                                                                            <Select v-model="item.slotId"
                                                                                    style="width:85px"
                                                                                    :disabled="!item.machineId"
                                                                                    v-else>
                                                                                <Option v-for="slotItem in item.slotList"
                                                                                        :value="slotItem.id"
                                                                                        :key="slotItem.id">{{ slotItem.slotNo }}</Option>
                                                                            </Select>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div class="ivu-table-tip"
                                                         v-if="detail.humanPorts.length==0">
                                                        <table cellspacing="0"
                                                               cellpadding="0"
                                                               border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <span>暂无数据</span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="seat-table">
                                        <div class="seat-col">
                                            <h2>固定坐席：{{detail.fixedCount}}个</h2>

                                            <div class="ivu-table-wrapper customer-table">
                                                <div class="ivu-table ivu-table-border">
                                                    <!---->
                                                    <div class="ivu-table-header">
                                                        <table cellspacing="0"
                                                               cellpadding="0"
                                                               border="0"
                                                               style="width: 100%;">
                                                            <colgroup>
                                                                <col width="30%">
                                                                <col width="40%">
                                                                <col width="30%">
                                                            </colgroup>
                                                            <thead>
                                                                <tr>
                                                                    <th class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span>坐席号码</span>
                                                                        </div>
                                                                    </th>
                                                                    <th class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span>设备号</span>
                                                                        </div>
                                                                    </th>
                                                                    <th class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span>端口号</span>
                                                                        </div>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                        </table>
                                                    </div>
                                                    <div class="ivu-table-body">
                                                        <table cellspacing="0"
                                                               cellpadding="0"
                                                               border="0"
                                                               style="width: 100%;">
                                                            <colgroup>
                                                                <col width="30%">
                                                                <col width="40%">
                                                                <col width="30%">
                                                            </colgroup>
                                                            <tbody class="ivu-table-tbody">
                                                                <tr class="ivu-table-row"
                                                                    v-for="(item,index) in detail.fixedPorts"
                                                                    :key="index">
                                                                    <td class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span>{{item.mobile}}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span v-if="detailId">{{item.machineId}}</span>
                                                                            <Select @on-change="machineChange(item)"
                                                                                    v-model="item.machineId"
                                                                                    style="width:120px"
                                                                                    v-else>
                                                                                <Option v-for="machineItem in machineList"
                                                                                        :value="machineItem.id"
                                                                                        :key="machineItem.id">{{ machineItem.machineName }}</Option>
                                                                            </Select>
                                                                        </div>
                                                                    </td>
                                                                    <td class="">
                                                                        <div class="ivu-table-cell">
                                                                            <span v-if="detailId">{{item.slotId}}</span>
                                                                            <Select v-model="item.slotId"
                                                                                    style="width:85px"
                                                                                    :disabled="!item.machineId"
                                                                                    v-else>
                                                                                <Option v-for="slotItem in item.slotList"
                                                                                        :value="slotItem.id"
                                                                                        :key="slotItem.id">{{ slotItem.slotNo }}</Option>
                                                                            </Select>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div class="ivu-table-tip"
                                                         v-if="detail.fixedPorts.length==0">
                                                        <table cellspacing="0"
                                                               cellpadding="0"
                                                               border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <span>暂无数据</span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fullScreen: false,
            isPageShow: false,//等待接口返回显示页面
            detail: {
                adminName: "",
                cityProxyContactsMobile: "",
                cityProxyContactsName: "",
                cityProxyName: "",
                contactsMobile: "",
                contactsName: "",
                createTime: null,
                humanCount: 0,
                humanPorts: [],
                fixedCount: 0,
                fixedPorts: [],
                id: null,
                platformName: null,
                provinceProxyName: null,
                robotCount: 0,
                robotPorts: [],
            },
            machineList: [],
            slotList: [],
            detailId: ''
        }
    },
    async mounted() {
        this.detailId = this.$route.params.detailId
        if (this.detailId) {
            await this.getInfoDetail()
        } else {
            await this.getDetail()
            await this.getUsableMachineList()
        }
        this.isPageShow = true
    },
    methods: {
        async getInfoDetail() {
            let result = await this.$smsApi.machine.getApplyDetails(this.$route.params.detailId)
            this.detail = result
        },
        async getDetail() {
            let result = await this.$smsApi.machine.getApplyDetails(this.$route.params.id)
            if (result.robotPorts.length) {
                result.robotPorts.forEach(item => {
                    item.machineId = ''
                    item.slotId = ''
                    item.slotList = []
                });
            }
            if (result.humanPorts.length) {
                result.humanPorts.forEach(item => {
                    item.machineId = ''
                    item.slotId = ''
                    item.slotList = []
                });
            }
            if (result.fixedPorts.length) {
                result.fixedPorts.forEach(item => {
                    item.machineId = ''
                    item.slotId = ''
                    item.slotList = []
                });
            }
            this.detail = result

        },
        async getUsableMachineList() {
            let result = await this.$smsApi.machine.getUsableMachineList()
            this.machineList = result
        },
        async getUsableSlot(item, id) {
            let result = await this.$smsApi.machine.getUsableSlot(id)
            item.slotList = result
        },
        machineChange(item) {
            this.getUsableSlot(item, item.machineId)
        },
        async machineApply() {
            let valid = this.handleApplyUnique(this.detail.robotPorts, this.detail.humanPorts, this.detail.fixedPorts)
            if (!valid.isRequired) {
                this.$Message.warning({ content: '尚有部分设备端口号还未选择，请选择!', duration: 3 });
                return
            }
            if (valid.isRepeat) {
                this.$Message.warning({ content: '有部分设备端口号选择重复，请更改!', duration: 3 });
                return
            }
            let result = await this.$smsApi.machine.postMachineApply({
                humanPorts: this.detail.humanPorts,
                robotPorts: this.detail.robotPorts,
                fixedPorts: this.detail.fixedPorts,
                id: this.$route.params.id
            })
            this.toList()
        },
        handleApplyUnique(arrA, arrB, arrC) {
            let isRepeat, isRequired, tempAll = [], tempA = [], tempB = [], tempC = [], aMachine = 0, bMachine = 0, cMachine = 0, aSlot = 0, bSlot = 0, cSlot = 0
            arrA.forEach((item) => {
                tempA.push(item.machineId + ',' + item.slotId)
                item.machineId && aMachine++
                item.slotId && aSlot++
            })
            arrB.forEach((item) => {
                tempB.push(item.machineId + ',' + item.slotId)
                item.machineId && bMachine++
                item.slotId && bSlot++
            })
            arrC.forEach((item) => {
                tempC.push(item.machineId + ',' + item.slotId)
                item.machineId && cMachine++
                item.slotId && cSlot++
            })
            tempAll = tempA.concat(tempB).concat(tempC)
            //是否重复
            isRepeat = (Array.from(new Set(tempAll)).length != tempA.length + tempB.length + tempC.length)
            //是否都选择
            isRequired = (aMachine == arrA.length && bMachine == arrB.length && cMachine == arrC.length && aSlot == arrA.length && bSlot == arrB.length && cSlot == arrC.length)
            return {
                isRepeat,
                isRequired
            }
        },
        toList() {
            this.$router.push({
                name: 'smsMachineApplyList'
            })
        },
        back() {
            history.back()
        }
    }
}
</script>

<style lang="scss">
.layout-form {
  .ivu-form-item {
    margin-bottom: 0;
  }
}

.customer-table {
  .ivu-table-cell {
    padding: 0 0 0 10px;
  }
}

.task .task-l {
  width: 18rem;
}

.task .task-r {
  margin-left: 19rem;
}
</style>
