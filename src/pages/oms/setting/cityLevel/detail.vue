<template>
  <div class="panel">
    <div class="panel-header">
      <i class="icon icon-enlarge panel-header-icon"
         :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'"
         @click="toggleFullScreen"></i>
      详情
      <div class="panel-header-tools"
           v-if="entity.level">
        <Button type="primary"
                @click="showForm(entity)">编辑</Button>
      </div>
    </div>
    <div class="panel-body">
      <p class="nodata"
         v-show="!entity.level">请先选择数据</p>
      <Tabs v-model="tabName"
            v-show="entity.level">
        <TabPane label="城市列表"
                 name="city">
          <ms-lazy :initial="tabName === 'city'">
            <city-tab-panel :data="entity" />
          </ms-lazy>
        </TabPane>
        <TabPane label="代理商列表"
                 name="proxy">
          <ms-lazy :initial="tabName === 'proxy'">
            <proxy-tab-panel :data="entity" />
          </ms-lazy>
        </TabPane>
      </Tabs>
    </div>

    <ms-panel v-model="form.show"
              :title="formTitle">
      <template v-if="form.show">
        <mod-form :data="form.entity"
                  @on-cancel="cancelForm"
                  @after-submit="afterSubmitForm" />
      </template>
    </ms-panel>

  </div>
</template>

<script>
import { detailMixin } from '@/mixins'
import CityTabPanel from './components/detail/cityTabPane'
import ProxyTabPanel from './components/detail/proxyTabPane'
import ModForm from './form'
import systemConfigApi from '@/api/oms/systemConfig'

export default {
  mixins: [detailMixin],
  components: {
    CityTabPanel,
    ProxyTabPanel,
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
      tabName: 'city',
      form: {
        show: false,
        entity: {}
      }
    }
  },
  computed: {
    formTitle() {
      return `编辑${['', '一级', '二级', '三级', '四级'][this.entity.level]}城市等级`
    }
  },
  methods: {
    toggleFullScreen() {
      this.$emit('toggleFullScreen', !this.fullScreen)
    },
    showForm(entity) {
      this.form.entity = entity
      this.form.show = true
    },
    cancelForm() {
      this.form.show = false
    },
    afterSubmitForm() {
      this.$emit('after-update')
      this.form.show = false
    }
  }
}
</script>
