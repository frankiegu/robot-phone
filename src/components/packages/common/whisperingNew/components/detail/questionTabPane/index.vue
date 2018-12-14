<template>
  <div>
    <Form inline>
      <FormItem>
        <i-input
          search
          style="width:230px;"
          type="text"
          placeholder="搜索问答名称"
          v-model.trim="params.name"
          @on-search="search"
          @on-enter="search"
        ></i-input>
      </FormItem>
    </Form>
    <div class="tool">
      <div class="tool-btns">
        <Button type="primary" @click="showForm({whisperingId: data.id})">添加问答</Button>
      </div>
    </div>
    <Table :columns="table.columns" :data="table.list" ref="table"/>
    <ms-pagination
      :pageNum="params.pageNum"
      :pageSize="params.pageSize"
      :total="page.totalNum"
      @change="list"
    />
    <Modal class-name="vertical-center-modal" width="540px" :footer-hide="false" v-model="form.show" :title="form.entity.id ? '编辑问答' : '新增问答'">
      <template v-if="form.show">
        <mod-form ref="modForm" :data="form.entity" @after-submit="afterSubmitForm" @on-cancel="cancelForm"/>
      </template>
      <div slot="footer">
        <Button style="margin-right: 8px" @click="cancelModal">取消</Button>
        <Button type="primary" @click="submitForm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { indexMixin } from "@/mixins";
import whisperingDetailMixin from "../whisperingDetailMixin";
import whisperingNewQuestionApi from "@/api/common/whisperingNewQuestionApi";
import { fmt } from "@/util";
import ModForm from "./form";

export default {
  mixins: [indexMixin, whisperingDetailMixin],
  components: {
    ModForm
  },
  data() {
    return {
      params: {
        whisperingId: this.data.id,
        name: ""
      },
      table: {
        columns: [
          {
            title: "序号",
            key: "id",
            width: 100
          },
          {
            title: "问题名称",
            key: "name"
          },
          {
            title: "问题关键字",
            key: "keyWord"
          },
          {
            title: "回复内容",
            key: "content"
          },
          {
            // 五期未完成屏蔽
            //   title: '跳转流程',
            //   key: 'nextNodeName'
            // }, {
            title: "操作",
            width: 100,
            render: (h, { row }) => {
              return h("div", [
                h(
                  "a",
                  {
                    on: {
                      click: () => {
                        this.showForm(row.id);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "a",
                  {
                    class: {
                      ml10: true
                    },
                    on: {
                      click: () => {
                        this.showDel(row.id);
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
          }
        ]
      }
    };
  },
  methods: {
    cancelModal(){
      this.form.show = false;
    },
    submitForm(){
      this.$refs.modForm.submit();
    },
    getApi() {
      return whisperingNewQuestionApi;
    },
    refreshTaskDetail(data) {
      this.params.whisperingId = data.id;
      this.search();
    },
    afterSubmitForm(data, entity) {
      this.form.show = false;
      this.success(`${entity.id ? "编辑" : "新增"}成功`);
      this.$emit("updated");
    }
  }
};
</script>
