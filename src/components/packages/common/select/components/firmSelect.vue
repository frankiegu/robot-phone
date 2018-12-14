<template>
  <span>
    <Select v-model="computedValue"
            v-bind="options"
            :placeholder="placeholder"
            :clearable="clearable"
            :filterable="filterable"
            @on-change="change"
            v-show="list.length">
      <Option v-for="v in list"
              :value="v.id"
              :key="v.id">{{ v.label }}</Option>
    </Select>
    <p class="nodata"
       v-show="list.length === 0">{{nodataText}}</p>
  </span>
</template>

<script>
import selectMixin from '@/components/packages/ems/select/components/selectMixin'
import adminInfoApi from '@/api/common/adminInfoApi'

export default {
  mixins: [selectMixin],
  props: {
    platformId: {
      default: ''
    }
  },
  watch: {
    platformId() {
      this.refresh()
    }
  },
  methods: {
    getData() {
      if (this.platformId) {
        return adminInfoApi.listFirm({ id: this.platformId }).then(data => {
          return data.map(v => {
            return {
              id: v.id,
              label: `${v.name}`,
              data
            }
          })
        })
      }
      return Promise.resolve([])
    }
  }
}
</script>
