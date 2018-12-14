<template>
  <div class="task-detail">
    <h1>{{entity.cityName}}</h1>
    <sub>{{entity.level | value(['', '一线城市', '二线城市', '三线城市', '四线城市'])}}</sub>
    <hr class="mt-10" />
    <div class="mt-10">
      <Form :label-width="1">
        <FormItem>
          <p>金牌代理企业: {{entity.goldCount || 0}}</p>
        </FormItem>
        <FormItem>
          <p>银牌代理企业: {{entity.silverCount || 0}}</p>
        </FormItem>
        <FormItem>
          <p>铜牌代理企业: {{entity.cuCount || 0}}</p>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'

export default {
  mixins: [detailMixin]
}
</script>
