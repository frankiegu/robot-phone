<template>
  <div>
    <div class="panel-body">
      <div class="task" style="height:30rem;overflow:auto;">
        <div class="task-l" style="box-shadow:none;">
          <div class="board board-primary" style="box-shadow:none;border-radius:0;width:100%;">
            <div class="board-header">进阶设置</div>
            <div class="board-body">
              <p>客户等级</p>
              <div class="keyword">
                <RadioGroup v-model="form.user_level">
                  <Radio label="A">
                    <ins
                      class="keyword-item keyword-primary"
                      :class="{ active: form.user_level === 'A' }"
                    >A级</ins>
                  </Radio>
                  <Radio label="B">
                    <ins
                      class="keyword-item keyword-success"
                      :class="{ active: form.user_level === 'B' }"
                    >B级</ins>
                  </Radio>
                  <Radio label="C">
                    <ins
                      class="keyword-item keyword-info"
                      :class="{ active: form.user_level === 'C' }"
                    >C级</ins>
                  </Radio>
                  <Radio label="D">
                    <ins
                      class="keyword-item keyword-default"
                      :class="{ active: form.user_level === 'D' }"
                    >D级</ins>
                  </Radio>
                  <Radio label="E">
                    <ins
                      class="keyword-item keyword-warning"
                      :class="{ active: form.user_level === 'E' }"
                    >E级</ins>
                  </Radio>
                  <Radio label="F">
                    <ins
                      class="keyword-item keyword-danger"
                      :class="{ active: form.user_level === 'F' }"
                    >F级</ins>
                  </Radio>
                </RadioGroup>
              </div>
              <p class="mt-10">客户标签</p>
              <div class="keyword">
                <ins
                  v-for="label in labels"
                  :key="label.id"
                  class="keyword-item keyword-default"
                  :class="{active: form.labels && tempLabels.indexOf(label.labelName) >= 0}"
                  @click="addLabel(label)"
                >{{ label.labelName }}</ins>
              </div>
              <p class="mt-10">备注</p>
              <div>
                <Input v-model="form.remarks" type="textarea" :rows="4" placeholder></Input>
              </div>
            </div>
          </div>
        </div>
        <div class="task-r" style="box-shadow:none;border-radius:0;">
          <div class="board board-primary" style="box-shadow:none;border-radius:0;width:100%;">
            <div class="board-header">基础信息</div>
            <div class="board-body">
              <Form
                :label-width="70"
                ref="form"
                :rules="rules"
                :model="form"
                style="overflow: hidden;"
              >
                <FormItem label="姓名" prop="user_name">
                  <Input type="text" v-model="form.user_name"/>
                </FormItem>
                <FormItem label="手机号" prop="mobile">
                  <Input type="text" v-model="form.mobile" :maxlength="11"/>
                </FormItem>
                <FormItem label="性别" prop="sex">
                  <RadioGroup v-model="form.sex">
                    <Radio :label="1">男</Radio>
                    <Radio :label="0">女</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="出生日期" prop="bron_time">
                  <DatePicker type="date" v-model="dateRange"></DatePicker>
                </FormItem>
                <FormItem label="微信号" prop="weixin">
                  <Input type="text" v-model="form.weixin"/>
                </FormItem>
                <FormItem label="QQ号" prop="qq">
                  <Input type="text" v-model="form.qq"/>
                </FormItem>
                <FormItem label="客户单位" prop="company_name">
                  <Input type="text" v-model="form.company_name"/>
                </FormItem>
                <FormItem label="单位电话" prop="company_mobile">
                  <Input type="text" v-model="form.company_mobile"/>
                </FormItem>
                <FormItem label="客户职务" prop="company_role">
                  <Input type="text" v-model="form.company_role"/>
                </FormItem>
                <FormItem label="家庭电话" prop="home_mobile">
                  <Input type="text" v-model="form.home_mobile"/>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/api/index";
import Util from "@/util/util";

const API_LABEL = API.ems.labelInfo;

export default {
  name: "clientEdit",
  props: {
    close: Function,
    confirm: Function
  },
  data() {
    return {
      labels: [],
      tempLabels: [], // selected label names
      form: {
        bron_time: "",
        company_name: "",
        company_mobile: "",
        company_role: "",
        home_mobile: "",
        id: "",
        labels: "",
        mobile: "",
        qq: "",
        remarks: "",
        sex: "",
        user_level: "",
        user_name: "",
        weixin: ""
      },
      dateRange: "",
      rules: {
        user_name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }]
      },
      visible: true
    };
  },
  created() {
    this.$watch("dateRange", function(n) {
      if (typeof n == "object") {
        this.form.bron_time = n ? n.getTime() : "";
      }
    });
  },
  mounted() {
    API_LABEL.getLabelList({ page_num: 1, page_size: 20 }).then(res => {
      this.labels = res.dataList;
    });
  },
  methods: {
    init(data) {
      this.form = {
        bron_time: data.bronTime,
        company_name: data.companyName,
        company_mobile: data.companyMobile,
        company_role: data.companyRole,
        home_mobile: data.homeMobile,
        id: data.id,
        labels: data.labels || [],
        mobile: data.mobile,
        qq: data.qq,
        remarks: data.remarks,
        sex: data.sex,
        user_level: data.userLevel,
        user_name: data.userName,
        weixin: data.weixin
      };
      this.dateRange = data.bronTime
        ? Util.msToDate(data.bronTime, "yyyy-MM-dd")
        : "";
      this.tempLabels = data.labels || [];
    },
    addLabel(label) {
      let add = true;
      this.form.labels.map((l, i) => {
        if (l.labelName === label.labelName) {
          this.form.labels.splice(i, 1);
          this.tempLabels.splice(i, 1);
          add = false;
        }
      });
      if (add) {
        this.form.labels.push(label);
        this.tempLabels.push(label.labelName);
      }
    },
    handleClose() {
      this.close();
    },
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const ids = this.form.labels.map(l => l.id);
          const data = Object.assign({}, this.form, {
            labels: ids
          });
          this.confirm(data);
        }
        return;
      });
    }
  }
};
</script>
