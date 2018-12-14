<template>
  <Form :label-width="90"
        style="overflow: hidden;"
        ref="form">
    <div class="block">
      <div class="block-header clear">
        <div class="fr">
          <Button type="primary"
                  size="small"
                  @click="showUpdateKey">编辑</Button>
        </div>
        <b>关键字</b>
      </div>
      <div class="block-body">
        <Row>
          <i-col :span="24">
            <FormItem prop="keys"
                      :label-width="1">
              <div v-show="keys.length">
                <div class="tag-container">
                  <Tag type="border"
                       :closable="false"
                       v-for="(v, i) in keys"
                       :key="i">{{v}}</Tag>
                </div>
              </div>
              <p class="nodata"
                 v-show="keys.length === 0">暂无关键字</p>
            </FormItem>
          </i-col>
        </Row>
      </div>
    </div>
  </Form>
</template>

<script>
import { detailMixin } from '@/mixins'

export default {
  mixins: [detailMixin],
  computed: {
    keys() {
      return (this.entity.keyWord && this.entity.keyWord.split(',')) || []
    }
  },
  methods: {
    showUpdateKey() {
      this.$emit('showUpdateKey', this.entity)
    }
  }
}
</script>
