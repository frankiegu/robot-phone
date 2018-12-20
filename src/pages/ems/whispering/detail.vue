<template>
  <div class="panel" style="border-radius: 0px; box-shadow: none;">
   
    <div class="panel-body">
      <p class="nodata" v-show="!entity.id">暂无数据</p>
      <Tabs v-model="tabName" v-if="entity.id">
        <TabPane label="基础信息" name="info">
          <info-tab-pane  @showForm="showForm" :data="entity" v-if="tabName === 'info'"/>
        </TabPane>
        <TabPane label="问题学习" name="study" v-if="entity.owner === 2">
          <study-tab-pane :data="entity" v-if="tabName === 'study'"/>
        </TabPane>
        
        <TabPane label="操作日志" name="log" v-if="entity.owner === 2">
          <log-tab-pane :data="entity" v-if="tabName === 'log'"/>
        </TabPane>
         <TabPane label="模拟训练" name="train">
          <talk :whisperingId="entity.id" :title="entity.title" v-if="tabName === 'train'"/>
        </TabPane>
        
        <div slot="extra" class="panel-header-tools" v-if="entity.id">
        <!-- <Button style="margin-right:10px" type="default" shape="circle" @click="showTalk">体验话术</Button> -->
        <export-whispering style="margin-right:10px" :data="entity" v-if="entity.isDownload === 1"/>
        <Button style="margin-right:10px" type="primary"  @click="commit" v-if="entity.isChange === 1">提交审核</Button>
        <!-- 共享话术可以复制为企业话术 -->
        <Button
        style="margin-right:10px"
          type="info"
          @click="showCopy"
          v-if="entity.owner === 1 && entity.isCopy === 1"
        >复制</Button>
        <template v-if="entity.owner === 2">
          <Button style="margin-right:10px" type="primary"  @click="showForm">话术编辑</Button>
          <Button type="error"   @click="showDel(entity.id)">删除话术</Button>
        </template>
      </div>
      </Tabs>
    </div>

    <!-- 复制话术 -->
    <Modal v-model="copy.show" title="复制话术">
      <copy :data="copy.entity" @after-submit="afterSubmitCopy" @on-cancel="cancelCopy"/>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { detailMixin } from "@/mixins";
import InfoTabPane from "./components/detail/infoTabPane";
import LogTabPane from "./components/detail/logTabPane";
import StudyTabPane from "./components/detail/studyTabPane";
import whisperingApi from "@/api/ems/whispering";
import whisperingEventBus from "./src/whisperingEventBus";
import Copy from "./components/detail/copy";
import Talk from "@/components/packages/common/talk";
import { ExportWhispering } from "@/components/packages/common/whispering";

export default {
  mixins: [detailMixin],
  components: {
    InfoTabPane,
    LogTabPane,
    Copy,
    StudyTabPane,
    Talk,
    ExportWhispering
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
      copy: {
        show: false,
        entity: {
          name: ""
        },
        rules: {
          name: [{ required: true, message: "请输入话术名称" }]
        }
      },
      talk: {
        show: false
      }
    };
  },
  methods: {
    afterEntity(entity) {
      this.tabName = "info";
    },
    toggleFullScreen() {
      this.$emit("toggleFullScreen", !this.fullScreen);
    },
    showDel(id) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "删除操作不可恢复，确认继续删除?",
        onOk: (action, instance) => {
          whisperingApi.del(id).then(() => {
            this.success("删除成功");
            whisperingEventBus.$emit("list.delete");
          });
        }
      });
    },
    showForm() {
      this.$emit("showForm", this.entity.id);
    },
    commit() {
      whisperingApi.commit(this.entity.id).then(() => {
        this.success("提交审核成功");
        whisperingEventBus.$emit("list.update");
      });
    },
    showCopy() {
      this.copy.entity = {
        name: this.entity.title,
        whisperingId: this.entity.id
      };
      this.copy.show = true;
    },
    cancelCopy() {
      this.copy.show = false;
    },
    afterSubmitCopy() {
      this.success("复制成功");
      this.copy.show = false;
      whisperingEventBus.$emit("list.update");
    },
    showTalk() {
      this.talk.show = true;
    }
  }
};
</script>
