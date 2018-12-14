<template>
  <div>
    <!-- 上方,搜索 -->
    <div class="panel">
      <div class="panel-body">
        <i-form class="panel-form clear"
                inline
                :label-width="100">
          <FormItem label="白名单类型">
            <Select style="width: 120px;"
                    v-model="params.type"
                    placeholder="请选择"
                    clearable
                    @on-change="search">
              <Option value="1">企业</Option>
              <Option value="2">超级管理</Option>
              <Option value="3">D类通话白名单</Option>
              <Option value="4">频率限制</Option>
            </Select>
          </FormItem>
          <FormItem label="创建日期">
            <DatePicker type="daterange"
                        placeholder="选择日期"
                        style="width: 200px;"
                        v-model="dateRange"
                        @on-change='delaySearch' />
          </FormItem>
          <div class="fr">
            <FormItem>
              <i-input placeholder="搜索电话号码"
                       v-model.trim="params.namePhone"
                       @keyup.native.enter="search">
              </i-input>
            </FormItem>
            <FormItem :label-width='1'>
              <i-button type="primary"
                        @click="search">查询</i-button>
            </FormItem>
          </div>
        </i-form>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <div class="tool">
          <i-button type="error"
                    @click="deleteSelected">删除所选</i-button>
          <i-button type="primary"
                    @click="exportShow=true">导入白名单</i-button>
          <i-button type="primary"
                    @click="showForm()">添加白名单</i-button>
        </div>
        <div style="overflow:hidden;">
          <Table :columns="table.columns"
                 :data="table.list"
                 ref="table"
                 @on-selection-change="handleTableSelection" />
          <Page :current="params.pageNum"
                :pageSize="params.pageSize"
                :total="page.totalNum"
                @on-change="list"
                @on-page-size-change="onPageSizeChange"
                show-sizer
                show-elevator
                style="float:right;margin:15px 0;" />
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <ms-panel v-model="form.show"
              :title="form.entity.id ? '编辑白名单' : '添加白名单'">
      <template v-if="form.show">
        <mod-form :data="form.entity"
                  @cancel="closeForm" />
      </template>
    </ms-panel>

    <!-- 编辑 -->
    <ms-panel v-model="eaditShow"
              title='编辑白名单'>
      <template v-if="eaditShow">
        <eadit-form :eaditData="eaditData"
                    @on-cancel="closeEaditForm"
                    @after-submit="afterEaditSubmitForm" />
      </template>
    </ms-panel>
    <!-- 弹窗 -->
    <ms-panel v-model="detail.show"
              :title="'白名单导入'">
      <template v-if="detail.show">
        <userWhiteDetail :data="detail.entity"
                         @cancel="closeDetail" />
      </template>
    </ms-panel>

    <!-- 导入excel -->
    <ms-panel v-model="exportShow"
              :title="'白名单详情'">
      <template v-if="exportShow">
        <exportForm :data="detail.entity"
                    @on-cancel="cancelExportShow"
                    @after-export="afterSubmitExportForm" />
      </template>
    </ms-panel>
  </div>
</template>

<script>
import { indexMixin, detailMixin } from "@/mixins";
// import wordDbApi from '@/api/sms/wordDb'
import userWhiteApi from "@/api/sms/userWhite";
import userWhiteEvenBus from "./src/userWhite";
import userWhiteDetail from "./detail.vue";
import ModForm from "./form";
import eaditForm from "./components/form/eaditForm";
import exportForm from "./exportForm";
import { fmt, getType, watchDateRangeToTimestamp } from "@/util";


export default {
  mixins: [indexMixin, detailMixin],
  components: {
    userWhiteDetail,
    ModForm,
    exportForm,
    eaditForm
  },
  data() {
    let that = this;
    return {
      params: {
        name_phone: "",
        status: "",
        start_time: '',
        end_time: '',
        type: ''
      },
      dateRange: '',
      table: {
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            fixed: "left",
          },
          {
            title: "ID",
            align: "center",
            key: "id",
            render: (h, { row }) => {
              return h("span", row.id);
            }
          },
          {
            title: "名字",
            key: "name",
            align: "center",
            render: (h, { row }) => {
              return h("span", row.name || "无");
            }
          },
          {
            title: "电话号码",
            key: "phone",
            align: "center",
            render: (h, { row }) => {
              return h("span", row.phone);
            }
          },
          {
            title: "白名单类型",
            align: "center",
            key: "phone",
            render: (h, { row }) => {
              return h("span", getType(row.type));
            }
          },
          // {
          //   title: "备注",
          //   key: "remarks",
          //   width: 150,
          //   render: (h, { row }) => {
          //     return h("span", row.remarks || "无");
          //   }
          // },
          {
            title: "企业名称",
            align: "center",
            key: "adminName",
            width: 150,
            render: (h, { row }) => {
              return h("span", row.adminName || "无");
            }
          },
          {
            title: "创建时间",
            key: "createTime",
            align: "center",
            width: 150,
            render: (h, { row }) => {
              return h("span", fmt.date(row.createTime));
            }
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            render(h, { row }) {

              let btnAll
              if (row.type === 1 || row.type === 2) {
                btnAll = [
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {
                          that.showDetail(row.id, true);
                        }
                      }
                    },
                    "详情"
                  )
                ]
              }

              if (row.type === 2) {
                let eaditDelete = [h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        that.showEadit(row.id);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        that.showDel(row.id);
                      }
                    }
                  },
                  "删除"
                )]

                btnAll.push.apply(btnAll, eaditDelete)
              }

              return h("div", btnAll);
            }
          }
        ],
        list: [],
        selection: []
      },
      exportShow: false,
      eaditShow: false,
      eaditData: {}
    };
  },
  mounted() {

  },
  created() {
    this.$watch('dateRange', watchDateRangeToTimestamp(this.params, 'start_time', 'end_time'))
    // 更新模板时触发，更新列表，并重新读取当前的详情
    // 更新时使用
    userWhiteEvenBus.$on("list.update", id => {
      this.closeForm(id);
    });
    // 新增时使用
    userWhiteEvenBus.$on("list.new", () => {
      this.closeForm();
    });

    // 更新列表，并定位到第一个的详情
    // 删除时使用
    userWhiteEvenBus.$on("list.delete", id => {
      this.closeForm(id);
    });
  },
  destroyed() {
    userWhiteEvenBus.$off("list.update");
    userWhiteEvenBus.$off("list.delete");
    userWhiteEvenBus.$off("list.new");
  },
  methods: {

    getApi() {
      return userWhiteApi;
    },
    toggleFullScreen(val) {
      this.fullScreen = val;
    },
    search() {
      this.table.selection = [];
      this.params.pageNum = 1;
      this.filterDelete(2)
      this.listAndDetail(0);
    },
    // 更改每页数量
    onPageSizeChange(pz) {
      this.params.pageSize = pz;
      this.listAndDetail();
    },
    /**
     * 显示详情
     * @param {any} entity
     */
    showDetail(entityOrId, show) {
      if (!show) {
        return;
      }
      if (typeof entityOrId !== "object") {
        this.getApi()
          .getUserWhiteDetail(entityOrId)
          .then(data => {
            this.detail.entity = data || {
              id: ""
            };
            this.detail.show = true;
          });
      } else {
        this.detail.entity = entityOrId || {
          id: ""
        };
        this.detail.show = true;
      }
    },
    closeDetail() {
      this.detail.show = false;
      this.detail.entity = "";
    },
    //excel导入成功后
    afterSubmitExportForm() {
      this.exportShow = false;
      this.success("批量新增成功");
      this.listAndDetail(0);
    },
    afterEaditSubmitForm() {
      this.eaditShow = true
      this.success("修改成功");
      this.listAndDetail(0);
    },
    cancelExportShow() {
      this.exportShow = false
    },
    /**
     * 显示新增/编辑
     * @param {any} entity
     */
    showForm(entityOrId) {
      if (!entityOrId || typeof entityOrId === "object") {
        this.form.entity = entityOrId || {};
        console.log(this.form.entity)
        this.form.show = true;
      } else {
        this.getApi()
          .getUserWhiteDetail(entityOrId)
          .then(data => {
            this.showForm(data);
            // this.closeForm()
          });
      }
    },
    showEadit(id) {

      this.getApi()
        .getUserWhiteDetail(id)
        .then(data => {
          this.eaditData = data;
          this.eaditShow = true
        });
    },
    afterEaditSubmitForm(data, entity) {
      this.success(entity.id ? '编辑白名单成功' : '')
      if (entity.id) {
        this.listAndDetail();
        this.closeEaditForm()
      } else {
        userWhiteEvenBus.$emit('list.new')
      }
    },
    cancelForm() {
      this.$emit('cancel', '', true)
    },
    closeEaditForm() {
      this.eaditShow = false
    },
    // 关闭弹框
    closeForm(id, noflash) {
      this.form.show = false;
      if (noflash) {
        return;
      }
      this.listAndDetail();
    },
    // 同步数据
    synchronousData() {
      this.getApi()
        .synchroData()
        .then(
          res => {
            this.success("同步成功");
          },
          () => { }
        );
    },
    showDel(id) {
      let ids = [];
      ids.push(id);
      let content = "删除操作不可恢复，确认继续删除?";
      this.$Modal.confirm({
        title: "确认删除",
        content,
        onOk: (action, instance) => {
          userWhiteApi.deleteUserWhiteTemplate({ ids }).then(() => {
            this.success("删除成功");
            this.listAndDetail();
            userWhite.$emit("list.delete");
          });
        }
      });
    },
    deleteSelected() {
      let ids = [];
      let content = "删除操作不可恢复，确认继续删除";
      this.table.selection.forEach(val => {
        ids.push(val.id);
      });
      this.$Modal.confirm({
        title: "确认删除",
        content,
        onOk: (action, instance) => {
          this.getApi()
            .deleteUserWhiteTemplate({ ids })
            .then(() => {
              this.success("删除成功");
              this.table.selection = [];
              this.listAndDetail();
            });
        }
      });
    }
  }
};
</script>