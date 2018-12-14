<template>
  <div class="task-detail">
    <h4>{{entity.taskName}}
      <em class="c-default"
          v-if="entity.status === 0">未开始</em>
      <em class="doing"
          v-if="entity.status === 1">进行中</em>
      <em class="doing"
          v-if="entity.status === 2">暂停</em>
      <em class="parseing"
          v-if="entity.status === 3">终止</em>
      <em class="finish"
          v-if="entity.status === 4">已结束</em>
    </h4>
   
    <div class="mt-20">
      <Row>
        <i-col span="5">
          <p>
            任务ID: {{entity.id}}
          </p>
        </i-col>
        <i-col span="6">
          <p style="word-break: break-all;">
            机器坐席号码: {{entity.mobile}}
          </p>
        </i-col>
        <i-col span="6">
          <p>
            话术模板: {{entity.whisperingTitle}}
              <span v-show="entity.whisperingVersion">({{entity.whisperingVersion}})</span>
          </p>
        </i-col>
      </Row>
      <Row>
        <i-col span="5">
          <p>
            启动方式: {{entity.startType | value(['', '立即启动', '定时启动 '])}}
          </p>
        </i-col>
        <i-col span="8">
          <p>
            外呼时间: {{entity.taskTime}}
          </p>
        </i-col>
         <i-col span="8">
          <p>
           初筛短信级别: {{messageLevel?messageLevel:'--'}}
          </p>
        </i-col>
      </Row>
      <Row>
        <i-col span="8">
          <p>
            初筛短信模板: {{entity.messageTemplateName||'--'}}
          </p>
        </i-col>
      </Row>
    </div>
    <div class="circle">
      <div>
        <i-circle :size="100" :trail-width="4" :stroke-width="4" stroke-color="#5983ff" trail-color="#f0f2f5" :percent="Numberchange(entity.callOutProgress)">
        <div class="topText">外呼进度</div>
        <div class="bottomText">{{entity.callOutProgress}}</div>
    </i-circle>
      </div>
      <div>
        <i-circle :size="100" :trail-width="4" :stroke-width="4"  trail-color="#f0f2f5"  stroke-color="#f5d761" :percent="Numberchange(entity.callConnectionRate)">
        <div  class="topText">接通率</div>
        <div class="bottomText">{{entity.callConnectionRate}}</div>
    </i-circle>
      </div>
      <div>
        <i-circle :size="100"  :trail-width="4" :stroke-width="4"  trail-color="#f0f2f5" stroke-color="#59c6ff" :percent="getCustomer(entity.userLevel)">
        <div class="topText">意向客户</div>
        <div class="bottomText">{{getCustomer(entity.userLevel)}}%</div>
    </i-circle>
      </div>
      <div>
          <div class="bigNum">{{entity.receivingStatus[0].value.substr(0,entity.receivingStatus[0].value.length-1)}}</div>
          <div class="smallText">已接通</div>
      </div>
      <div>
        <div class="bigNum">{{getAllcall(entity.receivingStatus)}}</div>
        <div class="smallText">呼叫总量</div>
      </div>
    </div>
    <div class="databar mt-20">
      <ul class="databar-item">
        <li class="databar-title">客户意向等级
          <Icon type="help-circled"
                class="ml-5 c-primary"></Icon>
        </li>
        <li class="border-R" v-for="(v, i) in entity.userLevel"
            :key="i">
             {{v.name}}
              <Progress :stroke-width="4" :percent="Number((v.value).substr(0,v.value.length-1))">
              <span>{{v.value}}</span>
            </Progress>
        </li>
      </ul>
      <ul class="databar-item">
        <li class="databar-title">通话时长</li>
        <li  class="border-R" v-for="(v, i) in entity.callTimeList"
            :key="i">
            <span style="width:4rem;display:inline-block;">{{v.name}}</span>
             <Progress :stroke-width="4" style="width:70%" :percent="Number((v.value).substr(0,v.value.length-1))">
              <span>{{v.value}}</span>
            </Progress>
        </li>
      </ul>
      <ul class="databar-item">
        <li class="databar-title">对话轮次</li>
        <li v-for="(v, i) in entity.callCount"
            :key="i">
           <span style="width:3rem;display:inline-block;">{{v.name}}</span>
             <Progress :stroke-width="4" style="width:85%"   :percent="Number((v.value).substr(0,v.value.length-1))">
              <span>{{v.value}}</span>
            </Progress>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'
import taskDetailMixin from './taskDetailMixin'
import { getDialectLabel } from '../../src/dialect'

export default {
  mixins: [detailMixin, taskDetailMixin],
  data() {
    return {
     
    }
  },
  computed: {
    excludeDate() {
      return this.entity.excludeDate ? this.entity.excludeDate.split(',') : [];
    },
    weekDate() {
      return this.entity.weekDate ? this.entity.weekDate.split(',') : [];
    },
    messageLevel() {
      let list = this.entity.messageLevelList ? this.entity.messageLevelList.slice(0) : []
      return list.reverse().join(',')
    },
    wxLevelList() {
      let list = this.entity.wxLevelList ? this.entity.wxLevelList.slice(0) : []
      return list.reverse().join(',')
    },
    wxUserList() {
      let list = this.entity.wxUserList ? this.entity.wxUserList.slice(0) : []
      return list.reverse().join(',')
    }
  },
  methods: {
    getDialectLabel,
    Numberchange(num){
      if(num.length>0){
       return Number((num).substr(0,num.length-1))
      }
    },
    getAllcall(values){
      let sum = 0;
      values.forEach(item => {
         if(item.value.substr!=undefined){
           sum+=Number(item.value.substr(0,item.value.length-1));
         }
      });
      return sum;
    },
    getCustomer(arrs){
      let sum = 0;
      for(let i=0;i<2;i++){
        if((arrs[i].value).substr!=undefined){
          sum+= Number((arrs[i].value).substr(0,arrs[i].value.length-1));
        }
      }
      return sum;
    }
  }
}
</script>
