<template>
  <Form :label-width="120"
        :model="entity"
        :rules="rules"
        ref="form">
    <FormItem label="选择设备"
              prop="machineId">
      <Select v-model="entity.machineId">
        <Option v-for="v in machineList"
                :key="v.id"
                :value="v.id">{{v.machineName}}</Option>
      </Select>
    </FormItem>
    <FormItem label="选择端口"
              prop="slotId">
      <Select v-model="entity.slotId">
        <Option v-for="v in slotList"
                :key="v.id"
                :value="v.id">{{v.slotNo}}</Option>
      </Select>
    </FormItem>

    <FormItem>
      <Button type="ghost"
              style="margin-right: 8px"
              @click="cancel">取消</Button>
      <Button type="primary"
              @click="submit">确定</Button>
    </FormItem>
  </Form>
</template>

<script>
import { formMixin } from '@/mixins'
import * as machineApi from '@/api/sms/machine'

export default {
  mixins: [formMixin],
  data() {
    return {
      machineList: [],
      slotList: [],
      entity: {
        id: '',
        cardType: '',
        machineId: '',
        mobile: '',
        slotId: ''
      },
      rules: {
        machineId: [
          { required: true, message: '请选择设备' }
        ],
        slotId: [
          { required: true, message: '请选择端口' }
        ]
      }
    }
  },
  watch: {
    'entity.machineId'(val) {
      this.entity.slotId = ''
      if (!val) {
        this.slotList = []
      } else {
        this.listSlot()
      }
    }
  },
  created() {
    this.listMachine()
  },
  methods: {
    listMachine() {
      return machineApi.listMoveSlotMachine({
        id: this.data.id
      }).then(data => {
        this.machineList = data
      })
    },
    listSlot() {
      return machineApi.listMoveSlotSlot({
        id: this.data.id,
        machineId: this.entity.machineId
      }).then(data => {
        this.slotList = data
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          machineApi.moveSlot(this.entity).then(() => {
            this.success('迁移成功')
            this.$emit('after-submit')
          })
        }
      })
    }
  }
}
</script>
