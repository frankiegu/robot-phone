<template>
  <div class="task-detail">
    <div class="cf">
      <div class="dib">
        <h1>{{entity.wordName}}</h1>
        <sub>ID: {{entity.id}}</sub>
      </div>
    </div>
    <hr class="mt-20">
    <div class="mt-20">
      <Row>
        <i-col span="16">
          <p>创建时间：{{entity.createTime | date}}</p>
        </i-col>
      </Row>
      <Row>
        <i-col span="16">
          <p>是否读取：{{statusMap[entity.status]}}</p>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'
import wordDbApi from '@/api/sms/wordDb'
import wordDbEventBus from '../../src/wordDbEventBus'

export default {
  mixins: [detailMixin],
  data() {
    return {
      statusMap: { '0': '否', '1': '是' }
    }
  }
}
</script>