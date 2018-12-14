<template>
  <Modal v-model="visible"
    :title="title"
    :loading="loading"
    @on-cancel="handleClose"
    @on-ok="handleConfirm">
    <div class="edit">
      <Form :label-width="85" ref="form" :rules="rules" :model="form">
       <FormItem label="标签名称" prop="labelName">
            <i-input v-model="form.labelName" type="text" placeholder="请输入标签名称" class="w300"></i-input>
          </FormItem>
          <FormItem label="标签说明" class="w300">
            <i-input v-model="form.labelDescribe" type="textarea" placeholder="请输入标签说明" class="w300"></i-input>
          </FormItem>
        </Form>
    </div>
  </Modal>
</template>
<script>
import API from "@/api/index";
import Util from "@/util/util";

export default {
  name: "tagEdit",
  props: {
    close: Function,
    confirm: Function
  },
  data() {
    return {
      form: {
        labelName: "",
        labelDescribe: ""
      },
      title: "",
      type: "add",
      rules: {
        labelName: [
          { required: true, message: "请输入标签名称", trigger: "blur" }
        ]
      },
      visible: true,
      loading: true
    };
  },
  methods: {
    init(type, data) {
      this.type = type;
      if (type === "add") {
        this.form = {};
        this.title = "添加标签";
      } else if (type === "edit") {
        this.form = {
          id: data.id,
          labelName: data.labelName,
          labelDescribe: data.labelDescribe
        };
        this.title = "编辑标签";
      }
      this.visible = true;
    },
    handleClose() {
      this.close();
      this.$refs.form.resetFields();
    },
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirm(this.type, this.form).finally(() => {
            this.loading = false;
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