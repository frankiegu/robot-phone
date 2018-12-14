<template>
  <div class="task-detail">
    <div class="cf">
      <div class="dib">
        <h1>{{entity.wordName}}</h1>
        <sub>ID: {{entity.id}}</sub>
      </div>
    </div>
    <hr class="mt-20">
    <div class="mt-20">
      <Row>
        <i-col span="16">
          <p class="mt20">客户名字：{{entity.name}}</p>
        </i-col>
      </Row>
      <Row>
        <i-col span="16">
          <p class="mt20">电话号码：{{entity.phone}}</p>
        </i-col>
      </Row>
      <Row>
        <i-col span="16">
          <p class="mt20">白名单类型:{{getType(entity.type)}}</p>
        </i-col>
      </Row>
      <Row>
        <i-col span="16">
          <p class="mt20">备注：{{entity.remarks || '无'}}</p>
        </i-col>
      </Row>
      <Row>
        <i-col span="16">
          <p class="mt20">创建时间：{{entity.createTime | date}}</p>
        </i-col>
      </Row>

    </div>
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'
import wordDbApi from '@/api/sms/wordDb'
import userWhite from '../../src/userWhite'
import {getType} from '@/util'
export default {
  mixins: [detailMixin],
  data() {
    return {
      statusMap: { '0': '否', '1': '是' },
    }
  },
  methods:{
    getType(type){
      return getType(type)
    }
  }
}
</script>