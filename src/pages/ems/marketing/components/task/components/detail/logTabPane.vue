<template>
  <div>
    <Form inline>
      <div class="fr">
        <FormItem>
          <i-input type="text"
                   placeholder="搜索客户号码"
                   v-model.trim="params.mobile"
                   @keyup.native.enter="search">
            <Icon type="search"
                  slot="prepend"></Icon>
          </i-input>
        </FormItem>
        <FormItem :label-width="1">
          <Button type="primary"
                  @click="search">查询</Button>
        </FormItem>
      </div>
      <FormItem label="呼叫状态"
                :label-width="60">
        <Select style="width: 120px;"
                v-model="params.callStatus"
                placeholder="全部"
                clearable
                @on-change="search">
          <Option value="0">开始呼叫</Option>
          <Option value="1">已接通</Option>
          <Option value="2">无法接通</Option>
          <Option value="3">拒接</Option>
          <Option value="4">外呼失败</Option>
        </Select>
      </FormItem>
      <FormItem>
        <DatePicker v-model="queryCreateTime"  type="daterange" placeholder="呼叫时间" class="w200"></DatePicker>
      </FormItem>
    </Form>
    <Table :columns="table.columns"
           :data="table.list"
           ref="table" />
    <ms-pagination :pageNum="params.pageNum"
                   :pageSize="params.pageSize"
                   :total="page.totalNum"
                   @change="list" />
  </div>
</template>

<script>
import { indexMixin } from "@/mixins";
import taskDetailMixin from "./taskDetailMixin";
import callRecordApi from "@/api/ems/callRecord";
import { fmt } from "@/util";

export default {
  mixins: [indexMixin, taskDetailMixin],
  data() {
    return {
      params: {
        taskId: this.data.id,
        callStatus: "",
        mobile: "",
        startTime:'',
        endTime:''
      },
      queryCreateTime: [],
      table: {
        columns: [
          {
            title: "序号",
            key: "id"
          },
          {
            title: "机器坐席号码",
            key: "callMobile"
          },
          {
            title: "客户号码",
            key: "calledMobile"
          },
          {
            title: "呼叫状态",
            key: "callStatus",
            render: (h, { row }) => {
              return h(
                "span",
                ["开始呼叫", "已接通", "无法接通", "拒接", "外呼失败"][
                  row.callStatus
                ]
              );
            }
          },
          {
            title: "呼叫时间",
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
 watch: {
    queryCreateTime: {
      handler(n){
        this.params.startTime = n[0] ? n[0].getTime() : ''
        this.params.endTime = n[1] ? n[1].getTime() : ''
        this.search()
      },
      deep: true
    },
  },
  methods: {
    getApi() {
      return callRecordApi;
    },
    initData(resolve) {
      // Tab 切换结束后再执行请求
      setTimeout(() => {
        resolve();
      }, 350);
    },
    refreshTaskDetail(data) {
      this.params.taskId = data.id;
      this.search();
    },
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize);
      let params = Object.assign({}, this.params);
      callRecordApi.listLog(params).then(page => {
        this.setTableList(page.dataList);
        this.setPagination(page);
      });
    }
  }
};
</script>
