<template>
  <div>
    <i-form :label-width="120"
            :data="entity"
            :rules="rules"
            :model="entity"
            ref="form">
      <FormItem label="模板内容"
                prop="content">
        <i-input :rows="4"
                 type="textarea"
                 :maxlength="420"
                 v-model.trim="entity.content"></i-input>
        <p class="c-info">占用短信数(70字/条)：{{Math.ceil(entity.content.length/70)}} 条</p>
        <p class="c-warning help-block">禁止发送内容：色情、赌博、毒品、党政、维权、众筹、慈善募捐、宗教、迷信、股票、移民、面试招聘(通知面试也不发）、博彩、贷款、催款、信用卡提额、投资理财、中奖、抽奖、一元夺宝、一元秒杀、A货、整形、烟酒、交友、暴力、恐吓、皮草、返利、代开发票、代理注册、代办证件、加群、加QQ或者加微信、贩卖个人信息、运营商策反、流量营销\微信红包等信息的短信</p>
        <p class="c-danger">短信模板需过运营商审核，审核时间可能比较久，平均时间二到三个工作日</p>
      </FormItem>
      <FormItem>
        <i-button type="ghost"
                  style="margin-right: 8px"
                  @click="cancel">取消</i-button>
        <i-button type="primary"
                  @click="submit">确定</i-button>
      </FormItem>
    </i-form>
  </div>
</template>

<script>
import { formMixin } from '@/mixins'
import entity from './src/entity'
import messageTemplateApi from '@/api/sms/messageTemplate'


export default {
  mixins: [formMixin],
  data() {
    return {
      entity: entity(),
      title: '',
      typeMap: { "1": "初筛推送短信", "2": "命中指定特殊词语(短信，微信，信息)短信" },
      rules: {
        type: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { type: 'string', max: 20, message: '不能超过20个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { type: 'string', max: 420, message: '不能超过100个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getApi() {
      return messageTemplateApi
    }
  }
}
</script>