<template>
  <Form :label-width="120"
        :model="entity"
        :rules="rules"
        ref="form">
    <FormItem label="话术名称"
              prop="name">
      <Input placeholder="请输入话术名称"
             v-model="entity.name"
             :maxlength="20" />
    </FormItem>

    <template v-if="isSms">
      <FormItem label="复制为"
                prop="owner">
        <Select v-model="entity.owner">
          <Option :value="1">共享话术</Option>
          <Option :value="2">企业话术</Option>
        </Select>
      </FormItem>

      <div v-show="entity.owner === 2">
        <FormItem label="运营商"
                  prop="platformId">
          <Select v-model="entity.platformId">
            <Option v-for="v in operatorList"
                    :key="v.id"
                    :value="v.id">{{v.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="企业"
                  prop="adminId"
                  required>
          <Select v-model="entity.adminId"
                  :disabled="!entity.platformId"
                  placeholder="请先选择运营商">
            <Option v-for="v in firmList"
                    :key="v.id"
                    :value="v.id">{{v.name}}</Option>
          </Select>
        </FormItem>
      </div>
      <template v-if="showAuthorization">
        <FormItem label="是否允许复制">
          <Checkbox v-model="entity.isCopy"
                    :true-value="1"
                    :false-value="0" />
        </FormItem>
        <FormItem label="是否允许导出">
          <Checkbox v-model="entity.isDownload"
                    :true-value="1"
                    :false-value="0" />
        </FormItem>
      </template>
    </template>

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
import whisperingNewApi from '@/api/common/whisperingNewApi'
import { isSms } from '../system'

export default {
  mixins: [formMixin],
  props: {
    showAuthorization: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      firmMap: {},
      platformId: '',
      entity: {
        adminId: '',
        name: '',
        owner: 1,
        platformId: '',
        whisperingId: '',
        isCopy: 1,
        isDownload: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入话术名称' }
        ]
      },
      operatorList: [],
      firmList: [],
      isSms: isSms()
    }
  },
  watch: {
    'entity.owner'(val) {
      if (val === 1) {
        delete this.rules.adminId
      } else if (val === 2) {
        this.rules.adminId = [
          { required: true, message: '请选择企业' }
        ]
      }
    },
    'entity.platformId'(val) {
      this.entity.adminId = ''
      if (!val) {
        this.firmList = []
      } else if (this.firmMap[val]) {
        this.firmList = this.firmMap[val]
      } else {
        this.getFirmList(val).then(data => {
          this.firmList = this.firmMap[val] = data
        })
      }
    }
  },
  created() {
    this.getOperateList()
  },
  methods: {
    getOperateList() {
      return whisperingNewApi.listSelectOperator().then(data => {
        this.operatorList = data
      })
    },
    getFirmList(platformId) {
      return whisperingNewApi.listAllFirm({
        id: platformId
      })
    },
    submit() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          let entity = Object.assign({}, this.entity)
          if (this.beforeSubmit(entity) !== false) {
            whisperingNewApi.copy(entity).then(data => {
              this.$emit('after-submit', data, entity)
            })
          }
        }
      })
    },
    beforeSubmit(data) {
      if (data.owner === 1) {
        delete data.platformId
        delete data.adminId
      }
    }
  }
}
</script>
