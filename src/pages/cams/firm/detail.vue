<template>
  <div class="task-detail">
    <!-- 有数据 -->
    <div v-show="!!currentId">
      <div class="cf">
        <div class="fr">
          <i-switch v-model="detail.status" size="large" :true-value="1" :false-value="0" @on-change="handlerChangeStatus">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </div>
        <div class="mr100">
          <h1>{{detail.name}} <span class="idText">ID：{{detail.id}}</span></h1>
        </div>
      </div>   
       <div class="mt-5 ivu-row">
                 <div class="ivu-col ivu-col-span-7">
                    <p>AI坐席数: {{detail.robotCount}}</p>
                </div>
                <div class="ivu-col ivu-col-span-7">
                    <p>人工坐席数: {{detail.employeeCount}}</p>
                </div>
                <div class="ivu-col ivu-col-span-7">
                    <p>智能坐席数: {{detail.fixedCount}}</p>
                </div>
               
            </div>
             <div class="mt-5 ivu-row">
                 <div class="ivu-col ivu-col-span-7">
                    <p>任务数: {{detail.taskCount}}</p>
                </div>
                <div class="ivu-col ivu-col-span-7">
                    <p>呼叫总数: {{detail.callAllCount}}</p>
                </div>
                <div class="ivu-col ivu-col-span-7">
                    <p>创建时间: {{detail.createTime | dateFormat}}</p>
                </div>
               
            </div>
             <div class="mt-5 ivu-row">
                 <div class="ivu-col ivu-col-span-7">
                    <p>备注: {{detail.remarks || '无'}}</p>
                </div>
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
