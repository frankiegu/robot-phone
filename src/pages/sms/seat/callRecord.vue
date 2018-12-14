<template>
    <div>
        <Table :columns="tableColumns" :data="tableParams.list" stripe>
        </Table>
        <div class="page-wrapper">
            <Page :total="tableParams.total" show-sizer show-elevator :current="currentPage" @on-change="onPageChange" @on-page-size-change="onPageSizeChange">
            </Page>
        </div>
    </div>
</template>

<script>
import tableMixin from "@/mixins/table-mixin"
    import {
        recordColumn
    } from "./tableColumn";
    export default {
        data() {
            return {
                tableColumns: recordColumn(this),
            }
        },
        props:{
            cardMobile:{
                type:String,
                default:0
            }
        },
        mounted(){
            
        },
        watch:{
            cardMobile:function(nv,ov){
                this.loadList()
            }
        },
        mixins: [tableMixin],
        mounted() {
            this.loadList()
        },
        methods:{
            async loadList(){
                let vm = this
                let result = await this.$smsApi.seat.getRecordList(vm.assignQuery({cardMobile:vm.cardMobile}))
                vm.initialTableData(result.totalNum,result.dataList)
            },
        }
    }
</script>