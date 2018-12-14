<template>
  <div class="pb-20">
    <h2 class="panel-tit panel-tit-primary">代理返利设置</h2>
    <Form class="mt-20 clear"
          :label-width="100"
          :model="param.entity"
          :rules="param.rules"
          ref="paramForm">
      <FormItem label="年返"
                prop="yearRatio">
        <i-input placeholder="请输入"
                 style="width: 400px;"
                 v-model.trim="param.entity.yearRatio"
                 :maxlength="8">
          <span slot="prepend">年采购端口数超过代理指标</span>
          <span slot="append">%，给予返利</span>
        </i-input>
      </FormItem>
      <FormItem label="季返"
                prop="quarterlyRatio">
        <i-input placeholder="请输入"
                 style="width: 500px;"
                 v-model.trim="param.entity.quarterlyRatio"
                 :maxlength="8">
          <span slot="prepend">季度采购端口数超过代理指标四分之一的</span>
          <span slot="append">%，给予返利</span>
        </i-input>
      </FormItem>
      <div class="form-btns">
        <Button type="primary"
                @click="updateParam">确定</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import systemConfigApi from '@/api/oms/systemConfig'
import { doubleValidator, maxValidator, minValidator } from '@/assets/javascripts/asyncValidator/validators'

export default {
  data() {
    return {
      param: {
        entity: {
          yearRatio: 0,
          quarterlyRatio: 0
        },
        rules: {
          yearRatio: [
            { required: true, message: '请输入年返比例' },
            { validator: doubleValidator, message: '请输入合法的年返比例' },
            { validator: maxValidator, max: 100, message: '年返比例必须介于[0, 100]' },
            { validator: minValidator, min: 0, message: '年返比例必须介于[0, 100]' }
          ],
          quarterlyRatio: [
            { required: true, message: '请输入季返比例' },
            { validator: doubleValidator, message: '请输入合法的季返比例' },
            { validator: maxValidator, max: 100, message: '季返比例必须介于[0, 100]' },
            { validator: minValidator, min: 0, message: '季返比例必须介于[0, 100]' }
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
        this.param.entity = data.proxyRebateInfo
      })
    },
    updateParam() {
      this.$refs.paramForm.validate().then(valid => {
        if (valid) {
          systemConfigApi.updateSystemParam({
            proxyRebateInfo: this.param.entity
          }).then(() => {
            this.success('保存成功')
          })
        }
      })
    }
  }
}
</script>
