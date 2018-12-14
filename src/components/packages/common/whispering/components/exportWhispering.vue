<template>
  <span>
    <Dropdown>
      <Button type="primary">
        导出话术
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem @click.native="exportXls(0)">只导出Excel</DropdownItem>
        <DropdownItem @click.native="exportXls(1)">导出Excel和音频</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </span>
</template>

<script>
import { detailMixin } from '@/mixins'
import whisperingNewApi from '@/api/common/whisperingNewApi'
import whisperingApi from '@/api/common/whisperingApi'
import { downloadFile } from '@/util'

export default {
  mixins: [detailMixin],
  props: {
    isNew: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getApi() {
      return this.isNew ? whisperingNewApi.exportXls() : whisperingApi.exportXls()
    },
    exportXls(flag = 0) {
      let exportXls = this.isNew ? whisperingNewApi.exportXls : whisperingApi.exportXls
      exportXls(this.entity.id, flag).then(data => {
        this.success('导出成功')
        downloadFile(data, `${this.entity.title}.zip`)
      })
    }
  }
}
</script>
