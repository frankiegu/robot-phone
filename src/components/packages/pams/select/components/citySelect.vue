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
import cityProxyApi from '@/api/pms/cityProxy'

export default {
  mixins: [selectMixin],
  methods: {
    getData() {
      return cityProxyApi.listProxyCity().then(data => {
        return data.map(v => {
          return {
            id: v.cityId,
            label: `${v.cityName}`,
            data
          }
        })
      })
    }
  }
}
</script>
