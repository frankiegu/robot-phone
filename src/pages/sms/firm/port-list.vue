<template>
    <div>
        <i-table :data="tableParams.list" :columns="columns"></i-table>
        <div class="page-wrapper cf">
            <Page simple show-sizer 
              :total="tableParams.total" 
              :current="currentPage" 
              @on-change="onPageChange" />
            <span class="fr">{{tableParams.total}}共条数据</span>
        </div>
    </div>
</template>
<script>

import {fmt,duration} from "@/util";
import tableMixin from "@/mixins/table-mixin";
export default {
  props: {
    firmId: ""
  },
  data() {
    return {
      columns: [
        {type: 'index',title: '序号',width: 60 },
        {key: 'deviceNo',title: '设备号' },
        {key: 'portNo',title: '端口号' },
        {key: 'mobile',title: '坐席号码' },
        {key: 'cardType',title: '坐席类型',render: (h,params)=>{
          let types = {'1': '机器', '2': '人工', '3': '固定' }
          return h('span',types[`${params.row.cardType}`] )
        }},
        {key: 'callAllCount',title: '呼叫次数'},
        {key: 'callAllTime',title: '呼叫时长', render: (h,params) => {
          return h('span', duration(params.row.callAllTime))
        }},
        {key: 'createTime',title: '开通时间', render: (h,params) => {
          return h('span', fmt.date(params.row.createTime))
        }},
        {key: 'endTime',title: '有效期', render: (h,params) => {
          return h('span', fmt.date(params.row.endTime))
        }},
      ],
    };
  },
  mixins: [tableMixin],
  watch: {
    firmId (n,o){
      if (n) {
        this.onSearch()
      }else{
        this.tableParams.list = []
        this.tableParams.total = 0
        this.tableParams.pageNum = 1
      }
    }
  },
   mounted() {
    this.loadList()
  },
  methods: {
    loadList(){
      let query = this.assignQuery({id: this.firmId})
      this.$smsApi.firm.getPortList(query).then(data => {
        this.tableParams.list = data.dataList
        this.tableParams.total = data.totalNum
      })
    },
  },
  created() {}
};
</script>
<style>

</style>

