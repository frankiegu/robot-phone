<template>
  <div>
    <Modal v-model="modalShow" width="560" title="续费" @on-ok="handlerSave" @on-cancel="handlerCancel">
      <i-form :label-width="120" :model="entity" :rules="rules" ref="form" class="mr100">
        <Form-item label="账户剩余端口数：">
          {{entity.portCount}}
        </Form-item>

        <Form-item label="企业名称：">
          <!-- 有mobile 时为编辑，建议过服务端传坐席id -->
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
  adminId: '', 
  consumePort: 1, 
  mobile: '',
  perPrice: 1, 
  totalPrice: 1, 
  year: 1,
  portCount: 0,
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
      entity: {...entity},
      rules: {},
      firmList: [],
      defaultRenewPrice: 1,
    };
  },
  computed: {
    totalPrice () {
      let t = 100
      return this.entity.year * toInterger(this.entity.perPrice) / t
    }
  },
  watch: {
    value (n) {
      this.modalShow = n
    },
    modalShow (n) {
      this.$emit('input',n)
      if (n) {
        // 打开时重新加载 以免出现新增的企业没有加载到
        this.loadAllFirmList()
      }
    },
    entry: {
      handler(n) {
        this.entity = Object.assign({}, entity, n,{perPrice: this.defaultRenewPrice});
      },
      deep: true
    },
    totalPrice(n){
      this.entity.totalPrice = n
    },
    'entity.year' (n){
      this.entity.consumePort = n
    }
  },
  methods: {
    async handlerSave() {
      let {adminId, consumePort, mobile, perPrice, totalPrice, year} = this.entity
      let data = {adminId, consumePort, mobile, perPrice, totalPrice, year}
      await this.$pmsApi.firm.addFirmRenew(data);
      this.$Message.success('续费成功')
      this.$emit("after-save");
      this.handlerCancel()
    },
    handlerCancel() {
      this.$emit("on-cancel");
      this.entity = { ...entity };
      this.$refs.form.resetFields();
    },
    loadAllFirmList () {
      this.$pmsApi.firm.getAllFirmList().then(data => {
        this.firmList = data
      })
    },
    getDefaultRenewPrice () {
      this.$pmsApi.firm.getDefaultRenewPrice().then( price => {
        this.defaultRenewPrice = price
      })
    }
  },
  created () {
    this.getDefaultRenewPrice()
  }
};
</script>

<style lang="scss">
.cn{
  &:after{
    content: '';
    clear: none;
  }
}
</style>
