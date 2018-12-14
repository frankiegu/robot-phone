<template>
    <div>
        <Table :columns="firmColumns"
               :data="tableParams.list"
               stripe>
        </Table>
        <div class="page-wrapper"
             v-if="tableParams.total">
            <Page :total="tableParams.total"
                  show-sizer
                  show-elevator
                  :current="tableParams.pageNum"
                  @on-change="onPageChange"
                  @on-page-size-change="onPageSizeChange"
                  :page-size="tableParams.pageSize">
            </Page>
        </div>
    </div>
</template>

<script>
import tableMixin from "@/mixins/table-mixin"
import {
    firmColumn
} from "../cityProxyTable";
export default {
    data() {
        return {
            firmColumns: firmColumn(this),
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

    },
    watch: {
        id: function (nv, ov) {
            this.loadList()
        }
    },
    mounted() {
        this.loadList()
    },
    mixins: [tableMixin],

    methods: {
        async loadList() {
            let vm = this
            let resultfirm = await this.$omsApi.provinceProxy.getFirmList(vm.assignQuery({
                id: vm.id,
            }))
            vm.initialTableData(resultfirm.totalNum, resultfirm.dataList)
        },
    }
}
</script>