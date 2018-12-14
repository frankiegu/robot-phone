<template>
  <div>
    <div class="divide" :class="{full: fullScreen}">
      <div class="divide-item">
        <div class="panel">
          <div class="panel-body">
            <i-form class="panel-form clear" inline>
              <FormItem>
                <DatePicker v-model="queryCreateTime" type="daterange" placeholder="选择创建时间" class="w200"></DatePicker>
              </FormItem>
              <div class="fr">
                <FormItem>
                <i-input v-model="query.machine_no" type="text" placeholder="搜索设备号" @on-enter="handlerSearch">
                </i-input>
              </FormItem>
                <FormItem>
                  <i-button type="primary" @click="handlerSearch">查询</i-button>
                </FormItem>
              </div>
            </i-form>
          </div>
        </div>
      </div>
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              设备列表
              <div class="panel-header-tools">
                <i-button type="primary" icon="plus" @click="handlerAdd">添加设备</i-button>
              </div>
            </div>
            <div class="panel-body">
              <ul class="list">
                <li v-for="(item,i) in machineList" :key="i" :class="{'active' : currentMachine.id == item.id }" @click="handlerChangeMachine(item)">
                  <div class="list-item">
                    <div class="list-item-main">
                      <p class="list-item-title">{{item.machineName}}</p>
                      <div class="list-item-info">
                        <span>总: {{item.slotCount}}</span>
                        <span>使用: {{item.useCount}}</span>
                        <span>空闲: {{item.freeCount}}</span>
                        <span>机: {{item.robotCount}}</span>
                        <span>人: {{item.peopleCount}}</span>
                        <span>固: {{item.fixedCount}}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>

              <Page class="pagination" show-sizer simple :total="machineTotal" :current="currentPage" @on-change="onPageChange" />
            </div>
          </div>
        </div>
        
        <div class="task-r divide-main">
          <div class="panel">
            <div class="panel-header">
              <i class="icon icon-enlarge panel-header-icon" :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'" @click="() => fullScreen = !fullScreen"></i>
              设备详情
              <div class="panel-header-tools" v-show="currentMachine && currentMachine.id">
                <i-button type="primary" @click="handlerEdit">编辑</i-button>
                <i-button type="error" @click="handlerDelete">删除</i-button>
              </div>
            </div>
            <div class="panel-body"   v-show="currentMachine && currentMachine.id">
              <Tabs value="1" v-model="tabName">
                <TabPane label="基础信息" name="1">
                  <machine-detail ref="detail" :machine-id="currentMachine ? currentMachine.id : ''"></machine-detail>
                </TabPane>
                <TabPane label="端口列表" name="2">
                  <port-list v-if="tabName=='2'" :machine-id="currentMachine ? currentMachine.id : ''"></port-list>
                </TabPane>
              </Tabs>
            </div>
            <div class="panel-body" v-show="!currentMachine || !currentMachine.id" >
              <p class="nodata">暂无数据!!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <new-machine v-model="newMachineShow"
              :title="newMachine.id ? '编辑设备' : '新增设备'" :entry="newMachine" @after-save="handlerAfterSave"></new-machine>

<!--     
    <ms-panel v-model="newMachineShow"
              :title="newMachine.id ? '编辑设备' : '新增设备'">
              
    </ms-panel> -->
  </div>
</template>

<script>
import tableMixin from "@/mixins/table-mixin.js";
import machineDetail from "./detail";
import portList from "./port-list";
import newMachine from "./components/new-machine";


const newMachineEntry = {
  id: '',
  fsIpAddr: '',// (string): fs的地址和端口号 ,
  machineName: '',// (string): 机器名称 ,
  machineNo: '',// (string): 机器编号 ,
  sipId: '',// (string): sip编号 ,
  slotCount: 8,// (integer): 机器端口数
}
export default {
  data() {
    return {
      tabName:'1',
      fullScreen: false,
      query: {
        startTime: '',
        endTime: '',
        machine_no: '',
        pageSize: 10,
        pageNum: 1
      },
      queryCreateTime: [],
      machineList: [],
      machineTotal: 0,
      currentMachine: {}, // 保存当前设备
      newMachine: {},
      newMachineShow: false,
    };
  },
  mixins: [tableMixin],
  components: {
    machineDetail,
    portList,
    newMachine,
  },
  computed: {
    currentPage() {
      return this.query.pageNum;
    }
  },
  watch: {
    queryCreateTime: {
      handler(n){
        this.query.startTime = n[0] ? n[0].getTime() : ''
        this.query.endTime = n[1] ? n[1].getTime() : ''
        this.handlerSearch()
      },
      deep: true
    },
  },
  methods: {
    async init (){
      this.currentMachine = await this.loadMachineList()
    },
    async loadMachineList() {
      return this.$smsApi.machine.getMachineList(this.query).then(data => {
        this.machineList = data.dataList
        this.machineTotal = data.totalNum
        return data.dataList.length ? data.dataList[0] : {}
      }).catch(() => {
        return {}
      })
    },
    handlerSearch() {
      this.onPageChange(1)
    },
    onPageChange(n) {
      this.query.pageNum = n;
      this.init();
    },
    handlerChangeMachine(machine){
      this.currentMachine = machine
    },
    handlerAdd(){
      this.newMachineShow = true
      this.newMachine = {...newMachineEntry}
    },
    async handlerEdit (){
      this.newMachineShow = true
      let data = await this.loadDetail()
      this.newMachine = data
    },
    async loadDetail() {
      return await this.$smsApi.machine
        .getMachineInfo(this.currentMachine.id)
    },
    handlerAfterSave(isEdit){
      this.loadMachineList()
      if (isEdit) {
        this.$refs.detail.loadDetail()
      }
    },
    handlerDelete (){
      this.$Modal.confirm({
        title: '提示',
        content: '该操作将删除该设备，是否继续',
        onOk: () => {
          this.$smsApi.machine.deleteMachine(this.currentMachine.id).then(() => {
            if (this.query.pageNum > 1 && this.machineList.length == 1) {
              --this.query.pageNum
            }
            this.init()
          })
        },
      });
    },

  },
  created() {
    this.init()
  }
};
</script>
