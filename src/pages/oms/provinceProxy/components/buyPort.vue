<template>
  <div>
    <Modal :value="visible"
           title="购买端口"
           @on-visible-change="onVisible">
      <div>
        <h3 class="mb10">后台端口信息</h3>
                <Row class="tc mb20">
                    <Col :span="12"> 剩余年端口数：{{platePortInfo.accountRemainPort }}</Col>
                    <Col :span="12"> 剩余月端口数：{{platePortInfo.accountRemainMonthPort}}</Col>
                </Row>
                <h3 class="mb10">{{pObj.name}}省代里端口信息</h3>
        <Row class="tc mb20">
          <Col :span="12"> 已购买年端口数：{{pObj.totalPort}}</Col>
          <Col :span="12"> 剩余可用年端口数：{{pObj.remainPort}}</Col>
        </Row>
        <Row class="tc mb20">
          <Col :span="12"> 已购买月端口数：{{pObj.monthCardAllCount}}</Col>
          <Col :span="12"> 剩余可用月端口数：{{pObj.monthCardRemainCount}}</Col>
        </Row>
        <i-form :model="formData"
                :label-width="120"
                ref="formRef"
                :rules="fromRules">
          <FormItem label="省份："
                    prop="provinceId">
            {{pObj.provinceName}}
          </FormItem>
          <FormItem label="代理商："
                    prop="adminId">
            {{pObj.name}}
          </FormItem>
          <FormItem label="购买类型"
                    prop="portType">
            <i-select v-model="formData.portType"
                      style="width:45%;"
                      placeholder="请选择购买类型">
              <i-option value="0">购买年端口</i-option>
              <i-option value="1">购买月端口</i-option>
            </i-select>
          </FormItem>
          <FormItem :label="typeString"
                    prop="ports">
            <InputNumber :min="0"
                         v-model="formData.ports"></InputNumber>
          </FormItem>
          <FormItem label="金额："
                    prop="price">
            <InputNumber :min="0"
                         v-model="formData.price"></InputNumber>
          </FormItem>
        </i-form>
      </div>
      <div slot="footer">
        <i-button @click="dialogClose">取消</i-button>
        <i-button type="primary"
                  @click="onConfirm">确定</i-button>
      </div>

    </Modal>
  </div>
</template>
<script>
let pObj = {
  id: "",
  name: "",
  provinceId: "",
  provinceName: "",
  proxyType: 1,
  remainPort: 1,
  totalPort: 1,
  monthCardAllCount: '1',
  monthCardRemainCount: '1'

};

let entity = {
  ports: 0,
  price: 0,
  adminId: "",
  provinceId: "",
  portType: ""
};
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    pObj: {
      type: Object,
      default: () => {
        return { ...pObj };
      }
    }
  },
  data() {
    let validateNumber = (rule, value, cb) => {
      if (!/^[0-9]*$/.test(value)) {
        return cb(new Error("必须为数字值!"));
      }
      cb();
    };
    return {
      formData: { ...entity },
      fromRules: {
        ports: [
          { required: true, message: "请输入端口数" },
          { validator: validateNumber }
        ],
        price: [
          { required: true, message: "请输入金额" },
          { validator: validateNumber }
        ],
        portType: [{ required: true, message: '购买类型不能为空' }],
      },
      typeString: '购买年端口数',
      platePortInfo: ''
    }
  },
  watch: {
    'formData.portType'(n) {
      if (n == 0) {
        this.typeString = "购买年端口数:"
        console.log(this.pObj)
      } else if (n == 1) {
        this.typeString = "购买月端口数:"
      }
    }
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    dialogClose() {
      this.visible = false;
      this.formData = { ...entity };
      this.$refs.formRef.resetFields();
    },
    onVisible(vs) {
      if (!vs) {
        this.dialogClose();
      }
    },
    onConfirm() {
      let _valid = false;
      this.$refs.formRef.validate(valid => (_valid = valid));
      if (!_valid) {
        return;
      }

      let { id: adminId, provinceId } = this.pObj;
      let postData = Object.assign({}, this.formData);
      postData.adminId = adminId;
      postData.provinceId = provinceId;
      this.$omsApi.provinceProxy.addSellPort(postData).then(data => {
        this.dialogClose();
        this.$emit("reload", true);
      });
    },
    getPlatePort() {
      this.$omsApi.statistics.getPlatePort().then(res => {
        this.platePortInfo = res
      })
    }
  },
  mounted() {
    this.getPlatePort()
  }
};
</script>
