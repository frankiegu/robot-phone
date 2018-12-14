<template>
  <div class="task-detail">
  
    <div style="line-height:32px" class="fs14">
      <span class="fs16" v-if="!isEditNick">{{detail.nickName}}</span>
      <i-input v-model="detail.nickName" v-else style="width:80px" class="vm" size="small"></i-input>
      <Icon type="ios-create-outline" @click.native="changeEdit" class="fs20 vm"/>
      <em class="ml-10 vm">共呼出{{detail.calledCount}}次</em>
      <em class="ml-20">总通话时长：{{detail.callAllTime | duration}}</em>
      <em class="ml-20">设备名称: {{detail.machineName || '无'}}</em>
      <em class="ml-20">设备号: {{detail.machineNo || '无'}}</em>
      <em class="ml-20">设备端口号:{{detail.slotNo|| '无'}}</em>
      <ins
        style="margin-left:20px"
        class="keyword-item keyword-primary"
        :class="{'keyword-success':detail.status==1,'keyword-default':detail.status==0,'keyword-primary':detail.status==3,'keyword-danger':detail.status==2}"
      >{{detail.status|seatStatus}}</ins>
    </div>
    <div class="fs14 mt-10">
      <em>创建时间：{{detail.createTime|msToDate}}</em>
      <em class="ml-20">有效时间：{{detail.endTime|msToDate}}</em>
    </div>
    <div class="baseinfo_w700 fleX">
      <div>
        <P>{{callTotalNum(detail.receivingStatus)}}</P>
        <P>呼叫总量</P>
      </div>
      <div v-for="(item,index) in detail.receivingStatus" :key="index">
        <P>{{callNum(item.value)}}</P>
        <P>{{item.name}}</P>
      </div>
     
    </div>
    <!-- </sub> -->
    <hr class="mt-20">
    <div class="databar mt-20" style="border-bottom:none;">
      <ul class="databar-item">
       <li class="databar-title">客户意向等级</li>
        <li class="border-R" v-for="(item,index) in detail.userLevel" :key="index">
             {{item.name}}级
              <Progress :stroke-width="4" :percent="Number((item.value).substr(0,item.value.length-1))">
              <span>{{item.value}}</span>
            </Progress>
        </li>
       
      </ul>
      <ul class="databar-item">
        <li class="databar-title">通话时长</li>
        <li  class="border-R" v-for="(item,index) in detail.callTimeList" :key="index">
         <span style="width:4rem;display:inline-block;">{{item.name}}</span>
              <Progress :stroke-width="4" class="callTime_ss" style="width:70%" :percent="Number((item.value).substr(0,item.value.length-1))">
              <span>{{item.value}}</span>
            </Progress>
        </li>
      </ul>
      <ul class="databar-item">
        <li class="databar-title">对话轮次</li>
        <li v-for="(item,index) in detail.callCount" :key="index">
         <span style="width:3rem;display:inline-block;">{{item.name}}</span>
              <Progress :stroke-width="4" class="callTime_ss2" style="width:85%;" :percent="Number((item.value).substr(0,item.value.length-1))">
              <span>{{item.value}}</span>
            </Progress>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>

</style>

<script>
export default {
  data() {
    return {
      isEditNick: false,
      update: false
    };
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {
    this.$watch("detail.nickName", function(nv, ov) {
      this.update = true;
    });
  },
  methods: {
      callTotalNum(arr){
          let sum = 0;
          arr.map((item)=>{
              sum+=Number((item.value).substr(0,item.value.length-1));
          })
          return sum;
      },
      callNum(num){
          return num.substr(0,num.length-1)
      },
    changeEdit() {
      this.isEditNick = !this.isEditNick;
      if (this.update) {
        this.updateNickName();
      }
    },
    async updateNickName() {
      let vm = this;
      let result = await this.$emsApi.cardSlot.updateNickName({
        id: +vm.detail.id,
        nickName: vm.detail.nickName
      });
      this.update = false;
    }
  }
};
</script>
