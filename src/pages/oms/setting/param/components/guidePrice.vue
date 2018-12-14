<template>
  <div class="pb-20">
    <h2 class="panel-tit panel-tit-primary">官方指导价设置</h2>
    <Form class="mt-20 clear"
          inline
          :model="param.entity"
          :rules="param.rules"
          :label-width="100"
          ref="paramForm">
      <Row>
        <i-col :span="8">
          <FormItem label="官方指导价"
                    prop="guidePrice">
            <i-input placeholder="请输入"
                     v-model.trim="param.entity.guidePrice"
                     :maxlength="8" />
          </FormItem>
          <span class="ivu-form-item-append">元/张卡</span>
        </i-col>
      </Row>
      <div class="form-btns">
        <Button type="primary"
                @click="updateParam">确定</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import systemConfigApi from '@/api/oms/systemConfig'
import { doubleValidator, minValidator } from '@/assets/javascripts/asyncValidator/validators'

export default {
  data() {
    return {
      param: {
        entity: {
          guidePrice: 0
        },
        rules: {
          guidePrice: [
            { required: true, message: '请输入官方指导价' },
            { validator: doubleValidator, message: '请输入合法的官方指导价' },
            { validator: minValidator, min: 0, message: '官方指导价必须大于等于0' }
          ]
        }
      }
    }
  },
  created() {
    this.initReady()
  },
  methods: {
    initReady() {
      systemConfigApi.getSystemParam().then(data => {
        this.param.entity = data.guidePriceInfo
      })
    },
    updateParam() {
      this.$refs.paramForm.validate().then(valid => {
        if (valid) {
          systemConfigApi.updateSystemParam({
            guidePriceInfo: this.param.entity
          }).then(() => {
            this.success('保存成功')
          })
        }
      })
    }
  }
}
</script>
