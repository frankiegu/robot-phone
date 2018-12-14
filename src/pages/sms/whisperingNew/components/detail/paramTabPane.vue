<template>
  <div class="panel">
    <div class="panel-body">
      <div class="pb-20">
        <h2 class="panel-tit panel-tit-primary">语音参数配置</h2>
        <Form class="mt-20 clear"
              :label-width="100"
              :model="param"
              :rules="rules"
              ref="form">
          <FormItem label="打断设置:"
                    prop="interruptTime">
            <i-input v-model.trim="param.interruptTime">
              <span slot="prepend">持续时长</span>
              <span slot="append">毫秒</span>
            </i-input>
            <p>说明：机器人说话过程中，若用户说话持续时长大于该值时，则中断说话并进行监听。该值越小，则机器人打断效果越灵敏。</p>
          </FormItem>
          <FormItem label="过滤噪音:"
                    prop="filterNoise">
            <i-input v-model.trim="param.filterNoise" />
            <p>说明：过滤噪音值得范围是0-1，该值设置越小，表示去噪音能力越弱</p>
          </FormItem>

          <FormItem>
            <!-- 五期未完成屏蔽 -->
            <Button type="primary"
                    disabled
                    @click="update">确定 (敬请期待...)</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { formMixin } from '@/mixins'
import { whisperingDetailMixin } from '@/components/packages/common/whisperingNew'
import { numberValidator, doubleValidator, minValidator, maxValidator } from '@/assets/javascripts/asyncValidator/validators'
import whisperingNewApi from '@/api/common/whisperingNewApi'

export default {
  mixins: [formMixin, whisperingDetailMixin],
  data() {
    return {
      param: {
        interruptTime: 20000,
        filterNoise: 0.2
      },
      rules: {
        interruptTime: [
          { required: true, message: '请输入打断设置时长' },
          { validator: numberValidator },
          { validator: minValidator, min: 500, message: '打断时长不能低于500毫秒' },
          { validator: maxValidator, max: 30000, message: '打断时长不能大于30秒' }
        ],
        filterNoise: [
          { required: true, message: '请输入过滤噪音时长' },
          { validator: doubleValidator },
          { validator: minValidator, min: 0, message: '过滤噪音时长为0-1之间的数值' },
          { validator: maxValidator, max: 1, message: '过滤噪音时长为0-1之间的数值' }
        ]
      }
    }
  },
  mounted() {
    this.refreshTaskDetail(this.data)
  },
  methods: {
    refreshTaskDetail(entity) {
      whisperingNewApi.getParam(entity.id).then(data => {
        this.param = Object.assign({}, this.param, data)
      })
    },
    update() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          let entity = Object.assign({}, this.param)
          whisperingNewApi.updateParam(entity).then(data => {
            this.success('更新成功')
          })
        }
      })
    }
  }
}
</script>
