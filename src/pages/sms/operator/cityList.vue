<template>
    <div class="operator-manage-city">
        <i-table :columns="cityColumns" :data="tableParams.list"></i-table>
        <div class="page-wrapper">
            <Page :total="tableParams.total" show-sizer show-elevator :current="currentPage" @on-change="onPageChange" @on-page-size-change="onPageSizeChange">
            </Page>
        </div>
    </div>
</template>

<script>
    import {
        cityColumn
    } from './operatorTableColumn'
    import tableMixin from '@/mixins/table-mixin'
    export default {
        data() {
            return {
                cityColumns: cityColumn(this)
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
         mounted() {
            this.loadList()
        },
        mixins: [tableMixin],
        methods: {
            async loadList() {
                let result = await this.$smsApi.operator.getCityList(this.assignQuery({
                    id: this.id
                }))
                this.initialTableData(result.totalNum, result.dataList)
            }
        }
    }
</script>