<template>
  <div style="max-height:32rem;overflow:auto;" class="custom_scollBar">
    <i-form :model="entity"
            :label-width="120"
            ref="form"
            :rules="rules"
            style="width: 400px;margin: 10px auto;"
            size="mini">
      <FormItem label="所属省份："
                prop="provinceId">
        <i-select clearable
                  v-model="entity.provinceId"
                  placeholder="选择省份">
          <Option v-for="(item,index) in provinceList"
                  :key="index"
                  :value="item.provinceId">{{item.provinceName}}</Option>
        </i-select>
        <p class="c-info">若无数据，请先配置[系统设置->系统参数/城市等级管理]</p>
      </FormItem>

      <!-- <FormItem label="所属城市：" prop="cityId">
        <i-select clearable v-model="entity.cityId" placeholder="选择城市" :disabled="!entity.provinceId">
          <Option v-for="(item,index) in cityList" :key="index" :value="item.cityId">{{item.cityName}}</Option>
        </i-select>
      </FormItem> -->

      <!-- <FormItem label="代理类型：" prop="cityProxyType">
            <RadioGroup v-model="entity.cityProxyType" type="button" @on-change="handlerChangeProxyType">
              <Radio :label="item.value" v-for="(item,index) in proxyTypes" :key="index"><span :class="['medal','medal-'+item.class]">{{item.label+'牌代理' }}</span></Radio>
            </RadioGroup>
          </FormItem> -->

      <FormItem label="年代理台数："
                prop="cardInitCount">
        <i-input v-model="entity.cardInitCount"></i-input>
      </FormItem>
            <FormItem label="月代理台数：">
        <i-input v-model="entity.monthCardInitCount"></i-input>
      </FormItem>

      <FormItem label="年代理单价："
                prop="proxyPrice">
        <i-input v-model="entity.proxyPrice"></i-input>
      </FormItem>

      <FormItem label="省代名称："
                prop="name">
        <i-input v-model="entity.name"></i-input>
      </FormItem>

      <FormItem label="省代账号："
                prop="account">
        <i-input v-model="entity.account"
                 placeholder="请输入英文字母和数字组合，6-30字符，用于登录"></i-input>
        <div class="fc-gray">提示：同时支持账号和绑定手机号登录</div>
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
  
  
      <FormItem label="初始密码：" prop="password">
        <i-input v-model="entity.password" type="password"></i-input>
      </FormItem>

      <FormItem label="头像："
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
        debugger
        vm.sendMessage();
      });
    },
    click() {
      // console.log(vm)
      // console.log('aaa')
    },
    canTodo: () => {
      //返回值判定是否可以发送
      let result = /^[1][3,4,5,7,8][0-9]{9}$/.test(vm.entity.mobile);
      if (!result) {
        vm.$Message.warning("请输入正确的手机号码");
      }
      return result;
    }
  };
};

const proxyTypes = [{
  value: 3,
  label: "金",
  class: "gold"
},
{
  value: 2,
  label: "银",
  class: "sliver"
},
{
  value: 1,
  label: "铜",
  class: "bronze"
}
];

const entity = {
  account: '', // (string, optional): 市代账号 ,
  cardInitCount: 0, // (integer, optional): 代理台数 ,
  monthCardInitCount:0,// (integer, optional): 月代理台数 ,
  cityId: '', // (integer, optional): 代理城市 ,
  cityProxyType: 0, // (integer, optional): 代理类型 ,
  contactsAddress: '', // (string, optional): 联系地址 ,
  contactsMobile: '', // (string, optional): 联系电话 ,
  contactsName: '', // (string, optional): 联系人 ,
  mobile: '', // (string, optional): 绑定手机号 ,
  name: '', // (string, optional): 市代名称 ,
  password: '', // (string, optional): 初始密码 ,
  proxyPrice: 0, // (number, optional): 代理单价 ,
  remarks: '', // (string, optional): 备注 ,
  // verifCode: '', // (string, optional): 验证码
  provinceId: '',
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
      entity: {        ...entity
      },
      proxyTypes,
      config: geCodeConfig(this),
      provinceList: [],
      cityList: [],
      proxyInfoList: [], // 保存代理信息
      currentProxyTypeInfo: {}, // 保存当前代理类型对应的代理信息
      rules: {
        proxyPrice: [{
          required: true,
          message: "必填项"
        }, {
          validator: validateNumber
        }],
        cardInitCount: [{
          required: true,
          message: "必填项"
        }, {
          validator: validateNumber
        }],
        provinceId: [{
          required: true,
          message: "必填项"
        }],
        cityId: [{
          required: true,
          message: "必填项"
        }],
        cityProxyType: [{
          required: true,
          message: "必填项"
        }],
        account: [{
          required: true,
          min: 6,
          max: 30,
          message: "请输入6-30字符"
        },
        {
          validator: validateStringNum
        }
        ],
        proxyPort: [{
          required: true,
          message: "必填项"
        },
        {
          validator: validateNumber
        }
        ],
        mobile: [{
          required: true,
          message: "必填项"
        },
        {
          validator: validateNumber
        }
        ],
        name: [{
          required: true,
          message: "必填项"
        }],
        password: [
          {
            required: true,
            message: "必填项"
          },
          {
            min: 6,
            message: '密码不能少于6位'
          }
        ],
        // verifCode: [{
        //   required: true,
        //   message: "必填项"
        // }]
      }
    };
  },
  props: {
    visible: false,
  },
  computed: {},
  watch: {
    visible(n) {

    },
    components: {
      geCode
    },
    methods: {
      async sendMessage() {
        let result = await this.$commonApi.adminInfoApi.sendMsg(this.entity.mobile);
      },
      async loadProvinceList() {
        this.provinceList = await this.$omsApi.provinceProxy.listProvince()
      },
      async loadCityList(n) {
        if (n) {
          this.entity.cardInitCount = n.ports
          this.entity.proxyPrice = n.price
        } else {
          this.entity.cardInitCount = 0
          this.entity.proxyPrice = 0
        }
      },
      deep: true
    }
  },
  components: {
    geCode
  },
  methods: {
    async sendMessage() {
      let result = await this.$commonApi.adminInfoApi.sendMsg(this.entity.mobile);
    },
    async loadProvinceList() {
      this.provinceList = await this.$omsApi.provinceProxy.listProvince()
    },
    async loadCityList(n) {
      console.log(n)
      if (n) {
        this.cityList = await this.$commonApi.provinceCity.cityList({
          provinceId: n
        })
      }
    },
    // handlerChangeProxyType() {
    //   this.proxyInfoList.forEach(item => {
    //     if (item.proxyType == this.entity.cityProxyType) {
    //       this.currentProxyTypeInfo = item
    //     }
    //   })
    // },
    handlerCancel() {
      this.$emit('on-cancel')
      this.entity = {        ...entity
      }
      this.$refs.form.resetFields()
    },
    async handlerSave() {
      let _valid = false
      this.$refs.form.validate(valid => {
        _valid = valid
      })
      if (!_valid) {
        return
      }


      let postData = Object.assign(this.entity)
      await this.$omsApi.provinceProxy.addProvinceProxy(postData)
      this.$emit('after-save')
      this.$Message.success('开通成功')
      this.handlerCancel()
    },

  },
  created() {
    this.loadProvinceList()
  }
};
</script>
