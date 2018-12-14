<template>
  <div class="task-detail">
    <div class="cf">
      <div class="dib">
        <h1>{{entity.name}}</h1>
        <sub>ID: {{entity.id}}</sub>
      </div>
      <div class="fr">
        <div class="mb10">状态：{{statusMap[entity.status]}}</div>
        <i-switch v-model="entity.status"
                  size="large"
                  :true-value="1"
                  :false-value="0"
                  @on-change="handlerChangeStatus">
          <span slot="open">启用</span>
          <span slot="close">禁用</span>
        </i-switch>

      </div>
    </div>
    <hr class="mt20">
    <div class="mt20">
      <div class="mb10">审核状态：
        <span class="c-info"
              v-if="entity.isCheck === 0">待审核</span>
        <span class="c-success"
              v-else-if="entity.isCheck === 1">审核通过</span>
        <span class="c-warning"
              v-else-if="entity.isCheck === 2">审核拒绝</span>
      </div>
      <div class="mb10">审核结果：{{entity.reason}}</div>
      <div class="mb10">模板分类：{{typeMap[entity.type]}}</div>
      <div class="mb10">创建时间：{{entity.createTime | date}}</div>
      <div class="mb10">短信内容：{{entity.content}}</div>
    </div>
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'
import messageTemplateApi from '@/api/sms/messageTemplate'
import messageEventBus from '../../src/messageEventBus'

export default {
  mixins: [detailMixin],
  data() {
    return {
      statusMap: { '0': '禁用', '1': '启用' },
      typeMap: { '1': '初筛推送短信', '2': '命中关键字短信' }
    }
  },
  methods: {
    getApi() {
      return messageTemplateApi
    },
    // 更新状态
    handlerChangeStatus(status) {
      let tmp = this.entity
      let params = {
        "id": tmp.id,
        "status": status
      }
      this.getApi().updateTemplateStatus(params).then(data => {
        this.$Message.success('操作成功')
        messageEventBus.$emit('list.update')
      })
    }
  }
}
</script>