<template>
  <Modal v-model="computedVisible"
    :mask-closable="false"
         title="添加短信条数"
         style="width: 400px">
    <Form :label-width="140"
          :model="entity"
          :rules="rules"
          ref="form"
          v-if="computedVisible">
      <FormItem label="运营商短信条数:">
        <b class="c-warning">{{messageCount.messageUseCount}}/{{messageCount.messageAllCount}}</b>
      </FormItem>
      <FormItem label="企业短信条数:">
        <b class="c-info">{{firmData.messageUseCount}}/{{firmData.messageAllCount}}</b>
      </FormItem>
      <FormItem label="添加短信条数:"
                prop="messageCount">
        <InputNumber v-model="entity.messageCount"
                     :min="1"
                     :max="messageCount.messageAllCount"
                     :step="10"
                     placeholder="添加短信条数" />
      </FormItem>
      
    </Form>
    <div slot="footer">
      <Button type="text"
                @click.native="cancel">取消</Button>
        <Button type="primary"
                @click.native="submit">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { formMixin } from '@/mixins'
import * as firmApi from '@/api/oms/firm'
import statisticsApi from '@/api/oms/statistics'

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
    },
    firmData: {
      type: Object,
      default() {
        return {
          messageAllCount: 0,
          messageUseCount: 0
        }
      }
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
      },
      messageCount: {
        messageAllCount: 0,
        messageUseCount: 0
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
  watch: {
    visible(val) {
      if (val) {
        this.initReady()
      }
    }
  },
  methods: {
    initReady() {
      statisticsApi.getMessageCount().then(data => {
        this.messageCount = data
      })
    },
    cancel() {
      this.computedVisible = false
    },
    submit() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          firmApi.addMessageNum({
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
