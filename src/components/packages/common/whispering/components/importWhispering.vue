<template>
  <span>
    <Dropdown>
      <Button  type="primary">
        <Icon type="md-add" />
        新建话术
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem @click.native="createWhispering">创建话术</DropdownItem>

        <DropdownItem @click.native="downloadWhisperingImportTemplate"
                      divided>下载导入模板</DropdownItem>
        <DropdownItem @click.native="showImportWhispering">导入话术</DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <Modal v-model="importZip.show"
           title="导入话术">
      <div>
        <ms-upload :action="importZip.action"
                   accept="application/zip"
                   :format="['zip']"
                   :limit="1"
                   @change="afterImportWhispering">
          <p slot="tip"
             style="margin-top: 10px;">请下载导入模板，参照模板格式上传文件，只允许zip格式<br />导入过程较慢，请耐心等待，不要重复导入</p>
        </ms-upload>
      </div>
      <div slot="footer"></div>
    </Modal>
  </span>
</template>

<script>
import { detailMixin } from '@/mixins'
import whisperingNewApi from '@/api/common/whisperingNewApi'
import whisperingApi from '@/api/common/whisperingApi'
import { downloadFile } from '@/util'
import { apiConfig } from '@/config'

export default {
  mixins: [detailMixin],
  props: {
    isNew: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      importZip: {
        show: false,
        action: this.isNew ? apiConfig.common.importWhisperingNew : apiConfig.common.importWhispering
      }
    }
  },
  methods: {
    createWhispering() {
      this.$emit('create')
    },
    downloadWhisperingImportTemplate() {
      let getTemplateFile = this.isNew ? whisperingNewApi.getTemplateFile : whisperingApi.getTemplateFile
      getTemplateFile().then(data => {
        downloadFile(data, `${this.isNew ? '新' : ''}话术模板.zip`)
      })
    },
    showImportWhispering() {
      this.importZip.show = true
    },
    afterImportWhispering() {
      this.success('导入成功')
      this.importZip.show = false
      this.$emit('afterImportWhispering')
    }
  }
}
</script>
