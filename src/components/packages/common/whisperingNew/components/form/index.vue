<template>
  <Tabs type="card" v-model="tabName">
    <TabPane label="基础信息" name="info">
      <whispering
        v-if="tabName === 'info'"
        :data="entity"
        @on-cancel="cancelWhispering"
        @after-submit="afterSubmitWhispering"
        class="pd10"
      />
    </TabPane>
    <TabPane label="话术流程" name="node" :disabled="!entity.id">
      <whispering-flow v-if="tabName === 'node'" :data="entity" />
    </TabPane>
    <TabPane label="话术图谱" name="atlas" :disabled="!entity.id">
      <atlas :data="entity" class="pd10" v-if="tabName === 'atlas'"/>
    </TabPane>
  </Tabs>
</template>

<script>
import { formMixin } from "@/mixins";
import Whispering from "./whispering";
import WhisperingFlow from "./whisperingFlow";
import Atlas from "./components/atlas";

export default {
  mixins: [formMixin],
  components: {
    Whispering,
    WhisperingFlow,
    Atlas
  },
  data() {
    return {
      tabName: "info"
    };
  },
  methods: {
    afterSubmitWhispering(id) {
      this.success(this.entity.id ? "编辑话术成功" : "新增话术成功");
      if (!this.entity.id) {
        this.entity.id = id;
      }
      this.tabName = "node";
    },
    cancelWhispering() {
      this.$emit("cancel");
    }
  }
};
</script>
