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
    
    
    <seat-renew v-model="modalShow" :entry="newEntry"></seat-renew>




    
  </div>
</template>
<script>
import { fmt, duration } from "@/util";
import tableMixin from "@/mixins/table-mixin";
import seatRenew from "./components/seat-renew";

const newEntry = {
  adminId: '', 
  consumePort: 1, 
  mobile: '',
  perPrice: 1, 
  totalPrice: 1, 
  year: 1,
  portCount: 0,
}
export default {
  props: {
    currentId: ""
  },
  data() {
    return {
      columns: [
        { type: "index", title: "序号", width: 60 },
        { key: "mobile", title: "坐席号码" },
        { key: "cardType", title: "坐席类型" , render: (h,params)=>{
          let cardType = {'1': '机器人', '2': '人工坐席', '3': '固定坐席'}
          return h('span', cardType[`${params.row.cardType}`])
        }},
        { key: "callNum", title: "呼叫次数" },
        { key: "callTime", title: "呼叫时长" , render: (h,params)=>{
          return h('span', duration(params.row.callTime))
        }},
        { key: "createTime", title: "开通时间" , render: (h,params)=>{
          return h('span', fmt.date(params.row.createTime))
        }},
        { key: "endTime", title: "有效期" , render: (h,params)=>{
          return h('span', fmt.date(params.row.endTime))
        }},
        { key: "status", title: "状态" , render: (h,params)=>{
          let type = {'0': '审核中', '1': '正常', '2': '已过期', '3': '使用中'}
            if(params.row.status==1){
               return h('span',{
                 style:{
                   color:"#32BD1B"
                 }
               }, type[`${params.row.status}`])
            }
            else if(params.row.status==3){
               return h('span',{
                 style:{
                   color:"#5983ff"
                 }
               }, type[`${params.row.status}`])
            }
            else{
               return h('span', type[`${params.row.status}`])
            }
         
        }},
        // {
        //   title: "操作",
        //   render: (h, params) => {
        //     return ( 
        //       <i-button size="small" class="ivu-btn-primary" disabled={params.row.status == 0 || params.row.status == 2} onClick={() => {this.handlerEdit(params.row)}}> 续费 </i-button>
        //      );
        //   }
        // }
      ],

      modalShow: false,
      newEntry: {}
    };
  },
  mixins: [tableMixin],
  components: {seatRenew},
  watch: {
    currentId(n, o) {
      if (n) {
        this.loadList();
      } else {
        this.tableParams.list = [];
      }
    }
  },
  // mounted() {
  //   this.loadList()
  // },
  methods: {
    async loadList() {
      let query = this.assignQuery({})
      let data = await this.$pmsApi.firm.getSeatList(this.currentId,query);
      this.tableParams.list = data.dataList
      this.tableParams.total = data.totalNum
    },
    handlerEdit(row) {
      this.modalShow = true
      let {adminId, mobile, portCount} = row
      this.newEntry = {...newEntry,...{adminId, mobile, portCount}}
    },
    // 编辑
    handlerCancel () {
      this.modalShow = false
    },
    handlerAfterSave () {
      this.loadList()
    },
  },
  created() {}
};
</script>
<style>

</style>

