<template>
  <Modal v-model="visible"
    title='处理达标市级代理'
    :loading='loading'
    @on-ok='clickOk'
    @on-cancel='clickCancel'
   >
    <div class="edit">
      <Form :label-width="70" :rules="rules"  ref=form :model="form">
        <FormItem label="奖励金额" prop="bonus" >
             <Row>
                <Col span="19">
                    <Input type="text"  v-model="form.bonus" placeholder="请输入奖励金额"/>
                </Col>
                <Col span="4" offset="1">
                    <span>万元</span>
                </Col>
            </Row>
        </FormItem>

        <FormItem label="备注" prop='remarks'>
          <Input v-model="form.remarks" type="textarea" :rows="4"></Input>
        </FormItem>
      </Form>
    </div>
  </Modal>
</template>

<script>
import API from "@/api/index";
import Util from "@/util/util";
import { numberValidator  } from '@/assets/javascripts/asyncValidator/validators'
export default {
  name: "dealModal",
  props: {
    close: Function,
    confirm: Function
  },
  data() {
    return {
      form: {
        id: "",
        bonus: "",
        remarks: ""
      },
      visible: true,
      loading: true,
      rules: {
        bonus: [
          { required: true, message: "必填项" ,trigger: 'blur'},
          { validator: numberValidator }
        ]
      }
    };
  },

  methods: {
    clickOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = false  
          this.confirm();
        } else {
          this.loading = false;
          setTimeout(() => {
            this.loading = true;
          }, 0);
          return false;
        }
      });
    },
    clickCancel() {
      this.$refs.form.resetFields();
      this.close();
    }
  }
};
</script>
