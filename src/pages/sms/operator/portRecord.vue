<template>
    <div class="operator-manage-port">
        <i-table :columns="portColumns"
                 :data="tableParams.list"></i-table>
        <div class="page-wrapper">
            <Page :total="tableParams.total"
                  show-sizer
                  show-elevator
                  :current="currentPage"
                  @on-change="onPageChange"
                  @on-page-size-change="onPageSizeChange">
            </Page>
        </div>
    </div>
</template>

<script>
import {
    portColumn
} from './operatorTableColumn'
import tableMixin from '@/mixins/table-mixin'
export default {
    data() {
        return {
            portColumns: portColumn(this)
        }
    },
    props: {
        // id: {
        //     type: Number,
        //     default: ''
        // }
        id: ""
    },
    watch: {
        id: function () {
            this.loadList()
        }
    },
    mixins: [tableMixin],
    mounted() {
        this.loadList()
    },
    methods: {
        async loadList() {
            let result = await this.$smsApi.operator.getPortList(this.assignQuery({
                id: this.id
            }))
            this.initialTableData(result.totalNum, result.dataList)
        }
    }
}
</script>