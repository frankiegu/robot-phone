<template>
  <div>
    <div class="task">
      <div class="task-l1" style="width:28rem;">
        <div class="board" style="border-radius:0;">
          <div class="board-body" style="padding-top:0;padding-bottom:0;">
            <p>姓名: {{entity.userName}}</p>
            <p>电话: {{entity.mobile}}</p>
            <hr>
          </div>
          <div class="board-body">
            <p>任务名称: {{entity.taskName}}</p>
            <p>话术模板: {{entity.whisperingTitle}}</p>
            <p>机器坐席: {{entity.cardMobile}}</p>
            <p>呼叫时间: {{entity.callStartTime}}</p>
            <hr style="margin-bottom:10px;">
            <div class="nail">
              <div class="nail-item">
                <p class="h3">{{entity.callAllTime | duration }}</p>
                <p>通话时长</p>
              </div>
              <div class="nail-item">
                <p class="h3">{{entity.callCount || 0}}轮</p>
                <p>通话轮次</p>
              </div>
              <div class="nail-item">
                <p class="h3">{{entity.userLevel}}</p>
                <p>意向等级</p>
              </div>
            </div>

            <p class="mt-20">命中关键字: {{entity.keywords.length}}个</p>
            <div class="keyword">
              <ins
                class="keyword-item"
                v-for="(v, i) in entity.keywords"
                :key="i"
                :class="{'keyword-effect': v.status === 1}"
              >{{v.keyWord}}</ins>
            </div>
          </div>
        </div>
        <div class="fleX pd30" v-if="isShow">
          <Button :disabled="isdisable1" type="primary" ghost @click="upPage(0)">上一条</Button>
          <Button :disabled="isdisable2" type="primary" ghost @click="upPage(1)">下一条</Button>
        </div>
      </div>
      <div class="task-r1" style="width:100%;">
        <chat :data="entity" :autoScroll="autoScroll"/>
      </div>
    </div>
  </div>
</template>

<script>
import { detailMixin } from "@/mixins";
import Chat from "./components/chat.vue";
import callRecordApi from "@/api/ems/callRecord";
export default {
  mixins: [detailMixin],
  components: {
    Chat
  },
  props: {
    autoScroll: {
      type: Boolean,
      default: false
    },
    isShow:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isdisable1:false,
      isdisable2:false,
      entity: {
        keywordList: []
      }
    };
  },
  created () {
    //console.log("entity",this.entity)
    if(this.entity.tableData.length<=1){
        this.isdisable1 = true;
         this.isdisable2 = true;
      }else if(this.entity.currentIndex==0){
         this.isdisable1 = true;
      }
      else if(this.entity.currentIndex+1==this.entity.tableData.length){
         this.isdisable2 = true;
      }
      else{
        this.isdisable1 = false;
         this.isdisable2 = false;
      }
  },
  methods:{
    
    upPage(num){
      let currentIndex = this.entity.currentIndex;
      let tableList = this.entity.tableData;           
       if(num === 0){
        currentIndex--
        if(currentIndex<=0){
          this.isdisable1 = true;
        }
        else{
          this.isdisable1 = false;
          this.isdisable2 = false;
        }
         this.$emit('showdetail',tableList[currentIndex].id,currentIndex);
         
      }
      else{
        currentIndex++;
        if(currentIndex+1>=tableList.length){
          this.isdisable2 = true;
        }
        else{
           this.isdisable1 = false;
           this.isdisable2 = false;
        }
        this.$emit('showdetail',tableList[currentIndex].id,currentIndex);
        // 用于判断是否已读
          if(tableList[currentIndex].isRead === 0){
            console.log('====',tableList[currentIndex].isRead);
            callRecordApi.isRead({ callId: tableList[currentIndex].id }).then(res => {
                            this.$emit('listdetail',tableList[currentIndex].id)
                          });
          }
      }
    }
  }
};
</script>
