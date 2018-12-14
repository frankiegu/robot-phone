<template>
  <div>
    <whispering-flow :data="whispering.entity" />
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'
import whisperingApi from '@/api/ems/whispering'
import { WhisperingFlow } from '@/components/packages/common/whisperingNew'

export default {
  mixins: [detailMixin],
  components: {
    WhisperingFlow
  },
  data() {
    return {
      whispering: {
        entity: {}
      }
    }
  },
  methods: {
    afterEntity(entity) {
      whisperingApi.get(entity.whisperingId).then(data => {
        this.whispering.entity = data
      })
    }
  }
}
</script>
