<template>
  <div>
    
    <FormItem label="关键字"
              :required="required"
              prop="keyWord">
      <Input placeholder="请输入关键字，多个关键字用英文“;”隔开，回车确定。"
             v-model.trim="key.text"
              style="width:398px;"
             @keyup.native.enter.prevent="addKeys" />
             <!-- 防止只有一个输入框时按enter会使表单刷新 -->
             <input id="hiddenText" type="text" style="display:none" />
    </FormItem>
    <FormItem prop="keys">
      <div v-show="keys.length">
        <div class="tag-container" style="width:398px;">
          <Tag class="ivu-tag-error"
               @click.native="removeAll">移除全部</Tag>
          <Tag type="border"
               closable
               v-for="(v, i) in keys"
               :key="i"
               @on-close="removeKey(i)">{{v}}</Tag>
        </div>
        <slot name="keyStatus" />
      </div>
      <!-- <p class="nodata"
         v-show="keys.length === 0">暂无关键字</p> -->
    </FormItem>
  </div>
</template>

<script>
import { validateKey, reduceKeys } from '@/util'

export default {
  model: {
    prop: 'keyWord',
    event: 'model'
  },
  props: {
    keyWord: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      key: {
        text: ''
      }
    }
  },
  computed: {
    keys: {
      get() {
        return (this.keyWord && this.keyWord.split(',')) || []
      },
      set(val) {
        this.$emit('model', val.join(','))
      }
    }
  },
  methods: {
    // 添加关键字
    addKeys() {
      if (this.key.text) {
        let keys = this.key.text.split(';').map(v => String(v).trim())
        let newKeys = reduceKeys(keys, this.keys)

        // 长度限制，单个关键字长度不能超过20个字符
        for (let i = 0, l = newKeys.length; i < l; i++) {
          let key = newKeys[i]
          if (!validateKey(key)) {
            return false
          }
        }

        // 过滤掉一样的key
        this.keys = this.keys.concat(newKeys)
        this.key.text = ''
      }
    },
    // 移除关键字
    removeKey(index) {
      this.keys.splice(index, 1)
      this.keys = this.keys.slice(0)
    },
    removeAll() {
      this.keys = []
    }
  }
}
</script>
