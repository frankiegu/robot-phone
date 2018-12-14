<template>
  <div>
    <Modal v-model="visible" width="560" title="续费" @on-ok="handlerSave" @on-cancel="handlerCancel">
      <i-form :label-width="140" :model="entity" :rules="rules" ref="form" class="mr100">
        <Form-item label="账户剩余端口数：">
          {{portCount}}
        </Form-item>

        <Form-item label="企业名称：">
          <i-select v-model="entity.adminId" placeholder="请选择类型" :disabled="!!this.entity.mobile">
            <i-option v-for="item in firmList" :value="item.id" :key="item.id">{{ item.name }}</i-option>
          </i-select>
        </Form-item>

        <Form-item label="续费坐席号：">
          {{entity.mobile}}
        </Form-item>

        <Form-item label="续费时间：">
          <i-button 
            :type="item == entity.year ? 'primary' : 'default'" 
            v-for="item in 3" 
            :key="item" 
            class="mr10"
            @click="()=>{entity.year = item}">{{item}} 年</i-button>
        </Form-item>

        <Form-item label="续费单价：">
          <InputNumber :min="0" v-model="entity.perPrice" placeholder="请输入单价"></InputNumber> 元
        </Form-item>

        <Form-item label="合计金额：">
          {{totalPrice}} 元
        </Form-item>

        <Form-item label="续费消耗端口数：">
          {{entity.consumePort}}
        </Form-item>

      </i-form>
    </Modal>
  </div>

</template>



<script>
import { toInterger } from "@/util";

// admin_id (integer, optional): 企业ID ,
// consume_port (integer, optional): 消耗端口 ,
// mobile (string, optional): 坐席号码 ,
// per_price (number, optional): 续费单价 ,
// total_price (number, optional): 续费总价 ,
// year (integer, optional): 续费时间(单位:年)
///////// portCount 剩余端口数//////

const entity = {
  adminId: "",
  consumePort: 1,
  mobile: "",
  perPrice: 1,
  totalPrice: 1,
  year: 1
};

export default {
  props: {
    value: false,
    entry: {
      default() {
        return { ...entity };
      }
    }
  },
  data() {
    return {
      modalShow: this.value,
      entity: { ...entity },
      rules: {},
      firmList: [],
      portCount: 0
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    totalPrice() {
      let t = 100;
      return this.entity.year * toInterger(this.entity.perPrice) / t;
    }
  },
  watch: {
    // entry: {
    //   immediate: true,
    //   handler(n) {
    //     this.entity = Object.assign({}, entity, n,{perPrice: this.defaultRenewPrice});
    //   },
    //   deep: true
    // },
    totalPrice(n) {
      this.entity.totalPrice = n;
    },
    "entity.year"(n) {
      this.entity.consumePort = n;
    }
  },
  methods: {
    handlerSave() {
      this.$omsApi.firm.seatRenew(Object.assign({}, this.entity)).then(() => {
        this.$Message.success("续费成功");
        this.$emit("after-save");
      });
    },
    handlerCancel() {
      this.$emit("on-cancel");
    },
    loadAllFirmList() {
      this.$omsApi.firm.getAllFirmList().then(data => {
        this.firmList = data;
      });
    },
    getDefaultRenewPrice(adminId) {
      this.$omsApi.firm.getDefaultRenewPrice(adminId).then(price => {
        this.entity.perPrice = price;
      });
    },
    getPortNum() {
      this.$omsApi.firm.getPortNum().then(num => {
        this.portCount = this.entity.portCount = num;
      });
    }
  },
  created() {
    this.entity = Object.assign({}, entity, this.entry);
    this.getDefaultRenewPrice(this.entry.adminId);
    this.getPortNum();
    this.loadAllFirmList();
  }
};
</script>

<style lang="scss">
.cn {
  &:after {
    content: "";
    clear: none;
  }
}
</style>
