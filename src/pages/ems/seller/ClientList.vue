<template>
  <div>
    <div class="title" style="border-bottom:1px solid #f1f1f1;padding-bottom:5px;">客户列表</div>
    <Table :columns="table.columns" :data="dataList" class="table"></Table>
    <Page
      class="pagination"
      :total="totalNum"
      :pageNum="pager.pageNum"
      :pageSize="pager.pageSize"
      @on-change="handleChangePageNum"
      @on-page-size-change="handleChangePageSize"
    />
  </div>
</template>
<script>
import API from "@/api/index";
import Util from "@/util/util";
import { fmt } from "@/util";

export default {
  name: "clientList",
  props: {
    id: ""
  },
  data() {
    return {
      pager: {
        id: "",
        pageNum: 1,
        pageSize: 10
      },
      totalNum: 0,
      dataList: [],
      params: {},
      table: {
        columns: [
          {
            type: "index",
            width: 60,
            align: "center",
            title: "序号",
            key: "1"
          },
          {
            title: "客户号码",
            align: "center",
            key: "mobile"
          },
          {
            title: "客户姓名",
            align: "center",
            key: "userName"
          },
          {
            title: "客户等级",
            align: "center",
            key: "userLevel"
          },
          {
            title: "分配时间",
            align: "center",
            key: "createTime",
            value: row => {
              return fmt.date(row.createTime);
            },
            render: (h, { row, column, index }) => {
              return h("span", column.value(row));
            }
          }
        ]
      }
    };
  },
  mounted() {
    setTimeout(() => {
      let id = this.id;
      this.initList({ id });
    }, 1000);
  },
  methods: {
    initList(param) {
      this.params = Object.assign({}, param);
      this.getList();
    },
    getList() {
      const obj = Object.assign({}, this.pager, this.params);
      API.ems.employee.listCustomer(obj).then(res => {
        this.dataList = res.dataList;
        this.totalNum = res.totalNum;
      });
    },
    handleChangePageNum(toPage) {
      this.pager.pageNum = toPage;
      this.getList();
    },
    handleChangePageSize(newSize) {
      this.pager.pageSize = newSize;
      this.pager.pageNum = 1;
      this.getList();
    }
  }
};
</script>
