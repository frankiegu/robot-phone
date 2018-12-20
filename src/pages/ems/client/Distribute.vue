<template>
  <div style="margin-right: -16px;">
    <div class="block">
      <div class="block-header">
        选择人工坐席
      </div>
      <div class="block-body">
        <Form inline
              class="clear"
              ref="form"
              :model="form">
          <div class="fr">
            <FormItem>
              <Input type="text"
                     search
                     @on-search="handleSearch"
                     placeholder="输入坐席号码/名称"
                     v-model="form.name_mobile" />
            </FormItem>
            <FormItem>
             
            </FormItem>
          </div>
          <FormItem >
            <Select style="width:195px;" v-model="form.status">
              <Option value="">请选择</Option>
              <Option value="0">未开始</Option>
              <Option value="1">正常</Option>
              <Option value="2">已过期</Option>
              <Option value="3">使用中</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="plate plate-simple">
          <div v-for="item in artList"
               :key="item.cardId"
               class="plate-item"
               :class="{active: item.cardId === selected}"
               @click="handleCalling(item.cardRelateId)">
            <h3>{{ item.mobile }}</h3>
            <p>{{ item.nickName }}</p>
          </div>
        </div>
        <div class="bottom">
          <p>共 {{ artList.length }} 个人工坐席</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/api/index'

const API_CLIENT = API.ems.client

export default {
  data() {
    return {
      form: {
        status: '',
        name_mobile: ''
      },
      selected: '',
      artList: []
    }
  },
  methods: {
    handleCalling(cardRelateId) {
      this.$emit('click', cardRelateId)
    },
    handleSearch() {
      API_CLIENT.getClientArtList(this.form)
        .then(res => {
          this.list = res
        })
    },
    getArtList() {
      API_CLIENT.getClientArtList()
        .then(res => {
          this.artList = res
        })
    }
  }
}
</script>
