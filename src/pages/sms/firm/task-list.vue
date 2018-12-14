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
const statusMap = ['未开始', '进行中' ,'暂停', '终止', '完成']
export default {
  props: {
    firmId: ""
  },
  data() {
    return {
      columns: [
        {type: 'index',title: '序号', width: 60 },
        {key: 'taskName',title: '任务名称' ,render: (h,params) => {
          return (<span class="text-link" onClick={()=>{this.handler2Detail(params.row.taskId)}}>{params.row.taskName}</span>)
        }},
        {key: 'mobile',title: '坐席号码' },
        {key: 'callNum',title: '呼叫号码数' },
        {key: 'status',title: '状态', render: (h,params) => {
          return h('span', statusMap[`${params.row.status}`])
        }},
        {key: 'createTime',title: '创建时间', render: (h,params) => {
          return h('span', fmt.date(params.row.createTime))
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
      this.$smsApi.firm.getTaskList(query).then(data => {
        this.tableParams.list = data.dataList
        this.tableParams.total = data.totalNum
      })
    },
    handler2Detail(id){
      // todo
      // this.$router.push({name: ''})
      console.log('详情模块为开发')
    }
  },
  created() {}
};
</script>
<style>

</style>

