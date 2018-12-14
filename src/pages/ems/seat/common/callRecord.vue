<template>
    <div>
        <Table :columns="robotColumns" :data="tableParams.list" stripe>
        </Table>
        <div class="page-wrapper">
            <Page :total="tableParams.total" show-sizer show-elevator :current="tableParams.pageNum" @on-change="onPageChange" @on-page-size-change="onPageSizeChange" :page-size="tableParams.pageSize">
            </Page>
        </div>
    </div>
</template>

<script>
    import tableMixin from "@/mixins/table-mixin"
    import {
        robotColumn,
        manualColumn
    } from "./seatColumn";
    export default {
        data() {
            return {
                robotColumns: robotColumn(this),
            }
        },
        props: {
            id: {
                type: Number,
                default: 0
            },
            cardType: {
                type: Number,
                default: 0
            }
        },
        created() {
            if (this.cardType == 1) {
                this.robotColumns = robotColumn(this)
            } else {
                this.robotColumns = manualColumn(this)
            }

        },
        watch: {
            id: function(nv, ov) {
                this.loadList()
            }
        },
        mixins: [tableMixin],
        created() {
            this.loadList()
        },
        methods: {
            async loadList() {
                let vm = this
                if (vm.cardType == 1) {
                    let resultRobot = await this.$emsApi.cardSlot.getCallRecords(vm.assignQuery({
                        id: vm.id,
                        cardType: vm.cardType
                    }))
                    vm.initialTableData(resultRobot.totalNum, resultRobot.dataList)
                } else {
                    // getArtificialCallRecords
                    let resultArtificial = await this.$emsApi.cardSlot.getCallRecords(vm.assignQuery({
                        id: vm.id,
                        cardType: vm.cardType
                    }))
                    vm.initialTableData(resultArtificial.totalNum, resultArtificial.dataList)
                }
            },
        }
    }
</script>