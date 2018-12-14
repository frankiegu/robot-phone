<template>
  <div class="task-detail">
    <div v-show="!!firmId">
      <div class="cf">
        <div class="dib">
          <h1>{{firm.name}}</h1>
          <div>
            <sub class="mr30">ID： {{firm.id}}</sub>
            <sub>上级代理商：{{firm.proxyName}}</sub>
          </div>
        </div>
        <div class="fr">
          <div class="mb10">状态：{{statusMap[firm.status]}}</div>
          <i-switch v-model="firm.status" size="large" :true-value="1" :false-value="0" @on-change="handlerChangeStatus">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </div>
      </div>

      <hr class="mt20">
      <div class="mt20 pb20">
        <Row>
          <i-col :span="12" class="mb10">机器坐席数：{{firm.robotCount}}</i-col>
          <i-col :span="12" class="mb10">人工坐席数：{{firm.employeeCount}}</i-col>
          <i-col :span="12" class="mb10">固定坐席数：{{firm.fixedCount}}</i-col>
          <i-col :span="12" class="mb10">任务数量：{{firm.taskCount}}</i-col>
          <i-col :span="12" class="mb10">呼叫总数：{{firm.callAllCount}}</i-col>
          <i-col :span="12" class="mb10">创建时间：{{firm.createTime | dateFormat}}</i-col>
          <i-col :span="12" class="mb10">企业账号：{{firm.account}}</i-col>
          <i-col :span="12" class="mb10">企业密码：{{firm.password}}</i-col>
          <i-col :span="24">备注：{{firm.remarks || '无'}}</i-col>
        </Row>
      </div>
    </div>
    <!-- 没数据 -->
    <div v-show="!firmId" class="ptb50 tc"> <span>暂无数据</span> </div>
  </div>
</template>

<script>
const initFirm = () => {return {}}
const statusMap = ['禁用', '启用']
export default {
  props: {
    firmId: ''
  },
  data() {
    return {
      firm: initFirm(),
      statusMap
    };
  },
  computed: {},
  watch: {
    firmId (n) {
      if (n) {
        this.loadDetail()
      }else{
        this.firm = initFirm()
      }
    }
  },
  methods: {
    async loadDetail () {
      this.firm = await this.$smsApi.firm.getFirmDetail(this.firmId).catch(() => {
        return initFirm()
      })
    },
    async handlerChangeStatus(s) {
      let data = {
        id: this.firmId,
        status: s
      }
      await this.$smsApi.firm.updataStatus(data).then(()=>{
        this.$Message.success('操作成功')
      }).catch((e) => {
        return e
      })
      this.loadDetail()
    }
  },
};
</script>

<style>

</style>
