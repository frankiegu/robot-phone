<template>
  <div class="cube">
    <div class="cube-header">{{title}}</div>
    <div class="cube-body">
      <Form inline
            :label-width="60">
        <Row v-for="(v, i) in list"
             :key="i">
          <i-col :span="12">
            <FormItem :label="v.proxyType | value(proxyTypeMap)">
              <i-input placeholder="请输入"
                       v-model.trim.number="v.lowestCardCount"
                       :maxlength="8">
                <span slot="append">张卡</span>
              </i-input>
            </FormItem>
          </i-col>
          <i-col :span="12">
            <FormItem label="最多限制">
              <i-input placeholder="请输入"
                       v-model.trim.number="v.limitChildCount"
                       :maxlength="8">
                <span slot="append">家代理</span>
              </i-input>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </div>
  </div>
</template>

<script>
import { OMS } from '@/constants'

export default {
  props: {
    title: {
      type: String
    },
    // 此组件操作会变更list的item
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      proxyTypeMap: OMS.CITY_PROXY_TYPE_MAP
    }
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        for (let v of this.list) {
          let proxyTitle = this.title + ['', '', '', ''][v.proxyType]
          if (isNaN(+v.lowestCardCount)) {
            reject(new Error(`请输入合法的${proxyTitle}代理卡数`))
            return false
          }
          if (+v.lowestCardCount < 0) {
            reject(new Error(`${proxyTitle}代理卡数必须大于等于0`))
            return false
          }
          if (isNaN(+v.limitChildCount)) {
            reject(new Error(`请输入合法的${proxyTitle}代理限制数`))
            return false
          }
          if (+v.limitChildCount < 0) {
            reject(new Error(`${proxyTitle}代理限制数必须大于等于0`))
            return false
          }
        }
        resolve(true)
      })
    }
  }
}
</script>
