<template>
  <div class="task-detail">
    <div class="title" style="border-bottom:1px solid #f1f1f1;padding-bottom:10px;">基础信息</div>
   <Row>
         <i-col span="4"><p>客户：{{entity.name || '--'}}</p></i-col>
         <i-col span="4"><p>白名单类型:{{getType(entity.type)}}</p></i-col>
         <i-col span="4"><p>备注:{{entity.remarks || '--'}}</p></i-col>
         <i-col span="6"><p>创建时间：{{entity.createTime | msToDate}}</p></i-col>
        </Row>
  </div>
</template>

<script>
import { detailMixin } from "@/mixins";
import { getType } from '@/util'
export default {
  mixins: [detailMixin],
  methods: {
    getType(type) {
      return getType(type)
    }
  }
};
</script>