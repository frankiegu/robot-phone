<template>
  <div class="panel">
   
    <div class="panel-body">
      <p class="nodata" v-show="!entity.id">暂无数据</p>
      <Tabs v-model="tabName" v-if="entity.id">
        <TabPane label="基础信息" name="info" style="padding: 0 5px;">
          <info-tab-pane :data="entity" v-if="tabName === 'info'">
            <template slot="checkStatus" slot-scope="scope">
              <span class="c-warning" v-if="scope.entity.isChange === 1">话术已变更，请提交审核，审核通过前可以继续使用原版话术</span>
              <template v-else>
                <span class="c-warning" v-show="scope.entity.checkStatus === 0">待审核</span>
                <span class="c-success" v-show="scope.entity.checkStatus === 1">已通过</span>
                <span class="c-danger" v-show="scope.entity.checkStatus === 2">已拒绝</span>
              </template>
            </template>
          </info-tab-pane>
        </TabPane>
        <TabPane label="工单" name="workorder" style="padding: 0 5px;">
          <work-Order :data="entity" v-if="tabName === 'workorder'"></work-Order>
        </TabPane>
        <TabPane label="问答管理" name="question" v-if="entity.owner === 2" style="padding: 0 5px;">
          <question-tab-pane :data="entity" v-if="tabName === 'question'" @updated="updatedInfo"/>
        </TabPane>
        <TabPane label="操作日志" name="log" v-if="entity.owner === 2" style="padding: 0 5px;">
          <log-tab-pane :data="entity" v-if="tabName === 'log'"/>
        </TabPane>
        <TabPane label="问题学习" name="study" v-if="entity.owner === 2" style="padding: 0 5px;">
          <study-tab-pane :data="entity" v-if="tabName === 'study'"/>
        </TabPane>
        <TabPane label="模拟训练" name="train" style="padding: 0 5px;">
          <talk v-if="tabName === 'train'" :whisperingId="entity.id" :title="entity.title"/>
        </TabPane>
        
         <div slot="extra" class="panel-header-tools" v-if="entity.id">
        <!-- 共享话术可以复制为企业话术 -->
        <Button type="primary" @click="showCopy" v-if="entity.owner === 1 && entity.isCopy === 1">复制</Button>
        <template v-if="entity.owner === 2">
          <Button type="primary" @click="showForm">编辑</Button>
          <Button type="error" @click="showDel(entity.id)">删除话术</Button>
        </template>
        <export-whispering :data="entity" isNew v-if="entity.isDownload === 1"/>
        <Button type="primary" @click="commit" v-if="entity.isChange === 1">提交审核</Button>
      </div>
      </Tabs>
    </div>

    <!-- 复制话术 -->
    <Modal v-model="copy.show" title="复制话术">
      <copy
        :data="copy.entity"
        @after-submit="afterSubmitCopy"
        @on-cancel="cancelCopy"
        v-if="copy.show"
      />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { detailMixin } from "@/mixins";
import { ExportWhispering } from "@/components/packages/common/whispering";
import {
  Copy,
  InfoTabPane,
  LogTabPane,
  QuestionTabPane,
  workOrder
} from "@/components/packages/common/whisperingNew";
import StudyTabPane from "./components/detail/studyTabPane";
import whisperingNewApi from "@/api/common/whisperingNewApi";
import Talk from "@/components/packages/common/talk";
import { downloadFile } from "@/util";

export default {
  mixins: [detailMixin],
  components: {
    InfoTabPane,
    LogTabPane,
    QuestionTabPane,
    workOrder,
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
      if (entity.owner !== 2) {
        this.tabName = "info";
      }
    },
    toggleFullScreen() {
      this.$emit("toggleFullScreen", !this.fullScreen);
    },
    showDel(id) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "删除操作不可恢复，确认继续删除?",
        onOk: (action, instance) => {
          whisperingNewApi.del(id).then(() => {
            this.success("删除成功");
            this.$emitBus("ems.whisperingNew.list.delete");
          });
        }
      });
    },
    showForm() {
      this.$emit("showForm", this.entity.id);
    },
    commit() {
      whisperingNewApi.commit(this.entity.id).then(() => {
        this.success("提交审核成功");
        this.$emitBus("ems.whisperingNew.list.update");
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
      this.$emitBus("ems.whisperingNew.list.update");
    },
    updatedInfo() {
      this.$emitBus("ems.whisperingNew.list.update");
    },
    showTalk() {
      this.talk.show = true;
    },
    exportXls() {
      whisperingNewApi.exportXls(this.entity.id).then(data => {
        this.success("导出成功");
        downloadFile(data, `${this.entity.title}.xls`);
      });
    }
  }
};
</script>
