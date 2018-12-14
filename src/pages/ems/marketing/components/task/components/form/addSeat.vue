<template>
  <Form :label-width="120"
        :model="entity"
        :rules="rules"
        ref="form">
    <p class="c-warning mb-20"
       style="margin-left: 120px;">机器坐席和人工坐席不可重复选择</p>
    <FormItem label="机器坐席"
              prop="robotId">
      <card-select v-model="entity.robotId"
                   nodataText="暂无可用坐席"
                   isFree
                   ref="cardSelect" />
    </FormItem>
    <FormItem label="人工坐席"
              prop="humanId">
      <human-card-select v-model="entity.humanId"
                         nodataText="暂无可用坐席"
                         ref="humanCardSelect" />
    </FormItem>
    <FormItem label="销售人员"
              prop="employeeId">
      <transfer-employee-select v-model="entity.employeeId"
                                nodataText="暂无空闲人员"
                                ref="transferEmployeeSelect" />
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
import taskApi from '@/api/ems/task'
import {
  HumanCardSelect,
  CardSelect,
  TransferEmployeeSelect
} from '@/components/packages/ems/select'

export default {
  mixins: [formMixin],
  components: {
    HumanCardSelect,
    CardSelect,
    TransferEmployeeSelect
  },
  data() {
    return {
      entity: {
        employeeId: '',
        employeeName: '',
        humanId: '',
        humanName: '',
        robotId: '',
        robotName: ''
      },
      rules: {
        employeeId: [
          { required: true, message: '请选择销售人员' }
        ],
        humanId: [
          { required: true, message: '请选择人工坐席' }
        ],
        robotId: [
          { required: true, message: '请选择机器坐席' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          let entity = Object.assign({}, this.entity)
          let robot = this.$refs.cardSelect.getObj(entity.robotId)
          if (robot) {
            entity.robotName = robot.label
          }
          let human = this.$refs.humanCardSelect.getObj(entity.humanId)
          if (human) {
            entity.humanName = human.label
          }
          let employee = this.$refs.transferEmployeeSelect.getObj(entity.employeeId)
          if (employee) {
            entity.employeeName = employee.label
          }
          this.$emit('add', entity)
        }
      })
    }
  }
}
</script>
