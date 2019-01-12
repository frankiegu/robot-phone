<template>
  <div class="task-detail">
    <div v-show="!!machineId">
      <div>
        <h1>{{machine.machineName}}</h1>
        <Row>
          <i-col span="3">ID：{{machine.id}}</i-col>
          <i-col span="3">端口数：{{machine.slotCount}}</i-col>
          <i-col span="4">sip号：{{machine.sipId}}</i-col>
          <i-col span="4">设备号：{{machine.machineNo}}</i-col>
          <i-col span="10">FS地址：{{machine.fsIpAddr}}</i-col>
        </Row>
      </div>

      <hr class="mt20">
      <div class="mt20 pb20">
        <Row>
          <i-col :span="24"
                 class="mb10">创建时间：{{machine.createTime | dateFormat}}</i-col>
        </Row>
        <Row>
          <i-col :span="8"
                 class="mb10">使用中：{{machine.useCount}}</i-col>
          <i-col :span="8"
                 class="mb10">空闲中：{{machine.freeCount}}</i-col>
        </Row>
        <Row>
          <i-col :span="8"
                 class="mb10">机器坐席数：{{machine.robotCount}}</i-col>
          <i-col :span="8"
                 class="mb10">人工坐席数：{{machine.peopleCount}}</i-col>
          <i-col :span="8"
                 class="mb10">固定坐席数：{{machine.fixedCount}}</i-col>
          <i-col :span="24">备注：{{machine.remarks || '无'}}</i-col>
        </Row>
        <h3 class="mtb10">设备包含企业信息</h3>
        <div>
          <!-- <ul v-if="machine.adminList && machine.adminList.length">
            <li v-for="(admin ,i) in machine.adminList"
                :key="i">{{admin.name}} {{admin.slotCount}}</li>
          </ul> -->
          <Row v-if="machine.adminList && machine.adminList.length">
            <i-col :span="8"
                   class="mb10"
                   v-for="(admin ,i) in machine.adminList"
                   :key="i">{{admin.name}} {{admin.slotCount}}</i-col>
          </Row>
          <div v-else>无</div>
        </div>
        <h3 class="mtb10">设备状态信息</h3>
        <div v-if="machine.machineType==='jmtx'">
          <Row>
            <i-col :span="8"
                   class="mb10">设备号名称：{{machine.gwid }}</i-col>
            <i-col :span="8"
                   class="mb10">中继线状态：{{machine.state }}</i-col>
            <i-col :span="8"
                   class="mb10">对接方式：{{machine.register}}</i-col>
            <i-col :span="8"
                   class="mb10">账户/主叫：{{machine.username }}</i-col>
            <i-col :span="8"
                   class="mb10">密码：{{machine.password || '无' }}</i-col>
            <i-col :span="8"
                   class="mb10">线路IP：{{machine.proxy || '无'}}</i-col>
            <i-col :span="8"
                   class="mb10">中继线前缀：{{machine.prefix || '无' }}</i-col>

          </Row>
        </div>
        <div v-else>
          <Row>
            <i-col :span="8"
                   class="mb10">网关状态：{{machine.state }}</i-col>
          </Row>
        </div>
      </div>
    </div>
    <!-- 没数据 -->
    <div v-show="!machineId"
         class="ptb50 tc">
      <span>暂无数据</span>
    </div>
  </div>
</template>

<script>
const initMachine = () => {
  return {};
};
export default {
  props: {
    machineId: ""
  },
  data() {
    return {
      machine: initMachine(),
    };
  },
  computed: {},
  watch: {
    machineId(n) {
      if (n) {
        this.loadDetail();
      } else {
        this.machine = initMachine();
      }
    }
  },
  methods: {
    async loadDetail() {
      this.machine = await this.$smsApi.machine
        .getMachineInfo(this.machineId)
        .catch((err) => {
          console.log(err)
          return initMachine();
        });
    },

  }
};
</script>

<style>
</style>
