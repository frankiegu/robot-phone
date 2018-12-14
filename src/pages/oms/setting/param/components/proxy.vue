<template>
  <div class="pb-20">
    <h2 class="panel-tit panel-tit-primary">代理费用设置</h2>
    <Form class="mt-20 clear"
          inline
          :label-width="80"
          :model="param.entity"
          :rules="param.rules"
          ref="paramForm">
      <Row>
        <i-col :span="8">
          <FormItem label="金牌代理"
                    prop="goldPrice">
            <i-input placeholder="请输入价格"
                     v-model.trim="param.entity.goldPrice"
                     :maxlength="8" />
          </FormItem>
          <span class="ivu-form-item-append">元/端口</span>
        </i-col>
        <i-col :span="8">
          <FormItem label="银牌代理"
                    prop="silverPrice">
            <i-input placeholder="请输入价格"
                     v-model.trim="param.entity.silverPrice" />
          </FormItem>
          <span class="ivu-form-item-append">元/端口</span>
        </i-col>
        <i-col :span="8">
          <FormItem label="铜牌代理"
                    prop="copperPrice">
            <i-input placeholder="请输入价格"
                     v-model.trim="param.entity.copperPrice" />
          </FormItem>
          <span class="ivu-form-item-append">元/端口</span>
        </i-col>
      </Row>
      <div class="form-btns">
        <Button type="primary"
                @click="updateParam">确定</Button>
      </div>
    </Form>
    <h2 class="panel-tit panel-tit-primary">代理端口数量</h2>
    <Row class="mt-20"
         :gutter="30">
      <i-col :span="12">
        <cube title="一线城市"
              :list="proxyPort.entity.firstTierCity"
              ref="firstTierCity" />
      </i-col>
      <i-col :span="12">
        <cube title="二线城市"
              :list="proxyPort.entity.secondTierCity"
              ref="secondTierCity" />
      </i-col>
    </Row>
    <Row class="mt-20"
         :gutter="30">
      <i-col :span="12">
        <cube title="三线城市"
              :list="proxyPort.entity.thirdTierCity"
              ref="thirdTierCity" />
      </i-col>
      <i-col :span="12">
        <cube title="四线城市"
              :list="proxyPort.entity.fourthTierCity"
              ref="fourthTierCity" />
      </i-col>
    </Row>
    <p class="help-block mt-20">提示：该设置为不同等级代理商每张卡的代理费用，不同等级的城市在相同类型代理的</p>
    <div class="form-btns">
      <Button type="primary"
              @click="updateProxyPort">确定</Button>
    </div>
  </div>
</template>

<script>
import systemConfigApi from '@/api/oms/systemConfig'
import Cube from './components/cube'
import { currencyValidator } from '@/assets/javascripts/asyncValidator/validators'

export default {
  components: {
    Cube
  },
  data() {
    return {
      proxyPort: {
        entity: {
          firstTierCity: [],
          secondTierCity: [],
          thirdTierCity: [],
          fourthTierCity: []
        }
      },
      param: {
        entity: {
          // 金牌代理单价
          goldPrice: 0,
          // 银牌代理单价
          silverPrice: 0,
          // 铜牌代理单价
          copperPrice: 0
        },
        rules: {
          goldPrice: [
            { required: true, message: '请输入金牌代理端口价格' },
            { validator: currencyValidator, message: '请输入合法的价格' }
          ],
          silverPrice: [
            { required: true, message: '请输入银牌代理端口价格' },
            { validator: currencyValidator, message: '请输入合法的价格' }
          ],
          copperPrice: [
            { required: true, message: '请输入铜牌代理端口价格' },
            { validator: currencyValidator, message: '请输入合法的价格' }
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
      systemConfigApi.getProxyPort().then(data => {
        this.proxyPort.entity = data
      })
      systemConfigApi.getSystemParam().then(data => {
        this.param.entity = data.proxyPriceInfo
      })
    },
    updateParam() {
      this.$refs.paramForm.validate().then(valid => {
        if (valid) {
          systemConfigApi.updateSystemParam({
            proxyPriceInfo: this.param.entity
          }).then(() => {
            this.success('保存成功')
          })
        }
      })
    },
    updateProxyPort() {
      Promise.all([
        this.$refs.firstTierCity.validate(),
        this.$refs.secondTierCity.validate(),
        this.$refs.thirdTierCity.validate(),
        this.$refs.fourthTierCity.validate()
      ]).then(() => {
        systemConfigApi.updateProxyPort(this.proxyPort.entity).then(() => {
          this.success('保存成功')
        })
      }, error => {
        this.warning(error.message)
      })
    }
  }
}
</script>
