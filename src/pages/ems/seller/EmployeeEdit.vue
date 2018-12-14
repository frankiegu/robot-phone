<template>
  <Modal v-model="visible"
         :title="title"
         :loading="loading"
         @on-cancel="handleClose"
         @on-ok="handleConfirm">
    <div class="edit">
      <Form :label-width="90"
            ref="form"
            :rules="rules"
            :model="form">
        <FormItem label="姓名"
                  prop="employee_name">
          <Input type="text"
                 v-model="form.employee_name" />
        </FormItem>
        <FormItem label="联系方式"
                  prop="mobile">
          <Input type="text"
                 placeholder="请输入座机号或者手机号码"
                 v-model="form.mobile"
                 :maxlength="12" />
        </FormItem>
        <FormItem label="密码"
                  prop="password">
          <Input type="text"
                 placeholder="请输入6-18位的密码"
                 v-model="form.password"
                 :maxlength="16" />
        </FormItem>
        <FormItem label="性别"
                  prop="sex">
          <RadioGroup v-model="form.sex">
            <Radio :label="1">男</Radio>
            <Radio :label="0">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="出生日期"
                  prop="born_time">
          <DatePicker type="date"
                      v-model="dateRange"></DatePicker>
        </FormItem>
        <FormItem label="微信号"
                  prop="weixin">
          <Input type="text"
                 v-model="form.weixin" />
        </FormItem>
        <FormItem label="QQ号"
                  prop="qq">
          <Input type="text"
                 v-model="form.qq" />
        </FormItem>
        <FormItem label="职务"
                  prop="role">
          <Input type="text"
                 v-model="form.role" />
        </FormItem>
        <FormItem label="家庭电话"
                  prop="home_mobile">
          <Input type="text"
                 v-model="form.home_mobile" />
        </FormItem>
        <FormItem label="备注"
                  prop="remarks">
          <Input v-model="form.remarks"
                 type="textarea"
                 :rows="4"></Input>
        </FormItem>
      </Form>
    </div>
  </Modal>
</template>

<script>
import API from "@/api/index";
import Util from "@/util/util";
import { watchDateToTimestamp } from "@/util";
import { passwordValidator } from "@/assets/javascripts/asyncValidator/validators";

export default {
  name: "employeeEdit",
  props: {
    close: Function,
    confirm: Function
  },
  data() {
    const mobileValidator = (rule, value, callback) => {
      let numberReg=/^[0-9]*$/
     
        if (value.length < 11 || value.length > 12 ||!numberReg.test(value)) {
        callback(new Error("请输入正确的座机号码或者手机号码"));
      
     }
      else {
        callback();
      }
    };
    return {
      form: {
        id: "",
        employee_name: "",
        mobile: "",
        password: "",
        sex: "",
        born_time: "",
        weixin: "",
        qq: "",
        remarks: "",
        role: "",
        home_mobile: ""
      },
      dateRange: "",
      title: "",
      type: "add",
      rules: {
        employee_name: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入座机号或者手机号码", trigger: "blur" },
          { validator: mobileValidator }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: passwordValidator }
        ]
      },
      visible: true,
      loading: true
    };
  },
  created() {
    this.$watch("dateRange", function (n) {
      if (typeof n == "object") {
        this.form.born_time = n ? n.getTime() : "";
      }
    });
  },
  methods: {
    init(type, data) {
      this.type = type;
      if (type === "add") {
        this.form = {};
        this.title = "添加销售人员";
      } else if (type === "edit") {
        this.form = {
          id: data.id,
          employee_name: data.employeeName,
          mobile: data.mobile,
          password: data.password,
          sex: data.sex,
          born_time: data.bornTime,
          weixin: data.weixin,
          qq: data.qq,
          remarks: data.remarks,
          role: data.role,
          home_mobile: data.homeMobile
        };
        this.dateRange = data.bornTime
          ? Util.msToDate(data.bornTime, "yyyy-MM-dd")
          : "";
        this.title = "编辑销售人员";
      }
      this.visible = true;
    },
    handleClose() {
      this.dateRange = "";
      this.close();
      this.$refs.form.resetFields();
    },
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirm(this.type, this.form).finally(() => {
            this.loading = false;
            this.$nextTick(() => {
              this.loading = true;
            });
          });
        } else {
          this.loading = false;
          setTimeout(() => {
            this.loading = true;
          }, 0);
          return false;
        }
      });
    }
  }
};
</script>
