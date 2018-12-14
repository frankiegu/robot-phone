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
// todo: 客户列表接口没有
import tableMixin from "@/mixins/table-mixin";
const statusMap = ['未开始','进行中','暂停','终止','完成']
export default {
  props: {
    labelId: ""
  },
  data() {
    return {
      query: {
        labelId: this.labelId,
      },
      columns: [
        {type: 'index',title: '序号'},
        {key: 'userName',title: '客户姓名'},
        {key: 'mobile', title: '电话号码'},
        {key: 'userLevel', title: '客户等级'},
        {key: 'callAllCount', title: '呼叫次数'},
        {key: 'taskName', title: '来源'},
      ],
    }
  },
  mixins: [tableMixin],
  mounted() {
    this.onSearch()
  },
  watch: {
    labelId (n,o){
      if (n) {
        this.query.labelId = n
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
      this.$emsApi.labelInfo.getUserlList(query).then(data => {
        this.tableParams.list = data.dataList
        this.tableParams.total = data.totalNum
      })
    },
  },
  created() {
   
  }
};
</script>
<style>

</style>

