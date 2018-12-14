<template>
  <Modal v-model="computedVisible"
         title="添加短信条数"
         style="width: 400px">
    <Form :label-width="120"
          :model="entity"
          :rules="rules"
          ref="form"
          v-if="computedVisible">
      <FormItem label="短信条数"
                prop="messageCount">
        <InputNumber v-model="entity.messageCount"
                     :min="1"
                     :step="10"
                     placeholder="添加短信条数" />
      </FormItem>
      <FormItem>
        <Button type="ghost"
                style="margin-right: 8px"
                @click="cancel">取消</Button>
        <Button type="primary"
                @click="submit">确定</Button>
      </FormItem>
    </Form>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
import { formMixin } from '@/mixins'
import * as operatorApi from '@/api/sms/operator'

export default {
  mixins: [formMixin],
  model: {
    prop: 'visible',
    event: 'model'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      required: true
    }
  },
  data() {
    return {
      entity: {
        messageCount: 1
      },
      rules: {
        messageCount: [
          { required: true, message: '请输入短信条数' }
        ]
      }
    }
  },
  computed: {
    computedVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('model', val)
      }
    }
  },
  methods: {
    cancel() {
      this.computedVisible = false
    },
    submit() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          operatorApi.addMessageNum({
            id: this.id,
            messageCount: this.entity.messageCount
          }).then(() => {
            this.success('添加短信条数成功')
            this.$emit('after-submit')
          })
        }
      })
    }
  }
}
</script>
