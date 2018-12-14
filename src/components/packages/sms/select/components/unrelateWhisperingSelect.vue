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
import * as firmApi from '@/api/sms/firm'

export default {
  mixins: [selectMixin],
  props: {
    firmId: {
      default: ''
    }
  },
  methods: {
    getData() {
      return firmApi.listUnrelateWhispering({
        id: this.firmId,
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
