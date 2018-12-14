<template>
  <Form ref="form"
        :entity="entity"
        :rules="rules"
        :label-width="80">
    <Row>
      <i-col :span="24">
      <!-- 五期未完成屏蔽
        <info :data="entity"
              showLabel
              showPriority
              showTogether
              showKeyWord
              ref="info">
          <FormItem label="跳转主流程"
                    prop="nextNodeId">
            <Select v-model="entity.nextNodeId"
                    clearable
                    transfer
                    placeholder="请选择">
              <Option v-for="v in mainModuleList"
                      :key="v.id"
                      :value="v.id">{{v.name}}</Option>
            </Select>
          </FormItem>
        </info>
        -->
        <info :data="entity"
              showKeyWord
              ref="info" />
      </i-col>
    </Row>
  </Form>
</template>

<script>
import { formMixin } from '@/mixins'
import Info from '@/components/packages/common/whisperingNew/components/form/components/whisperingNode/components/form/info'
import whisperingNewNodeApi from '@/api/common/whisperingNewNodeApi'
import whisperingNewQuestionApi from '@/api/common/whisperingNewQuestionApi'

export default {
  mixins: [formMixin],
  components: {
    Info
  },
  data() {
    return {
      mainModuleList: []
    }
  },
  methods: {
    initData(resolve) {
      whisperingNewNodeApi.listModule({
        whisperingId: this.data.whisperingId,
        module: 1
      }).then(data => {
        this.mainModuleList = data
        resolve()
      })
    },
    submit() {
      this.$refs.info.validate().then(info => {
        info.nextNodeId = this.entity.nextNodeId
        whisperingNewQuestionApi.saveOrUpdate(info).then(data => {
          this.$emit('after-submit', data, info)
        })
      }).catch(err => { })
    }
  }
}
</script>
