<template>
  <div class="task-detail">
    <div v-show="!!currentId">
      <div class="cf">
        <div class="fr">
          <Tag type="border" :color="tagColor[detail.status]">{{statusList[detail.status]}}</Tag>
        </div>
        <div class="mr100">
          <h1>{{detail.mobile}}<span class="idText">{{detail.cardType | cardType}}</span></h1>
         
        </div>
      </div>  
       <div class=" ivu-row">
                 <div class="ivu-col ivu-col-span-5">
                    <p>通话次数： {{detail.callNum || 0}}次</p>
                </div>
                <div class="ivu-col ivu-col-span-5">
                    <p>创建时间： {{detail.createTime | dateFormat}}</p>
                </div>
                <div class="ivu-col ivu-col-span-5">
                    <p>到期时间： {{detail.endTime | dateFormat}}</p>
                </div>
               
            </div>  
             <div class="ivu-row">
                 <div class="ivu-col ivu-col-span-5">
                    <p>企业名称： {{detail.name}}</p>
                </div>
                <div class="ivu-col ivu-col-span-5">
                    <p>市级代理商： {{detail.cityName}}</p>
                </div>
                <div class="ivu-col ivu-col-span-5">
                    <p>省级代理商： {{detail.provinceName}}</p>
                </div>
               
            </div> 
             <div class="ivu-row">
                 <div class="ivu-col ivu-col-span-5">
                    <p>所属设备： {{detail.machineName}}</p>
                </div>
                <div class="ivu-col ivu-col-span-5">
                    <p>所属端口： {{detail.slotNo}}</p>
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
