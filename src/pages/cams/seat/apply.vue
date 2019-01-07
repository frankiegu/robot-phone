<template>
  <div>
    <Breadcrumb separator=">">
      <span class="home" @click="linkTo('camsHomeIndex')">
        <BreadcrumbItem>首页</BreadcrumbItem>
      </span>
      <BreadcrumbItem>坐席申请列表</BreadcrumbItem>
    </Breadcrumb>
    <div style="height: calc(100vh - 125px);
    overflow: auto;background:#fff;">
      <div class="divide-item">
        <div class="panel">
          <div class="panel-body">
            <i-form class="panel-form clear" inline>
              <FormItem>
                <i-select
                  v-model="query.status"
                  class="w200"
                  @on-change="onSearch"
                  placeholder="请选择状态"
                >
                  <i-option value>全部状态</i-option>
                  <i-option v-for="(item,i) in statusList" :value="i" :key="i">{{ item }}</i-option>
                </i-select>
              </FormItem>

              <FormItem>
                <i-input
                  search
                  @on-search="onSearch"
                  v-model="query.name"
                  @on-enter="onSearch"
                  type="text"
                  placeholder="搜索企业名称"
                ></i-input>
              </FormItem>
            </i-form>
          </div>
        </div>
      </div>
      <div class>
        <i-table stripe :data="tableParams.list" :columns="columns"></i-table>

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
      </div>
    </div>
    <ms-panel v-model="seatShow" :title="seatId ? '编辑坐席' : '开通坐席'">
      <seat-detail :visible="seatShow" :seat-id="seatId"></seat-detail>
    </ms-panel>
  </div>
</template>
<script>
import { fmt, duration } from "@/util";
import tableMixin from "@/mixins/table-mixin";
import seatDetail from "./components/seat-apply";
import Util from "@/util/util";
const status = ["待开通", "已开通", "已拒绝"];
export default {
  data() {
    return {
      query: {
        name: "",
        status: ""
      },
      statusList: status,
      columns: [
        { type: "index", title: "序号", width: 60 },
        {
          title: "企业名称",
          render: (h, params) => {
            return (
              <span
                
                onClick={() => {
                  this.handlerShowDetail(params.row.id);
                }}
              >
                {params.row.name}
              </span>
            );
          }
        },
        { key: "robotCount", title: "开通机器坐席数" },
        { key: "humanCount", title: "开通人工坐席数" },
        { key: "fixedCount", title: "开通固定坐席数" },
        { key: "perPrice", title: "坐席单价（元）" },
        { key: "allPrice", title: "合计金额（元）" },
        {
          title: "状态",
          render: (h, params) => {
            let classes = [
              "",
              "text-success",
              "text-info",
              "text-warning"
            ];
            return (
              <span class={classes[params.row.status]}>
                {status[params.row.status]}
              </span>
            );
          }
        },
        {
          title: "使用期限",
          render: (h, params) => {
            let type;
            if (params.row.portType === 0) {
              type = "年";
            } else if (params.row.portType === 1) {
              type = "月";
            }
            return (
              <span>
                {params.row.serviceLife}
                {type}
              </span>
            );
          }
        },
        {
          title: "申请时间",
          render: (h, params) => {
            let time = fmt.date(params.row.createTime);
            return <span>{time}</span>;
          }
        }
      ],

      seatShow: false,
      seatId: ""
    };
  },
  mixins: [tableMixin],
  components: {
    seatDetail
  },
  watch: {},
  methods: {
    linkTo(name) {
      Util.openPage(this, name);
    },
    async loadList() {
      let query = this.assignQuery(this.query);
      let data = await this.$pmsApi.seat.getApplyList(query);
      this.tableParams.list = data.dataList;
      this.tableParams.total = data.totalNum;
    },
    handlerShowDetail(id) {
      this.seatId = id;
      this.seatShow = true;
    }
  },
  created() {
    this.loadList();
  }
};
</script>
<style>
</style>

