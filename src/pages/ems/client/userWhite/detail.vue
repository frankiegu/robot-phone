<template>
  <div>
    <div class="panel">
      <div class="panel-header">客户详情
        <div class="panel-header-tools" v-if="entity && entity.id && entity.type===1">
          <span @click="showEdit" class="iconWap">
            <Icon size="25" type="ios-create-outline"/>
          </span>
          <span @click="showDel(entity.id)" class="iconWap">
            <Icon size="25" color="red" type="ios-trash-outline"/>
          </span>
        </div>
      </div>
      <div class="panel-body" v-show="!entity || !entity.id">
        <p class="nodata">暂无数据</p>
      </div>
      <div class="panel-body" v-if="entity && entity.id">
        <info-tab-pane :data="entity"/>
        <task-tab-pane :data="entity"/>
      </div>
    </div>
    <!-- 弹窗 -->
     <Modal :mask-closable="false" v-model="template.show" :title="entity.id ? '编辑白名单客户' : '新增白名单客户'">
         <template v-if="template.show">
        <mod-form ref="modForms" :data="entity" @on-cancel="cancelForm" @after-submit="afterSubmitForm"></mod-form>
      </template>
      <div slot="footer">
        <i-button  style="margin-right: 8px" @click="cancelForm">取消</i-button>
        <i-button type="primary" @click="submitForm">确定</i-button>
      </div>
    </Modal>
    <!-- <ms-panel v-model="template.show" :title="entity.id ? '编辑白名单客户' : '新增白名单客户'">
      <template v-if="template.show">
        <mod-form :data="entity" @on-cancel="cancelForm" @after-submit="afterSubmitForm"></mod-form>
      </template>
    </ms-panel> -->
  </div>
</template>

<script>
import { detailMixin } from "@/mixins";
import userWhiteApi from "@/api/ems/userWhite";
import InfoTabPane from "./components/detail/infoTabPane.vue";
import TaskTabPane from "./components/detail/taskTabPane.vue";
import ModForm from "./form.vue";
import modEventBus from "./src/eventBus";

export default {
  mixins: [detailMixin],
  components: {
    InfoTabPane,
    TaskTabPane,
    ModForm
  },
  props: {
    fullScreen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tabName: "info",
      template: {
        show: false
      }
    };
  },
  methods: {
    getApi() {
      return userWhiteApi;
    },
    toggleFullScreen() {
      this.$emit("toggleFullScreen", !this.fullScreen);
    },
    showEdit() {
      this.template.show = true;
    },
    /**
     * 新增/编辑成功后执行,这次是编辑
     * @param {any} entity, 表单的数据
     * @param {any} data, 提交之后返回值
     */
    afterSubmitForm(data, entity) {
      this.template.show = false;
      modEventBus.$emit("list.update", data, entity);
    },
    submitForm(){
      this.$refs.modForms.submit();
    },
    cancelForm() {
      this.template.show = false;
    },
    showDel(id, content = "删除操作不可恢复，确认继续删除?") {
      this.$Modal.confirm({
        title: "确认删除",
        content,
        onOk: (action, instance) => {
          userWhiteApi.del(id).then(() => {
            this.success("删除成功");
            modEventBus.$emit("list.delete");
          });
        }
      });
    }
  }
};
</script>