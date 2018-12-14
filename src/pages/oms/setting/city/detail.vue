<template>
  <div class="panel">
    <div class="panel-header">
      <i class="icon icon-enlarge panel-header-icon" :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'" @click="toggleFullScreen"></i>
      详情
    </div>
    <div class="panel-body" v-show="!tableList.length">
      <p class="nodata">暂无数据!!</p>
    </div>
    <div class="panel-body" v-show="tableList.length">
      <p class="nodata" v-show="entity.id ">请先选择数据</p>
      <Tabs v-model="tabName" v-show="entity.id">
        <TabPane label="基础信息" name="info">
          <ms-lazy :initial="tabName === 'info'">
            <info-tab-panel :data="entity" />
          </ms-lazy>
        </TabPane>
        <TabPane label="城市代理" name="record">
          <ms-lazy :initial="tabName === 'record'">
            <city-proxy-tab-panel :data="entity" />
          </ms-lazy>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import {
    detailMixin
  } from "@/mixins";
  import InfoTabPanel from "./components/detail/infoTabPane";
  import CityProxyTabPanel from "./components/detail/cityProxyTabPane";

  export default {
    mixins: [detailMixin],
    components: {
      InfoTabPanel,
      CityProxyTabPanel
    },
    props: {
      fullScreen: {
        type: Boolean,
        default: false
      },
      tableList:''
    },
    data() {
      return {
        tabName: "info"
      };
    },
    methods: {
      toggleFullScreen() {
        this.$emit("toggleFullScreen", !this.fullScreen);
      }
    },
  };

</script>
