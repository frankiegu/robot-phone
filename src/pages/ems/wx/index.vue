<template>
  <div>
    <div class="divide" :class="{full: fullScreen}">

      <div class="task" style="height:auto;">
        <div class="task-l divide-item" style="border-radius:0;box-shadow:none;border-right: .7rem solid #f3f4f8;">
          <div class="panel">
            <div class="panel-header">扫码关注</div>
            <div class="panel-body">
              <div class="qrcode-container">
                <img :src="qrCodeUrl">
                <!--
                <a :href="qrCodeUrl"
                   download="二维码.jpg"
                   target="_blank"
                   class="qrcode-download">点击下载二维码</a>
                -->
              </div>
              <p class="text-c">说明
                <br>扫描二维码 - 关注公众号 - 微信用户列表
                <br>- 审核通过 - 到销售人员管理中绑定微信
              </p>
            </div>
          </div>
        </div>
        <div class="task-r divide-main" style="border-radius:0;box-shadow:none;">
          <div class="panel">
            <div class="panel-body">
                    <div class="divide-item">
        <div class="panel">
          <div class="panel-body">
            <Form class="panel-form" inline>
              <div class="fr">
                <FormItem>
                  <i-input
                    type="text"
                    search
                    style="width:230px;"
                    placeholder="搜索ID/昵称"
                    v-model.trim="params.idName"
                    @on-search="search"
                    @on-enter="search"
                  ></i-input>
                </FormItem>
              </div>
              <FormItem label="绑定状态" :label-width="70">
                <Select
                  style="width: 150px;"
                  v-model="params.bindStatus"
                  placeholder="全部"
                  clearable
                  @on-change="search"
                >
                  <Option value="1">已绑定</Option>
                  <Option value="0">未绑定</Option>
                </Select>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
              <Table :columns="table.columns" :data="table.list" ref="table"/>
              <ms-pagination
                :pageNum="params.pageNum"
                :pageSize="params.pageSize"
                :total="page.totalNum"
                @change="list"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { indexMixin } from "@/mixins";
import wxApi from "@/api/ems/wx";
import { fmt } from "@/util";

export default {
  mixins: [indexMixin],
  data() {
    return {
      params: {
        idName: "",
        bindStatus: ""
      },
      table: {
        columns: [
          {
            title: "头像",
            key: "headUrl",
            width: 60,
            render: (h, { row, column, index }) => {
              return (
                <img src={row.headUrl} style="width: 40px; height: 40px;" />
              );
            }
          },
          {
            title: "昵称",
            key: "name"
          },
          {
            title: "关注时间",
            key: "createTime",
            width: 160,
            value: row => {
              return fmt.date(row.createTime);
            },
            render: (h, { row, column, index }) => {
              return h("span", column.value(row));
            }
          },
          {
            title: "处理状态",
            key: "status",
            width: 100,
            value: row => {
              return fmt.value(row.status, ["待处理", "通过", "拒绝"]);
            },
            render: (h, { row, column, index }) => {
              return h("span", column.value(row));
            }
          },
          {
            title: "绑定状态",
            key: "bindStatus",
            width: 100,
            value: row => {
              return fmt.value(row.bindStatus, ["未绑定", "已绑定"]);
            },
            render: (h, { row, column, index }) => {
              return h("span", column.value(row));
            }
          },
          {
            title: "操作",
            key: "mobile",
            width: 160,
            render: (h, { row, column, index }) => {
              let html = [
                <a
                  href="javascript: void(0)"
                  class="c-danger mr-10"
                  onClick={() => this.showDel(row.id)}
                >
                  删除
                </a>
              ];
              if (row.status === 0) {
                html.push(
                  <a
                    href="javascript: void(0)"
                    onClick={() => this.updateStatus(row.id, 1, "通过")}
                  >
                    通过
                  </a>
                );
                html.push(
                  <a
                    href="javascript: void(0)"
                    class="ml-10"
                    onClick={() => this.updateStatus(row.id, 2, "拒绝")}
                  >
                    拒绝
                  </a>
                );
              }
              return <span>{html}</span>;
            }
          }
        ]
      },
      qrCodeUrl: "",
      fullScreen: false
    };
  },
  created() {
    wxApi.getCode().then(url => {
      this.qrCodeUrl = url;
    });
  },
  methods: {
    getApi() {
      return wxApi;
    },
    updateStatus(id, status, label) {
      wxApi
        .updateStatus({
          id,
          status
        })
        .then(() => {
          this.success(`${label}成功`);
          this.list();
        });
    }
  }
};
</script>
