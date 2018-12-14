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
            <i-col span="8">{{detail.name}}</i-col>
            <i-col span="16">共呼出{{detail.callNum || 0}}次</i-col>
          </Row>
        </div>
      </div>
      
      <hr class="mt20">
      
      <div class="mt20 pb20">
        <Row  class="mb10">
          <i-col :span="10">创建时间： {{detail.createTime | dateFormat}}</i-col>
          <i-col :span="10">有效期至： {{detail.endTime | dateFormat}}</i-col>
        </Row>
      </div>
      <!-- <div class="bb fs16 ptb10 mtb20"> 续费记录 </div>
      <div v-if="!renewRecords.length">无</div>
      <div v-else class="bd" v-for="(item,i) in renewRecords">
        <Row class="pd10">
          <i-col span="8">续费时间：{{item.year}} 年</i-col>
          <i-col span="8">续费后有效期至：{{item.endTime | dateFormat}}</i-col>
          <i-col span="8">操作时间：{{item.createTime | dateFormat}}</i-col>
        </Row>
      </div> -->
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

export default {
  props: {
    currentId: ''
  },
  data() {
    return {
      detail: initdetail(),
      renewRecords: [],
      statusList: status,
      tagColor,

    };
  },
  computed: {},
  watch: {
    currentId(n) {
      if (n) {
        this.loadDetail();
        this.loadRenewRecords();
      } else {
        this.detail = initdetail();
        this.renewRecords = []
      }
    }
  },
  methods: {
    async loadDetail() {
      this.detail = await this.$pmsApi.seat
        .getSeatDetail(this.currentId)
        .catch(() => {
          return initdetail();
        });
    },
    async loadRenewRecords(){
      this.renewRecords = await this.$pmsApi.seat
        .getRenewRecord(this.currentId)
    },
    handlerChangeStatus(s){
      let data = {
        id: this.currentId,
        status: s
      }
      // await this.$smsApi.firm.updataStatus(data).then(()=>{
      //   this.$Message.success('操作成功')
      // }).catch((e) => {
      //   return e
      // })
      this.loadDetail()
    }

  }
};
</script>

<style>

</style>
