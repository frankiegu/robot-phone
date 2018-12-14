<template>
  <div class="task-detail">
    <h1>{{ entity.title }}
      <div class="fr">
        <p>状态：{{ entity.status ? '启用' : '禁用' }}</p>
        <i-switch v-model="entity.status"
                  size="large"
                  :true-value="1"
                  :false-value="0"
                  @on-change="handleSwitchChange">
          <span slot="open">启用</span>
          <span slot="close">禁用</span>
        </i-switch>
      </div>
    </h1>
    <sub>ID: {{entity.id}}
      <span class="ml-20">{{entity.typeName}}</span>
    </sub>
    <hr class="mt-20">
    <div class="mt-20">
      <Row>
        <i-col span="16">
          <p>话术类型: {{ entity.owner | value(['', '共享话术', '企业话术']) }}</p>
        </i-col>
      </Row>
      <template v-if="entity.owner === 2">
        <Row>
          <i-col span="16">
            <p>所属企业: {{ entity.adminName }}</p>
          </i-col>
        </Row>
        <Row>
          <i-col span="16">
            <p>发送状态:
              <span class="c-warning"
                    v-show="entity.isSend === 0">发送中</span>
              <span v-show="entity.isSend === 1">正常</span>
            </p>
          </i-col>
        </Row>
        <Row>
          <i-col span="16">
            <p>审核状态:
              <span class="c-warning"
                    v-show="entity.checkStatus === 0">待审核</span>
              <span class="c-success"
                    v-show="entity.checkStatus === 1">已通过</span>
              <span class="c-danger"
                    v-show="entity.checkStatus === 2">已拒绝</span>
            </p>
          </i-col>
        </Row>
        <Row>
          <i-col span="16">
            <p>审核备注: {{entity.content}}</p>
          </i-col>
        </Row>
      </template>
      <Row>
        <i-col span="16">
          <p>创建时间: {{ entity.createTime | date }}</p>
        </i-col>
      </Row>
      <Row>
        <i-col span="16">
          <p>累计通话次数: {{ entity.totalCallCount || 0 }}</p>
        </i-col>
      </Row>
      <Row>
        <i-col span="16">
          <p>任务数: {{ entity.totalTaskCount || 0 }}</p>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'
import whisperingApi from '@/api/sms/whispering'
import whisperingEventBus from '../../src/whisperingEventBus'

export default {
  mixins: [detailMixin],
  methods: {
    handleSwitchChange(status) {
      whisperingApi.updateStatus({
        id: this.entity.id,
        status
      }).then(() => {
        whisperingEventBus.$emit('list.update')
      })
    }
  }
}
</script>
