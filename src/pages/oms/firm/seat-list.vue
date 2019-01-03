<template>
  <div>
    <i-table :data="tableParams.list" :columns="columns"></i-table>

    <div class="page-wrapper cf">
      <Page
        simple
        show-sizer
        :total="tableParams.total"
        :current="currentPage"
        @on-change="onPageChange"
      />
      <span class="fr">{{tableParams.total}}共条数据</span>
    </div>

    <div v-if="lastDestroy">
      <seat-renew v-model="modalShow" :entry="newEntry" @after-save="loadList"></seat-renew>
    </div>
  </div>
</template>
<script>
import { fmt, duration } from "@/util";
import tableMixin from "@/mixins/table-mixin";
import seatRenew from "./components/seat-renew";
import * as firmApi from "@/api/oms/firm";
const newEntry = {
  adminId: "",
  consumePort: 1,
  mobile: "",
  perPrice: 1,
  totalPrice: 1,
  year: 1,
  portCount: 0
};
export default {
  props: {
    currentId: ""
  },
  data() {
    return {
      columns: [
        { type: "index", title: "序号", width: 60 },
        { key: "mobile", title: "坐席号码" },
        {
          key: "cardType",
          title: "坐席类型",
          render: (h, params) => {
            let cardType = { "1": "机器人", "2": "人工坐席", "3": "固定坐席" };
            return h("span", cardType[`${params.row.cardType}`]);
          }
        },
        { key: "callNum", title: "呼叫次数" },
        {
          key: "callTime",
          title: "呼叫时长",
          render: (h, params) => {
            return h("span", duration(params.row.callTime));
          }
        },
        {
          key: "createTime",
          title: "开通时间",
          render: (h, params) => {
            return h("span", fmt.date(params.row.createTime));
          }
        },
        {
          key: "endTime",
          title: "有效期",
          render: (h, params) => {
            return h("span", fmt.date(params.row.endTime));
          }
        },
        {
          key: "status",
          title: "状态",
          render: (h, params) => {
            let type = {
              "0": "审核中",
              "1": "正常",
              "2": "已过期",
              "3": "使用中"
            };
            if(params.row.status=='1'){
               return h("span", {
              style: {
                color: "#32BD1B"
              }
            },
             type[`${params.row.status}`]);
            }
           else if(params.row.status=='3'){
              return h("span", {
              style: {
                color: "#5983FF"
              }
            },
             type[`${params.row.status}`]);
           }
           else{
              return h("span", 
             type[`${params.row.status}`]);
           }
          }
        }
      ],

      lastDestroy: false,
      modalShow: false,
      newEntry: {}
    };
  },
  mixins: [tableMixin],
  components: { seatRenew },
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
    // async loadList() {
    //   console.log('a')
    //   let query = this.assignQuery({})
    //   let data = await this.$omsApi.firm.getSeatList(this.currentId,query);
    //   this.tableParams.list = data.dataList
    //   this.tableParams.total = data.totalNum
    // },
    loadList() {
      let query = this.assignQuery({});

      firmApi.getSeatList(this.currentId, query).then(res => {
        this.tableParams.list = res.dataList;
        this.tableParams.total = res.totalNum;
      });
    },
    // 编辑
    handlerEdit(row) {
      this.modalShow = true;
      this.lastDestroy = true;
      let { adminId, mobile, portCount } = row;
      this.newEntry = { ...newEntry, ...{ adminId, mobile, portCount } };
    },
    handlerCancel() {
      this.modalShow = false;
      this.lastDestroy = false;
    },
    handlerAfterSave() {
      this.loadList();
    }
  },
  created() {}
};
</script>
<style>
</style>

