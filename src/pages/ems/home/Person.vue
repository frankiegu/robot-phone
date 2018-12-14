<template>
  <div>
    <div class="container">
      <div class="panel">
        <div class="panel-body person-title" style="display:flex;justify-content: space-between;align-items: center;cursor: pointer;">
           <p>个人设置</p>
          <Icon type="md-close"
                @click.native="handleBack"></Icon>
        </div>
        <div class="person-body">
          <div v-if="employeeShow"
               class="person-left">
            <div class="person-block">
              <div class="person-block-title">
                <p>个人信息</p>
              </div>
              <Form class="person-form"
                    ref="form1"
                    :model="form1"
                    :rules="rules1"
                    :label-width="100">
                <FormItem label="姓名："
                          prop="employeeName">
                  <Input type="text"
                         v-model="form1.employeeName"
                         :maxlength="30"></Input>
                </FormItem>
                <FormItem label="手机号："
                          prop="mobile">
                  <Input type="text"
                         v-model="form1.mobile"
                         :maxlength="11"></Input>
                </FormItem>
                <FormItem label="性别："
                          prop="sex">
                  <RadioGroup v-model="form1.sex">
                    <Radio :label="2">女</Radio>
                    <Radio :label="1">男</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="出生日期："
                          prop="bornTime">
                  <DatePicker type="date"
                              placeholder="年-月-日"
                              v-model="dateRange"></DatePicker>
                </FormItem>
                <FormItem label="微信号："
                          prop="weixin">
                  <Input type="text"
                         v-model="form1.weixin"
                         :maxlength="50"></Input>
                </FormItem>
                <FormItem label="QQ号："
                          prop="qq">
                  <Input type="text"
                         v-model="form1.qq"
                         :maxlength="50"></Input>
                </FormItem>
                <FormItem>
                  <Button type="primary"
                          @click="handleSave">保存</Button>
                </FormItem>
              </Form>
            </div>
          </div>
          <div :class="{'person-center': !employeeShow, 'person-right': employeeShow}">
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
                  <div class="label">sdk类型：</div>
                  <p class="value">
                    {{admin.sdkType?admin.sdkType===2 ? '讯飞sdk' : '讯飞webapi' : '默认' }}
                    <a class="link"
                       @click="openKeyModal">修改类型</a>
                  </p>
                </div>
                <div class="person-info"
                     v-show="admin.sdkType==1 || admin.sdkType==2 ">
                  <div class="label">讯飞AppId：</div>
                  <p class="value">
                    {{ admin.iflyAsrKey || '无' }}
                  </p>
                </div>
                <div class="person-info"
                     v-show="admin.sdkType==2 ">
                  <div class="label">ApiKey：</div>
                  <p class="value">
                    {{ admin.appkey || '无' }}
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
            <div class="person-block">
              <div class="person-block-title">
                <p>企业信息</p>
              </div>
              <div class="person-content">
                <div class="person-info">
                  <div class="label">
                    <span class="required">企业名称：</span>
                  </div>
                  <p class="value">{{ admin.name }}</p>
                </div>
                <div class="person-info">
                  <div class="label">
                    <span class="required">企业账号：</span>
                  </div>
                  <p class="value">{{ admin.account }}</p>
                </div>
                <div class="person-info">
                  <div class="label">联系人：</div>
                  <p class="value">{{ admin.contactsName }}</p>
                </div>
                <div class="person-info">
                  <div class="label">联系电话：</div>
                  <p class="value">{{ admin.contactsMobile }}</p>
                </div>
                <div class="person-info">
                  <div class="label">联系地址：</div>
                  <p class="value">{{ admin.contactsAddress }}</p>
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
           :closable="true"
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

    <Modal v-model="xfKeyVisible"
           title="修改讯飞key"
           ref="xfKey"
           :loading="true"
           :closable="true"
           :mask-closable="false"
           @on-cancel="handleCancel('formXfKey')"
           @on-ok="handleXfKey">
      <Form class="person-dialog-form"
            ref="formXfKey"
            :rules='rulesXfKey'
            :model="formXfKey"
            :label-width="120">
        <FormItem label="sdk类型"
                  :label-width="120">
          <Select v-model="formXfKey.sdkType"
                  placeholder="选择类型"
                  style="width: 270px;">
            <Option value="0">默认</Option>
            <!-- <Option value="1">讯飞sdk</Option> -->
            <Option value="2">讯飞webApi</Option>
          </Select>
        </FormItem>
        <FormItem label="讯飞AppId"
                  prop="ifly_asr_key"
                  v-if='formXfKey.sdkType==1 || formXfKey.sdkType==2'>
          <Input v-model="formXfKey.ifly_asr_key"
                 placeholder="请输入讯飞AppId"></Input>
        </FormItem>
        <FormItem label="ApiKey"
                  prop="appkey"
                  v-if='formXfKey.sdkType==2'>
          <Input v-model="formXfKey.appkey"
                 placeholder="请输入ApiKey"></Input>
        </FormItem>

      </Form>
    </Modal>

    <Modal v-model="phoneVisible"
           title="修改手机"
           ref="mobile"
           :loading="true"
           :closable="true"
           :mask-closable="false"
           @on-cancel="handleCancel('formPhone')"
           @on-ok="handleModifyPhone">
      <Form class="person-dialog-form"
            ref="formPhone"
            :model="formPhone"
            :rules="rulesPhone"
            :label-width="90">
        <FormItem label="手机号"
                  prop="mobile">
          <Input  type="text"
                 v-model="formPhone.mobile"
                 @keyup.native="handlePhoneInput"
                 :maxlength="11"
                 placeholder="请输入需要绑定的手机号"></Input>
        </FormItem>
        <FormItem class="forget-code"
                  label="验证码"
                  prop="msg_code"
                  :label-width="90">
          <Input type="text"
                 style="width: 170px;"
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
import { mapMutations, mapGetters } from "vuex";
import defaultAvatar from "@/assets/images/avtor.jpg";
import API from "@/api/index";
import API_ADMIN from "@/api/common/adminInfoApi";
import TIP from "@/util/tip";
import REGEX from "@/util/regex";
import Util from "@/util/util";

const API_EMPLOYEE = API.ems.employee;
const API_EMS = API.ems.admin;

export default {
  name: "person",
  computed: {
    ...mapGetters(["system"]),
    employeeShow() {
      return "" + this.system === "6";
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(TIP.PHONE_NEEDED));
      } else if (!REGEX.isPhone(value)) {
        callback(new Error(TIP.PHONE_ERROR));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(TIP.PWD_NEEDED));
      } else if (!REGEX.isPassword(value)) {
        callback(new Error(TIP.PWD_ERROR));
      } else {
        callback();
      }
    };
    const validatePassword2 = (rule, value, callback) => {
      if (value !== this.formPwd.password) {
        callback(new Error(TIP.PWD_NOT_SAME));
      } else {
        callback();
      }
    };
    const validateXfKey = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("讯飞key不能为空"));
      } else {
        callback();
      }
    };
    const validateAppKey = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("appKey不能为空"));
      }
      else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(TIP.CODE_NEEDED));
      } else if (!REGEX.isCode(value)) {
        callback(new Error(TIP.CODE_ERROR));
      } else {
        callback();
      }
    };
    return {
      admin: {},
      avatar: defaultAvatar,
      form1: {
        employeeName: "",
        mobile: "",
        sex: "",
        bornTime: "",
        weixin: "",
        qq: ""
      },
      dateRange: "",
      pwdVisible: false,
      phoneVisible: false,
      xfKeyVisible: false,
      isCodeDisabled: true,
      rules1: {
        employeeName: [
          { required: true, trigger: "blur", message: TIP.NAME_NEEDED }
        ],
        mobile: [
          {
            required: true,
            max: 11,
            trigger: "blur",
            message: TIP.PHONE_NEEDED
          }
        ]
      },
      formPwd: {
        old_password: "",
        password: "",
        password2: ""
      },
      rulesPwd: {
        old_password: [{ validator: validatePassword, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        password2: [
          { validator: validatePassword, trigger: "blur" },
          { validator: validatePassword2, trigger: "blur" }
        ]
      },
      formXfKey: {
        ifly_asr_key: "",
        sdkType: '',
        appkey: ''
      },
      rulesXfKey: {
        ifly_asr_key: [
          { validator: validateXfKey, trigger: "blur" }
        ],
        appkey: [
          { validator: validateAppKey, trigger: "blur" }
        ]
      },
      formPhone: {
        mobile: "",
        msg_code: "",
        password: ""
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
    dateRange: {
      handler(n) {
        if (typeof n == "object") {
          this.form1.bornTime = n ? n.getTime() : "";
        }
      }
    },
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
    this.fetchAdminInfo();
  },
  methods: {
    fetchAdminInfo() {
      API_ADMIN.getAdminInfo()
        .then(res => {
          this.prevHeadUrl = res.headUrl
          this.admin = res

          if (this.employeeShow && res.id) {
            API_EMPLOYEE.get(res.id)
              .then(res2 => {
                this.dateRange = Util.msToDate(res2.bornTime, 'yyyy-MM-dd')
                this.form1 = res2
              })
          }
        })
    },
    handleSave() {
      this.$refs["form1"].validate(valid => {
        if (valid) {
          API_EMPLOYEE.update(this.form1).then(res => {
            this.$Message.success("操作成功");
          });
        }
      });
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
          this.$refs.pwd.buttonLoading = false;
          return;
        }
      });
    },

    openKeyModal() {

      this.formXfKey.ifly_asr_key = this.admin.iflyAsrKey
      this.formXfKey.appkey = this.admin.appkey
      this.xfKeyVisible = true
      this.formXfKey.sdkType = this.admin.sdkType + ""
    },
    handleXfKey() {
      // 修改讯飞key

      if (this.formXfKey.sdkType == 0) {
        this.delXfKey()
        this.xfKeyVisible = false;
        return
      }
      this.$refs.formXfKey.validate(valid => {
        if (valid) {
          API_EMS.updateIflyKey(this.formXfKey)
            .then(res => {
              this.fetchAdminInfo();
              this.$Message.success("修改成功");
              this.$refs.formXfKey.resetFields();
              this.xfKeyVisible = false;
            })
            .catch(() => {
              this.$refs.xfKey.buttonLoading = false;
            });
        } else {
          this.$refs.xfKey.buttonLoading = false;
          return;
        }
      })
    },
    delXfKey() {
      API_EMS.updateIflyKey({
        ifly_asr_key: '',
        sdkType: '0'
      }).then(res => {
        this.fetchAdminInfo();
        this.$Message.success("修改成功");
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
          this.$refs.mobile.buttonLoading = false;
          return;
        }
      });
    },
    handlePhoneInput() {
      const phone = this.formPhone.mobile;
      if (phone !== "" && REGEX.isPhone(phone)) {
        this.isCodeDisabled = false;
      } else {
        this.isCodeDisabled = true;
      }
    },
    handleGetCode() {
      if (this.formPhone.mobile.trim() === '') {
        this.$Message.error(TIP.CODE_PHONE_NEEDED)
        return
      } else {
        this.isCodeDisabled = true;
        API_ADMIN.sendMsg(this.formPhone.mobile)
          .then(res => {
            this.$Message.success(TIP.CODE_SENT_SUCCESS);

            this.nextTick(() => {
              this.isCodeDisabled = false;
            });
          })
          .catch(() => {
            this.isCodeDisabled = false;
          });
      }
    },
    handleCancel(name) {
      this.$refs[name].resetFields();
      if (name === "formPwd") {
        this.pwdVisible = false;
      } else if (name === "formPhone") {
        this.phoneVisible = false;
      } else if (name === "xfKey") {
        this.xfKeyVisible = false;
      }
    },
    handleBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
.person-right {
  position: relative;
}
</style>
