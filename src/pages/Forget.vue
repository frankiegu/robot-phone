<template>
  <div class="forget-bg">
    <div class="forget-wrapper">
      <h1 class="login-title">找回密码</h1>
      <Form class="forget-form" ref="form" :model="form" :rules="rules">
        <FormItem label="手机号" prop="phone">
          <Input type="text" v-model="form.phone" @keyup.native="handlePhoneInput" :maxlength="11" placeholder="请输入您注册的手机号"></Input>
        </FormItem>
        <FormItem class="forget-code" label="验证码" prop="code">
          <Input type="text" v-model="form.code" :maxlength="6" placeholder="请输入验证码"></Input>
          <span class="forget-code-img" :class="{dis: isCodeDisabled}" @click="handleGetCode">获取验证码</span>
        </FormItem>
        <FormItem label="新密码" prop="password">
          <Input type="password" v-model="form.password" :maxlength="20" placeholder="请输入新密码，6-20个字符或数字"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="password2">
          <Input type="password" v-model="form.password2" :maxlength="20" placeholder="请再次输入新密码"></Input>
        </FormItem>
        <FormItem>
          <Button class="forget-btn-submit" type="primary" @click="handleForgetSubmit">提交</Button>
        </FormItem>
      </Form>
      <div class="forget-more">
        <a href="javascript: void(0);" class="forget-back" @click="back"><i class="icon icon-login-back"></i>返回登录页面</a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import API_ADMIN from '@/api/common/adminInfoApi'
import TIP from '@/util/tip'
import REGEX from '@/util/regex'

export default {
  name: 'forget',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(TIP.PHONE_NEEDED))
      } else if (!REGEX.isPhone(value)) {
        callback(new Error(TIP.PHONE_ERROR))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(TIP.PWD_NEEDED))
      } else if (!REGEX.isPassword(value)) {
        callback(new Error(TIP.PWD_ERROR))
      } else {
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error(TIP.PWD_NOT_SAME))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(TIP.CODE_NEEDED))
      } else if (!REGEX.isCode(value)) {
        callback(new Error(TIP.CODE_ERROR))
      } else {
        callback()
      }
    }
    return {
      form: {
        phone: '',
        code: '',
        password: '',
        password2: '',
        loginType: 1
      },
      isCodeDisabled: true,
      rules: {
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        password2: [
          { validator: validatePassword, trigger: 'blur' },
          { validator: validatePassword2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleForgetSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          API_ADMIN.findPwd({
            admin_type: this.$route.query.type,
            mobile: this.form.phone,
            msg_code: this.form.code,
            password: this.form.password
          })
            .then(res => {
              this.$Message.success('修改成功')

              window.setTimeout(() => {
                // this.$router.push({
                //   name: 'login'
                // })
                this.back()
              }, 1000)
            })
        } else {
          return
        }
      })
    },
    handlePhoneInput() {
      const phone = this.form.phone
      if (phone !== '' && REGEX.isPhone(phone)) {
        this.isCodeDisabled = false
      } else {
        this.isCodeDisabled = true
      }
    },
    handleGetCode () {
      if (this.form.phone.trim() === '') {
        this.$Message.error(TIP.CODE_PHONE_NEEDED)
        return
      } else {
        this.isCodeDisabled = true
        API_ADMIN.sendMsg(this.form.phone)
          .then(res => {
            this.$Message.success(TIP.CODE_SENT_SUCCESS)

            this.nextTick(() => {
              this.isCodeDisabled = false
            })
          })
          .catch(() => {
            this.isCodeDisabled = false
          })
      }
    },
    back() {
      history.back()
    }
  }
}
</script>
