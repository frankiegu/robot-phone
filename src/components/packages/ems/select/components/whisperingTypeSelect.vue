<template>
  <span>
    <Select v-model="computedValue"
            v-bind="options"
            :placeholder="placeholder"
            :style="{width: widths}"
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
import selectMixin from './selectMixin'
import whisperingTypeApi from '@/api/ems/whisperingType'

export default {
  mixins: [selectMixin],
  methods: {
    getData() {
      return whisperingTypeApi.list({
        pageNum: 1,
        pageSize: 99999999
      }).then(data => {
        return data.dataList.map(v => {
          return {
            id: v.id,
            label: `${v.name}`,
            data
          }
        })
      })
    }
  }
}
</script>
