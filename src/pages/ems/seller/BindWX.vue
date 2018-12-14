<template>
  <div>
    <div v-show="wxList.length > 0">
      <p class="text-c">请选择微信用户</p>
      <CheckboxGroup v-model="wxUserList"
                     @on-change="changeWxUserId">
        <ul class="collection"
            style="margin: .5rem auto;">
          <li v-for="v in wxList"
              :key="v.id">
            <label class="collection-user">
              <img :src="v.headUrl | url">
              <p>{{v.name}}</p>
              <em>
                <Checkbox :label="v.id">&nbsp;</Checkbox>
              </em>
            </label>
          </li>
        </ul>
      </CheckboxGroup>
      
    </div>
    <p class="nodata"
       v-show="wxList.length === 0">暂无数据</p>
  </div>
</template>

<script>
import employeeApi from '@/api/ems/employee'

export default {
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      wxList: [],
      entity: {
        wxUserId: ''
      },
      wxUserList: []
    }
  },
  created() {
    employeeApi.listWx({
      employeeId: this.id
    }).then(data => {
      this.wxList = data
      for (let v of data) {
        if (v.isBind === 1) {
          this.entity.wxUserId = v.id
          this.wxUserList = [v.id]
        }
      }
    })
  },
  methods: {
    changeWxUserId(arr) {
      if (arr.length) {
        this.entity.wxUserId = arr[arr.length - 1]
        this.wxUserList = [this.entity.wxUserId]
      } else {
        this.entity.wxUserId = ''
        this.wxUserList = []
      }
    },
    cancel() {
      this.$emit('on-cancel')
    },
    submit() {
      employeeApi.bindWx({
        id: this.id,
        wxUserId: this.entity.wxUserId
      }).then(() => {
        this.success('操作成功')
        this.$emit('after-submit')
      })
    }
  }
}
</script>
