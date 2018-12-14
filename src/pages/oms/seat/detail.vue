<template>
  <div class="task-detail">
    <div v-show="!!currentId">
      <div class="cf">
        <div class="fr">
          <Tag type="border" :color="tagColor[detail.status]">{{statusList[detail.status]}}</Tag>
        </div>
        <div class="mr100">
          <h1>{{detail.mobile}}</h1>
          <Row>
            <i-col span="6">{{detail.nickName}}</i-col>
            <i-col span="6">{{detail.cardType | cardType}}</i-col>
            <i-col span="12">共呼出{{detail.callNum || 0}}次</i-col>
          </Row>
        </div>
      </div>
      
      <hr class="mt20">
      
      <div class="mt20 pb20">
        <Row  class="mb10">
          <i-col class="mb10" :span="10">创建时间： {{detail.createTime | dateFormat}}</i-col>
          <i-col class="mb10" :span="10">有效期至： {{detail.endTime | dateFormat}}</i-col>
          <i-col class="mb10" :span="10">所属商家： {{detail.name}}</i-col>
          <i-col class="mb10" :span="10">市级代理商： {{detail.cityName}}</i-col>
          <i-col class="mb10" :span="10">所属设备： {{detail.machineName}}</i-col>
          <i-col class="mb10" :span="10">省级代理商： {{detail.provinceName}}</i-col>
          <i-col class="mb10" :span="10">所属端口： {{detail.slotNo}}</i-col>
        </Row>
      </div>
    </div>
    <!-- 没数据 -->
    <div v-show="!currentId" class="ptb50 tc"> <span>暂无数据</span> </div>

  </div>
</template>

<script>
const initdetail = () => {
  return {};
};
const status = ['审核中', '空闲', '已过期', '使用中', '异常']
const tagColor = ['blue','green','red','yellow']
const cardType = {'1': '机器人坐席','2': '人工坐席', '3': '固定坐席'}
export default {
  props: {
    currentId: ''
  },
  data() {
    return {
      detail: initdetail(),
      statusList: status,
      tagColor,

    };
  },
  computed: {},
  filters: {
    cardType (input){
      return cardType[`${input}`]
    },
  },
  watch: {
    currentId(n) {
      if (n) {
        this.loadDetail();
      } else {
        this.detail = initdetail();
      }
    }
  },
  methods: {
    async loadDetail() {
      this.detail = await this.$omsApi.seat
        .getDetail(this.currentId)
        .catch(() => {
          return initdetail();
        });
    },

  }
};
</script>

<style>

</style>
