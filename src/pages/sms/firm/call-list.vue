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
import {getCallResultLabel} from '@/constants'

export default {
  props: {
    firmId: ""
  },
  data() {
    return {
      columns: [
        {type: 'index',title: '序号', width: 60 },
        {key: 'callType',title: '主叫类型', render: (h,params)=>{
          let types = {'1': '机器类型', '2': '人工类型'}
          return <span>{types[`${params.row.callType}`]}</span>
        }},
        {key: 'cardMobile',title: '主叫号码' },
        {key: 'callResult',title: '呼叫结果', render: (h,params)=>{
          return <span>{getCallResultLabel(params.row.callResult)}</span>
        }},
        {key: 'userLevel',title: '客户等级', render: (h,params)=>{
          return <span>{params.row.userLevel}{params.row.userLevel ? '级' : ''}</span>
        }},
        {key: 'callAllTime',title: '通话时长', render: (h,params)=>{
          return <span>{duration(params.row.callAllTime)}</span>
        }},
        {key: 'callCount',title: '通话轮次' },
        {key: 'callStartTime',title: '呼叫时间', render: (h,params)=>{
          return <span>{fmt.date(params.row.callStartTime)}</span>
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
      this.$smsApi.firm.getCallRecordList(query).then(data => {
        this.tableParams.list = data.dataList
        this.tableParams.total = data.totalNum
      })
    },
    handler2Detail(id){
      // todo
      // this.$router.push({name: ''})
    }
  },
  created() {}
};
</script>
<style>

</style>

