<template>
  <div>
    <h1>{{entity.title}}</h1>
    <h3>创建于{{entity.createTime | date}}</h3>
    <hr class="mt-15 mb-15" />
    <div v-html="entity.content"></div>
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'

export default {
  mixins: [detailMixin]
}
</script>
