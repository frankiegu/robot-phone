<template>
  <div class="task">
    <div>
      <div class="board-primary">
        <div class="board-body">
          <whispering-flow-item
            title="主流程"
            :list="node.main.list"
            :currentNode="detail.entity"
            @clickCreate="createWhisperingModule(1)"
            @clickSort="showSortableNode(node.main.list, '主流程排序')"
            @clickNode="v => showWhisperingNode(v, '主流程')"
          />

          <whispering-flow-item
            title="辅助流程"
            :list="node.aside.list"
            :currentNode="detail.entity"
            :showSort="false"
            @clickCreate="createWhisperingModule(2)"
            @clickNode="v => showWhisperingNode(v, '辅助流程')"
          />

          <whispering-flow-item
            title="特殊流程"
            :list="node.special.list"
            :currentNode="detail.entity"
            :showSort="false"
            :showCreateBtn="false"
            @clickNode="v => showWhisperingNode(v, '特殊流程')"
          />
        </div>
      </div>
    </div>
    <div class="task-r" style="border-radius:0;box-shadow:none;border: 1px solid #dcdcdc;">
      <div class="board2 "  ref="detail">
        <div class="board-body">
          <whispering-module
            :data="detail.entity"
            v-if="detail.entity && detail.entity.id"
            @showUpdate="entity => showForm(entity)"
            @showDel="showDelModule"
            @afterSubmitKey="afterSubmitKey"
          />
          <p class="nodata" v-else>请选择话术模板或创建新的话术模板</p>
        </div>
      </div>
    </div>
    <Modal v-model="sort.show" :title="sort.title">
      <sortable-node :list="sort.list" @change="sortList"/>
      <div slot="footer"></div>
    </Modal>

    <Modal :mask-closable="false" v-model="form.show" :title="form.entity.id ? '编辑模板' : '新增模板'">
      <whispering-module-form
        :data="form.entity"
        @after-submit="afterSubmitModule"
        @on-cancel="cancelModule"
        v-if="form.show"
        ref="moduleForm"
      />
      <div slot="footer">
         <Button 
              style="margin-right: 8px"
              @click="cancelFrom">取消</Button>
      <Button type="primary"
              @click="submitForm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { formMixin, indexMixin } from "@/mixins";
import SortableNode from "./components/sortableNode";
import { WhisperingFlowItem } from "@/components/packages/common/whispering";
import FlowItem from "./src/flowItem";
import WhisperingModuleForm from "./components/whisperingModule/form";
import WhisperingModule from "./components/whisperingModule";
import whisperingNewModuleApi from "@/api/common/whisperingNewModuleApi";
import whisperingNewNodeApi from "@/api/common/whisperingNewNodeApi";

export default {
  mixins: [formMixin, indexMixin],
  components: {
    SortableNode,
    WhisperingFlowItem,
    WhisperingModuleForm,
    WhisperingModule
  },
  data() {
    FlowItem.clear();
    return {
      params: {
        id: this.data.id
      },
      node: {
        // 主流程
        main: new FlowItem({ module: 1, title: "主流程" }),
        // 辅助流程
        aside: new FlowItem({ module: 2, title: "旁白流程" }),
        // 特殊流程
        special: new FlowItem({ module: 3, title: "关键字结束流程" })
      },
      sort: {
        show: false,
        title: "排序",
        list: []
      }
    };
  },
  mounted() {
    this.search();
  },
  destroyed() {
    FlowItem.clear();
  },
  methods: {
    cancelFrom(){
      this.form.show = false;
    },
    submitForm(){
      this.$refs.moduleForm.submit();
    },
    getApi() {
      return whisperingNewModuleApi;
    },
    init() {},
    list(pageNum, pageSize) {
      if (!this.data.id) {
        return Promise.resolve();
      }
      this.setPageNumSize(pageNum, pageSize);
      let params = Object.assign({}, this.params, {
        id: this.data.id
      });
      return whisperingNewModuleApi.list(params).then(data => {
        // 五期未完成屏蔽
        // 特殊流程只保留挽回
        FlowItem.addData(
          data.map(v => {
            if (v.module === 3 && v.type !== 1) {
              v.name = `${v.name} (敬请期待...)`;
              v.disable = true;
            }
            return v;
          })
        );
        return data;
      });
    },
    listAndDetail(index) {
      this.list().then(data => {
        if (data.length === 0) {
          this.detail.entity = {};
        } else if (typeof index === "number") {
          // 选择特定位置
          if (data[index]) {
            this.showDetail(data[index].id);
          }
        } else if (this.detail.entity.id) {
          // 判断之前选中的是否还存在于该页面
          if (data.some(v => v.id === this.detail.entity.id)) {
            this.showDetail(this.detail.entity.id);
          } else {
            this.showDetail(data[0].id);
          }
        }
      });
    },
    createWhisperingModule(module) {
      this.showForm({
        module,
        whisperingId: this.data.id
      });
    },
    afterSubmitModule() {
      this.listAndDetail();
      this.form.show = false;
    },
    cancelModule() {
      this.form.show = false;
    },
    // 显示话术节点详情
    // 支持 id/Object
    showWhisperingNode(entity, moduleTitle) {
      if (entity.disable === true) {
        return this.info("开发中，敬请期待...");
      }
      whisperingNewModuleApi.get(entity.id).then(data => {
        data.moduleTitle = moduleTitle;
        this.detail.entity = Object.assign({}, entity, data);
        this.$refs.detail.scrollIntoViewIfNeeded();
      });
    },
    showDelModule(entity) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "该操作不可回退，确定继续？",
        onOk: (action, instance) => {
          whisperingNewModuleApi.del(entity.id).then(() => {
            this.listAndDetail(0);
          });
        }
      });
    },
    // 显示排序
    showSortableNode(list, title) {
      if (list.length > 1) {
        this.sort.list = list;
        this.sort.title = title;
        this.sort.show = true;
      } else {
        this.info("数据至少有两条才能排序");
      }
    },
    // 执行排序
    sortList(list) {
      if (JSON.stringify(list) !== JSON.stringify(this.sort.list)) {
        let oldList = this.sort.list;
        this.sort.list = list;
        whisperingNewNodeApi.sort(list).then(
          () => {
            this.success(`${this.sort.title}成功`);
            this.listAndDetail();
          },
          err => {
            this.sort.list = oldList;
            Promise.reject(err);
          }
        );
      }
    },
    afterSubmitKey() {
      this.showWhisperingNode(
        this.detail.entity,
        this.detail.entity.moduleTitle
      );
    }
  }
};
</script>
