<template>
    <div>
        <div class="mb10">
          <i-select v-model="query.status" class="w150" placeholder="请选择分配状态" @on-change="onQueryChange">
            <i-option label="全部" value=""></i-option>
            <i-option v-for="(item,i) in statusList" :key="i" :label="item.label" :value="item.value"></i-option>
          </i-select>
          <i-select v-model="query.userLevel" class="w150" placeholder="请选择客户等级" @on-change="onQueryChange">
            <i-option label="全部" value=""></i-option>
            <i-option v-for="(item,i) in userLevelList" :key="i" :label="item.label" :value="item.value"></i-option>
          </i-select>
          <i-select v-model="query.callAllTime" class="w150" placeholder="请选择通话时长" @on-change="onQueryChange">
            <i-option label="全部" value=""></i-option>
            <i-option v-for="(item,i) in callAllTimeList" :key="i" :label="item.label" :value="item.value"></i-option>
          </i-select>
          <i-select v-model="query.callCount" class="w150" placeholder="请选择通话轮次" @on-change="onQueryChange">
            <i-option label="全部" value=""></i-option>
            <i-option v-for="(item,i) in callCountList" :key="i" :label="item.label" :value="item.value"></i-option>
          </i-select>
        </div>
        <div class="mb10 cf">
          <i-button type="primary" class="fr" @click="exportData">导出</i-button>
        </div>
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
const callResults = {'1': '已接通', '2': '无法接通', '3': '拒接', '4': '外呼失败'}

// 筛选条件
const statusList = [{label: '未分配', value: 0}, {label: '已分配', value: 1}]
const userLevelList = [ {label:'A级', value: 'A'}, {label:'B级', value: 'B'}, {label:'C级', value: 'C'}, {label:'D级', value: 'D'}, {label:'E级', value: 'E'}, {label:'F级', value: 'F'} ]
const callAllTimeList = [ {value: 1, label: '小于10秒'}, {value: 2, label: '10秒~1分钟'}, {value: 3, label: '1分钟~2分钟'}, {value: 4, label: '大于2分钟'} ]	
const callCountList = [ {label: '0~10轮', value: 1}, {label: '11~20轮', value: 2}, {label: '21~30轮', value: 3}, {label: '大于30轮', value: 4} ]

// 初始化query
const initQuery = () => {
  return {
    status: '',
    userLevel: '',
    callAllTime: '',
    callCount: ''
  }
}

export default {
  props: {
    firmId: ""
  },
  data() {
    return {
      query: initQuery(),
      columns: [
        {type: 'selection', width: 60 },
        {type: 'index',title: '序号', width: 60 },
        {key: 'mobile',title: '客户号码' },
        {key: 'userName',title: '客户姓名' },
        {key: 'taskNum',title: '任务数' },
        {key: 'callNum',title: '被呼叫次数' },
        {key: 'createTime',title: '最近呼叫时间', render: (h,params)=>{
          return <span>{fmt.date(params.row.createTime)}</span>
        }},
      ],
      statusList,
      userLevelList,
      callAllTimeList,
      callCountList,
      isQueryReset: false, // 是否是重置查询信息
    };
  },
  mixins: [tableMixin],
  watch: {
    firmId (n,o){
      this.resetQuery()
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
      let query = this.assignQuery({...this.query,id: this.firmId})
      this.$smsApi.firm.getCustomerList(query).then(data => {
        this.tableParams.list = data.dataList
        this.tableParams.total = data.totalNum
      })
    },
    handler2Detail(id){
      // todo
      // this.$router.push({name: ''})
    },
    onQueryChange (i){
      // 防止重置query 时，多次出发查询
      if (this.isQueryReset) { return }
      this.onSearch()
    },
    exportData(){
      this.resetQuery()
    },
    resetQuery(){
      this.query = initQuery()
      this.isQueryReset = true
      this.$nextTick(() => {
        this.isQueryReset = false
      })
    }
  },
  created() {}
};
</script>
<style>

</style>

