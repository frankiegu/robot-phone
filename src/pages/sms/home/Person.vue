<template>
  <div>
    <div class="container">
      <div class="panel">
        <div class="panel-body person-title">
          <Icon type="close"
                @click.native="handleBack"></Icon>
          <p>个人设置</p>
        </div>
        <div class="person-body">
          <div class="person-center">
            <div class="person-block">
              <div class="person-block-title">
                <p>账号信息</p>
              </div>
              <div class="person-content">
                <div class="person-info">
                  <div class="label">账号：</div>
                  <p class="value">{{ admin.account }}</p>
                </div>
                <div class="person-info"
                     style="height: auto;">
                  <div class="label">头像：</div>
                  <p class="value">
                    <ms-image-upload v-model="admin.headUrl" />
                  </p>
                </div>
                <div class="person-info">
                  <div class="label">密码：</div>
                  <p class="value">
                    ******
                    <a class="link"
                       @click="pwdVisible = true">修改密码</a>
                  </p>
                </div>
                <div class="person-info">
                  <div class="label">绑定手机号：</div>
                  <p class="value">
                    {{ admin.mobile }}
                    <a class="link"
                       @click="phoneVisible = true">修改手机</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="pwdVisible"
           title="修改密码"
           ref="pwd"
           :loading="true"
           :closable="false"
           :mask-closable="false"
           @on-cancel="handleCancel('formPwd')"
           @on-ok="handleModifyPwd">
      <Form class="person-dialog-form"
            ref="formPwd"
            :model="formPwd"
            :rules="rulesPwd"
            :label-width="80">
        <FormItem label="当前密码">
          <Input type="password"
                 v-model="formPwd.old_password"
                 :maxlength="20"
                 placeholder="请输入原密码"></Input>
        </FormItem>
        <FormItem label="新密码"
                  prop="password">
          <Input type="password"
                 v-model="formPwd.password"
                 :maxlength="20"
                 placeholder="请输入6-18位的新密码"></Input>
        </FormItem>
        <FormItem label="确认密码"
                  prop="password2">
          <Input type="password"
                 v-model="formPwd.password2"
                 :maxlength="20"
                 placeholder="请再次输入新密码"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="phoneVisible"
           title="修改手机"
           ref="mobile"
           :loading="true"
           :closable="false"
           :mask-closable="false"
           @on-cancel="handleCancel('formPhone')"
           @on-ok="handleModifyPhone">
      <Form class="person-dialog-form"
            ref="formPhone"
            :model="formPhone"
            :rules="rulesPhone"
            :label-width="70">
        <FormItem label="手机号"
                  prop="mobile">
          <Input type="text"
                 v-model="formPhone.mobile"
                 @keyup.native="handlePhoneInput"
                 :maxlength="11"
                 placeholder="请输入需要绑定的手机号"></Input>
        </FormItem>
        <FormItem class="forget-code"
                  label="验证码"
                  prop="msg_code">
          <Input type="text"
                 v-model="formPhone.msg_code"
                 :maxlength="6"
                 placeholder="请输入验证码"></Input>
          <span class="forget-code-img"
                :class="{dis: isCodeDisabled}"
                @click="handleGetCode">获取验证码</span>
        </FormItem>
        <FormItem label="登录密码"
                  prop="password">
          <Input type="password"
                 v-model="formPhone.password"
                 :maxlength="20"
                 placeholder="请输入登录密码"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
import defaultAvatar from '@/assets/images/avtor.jpg'
import API from '@/api/index'
import API_ADMIN from '@/api/common/adminInfoApi'
import TIP from '@/util/tip'
import REGEX from '@/util/regex'

export default {
  name: 'person',
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
      if (value !== this.formPwd.password) {
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
      admin: {},
      avatar: defaultAvatar,
      pwdVisible: false,
      phoneVisible: false,
      isCodeDisabled: true,
      formPwd: {
        old_password: '',
        password: '',
        password2: ''
      },
      rulesPwd: {
        old_password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        password2: [
          { validator: validatePassword, trigger: 'blur' },
          { validator: validatePassword2, trigger: 'blur' }
        ]
      },
      formPhone: {
        mobile: '',
        msg_code: '',
        password: ''
      },
      rulesPhone: {
        mobile: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        msg_code: [
          { validator: validateCode, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ]
      },
      prevHeadUrl: null
    }
  },
  watch: {
    'admin.headUrl'(val) {
      if (val !== this.prevHeadUrl) {
        API_ADMIN.updateHeadImg({
          headUrl: val
        }).then(() => {
          this.success('更新头像成功')
        })
      }
    }
  },
  mounted() {
    this.fetchAdminInfo()
  },
  methods: {
    fetchAdminInfo() {
      API_ADMIN.getAdminInfo()
        .then(res => {
          this.prevHeadUrl = res.headUrl
          this.admin = res
        })
    },
    handleModifyPwd() {
      // 修改密码
      this.$refs.formPwd.validate(valid => {
        if (valid) {
          API_ADMIN.updatePwd({
            old_password: this.formPwd.old_password,
            password: this.formPwd.password
          }).then(res => {
            this.$Message.success('修改成功')
            this.$refs.formPwd.resetFields()
            this.pwdVisible = false
          }).catch(() => {
            this.$refs.pwd.buttonLoading = false
          })
        } else {
          this.$refs.pwd.buttonLoading = false
          return
        }
      })
    },
    handleModifyPhone() {
      // 修改手机
      this.$refs.formPhone.validate(valid => {
        if (valid) {
          API_ADMIN.updateMobile({
            mobile: this.formPhone.mobile,
            msg_code: this.formPhone.msg_code,
            password: this.formPhone.password
          }).then(res => {
            this.$Message.success('修改成功')
            this.$refs.formPhone.resetFields()
            this.phoneVisible = false
            this.fetchAdminInfo()
          }).catch(() => {
            this.$refs.mobile.buttonLoading = false
          })
        } else {
          this.$refs.mobile.buttonLoading = false
          return
        }
      })
    },
    handlePhoneInput() {
      const phone = this.formPhone.mobile
      if (phone !== '' && REGEX.isPhone(phone)) {
        this.isCodeDisabled = false
      } else {
        this.isCodeDisabled = true
      }
    },
    handleGetCode() {
      if (this.formPhone.mobile.trim() === '') {
        this.$Message.error(TIP.CODE_PHONE_NEEDED)
        return
      } else {
        this.isCodeDisabled = true
        API_ADMIN.sendMsg(this.formPhone.mobile)
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
    handleCancel(name) {
      this.$refs[name].resetFields()
      if (name === 'formPwd') {
        this.pwdVisible = false
      } else if (name === 'formPhone') {
        this.phoneVisible = false
      }
    },
    handleBack() {
      this.$router.go(-1)
    }
  }
}
</script>
