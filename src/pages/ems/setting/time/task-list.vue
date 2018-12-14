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
import tableMixin from "@/mixins/table-mixin";
import Util from '@/util/util'
const statusMap = ['未开始','进行中','暂停','终止','完成']
export default {
  props: {
    templateId: ""
  },
  data() {
    return {
      query: {
        timeTemplateId: this.templateId,
      },
      columns: [
        {type: 'index',title: '序号'},
        {key: 'taskName',title: '营销任务名称'},
        {key: 'userCount',title: '呼叫总数'},
        {key: 'status',title: '任务状态',render: (h,params)=>{
          return h('span',statusMap[params.row.status])
        }},
        {key: 'createTime',title: '创建时间', render: (h, params) => {
          return h('span', Util.msToDate(params.row.createTime, 'yyyy-MM-dd hh:mm'))
        }}
      ],
    };
  },
  mixins: [tableMixin],
  mounted() {
    this.onSearch()
  },
  watch: {
    templateId (n,o){
      if (n) {
        this.query.timeTemplateId = n
        this.onSearch()
      }else{
        this.tableParams.list = []
        this.tableParams.total = 0
        this.tableParams.pageNum = 1
      }
    }
  },
  methods: {
    loadList(){
      let query = this.assignQuery(this.query)
      this.$emsApi.timeTemplate.getTaskList(query).then(data => {
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

