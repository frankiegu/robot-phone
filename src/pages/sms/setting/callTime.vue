<template>
  <div>
    <div class="panel">
      <div class="panel-body">
        <div class="pb-20">
          <h2 class="panel-tit panel-tit-primary">呼叫时间设置</h2>
          <Form class="mt-20 clear"
                :label-width="100"
                :model="entity"
                :rules="rules"
                ref="form">
            <Row>
              <i-col :span="12">
                <FormItem label="上午上班时间"
                          prop="amWorkTime">
                  <TimePicker type="time"
                              placeholder="请选择"
                              format="HH:mm"
                              v-model="amWorkTime"
                              style="width: 100%;" />
                </FormItem>
              </i-col>
              <i-col :span="12">
                <FormItem label="下午上班时间"
                          prop="pmWorkTime">
                  <TimePicker type="time"
                              placeholder="请选择"
                              format="HH:mm"
                              v-model="pmWorkTime"
                              style="width: 100%;" />
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col :span="12">
                <FormItem label="上午下班时间"
                          prop="amRestTime">
                  <TimePicker type="time"
                              placeholder="请选择"
                              format="HH:mm"
                              v-model="amRestTime"
                              style="width: 100%;" />
                </FormItem>
              </i-col>
              <i-col :span="12">
                <FormItem label="下午下班时间"
                          prop="pmRestTime">
                  <TimePicker type="time"
                              placeholder="请选择"
                              format="HH:mm"
                              v-model="pmRestTime"
                              style="width: 100%;" />
                </FormItem>
              </i-col>
            </Row>
            <FormItem>
              <p>注：设置呼叫时间后，所有用户只能在呼叫时间内进行自动拨号，在该时间段外将被禁止呼叫！</p>
            </FormItem>
            <FormItem>
              <Button type="primary"
                      @click="update">确定</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import systemConfigApi from '@/api/sms/systemConfig'
import { date } from '@/util'

export default {
  data() {
    let diffDate = (beginStr, endStr) => {
      let begins = beginStr.split(':')
      let ends = endStr.split(':')
      let getMinutes = arr => {
        return Number(arr[0]) * 60 + Number(arr[1])
      }
      return getMinutes(begins) - getMinutes(ends)
    }

    let amWorkTimeValidator = (rule, value, callback, source, options) => {
      let errors = []
      if (value) {
        if (this.entity.amRestTime && diffDate(value, this.entity.amRestTime) >= 0) {
          errors.push('上午上班时间不能晚于上午下班时间')
        }
      }
      callback(errors)
    }

    let amRestTimeValidator = (rule, value, callback, source, options) => {
      let errors = []
      if (value) {
        if (this.entity.pmWorkTime && diffDate(value, this.entity.pmWorkTime) >= 0) {
          errors.push('上午下班时间不能晚于下午上班时间')
        }
      }
      callback(errors)
    }

    let pmWorkTimeValidator = (rule, value, callback, source, options) => {
      let errors = []
      if (value) {
        if (this.entity.pmRestTime && diffDate(value, this.entity.pmRestTime) >= 0) {
          errors.push('下午上班时间不能晚于下午下班时间')
        }
      }
      callback(errors)
    }

    return {
      entity: {
        amWorkTime: '',
        amRestTime: '',
        pmWorkTime: '',
        pmRestTime: ''
      },
      rules: {
        amWorkTime: [
          { required: true, message: '请选择上午上班时间' },
          { validator: amWorkTimeValidator }
        ],
        amRestTime: [
          { required: true, message: '请选择上午下班时间' },
          { validator: amRestTimeValidator }
        ],
        pmWorkTime: [
          { required: true, message: '请选择下午上班时间' },
          { validator: pmWorkTimeValidator }
        ],
        pmRestTime: [
          { required: true, message: '请选择下午下班时间' }
        ]
      }
    }
  },
  computed: {
    amWorkTime: {
      get() {
        return this.entity.amWorkTime
      },
      set(val) {
        this.entity.amWorkTime = val
      }
    },
    amRestTime: {
      get() {
        return this.entity.amRestTime
      },
      set(val) {
        this.entity.amRestTime = val
      }
    },
    pmWorkTime: {
      get() {
        return this.entity.pmWorkTime
      },
      set(val) {
        this.entity.pmWorkTime = val
      }
    },
    pmRestTime: {
      get() {
        return this.entity.pmRestTime
      },
      set(val) {
        this.entity.pmRestTime = val
      }
    }
  },
  created() {
    this.get()
  },
  methods: {
    get() {
      systemConfigApi.getCallTime().then(data => {
        data.pmWorkTime = data.pmWorkTime || data.pmWordTime
        Object.assign(this.entity, data)
      })
    },
    update() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let entity = Object.assign({}, this.entity)
          entity.pmWordTime = entity.pmWorkTime
          systemConfigApi.updateCallTime(entity).then(() => {
            this.success('更新成功')
          })
        }
      })
    }
  }
}
</script>
