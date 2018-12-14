<template>
  <div class="task-detail" style="padding-left:18px;">
    <!-- <h1>{{ entity.title }}
      <div class="fr">
        <p>状态：{{ entity.status ? '启用' : '禁用' }}</p>
      </div>
    </h1> -->
    <div class="mt-20">
      <Row>
        <i-col span="16">
          <p>ID: {{entity.id}}</p>
        </i-col>
      </Row>
      <Row>
        <i-col span="16">
          <p>话术类型: {{ entity.owner | value(['', '共享话术', '企业话术']) }}</p>
        </i-col>
      </Row>
        <Row>
        <i-col span="16">
          <p>状态：{{ entity.status ? '启用' : '禁用' }}</p>
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
      <template v-if="entity.owner === 2">
        <Row>
          <i-col span="16">
            <p>所属企业: {{ entity.adminName }}</p>
          </i-col>
        </Row>
        <Row>
          <i-col span="16">
            <p>审核状态:
              <span class="c-warning"
                    v-if="entity.isChange === 1">
                话术已变更，请提交审核，审核通过前可以继续使用原版话术
              </span>
              <template v-else>
                <span class="c-warning"
                      v-show="entity.checkStatus === 0">待审核</span>
                <span class="c-success"
                      v-show="entity.checkStatus === 1">已通过</span>
                <span class="c-danger"
                      v-show="entity.checkStatus === 2">已拒绝</span>
              </template>
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
      <!-- <Button style="margin-right:10px" type="primary" shape="circle" @click="showForm">编辑</Button> -->
    </div>
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'
export default {
  mixins: [detailMixin],
  methods:{
     showForm() {
      this.$emit("showForm", this.entity.id);
    }
  }
}
</script>
