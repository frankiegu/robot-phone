<template>
  <div class="task-detail">
    <div v-show="!!labelId">
      <div class="cf">
        <div class="dib">
          <h1>{{label.labelName}}</h1>
          <sub>ID: {{label.id}}</sub>
        </div>
        <div class="fr">
          <div class="mb10">状态：{{statusMap[label.status]}}</div>
          <i-switch v-model="label.status" size="large" :true-value="1" :false-value="0" @on-change="handlerChangeStatus">
            <span slot="open">开启</span>
            <span slot="close">禁用</span>
          </i-switch>
        </div>
      </div>
      <hr class="mtb20">
      <div class="mb10">创建时间：{{label.createTime | msToDate}}</div> 
      <div class="mb10">标签包含客户数：{{label.userCount}}</div>
      <div class="mb10">标签说明：{{label.labelDescribe}}</div>

    </div>
  <!-- 没数据 -->
    <div v-show="!labelId" class="ptb50 tc"> <span>暂无数据</span> </div>
  </div>
</template>
<script>
export default {
  props: {
    labelId: ""
  },
  data() {
    return {
      label: {
        id: '',
        labelName: '',
        labelDescribe: '',
        status: '',
        createTime: '',
        userCount: ''
      },
      statusMap: {'0': '禁用', '1': '启用'}
      
    };
  },
  computed: {},
  watch: {
    labelId(n) {
      if (n) {
        this.loadDetail();
      }else{
        this.label = {
          id: '',
          labelName: '',
          labelDescribe: '',
          status: '',
          createTime: '',
          userCount: ''
        }
      }
    }
  },
  methods: {
    loadDetail() {
      this.$emsApi.labelInfo
        .getLabelDetail(this.labelId)
        .then(data => {
          this.label = data;
        });
    },
    async handlerChangeStatus(e) {
      let {id, labelName, labelDescribe, status} = this.label
      let label = {id, labelName, labelDescribe, status}
      label.status = e ? 1 : 0
      await this.$emsApi.labelInfo.updateLabel(label).catch(() => {})
      this.loadDetail()
    },
  },
  created() {}
};
</script>

