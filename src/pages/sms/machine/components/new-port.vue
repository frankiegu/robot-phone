<template>
  <div>

    <div class="task">
      <div class="task-l divide-item">
        <div class="panel">
          <div class="panel-header">
            端口信息
          </div>
          <div class="panel-body">
            <i-form :label-width="120">
              <Form-item label="设备名称" class="cf">{{entity.machineName}}</Form-item>
              <Form-item label="FS地址" class="cf">{{entity.fsIpAddr}}</Form-item>
              <Form-item label="Sip号" class="cf">{{entity.sipId}}</Form-item>
              <Form-item label="设备号" class="cf">{{entity.machineNo}}</Form-item>
              <Form-item label="端口号" class="cf">{{entity.slotNo}}</Form-item>
            </i-form>
          </div>
        </div>
      </div>

      <div class="task-r divide-main">
        <div class="panel">
          <div class="panel-header">
            基础信息
          </div>
          <div class="panel-body">
            <i-form :label-width="120" :model="entity" :rules="rules" class="mr30 w400" ref="form">
              <Form-item label="坐席号码" class="cn" prop="mobile">
                <i-input v-model="entity.mobile" type="text" placeholder=""></i-input>
              </Form-item>
              <Form-item label="坐席类型" class="cn" prop="cardType">
                <i-select v-model="entity.cardType"  placeholder="请选择类型">
                  <i-option v-for="item in cardType" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                </i-select>
              </Form-item>
              <Form-item class="cn">
                <i-button @click="handlerCancel">取消</i-button>
                <i-button type="primary" @click="handlerSave">保存</i-button>
              </Form-item>
            </i-form>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
const entity = {};
const cardType = [
  {value: 1, label: '机器' },
  {value: 2, label: '人工' },
  {value: 3, label: '固定' },
]
export default {
  props: {
    entry: {
      default() {
        return { ...entity };
      }
    }
  },
  data() {
    return {
      entity: {},
      rules: {
        mobile: [{required: true, message: '请输入坐席号码'}],
        cardType: [{required: true, message: '请选择坐席类型'}]
      },
      cardType,
    };
  },

  watch: {
    entry: {
      handler(n) {
        this.entity = Object.assign({}, entity, n);
      },
      deep: true
    }
  },
  methods: {
    async handlerSave() {
      let {id, mobile, cardType} = this.entity
      let data = {id, mobile, cardType}
      await this.$smsApi.machine.updateSlot(data);
      this.$Message.success('操作成功')
      this.$emit("after-save");
      this.$refs.form.resetFields();
    },
    handlerCancel() {
      this.$emit("on-cancel");
      this.$refs.form.resetFields();
    }
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
