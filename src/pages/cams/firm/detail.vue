<template>
  <div class="task-detail">
    <!-- 有数据 -->
    <div v-show="!!currentId">
      <div class="cf">
        <div class="fr">
          <div class="mb10">状态：{{statusMap[detail.status]}}</div>
          <i-switch v-model="detail.status" size="large" :true-value="1" :false-value="0" @on-change="handlerChangeStatus">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </div>
        <div class="mr100">
          <h1>{{detail.name}}</h1>
          <div span="6">ID：{{detail.id}}</div>
        </div>
      </div>
      
      <hr class="mt20">
      
      <div class="mt20 pb20">
        <Row>
          <i-col :span="8" class="mb10">机器坐席数：{{detail.robotCount}}</i-col>
          <i-col :span="8" class="mb10">人工坐席数：{{detail.employeeCount}}</i-col>
          <i-col :span="8" class="mb10">固定坐席数：{{detail.fixedCount}}</i-col>
        </Row>
        <Row>
          <i-col :span="8" class="mb10">任务数量：{{detail.taskCount}}</i-col>
          <i-col :span="8" class="mb10">呼叫总数：{{detail.callAllCount}}</i-col>
          <i-col :span="24">创建时间：{{detail.createTime | dateFormat}}</i-col>

          <i-col :span="24">备注：{{detail.remarks || '无'}}</i-col>
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
const statusMap = ['禁用', '启用']
export default {
  props: {
    currentId: ''
  },
  data() {
    return {
      detail: initdetail(),
      statusMap
    };
  },
  computed: {},
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
      this.detail = await this.$pmsApi.firm
        .getDetail(this.currentId)
        .catch(() => {
          return initdetail();
        });
    },
    async handlerChangeStatus(s){
      let data = {
        id: this.currentId,
        status: s
      }
      await this.$pmsApi.firm.updateStatus(data).then(()=>{
        this.$Message.success('操作成功')
      }).catch((e) => {
        return e
      })
      this.loadDetail()
    }

  }
};
</script>
