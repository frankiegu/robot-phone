<template>
  <div>
    <i-form :label-width="120"
            :model="entity"
            :rules="rules"
            class="mr30"
            ref="form"
            style="width: 500px; margin: 0 auto;">
      <Form-item label="企业名称："
                 prop="name">
        <i-input v-model="entity.name"
                 type="text"
                 placeholder="请输入企业名称"></i-input>
      </Form-item>

      <Form-item label="企业账号："
                 prop="account">
        <i-input v-model="entity.account"
                 type="text"
                 placeholder="请输入企业账号"></i-input>
        <div class="fc-gray">提示：同时支持账号和绑定手机号登录</div>
      </Form-item>

      <Form-item label="绑定手机号："
                 prop="mobile">
        <i-input v-model="entity.mobile"
                 type="text"
                 placeholder="请输入绑定手机号"></i-input>
      </Form-item>

      <Form-item label="验证码："
                 prop="verifCode">
        <i-input v-model="entity.verifCode"
                 type="text"
                 placeholder="请输入手机验证码"
                 class="w260"></i-input>
        <i-button type="primary"
                  @click="handlerSendCode"
                  :disabled="!!this.resendSecond">{{codeButtonText}}</i-button>
      </Form-item>

      <Form-item label="设账号密码："
                 prop="password">
        <i-input v-model="entity.password"
                 type="password"
                 placeholder="请输入密码"></i-input>
      </Form-item>

      <FormItem label="头像:"
                prop="headUrl">
        <ms-image-upload v-model="entity.headUrl" />
      </FormItem>

      <Form-item label="联系人：">
        <i-input v-model="entity.contactsName"
                 type="text"
                 placeholder="请输入联系人"></i-input>
      </Form-item>

      <Form-item label="联系电话：">
        <i-input v-model="entity.contactsMobile"
                 type="text"
                 placeholder="请输入联系电话"></i-input>
      </Form-item>

      <Form-item label="联系地址：">
        <i-input v-model="entity.contactsAddress"
                 type="text"
                 placeholder="请输入联系地址"></i-input>
      </Form-item>
      <Form-item label="备注：">
        <i-input v-model="entity.remarks"
                 type="textarea"
                 placeholder="请输入备注"></i-input>
      </Form-item>
    </i-form>
    <div class="tc">
      <i-button type="primary"
                @click="handlerSave">确定</i-button>
      <i-button @click="handlerCancel">取消</i-button>
    </div>
  </div>
</template>

<script>
import commonApi from "@/api/common/adminInfoApi";
const entity = {
  account: '',
  contactsAddress: '',
  contactsMobile: '',
  contactsName: '',
  mobile: '',
  name: '',
  password: '',
  remarks: '',
  verifCode: '',
  headUrl: ''
}

export default {
  props: {
    entry: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const validateMobile = (rules, value, callback) => {
      let rgx = /^1\d{10}$/
      if (!rgx.test(value)) {
        callback(new Error('请输入正确手机号码'))
      } else {
        callback()
      }
    }

    return {
      entity: { ...entity },
      resendSecond: 0,
      timer: null,
      rules: {
        name: [{ required: true, message: '必填项' }],
        account: [{ required: true, message: '必填项' }],
        password: [{ required: true, message: '必填项' }],
        mobile: [
          { required: true, message: '必填项' },
          { validator: validateMobile },
        ],
        verifCode: [{ required: true, message: '验证码不能为空' }]
      },
    }
  },
  computed: {
    codeButtonText() {
      return this.resendSecond ? `${this.resendSecond}s后重新获取` : `发送验证码`
    },
  },
  watch: {
    'entry': {
      handler(n) {
        this.entity = Object.assign({}, entity, n)
      },
      deep: true
    },

  },
  methods: {
    handlerSendCode() {
      this.$refs.form.validateField('mobile', (error) => {
        if (error) {
          return
        }
        commonApi.sendMsg(this.entity.mobile)
        this.resendSecond = 60
        this.timer = setInterval(() => {
          if (this.resendSecond == 0) {
            return clearInterval(this.timer)
          }
          --this.resendSecond
        }, 1000);
      })

    },
    async handlerSave() {
      let _valid = false
      this.$refs.form.validate(valid => { _valid = valid })
      if (!_valid) { return }
      await this.$pmsApi.firm.addFirm(this.entity)
      this.$emit('after-save')
      this.$Message.success('添加成功')
      this.handlerCancel()
    },
    handlerCancel() {
      this.$refs.form.resetFields()
      this.$emit('on-cancel')
    },

  },

}
</script>

<style>
</style>
