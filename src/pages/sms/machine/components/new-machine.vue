<template>
  <Modal v-model="modalShow"
         :title="entity.id ? '编辑设备' : '新增设备' ">
    <i-form :label-width="120"
            :model="entity"
            :rules="rules"
            class="mr30"
            ref="form">
      <Form-item label="设备名称"
                 prop="machineName">
        <i-input v-model="entity.machineName"
                 type="text"
                 placeholder="名称"></i-input>
      </Form-item>
      <!-- <template v-if="!entity.id"> -->
      <Form-item label="设备类型"
                 prop="machineType">
        <Select v-model="entity.machineType"
                :disabled="entity.id?true:false">
          <Option value="dbl">单口</Option>
          <Option value="synway">多口</Option>
          <!-- <Option value="dinstar">鼎信通达</Option> -->
          <Option value="jmtx">中继线</Option>
        </Select>
      </Form-item>
      <Form-item label="FS地址"
                 prop="fsIpAddr">
        <i-input v-model="entity.fsIpAddr"
                 type="text"
                 placeholder="网关服务器地址"></i-input>
      </Form-item>
      <!--
      <Form-item label="Sip号"><i-input v-model="entity.sipId" type="text" placeholder=""></i-input></Form-item>
      -->
      <Form-item label="设备号"
                 prop="machineNo">
        <i-input v-model="entity.machineNo"
                 type="text"
                 placeholder="设备号不能重复"></i-input>
                       <div><span class='vma-info'>设备号填写规范：<span>{{entity.machineType === 'jmtx' ? '中继线设备号从0001开始递增' : '网关设备号从1001开始递增'}}</span> 
</span> </div>
      </Form-item>

      <!-- </template> -->
      <Form-item label="端口数"
                 prop="slotCount"
                 v-if="entity.machineType === 'jmtx'">
        <InputNumber :max="99999999"
                     :min="entity.slotCountMin"
                     v-model="entity.slotCount" />
        <p class="help-block">中继线下使用的端口数</p>
      </Form-item>
      <Form-item label="端口数"
                 prop="slotCount"
                 v-else-if="!entity.id && entity.machineType !== 'jmtx'">
        <RadioGroup v-model="entity.slotCount">
          <Radio :label="1">1</Radio>
          <Radio :label="2">2</Radio>
          <Radio :label="4">4</Radio>
          <Radio :label="8">8</Radio>
          <Radio :label="16">16</Radio>
          <Radio :label="32">32</Radio>
          <Radio :label="64">64</Radio>
        </RadioGroup>
      </Form-item>
      <template v-if="entity.machineType === 'jmtx'">
        <Form-item label="线路IP"
                   prop="vosHost">
          <i-input v-model="entity.vosHost"
                   type="text"
                   :maxlength="50"
                   placeholder="线路IP地址，如6.6.6.6:5060"></i-input>
        </Form-item>
        <Form-item label="线路前缀"
                   prop="vosPrefix">
          <i-input v-model="entity.vosPrefix"
                   type="text"
                   :maxlength="50"
                   placeholder="线路前缀"></i-input>
        </Form-item>
        <Form-item label="线路sip">
          <i-input v-model="entity.vosSipId"
                   type="text"
                   :maxlength="50"
                   placeholder="主叫账号"></i-input>
        </Form-item>
        <Form-item label="线路密码">
          <i-input v-model="entity.vosSipPwd"
                   type="text"
                   :maxlength="50"
                   placeholder="线路密码"></i-input>
        </Form-item>
      </template>
      <!-- <FormItem>
            <Button type="ghost"
                style="margin-right: 8px"
                @click="handlerCancel">取消</Button>
        <Button type="primary"
                @click="handlerSave">确定</Button>
      </FormItem> -->
    </i-form>
    <div slot="footer">
      <Button type="ghost"
              style="margin-right: 8px"
              @click="handlerCancel">取消</Button>
      <Button type="primary"
              @click="handlerSave">确定</Button>
    </div>
  </Modal>
</template>

<script>
const entity = {
  id: "",
  fsIpAddr: "", // (string): fs的地址和端口号 ,
  machineName: "", // (string): 机器名称 ,
  machineNo: "", // (string): 机器编号 ,
  sipId: "1003", // (string): sip编号 ,
  slotCount: 8, // (integer): 机器端口数
  slotCountMin: 1,
  machineType: "synway",
  vosHost: "",
  vosPrefix: "",
  vosSipId: "",
  vosSipPwd: ""
};
export default {
  props: {
    value: false,
    entry: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      modalShow: this.value,
      entity: { ...entity },
      rules: {
        machineName: [{ required: true, message: "请输入设备名称" }],
        machineType: [{ required: true, message: "请选择设备类型" }],
        fsIpAddr: [{ required: true, message: "请输入FS地址" }],
        machineNo: [{ required: true, message: "请输入设备号" }],
        vosHost: [{ required: true, message: "请输入线路IP" }],
        // vosPrefix: [
        //   { required: true, message: '请输入线路前缀' }
        // ],
        vosSipId: [{ required: true, message: "请输入线路sip" }]
      }
    };
  },
  watch: {
    value(n) {
      this.modalShow = n;
    },
    modalShow(n) {
      this.$emit("input", n);
    },
    entry: {
      handler(n) {
        if (n.id) {
          n.slotCountMin = n.slotCount;
        } else {
          n.slotCountMin = 1;
        }
        this.entity = Object.assign({}, entity, n);
      },
      deep: true
    }
  },
  methods: {
    async handlerSave() {
      if (this.entity.id) {
        await this.$smsApi.machine.updateMachine(this.entity);
        this.$Message.success("修改成功");
      } else {
        let machine = Object.assign({}, this.entity);
        await this.$smsApi.machine.addMachine(machine);
        this.$Message.success("添加成功");
      }
      this.$emit("after-save", !!this.entity.id);
      this.modalShow = false;
    },
    handlerCancel() {
      this.modalShow = false;
      this.entity = { ...entity };
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style>
</style>
