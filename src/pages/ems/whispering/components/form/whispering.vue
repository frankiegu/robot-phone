<template>
  <Form :label-width="260"
        :model="entity"
        :rules="rules"
        ref="form">
    <FormItem label="话术分类"
              prop="type">
      <whispering-type-select widths="460px" v-model="entity.type" />
    </FormItem>
    <FormItem label="话术名称"
              prop="title">
      <Input placeholder="请输入话术名称"
             style="width:460px"
             v-model="entity.title"
             :maxlength="20" />
    </FormItem>
    <FormItem label="未匹配关键字流程次数"
              prop="noKeyCount">
      <InputNumber :max="10"
                   style="width:460px"
                   :min="1"
                   v-model="entity.noKeyCount" />
      <!-- <p class="c-warning help-block">未匹配到关键字时播放的【未匹配关键字流程】节点的次数，超过这个次数后将不再触发【未匹配关键字流程】</p> -->
    </FormItem>
    <FormItem label="未匹配关键字字数"
              prop="noKeyNum">
      <InputNumber :max="10"
                   :min="4"
                   style="width:460px"
                   v-model="entity.noKeyNum" />
      <!-- <p class="c-warning help-block">当客户语音未匹配到关键字时，客户语音达到xx个字触发【未匹配关键字流程】</p> -->
    </FormItem>
    <FormItem label="无人应答流程次数"
              prop="noReplyNum">
      <InputNumber :max="10"
                   :min="1"
                   style="width:460px"
                   v-model="entity.noReplyNum" />
      <!-- <p class="c-warning help-block">当客户语音被识别为无人应答时播放的【无人应答流程】节点的次数，超过这个次数后将不再触发【无人应答流程】</p> -->
    </FormItem>

      <div style="border-top: 1px solid #e8eaec;padding-top:20px;">
       <div style="float:right">
          <Button 
              style="margin-right: 8px"
              @click="cancel">取消</Button>
      <Button type="primary"
              @click="submit">确定</Button>
       </div>
      </div>
  </Form>
</template>

<script>
import { formMixin } from '@/mixins'
import { WhisperingTypeSelect } from '@/components/packages/ems/select'
import entity from '../../src/entity'
import whisperingApi from '@/api/ems/whispering'

export default {
  mixins: [formMixin],
  components: {
    WhisperingTypeSelect
  },
  data() {
    return {
      entity: entity({
        noKeyCount: 3,
        noKeyNum: 5,
        noReplyNum: 3
      }),
      rules: {
        type: [
          { required: true, message: '请选择话术分类' }
        ],
        title: [
          { required: true, message: '请选择话术名称' }
        ]
      }
    }
  },
  methods: {
    mysubmit(){
      this.submit();
    },
    getApi() {
      return whisperingApi
    }
  }
}
</script>
