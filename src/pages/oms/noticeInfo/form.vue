<template>
  <Form :label-width="120"
        :model="entity"
        :rules="rules"
        ref="form">
    <FormItem label="标题"
              prop="title">
      <Input placeholder="请输入标题"
             v-model.trim="entity.title"
             :maxlength="50" />
    </FormItem>
    <FormItem label="发布对象"
              prop="adminType">
      <ButtonGroup>
        <Button :type="adminTypes.indexOf('3') > -1 ? 'primary' : 'default'"
                @click="toggleAdminType('3')">省级代理</Button>
        <Button :type="adminTypes.indexOf('4') > -1 ? 'primary' : 'default'"
                @click="toggleAdminType('4')">市级代理</Button>
        <Button :type="adminTypes.indexOf('5') > -1 ? 'primary' : 'default'"
                @click="toggleAdminType('5')">企业</Button>
      </ButtonGroup>
    </FormItem>
    <FormItem>
      <ms-editor ref="editor" />
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
import noticeInfoApi from '@/api/common/noticeInfoApi'
import entity from './src/entity'

export default {
  mixins: [formMixin],
  data() {
    return {
      entity: entity(),
      rules: {
        title: [
          { required: true, message: '请输入标题' }
        ],
        adminType: [
          { required: true, message: '请选择发布对象' }
        ]
      }
    }
  },
  computed: {
    adminTypes: {
      get() {
        let adminType = this.entity.adminType
        return adminType ? adminType.split(',') : []
      },
      set(val) {
        this.entity.adminType = val.join(',')
      }
    }
  },
  methods: {
    getApi() {
      return noticeInfoApi
    },
    afterEntity(entity) {
      this.$refs.editor.setData(entity.content)
    },
    toggleAdminType(adminType) {
      let index = this.adminTypes.indexOf(adminType)
      if (index === -1) {
        this.adminTypes = this.adminTypes.concat([adminType])
      } else {
        let adminTypes = this.adminTypes.slice(0)
        adminTypes.splice(index, 1)
        this.adminTypes = adminTypes
      }
    },
    beforeSubmit(data) {
      data.content = this.$refs.editor.getData()
    }
  }
}
</script>
