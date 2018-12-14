<template>
  <div>
    <i-form :model="entity"
            :label-width="120"
            ref="form"
            :rules="rules"
            style="width: 600px;margin: 10px auto;"
            size="mini">
      <FormItem label="所属省份：">
        <!-- <i-select clearable v-model="entity.provinceId" placeholder="选择省份">
          <Option v-for="(item,index) in provinceList" :key="index" :value="item.provinceId">{{item.provinceName}}</Option>
        </i-select> -->
        <i-input v-model="entity.provinceName"
                 disabled></i-input>
      </FormItem>

      <FormItem label="所属城市：">
        <i-input v-model="entity.cityName"
                 disabled></i-input>
        <!-- <i-select clearable v-model="entity.cityId" placeholder="选择城市" :disabled="!entity.provinceId">
          <Option v-for="(item,index) in cityList" :key="index" :value="item.cityId">{{item.cityName}}</Option>
        </i-select> -->
      </FormItem>

      <FormItem label="市代名称："
                prop="name">
        <i-input v-model="entity.name"></i-input>
      </FormItem>

      <FormItem label="绑定手机号："
                prop="mobile">
        <i-input v-model="entity.mobile"
                 placeholder="请输入手机号码"></i-input>
      </FormItem>

      <!-- <FormItem label="验证码：" prop="verifCode">
        <i-input v-model="entity.verifCode" placeholder="请输入手机验证码">
          <ge-code slot="append" :config="config"></ge-code>
        </i-input>
      </FormItem> -->

      <FormItem label="头像:"
                prop="headUrl">
        <ms-image-upload v-model="entity.headUrl" />
      </FormItem>

      <FormItem label="联系人：">
        <i-input v-model="entity.contactsName"></i-input>
      </FormItem>

      <FormItem label="联系电话：">
        <i-input v-model="entity.contactsMobile"></i-input>
      </FormItem>

      <FormItem label="联系地址：">
        <i-input v-model="entity.contactsAddress"></i-input>
      </FormItem>

      <FormItem label="备注：">
        <i-input v-model="entity.remarks"
                 type="textarea"
                 :rows="3"></i-input>
      </FormItem>

      <div class="tc">
        <i-button @click="handlerCancel">取消</i-button>
        <i-button type="primary"
                  @click="handlerSave">确定</i-button>
      </div>
    </i-form>
  </div>
</template>

<script>
import geCode from "@/components/libs/geCode";
let geCodeConfig = context => {
  let vm = context;
  return {
    startText: "获取验证码",
    endText: "获取验证码",
    todo() {
      vm.$nextTick(() => {
        vm.sendMessage();
      });
    },
    click() {
    },
    canTodo: () => {
      //返回值判定是否可以发送
      let result = /^1\d{10}$/.test(vm.entity.mobile);
      if (!result) {
        vm.$Message.warning("请输入正确的手机号码");
      }
      return result;
    }
  };
};


const entity = {
  id: '',
  contactsAddress: '', // (string, optional): 联系地址 ,
  contactsMobile: '', // (string, optional): 联系电话 ,
  contactsName: '', // (string, optional): 联系人 ,
  mobile: '', // (string, optional): 绑定手机号 ,
  name: '', // (string, optional): 市代名称 ,
  remarks: '', // (string, optional): 备注 ,
  // verifCode: '', // (string, optional): 验证码

  // 以下数据仅用于ui，不用于请求
  cityName: '', // (integer, optional): 代理城市 ,
  provinceName: '',
  headUrl: ''
}


export default {
  data() {
    let validateNumber = (rule, value, cb) => {
      if (!/^[0-9]*$/.test(value)) {
        return cb(new Error("必须为数字值!"));
      }
      cb();
    };
    let validateStringNum = (rule, value, cb) => {
      if (!/^[0-9a-zA-Z]+$/.test(value)) {
        return cb(new Error("必须为数字或者英文!"));
      }
      cb();
    };
    return {
      entity: { ...entity },
      proxyDetail: {}, // 仅用于保存获取到的代理详情
      config: geCodeConfig(this),
      rules: {
        account: [
          { required: true, min: 6, max: 30, message: "请输入6-30字符" },
          { validator: validateStringNum }
        ],
        mobile: [
          { required: true, message: "必填项" },
          { validator: validateNumber }
        ],
        name: [{ required: true, message: "必填项" }],
        // verifCode: [{ required: true, message: "必填项" }]
      }
    };
  },
  props: {
    visible: false,
    proxyId: '',
  },
  computed: {},
  watch: {
    visible(n) {
      if (n && this.proxyId) {
        this.loadDetail()
      }
    },
  },
  components: {
    geCode
  },
  methods: {
    async sendMessage() {
      let result = await this.$smsApi.common.sendMessage(this.entity.mobile);
    },
    async loadDetail() {
      if (this.proxyId) {
        this.proxyDetail = await this.$omsApi.cityProxy.getCityProxyDetail(this.proxyId)
        let data = this.proxyDetail

        this.entity = Object.assign({}, this.entity, data)
      }
    },
    handlerCancel() {
      this.$emit('on-cancel')
      this.entity = { ...entity }
      this.$refs.form.resetFields()
    },
    async handlerSave() {
      let _valid = false
      this.$refs.form.validate(valid => { _valid = valid })
      if (!_valid) { return }
      await this.$omsApi.cityProxy.editCityProxy(Object.assign({}, this.entity))
      this.$emit('after-save')
      this.handlerCancel()
    },

  },
  created() { }
};
</script>
