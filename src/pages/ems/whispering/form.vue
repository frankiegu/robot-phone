<template>
  <Tabs v-model="tabName" type="card" :animated="false">
    <TabPane label="基础信息" name="info">
      <whispering
        v-if="tabName === 'info'"
        :data="entity"
        ref="myWhispering"
        @on-cancel="cancelWhispering"
        @after-submit="afterSubmitWhispering"
      />
    </TabPane>
    <TabPane label="话术流程" name="node" :disabled="!entity.id">
      <whispering-flow v-if="tabName === 'node'" :data="entity"/>
    </TabPane>
  </Tabs>
</template>

<script>
import { formMixin } from "@/mixins";
import Whispering from "./components/form/whispering";
import WhisperingFlow from "./components/form/whisperingFlow";

export default {
  mixins: [formMixin],
  components: {
    Whispering,
    WhisperingFlow
  },
  data() {
    return {
      tabName: "info"
    };
  },
  methods: {
    getsubmit(){
      this.$refs.myWhispering.mysubmit();
    },
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
