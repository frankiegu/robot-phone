<template>
    <div class="operator-manage-port">
        <i-table :columns="provinColumns" :data="tableParams.list"></i-table>
        <div class="page-wrapper">
            <Page :total="tableParams.total" show-sizer show-elevator :current="currentPage" @on-change="onPageChange" @on-page-size-change="onPageSizeChange">
            </Page>
        </div>
    </div>
</template>

<script>
    import {
        provinColumn
    } from './operatorTableColumn'
    import tableMixin from '@/mixins/table-mixin'
    export default {
        data() {
            return {
                provinColumns: provinColumn(this)
            }
        },
        props: {
            // id: {
            //     type: Number,
            //     default: ''
            // }
            id:""
        },
        watch: {
            id: function() {
                this.loadList()
            }
        },
        mixins: [tableMixin],
        mounted() {
            this.loadList()
        },
        methods: {
            async loadList() {
                let result = await this.$smsApi.operator.getProvinceList(this.assignQuery({
                    id: this.id
                }))
                this.initialTableData(result.totalNum, result.dataList)
            }
        }
    }
</script>