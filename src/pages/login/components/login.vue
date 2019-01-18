<template>
  <div class="login-bg" :style="loginBg ? `background-image: url(${loginBg})` : ''">
    <div class="login-wrapper">
      <h4 class="login-title">{{title}}</h4>

      <Form class="login-form" ref="form" :model="form" :rules="rules">
        <Tabs v-model="form.loginType">
          <TabPane label="账号登入" name="1">
            <FormItem prop="account">
              <i-input
                type="text"
                v-model.trim="form.account"
                :maxlength="20"
                placeholder="请输入登录账号"
                @keyup.native.enter="handleLoginSubmit"
              ></i-input>
            </FormItem>
            <FormItem prop="password">
              <i-input
                type="password"
                v-model.trim="form.password"
                :maxlength="20"
                placeholder="请输入密码"
                @keyup.native.enter="handleLoginSubmit"
              />
            </FormItem>
          </TabPane>
          <TabPane label="手机号登入" name="2">
            <FormItem prop="account">
              <i-input
                type="text"
                v-model.trim="form.account"
                :maxlength="20"
                placeholder="请输入登录账号"
                @keyup.native.enter="handleLoginSubmit"
              ></i-input>
            </FormItem>
            <FormItem prop="password">
              <i-input
                type="password"
                v-model.trim="form.password"
                :maxlength="20"
                placeholder="请输入密码"
                @keyup.native.enter="handleLoginSubmit"
              ></i-input>
            </FormItem>
          </TabPane>
        </Tabs>
        <FormItem prop="loginType">
          <div class="fleX" style="margin-top:-20px;">
            <Checkbox v-model="form.rememberMe" @on-change="remeberMe">记住我</Checkbox>
           
            <div class="login-more">
              <router-link
                class="login-more-forget"
                :to="{ name: 'forget', query: { type: adminType } }"
              >忘记密码？</router-link>
            </div>
          </div>
        </FormItem>
        <div class="rightTop">
          <slot name="adminType"/>
        </div>

        <FormItem>
          <Button class="login-btn-submit" type="primary" @click="handleLoginSubmit">登录</Button>
        </FormItem>
      </Form>
    </div>
    <div class="loginCanvas">
      <particle-js></particle-js>
    </div>
    <div class="footertext">为了获得最佳体验,建议使用&nbsp;
      <a href="https://www.google.cn/chrome/" target="_blank" rel="noopener noreferrer">谷歌浏览器Chrome</a>
    </div>
  </div>
</template>
<script>
import TIP from "@/util/tip";
import REGEX from "@/util/regex";
import { mapMutations } from "vuex";
import adminInfoApi from "@/api/common/adminInfoApi";
import * as loginTypes from "@/router/login/types";
import { SYSTEM } from "@/constants";
import "@/assets/javascripts/gVerify";
import { lastLoginAccountLocal } from "@/storage/local";
import RSAUtils from "@/assets/javascripts/vendors/rsa";
import { loginBg } from "@/config";
import particleJs from "@/components/libs/particlesJs";
export default {
  name: "login",
  props: {
    // 帐号类型：1超级管理 2管理员 3省级代理商 4市级代理 5企业 6员工
    adminType: {
      type: Number
    }
  },
  data() {
    // 分system各自缓存用户名
    let lastUser = lastLoginAccountLocal.getBySystem() || "";
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
      storageUser: "",
      form: {
        account: lastUser,
        password: "",
        code: "",
        adminType: "",
        loginType: "1",
        rememberMe: true
      },
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
        // code: [
        //   { validator: codeCheck, trigger: 'blur' }
        // ]
      },
      verifyCode: null,
      loginBg
    };
  },
  components: {
    particleJs
  },
  computed: {
    title() {
      return SYSTEM.SYSTEM_TITLE_MAP[this.adminType];
    }
  },
  mounted() {
   
     this.firstLogin();
  },
  // watch: {
  //   "form.password"(){
  //     if(this.form.rememberMe){
  //      this.remeberMe();
  //     }
  //   }
  // },
  methods: {
    remeberMe() {
      this.storageUser = window.localStorage;
      if (this.form.rememberMe) {
        this.form.account = lastLoginAccountLocal.getBySystem() || "";
        console.log("password", this.form.password);
        this.storageUser.setItem("passWord", this.form.password);
        this.storageUser.setItem("isstorepassword", "yes");
        // this.form.password = this.storageUser.getItem("passWord");
      } else {
        this.storageUser.setItem("isstorepassword", "no");
        this.storageUser.setItem("passWord", "");
      }
    },
    firstLogin() {
      if ("yes" == window.localStorage.getItem("isstorepassword")) {
        this.form.password = window.localStorage.getItem("passWord");
      }
    },
    handleLoginSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 数据重组
          let data = Object.assign({
            account: this.form.account,
            password: this.form.password,
            adminType: this.adminType,
            loginType: this.form.loginType
          });
          adminInfoApi
            .getSecret()
            .then(({ exponent, modulus, rsaKey }) => {
              RSAUtils.setMaxDigits(200);
              // 第一个参数为加密指数、第二个参数为解密参数、第三个参数为加密系数
              var key = RSAUtils.getKeyPair(exponent, "", modulus);
              data.password = RSAUtils.encryptedString(key, data.password);
              return rsaKey;
            })
            .then(rsaKey => {
              adminInfoApi
                .login(data, {
                  headers: {
                    rsaKey
                  }
                })
                .then(res => {
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
                  };
                  this.login({
                    vm: this,
                    user: user,
                    system: this.adminType
                  });
                  this.$Message.success("登录成功");
                  //用于首次登入
                  if (this.form.rememberMe) {
                    this.remeberMe();
                  }
                });
            });
        }
      });
    },
    ...mapMutations({
      login: "LOGIN"
    })
  }
};
</script>





