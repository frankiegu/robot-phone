<template>
  <div class="login-bg"
       :style="loginBg ? `background-image: url(${loginBg})` : ''">
       
    <div class="login-wrapper">
      <h4 class="login-title">{{title}}</h4>
      <Form class="login-form"
            ref="form"
            :model="form"
            :rules="rules">
        <FormItem prop="account">
          <i-input type="text"
                   v-model.trim="form.account"
                   :maxlength="20"
                   placeholder="请输入登录账号"
                   @keyup.native.enter="handleLoginSubmit" >
                   </i-input>
        </FormItem>
        <FormItem prop="password">
          <i-input type="password"
                   v-model.trim="form.password"
                   :maxlength="20"
                   placeholder="请输入密码"
                   @keyup.native.enter="handleLoginSubmit" />
        </FormItem>
        <!-- <FormItem class="login-code"
                  prop="code">
          <i-input type="text"
                   v-model.trim="form.code"
                   :maxlength="4"
                   placeholder="请输入验证码"
                   @keyup.native.enter="handleLoginSubmit" />
          <span class="login-code-img"
                id="codeImg">
          </span>
        </FormItem> -->
        <FormItem prop="loginType">
          <RadioGroup v-model="form.loginType">
            <Radio :label="1">账号登录</Radio>
            <Radio :label="2">手机登录</Radio>
          </RadioGroup>
          <div class="login-more">
        <router-link class="login-more-forget"
                     :to="{ name: 'forget', query: { type: adminType } }">忘记密码？</router-link>
      </div>
        </FormItem>
        <slot name="adminType" />

        <FormItem>
          <Button class="login-btn-submit"
                  type="primary"
                  @click="handleLoginSubmit">登录</Button>
        </FormItem>
      </Form>
      
    </div>
    <div  class="loginCanvas">
      <particle-js> </particle-js>
    </div>
     
  </div>
</template>
<script>
import TIP from '@/util/tip'
import REGEX from '@/util/regex'
import { mapMutations } from 'vuex'
import adminInfoApi from '@/api/common/adminInfoApi'
import * as loginTypes from '@/router/login/types'
import { SYSTEM } from '@/constants'
import '@/assets/javascripts/gVerify'
import { lastLoginAccountLocal } from '@/storage/local'
import RSAUtils from '@/assets/javascripts/vendors/rsa'
import { loginBg } from '@/config'
import particleJs from '@/components/libs/particlesJs'
export default {
  name: 'login',
  props: {
    // 帐号类型：1超级管理 2管理员 3省级代理商 4市级代理 5企业 6员工
    adminType: {
      type: Number
    }
  },
  data() {
   
    // 分system各自缓存用户名
    let lastUser = lastLoginAccountLocal.getBySystem() || ''
    let defaultPwd = ''
    // const codeCheck = (rule, value, callback) => {
    //   // 验证码验证
    //   if (value === '') {
    //     callback(new Error(TIP.CODE_NEEDED))
    //   } else if (!this.verifyCode.validate(value)) {
    //     callback(new Error(TIP.CODE_ERROR))
    //   } else {
    //     callback()
    //   }
    // }

    return {
      form: {
        account: lastUser,
        password: defaultPwd,
        code: '',
        adminType: '',
        loginType: 1
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
        // code: [
        //   { validator: codeCheck, trigger: 'blur' }
        // ]
      },
      verifyCode: null,
      loginBg
    }
  },
  components: {
    particleJs
  },
  computed: {
    title() {
      return SYSTEM.SYSTEM_TITLE_MAP[this.adminType]
    }
  },
  mounted() {
    // const $img = window.document.getElementById('codeImg')
    // const react = $img.getBoundingClientRect()
    // this.verifyCode = new GVerify({
    //   id: 'codeImg',
    //   width: react.width,
    //   height: react.height
    // })
  },
  methods: {
   
    handleLoginSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 数据重组
          let data = Object.assign({
            account: this.form.account,
            password: this.form.password,
            adminType: this.adminType,
            loginType: this.form.loginType
          })
          adminInfoApi.getSecret().then(({ exponent, modulus, rsaKey }) => {
            RSAUtils.setMaxDigits(200)
            // 第一个参数为加密指数、第二个参数为解密参数、第三个参数为加密系数
            var key = RSAUtils.getKeyPair(exponent, '', modulus)
            data.password = RSAUtils.encryptedString(key, data.password)
            return rsaKey
          }).then(rsaKey => {
            adminInfoApi.login(data, {
              headers: {
                rsaKey
              }
            }).then(res => {
              const user = {
                ...res,
                menus: res.menuList,
                loginRouter: {
                  [SYSTEM.ADMIN_TYPE_SMS]: loginTypes.LOGIN_SMS,
                  [SYSTEM.ADMIN_TYPE_OMS]: loginTypes.LOGIN_OMS,
                  [SYSTEM.ADMIN_TYPE_PAMS]: loginTypes.LOGIN_PAMS,
                  [SYSTEM.ADMIN_TYPE_CAMS]: loginTypes.LOGIN_CAMS,
                  [SYSTEM.ADMIN_TYPE_EMS]: loginTypes.LOGIN_EMS,
                  [SYSTEM.ADMIN_TYPE_STAFF]: loginTypes.LOGIN_STAFF
                }[this.adminType]
              }
              this.login({
                vm: this,
                user: user,
                system: this.adminType
              })
              this.$Message.success('登录成功')
              // this.$emit('after-login')
            })
          })
        }
      })
    },
    ...mapMutations({
      login: 'LOGIN'
    })
  }
}
</script>





