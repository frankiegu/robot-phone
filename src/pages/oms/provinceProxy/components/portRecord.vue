<template>
    <div>
        <Table :columns="portColumns" :data="tableParams.list" stripe>
        </Table>
        <div class="page-wrapper" v-if="tableParams.total">
            <Page :total="tableParams.total" show-sizer show-elevator :current="tableParams.pageNum" @on-change="onPageChange" @on-page-size-change="onPageSizeChange" :page-size="tableParams.pageSize">
            </Page>
        </div>
    </div>
</template>

<script>
    import tableMixin from "@/mixins/table-mixin"
    import {portColumn} from "../cityProxyTable";
    export default {
        data() {
            return {
                portColumns: portColumn(this),
            }
        },
        props: {
            id: {
                type: Number,
                default: 0
            },
        },
        created() {
        },
        mixins: [tableMixin],
        watch: {
            id: function(nv, ov) {
                this.loadList()
            }
        },
        mounted() {
            this.loadList()
        },
        methods: {
            async loadList() {
                let vm = this
                    let result = await this.$omsApi.provinceProxy.getPortList(vm.assignQuery({
                        id: vm.id
                    }))
                    vm.initialTableData(result.totalNum, result.dataList)

            }
        }
    }
</script>