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
import commonApi from '@/api/common/provinceCity'

export default {
  mixins: [selectMixin],
  methods: {
    getData() {
      return commonApi.provinceList().then(data => {
        return data.map(v => {
          return {
            id: v.provinceId,
            label: `${v.provinceName}`,
            data
          }
        })
      })
    }
  }
}
</script>
