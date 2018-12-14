<template>
 
    <div>
      <div class="panel" style="border-radious:0;box-shadow:none">
        <!-- <div class="panel-header">
          <div class="panel-header-tools">
            <Icon type="close"
                  class="panel-close"
                  @click.native="close"></Icon>
          </div>
          <b>体验话术
            <span v-show="title">({{title}})</span>
          </b>
        </div> -->
        <div class="panel-body2">
          <talk :whisperingId="whisperingId"
                @exportImg="exportImg" />
        </div>
      </div>
    </div>
</template>

<script>
import talk from './components/talk'
import PopupManager from '@/components/libs/popupManager'
import html2canvas from 'html2canvas'
import { downloadBase64Img } from '@/util'

export default {
  components: {
    talk
  },
 
  props: {
    whisperingId: {
      required: true
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      zIndex: 1,
      onExportIng: false
    }
  },
  
  methods: {
    close() {
      if (this.onExportIng === false) {
        this.$emit('model', false)
      }
    },
    exportImg(el) {
      this.onExportIng = true
      html2canvas(el).then(canvas => {
        downloadBase64Img(canvas.toDataURL(), '体验话术.jpg')
        this.onExportIng = false
      })
    }
  }
}
</script>
