<template>
  <div>
    <Breadcrumb separator=">">
      <span class="home" @click="linkTo('pamsHomeIndex')">
        <BreadcrumbItem>首页</BreadcrumbItem>
      </span>
      <BreadcrumbItem>财务统计</BreadcrumbItem>
    </Breadcrumb>
    <div class="panel pl-20 pr-20 pt-10" style="height: calc(100vh - 125px);margin:0;
    overflow: auto;">
      <Tabs v-model="tabName">
        <TabPane label="端口记录" name="name1">
          <port v-if="tabName=='name1'"></port>
        </TabPane>
        <TabPane label="财务统计" name="name2">
          <finance v-if="tabName=='name2'"></finance>
        </TabPane>
    </Tabs>
    </div>
  </div>
</template>

<script>
import Util from "@/util/util";
import port from "./components/port"
import finance from "./components/finance"
export default {
  data() {
    return {
      tabName:'name1'
    };
  },
  components: {
    port,
    finance
  },
  methods: {
    linkTo(name) {
      Util.openPage(this, name);
    }
  }
};
</script>

<style>
</style>
