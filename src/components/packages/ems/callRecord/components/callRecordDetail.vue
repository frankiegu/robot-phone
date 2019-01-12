<template>
  <div>
    <div class="task">
      <div class="task-l1" style="width:28rem;">
        <div class="board" style="border-radius:0;">
          <div class="board-body pl" style="padding-top:0;padding-bottom:0;">
            <p>姓名: {{entity.userName}}</p>
            <p>电话: {{entity.mobile}}</p>
            <hr>
          </div>
          <div class="board-body pl pr">
            <p><span class="mr-5">任务名称: </span>{{entity.taskName}}</p>
            <p><span class="mr-5">话术模板: </span>{{entity.whisperingTitle}}</p>
            <p><span class="mr-5">机器坐席: </span>{{entity.cardMobile}}</p>
            <p><span class="mr-5">呼叫时间: </span>{{entity.callStartTime}}</p>
            <!-- 新增计划任务 -->
            <div class="box-flex" v-show="entity.recordPlan.length>0">
              <p>计划任务：</p>
              <div :class="showHidden?'overflow':''">
                <p v-for="item in entity.recordPlan" :key="item.id">
                  <span class="text"><span class="mr-10">{{item.planDate}}</span>{{item.planContent}}</span>
                  <span class="redDelete" @click="deletePlan(item.id)">删除</span>
                </p>
              </div>
            </div>
            <div v-show="ShowExpand" class="blue_link tc" @click="showExpand">{{showHidden?'展开':'收缩'}}</div>
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

            <p class="mt-20" v-show="entity.keywords.length>0">命中关键字: {{entity.keywords.length}}个</p>
            <div class="keyword">
              <ins
                class="keyword-item"
                v-for="(v, i) in entity.keywords"
                :key="i"
                :class="{'keyword-effect': v.status === 1}"
              >{{v.keyWord}}</ins>
            </div>
            <!-- 工单记录 -->
            <div class="tableWap" v-show="entity.recordWorkorder.length">
              <table class="workTable" border="1px" cellspacing="0" cellpadding="0">
                <tr v-for="(item,index) in entity.recordWorkorder" :key="index">
                  <td>{{item.workorderItem}}</td>
                  <td>{{item.workorderValue}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="posb" v-if="isShow">
          <Button :disabled="isdisable1" type="primary" class="ml-30" @click="upPage(0)">上一条</Button>
          <span class="circle ml-40" @click="newPlan">计划</span>
          <Button :disabled="isdisable2" type="primary" class="ml-40" @click="upPage(1)">下一条</Button>
        </div>
      </div>
      <div class="task-r1" style="width:100%;">
        <chat :data="entity" :autoScroll="autoScroll"/>
      </div>
    </div>
    <Modal
      class-name="vertical-center-modal"
      :mask-closable="false"
      title="计划任务"
      width="450"
      v-model="showPlan"
    >
      <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
        <FormItem prop="dates" label="计划时间：">
          <DatePicker v-model="formInline.dates" type="date" placeholder="请选择日期" style="width: 300px"></DatePicker>
        </FormItem>
        <FormItem prop="text" label="计划内容：">
         <Input v-model="formInline.text" style="width: 300px" type="textarea" placeholder="请输入计划内容" />
        </FormItem>
       
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelPlan">取消</Button>
        <Button type="primary" @click="entruePlan">确定</Button>
      </div>
    </Modal>
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
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showPlan: false,
      showHidden:true,
      ShowExpand:false,
      isdisable1: false,
      isdisable2: false,
      entity: {
        keywordList: []
      },
      formInline: {
        dates: "",
        text: ""
      },
      ruleInline: {
        dates: [
          {
            required: true,
            type: 'date',
            message: "请选择日期",
            trigger: "blur"
          }
        ],
        text: [
          {
            required: true,
            message: "请输入计划内容",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    //console.log("entity",this.entity)
    if (this.entity.tableData.length <= 1) {
      this.isdisable1 = true;
      this.isdisable2 = true;
    } else if (this.entity.currentIndex == 0) {
      this.isdisable1 = true;
    } else if (this.entity.currentIndex + 1 == this.entity.tableData.length) {
      this.isdisable2 = true;
    } else {
      this.isdisable1 = false;
      this.isdisable2 = false;
    }
    // 初始化新增计划内容
      this.formInline.dates = '';
      this.formInline.text = '';
  },
  watch: {
    "entity.recordPlan.length"(){
      if(this.entity.recordPlan.length>5){
        this.ShowExpand = true;
        
      }
      else{
        this.ShowExpand = false;
      }
    }
  },
  methods: {
    showExpand(){
      this.showHidden = !this.showHidden; 
    },
    entruePlan(){
      this.handleSubmitPlan("formInline")
    },
    handleSubmitPlan(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params={
            "callId": this.entity.id,
            "planDate":this.dateSwitch(this.formInline.dates),
            "planContent": this.formInline.text
          }
          callRecordApi.addPlan(params).then((res)=>{
             let currentIndex = this.entity.currentIndex;
             let tableList = this.entity.tableData;
            this.$emit("showdetail", tableList[currentIndex].id, currentIndex);
          })
          this.$Message.success("Success!");
          this.showPlan = false;
        } else {
          this.$Message.error("请输入必填选项");
        }
      });
    },
    // 新增计划任务
    newPlan() {
      this.showPlan = true;
    },
    dateSwitch(time){
       var d = new Date(time);
       var times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
       return times
    },
    //删除计划
    deletePlan(id){
      this.$Modal.confirm({
                    title: '计划任务',
                    content: '<p>确定删除计划任务?</p>',
                    onOk: () => {
                       callRecordApi.deletePlan(id).then((res)=>{
                         let currentIndex = this.entity.currentIndex;
             let tableList = this.entity.tableData;
            this.$emit("showdetail", tableList[currentIndex].id, currentIndex);
                       });
                    },
                    onCancel: () => {
                       
                    }
                });
      
    },
    cancelPlan() {
      this.showPlan = false;
    },
    upPage(num) {
      let currentIndex = this.entity.currentIndex;
      let tableList = this.entity.tableData;
      if (num === 0) {
        currentIndex--;
        if (currentIndex <= 0) {
          this.isdisable1 = true;
        } else {
          this.isdisable1 = false;
          this.isdisable2 = false;
        }
        this.$emit("showdetail", tableList[currentIndex].id, currentIndex);
      } else {
        currentIndex++;
        if (currentIndex + 1 >= tableList.length) {
          this.isdisable2 = true;
        } else {
          this.isdisable1 = false;
          this.isdisable2 = false;
        }
        this.$emit("showdetail", tableList[currentIndex].id, currentIndex);
        // 用于判断是否已读
        if (tableList[currentIndex].isRead === 0) {
          console.log("====", tableList[currentIndex].isRead);
          callRecordApi
            .isRead({ callId: tableList[currentIndex].id })
            .then(res => {
              this.$emit("listdetail", tableList[currentIndex].id);
            });
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.circle {
  display: inline-block;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border: 1px solid #5983ff;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    color: #5983ff;
  }
}
.tableWap {
  margin-top: 15px;
  margin-bottom: 30px;
  max-height: 185px;
  overflow: auto;
}
.workTable {
  border: 1px solid #ccc;
  border-collapse: collapse;

  td {
    padding: 0 10px;
    width: 200px;
    color: #666;
  }
}
.box-flex{
  .text{
    display: inline-block;
    width: 200px;
    white-space: pre-line;
  }
}
.overflow{
  max-height: 150px;
  overflow: hidden;
}
</style>

<style scoped>
</style>

