<template>
  <div class="home-body">
    <div class="home-welcome fleX">
      <div class="v-middle">
         <img class="user-avtor" :src="userAvatar || defaultAvatar" />
        <span class="middle-auto">上午好,</span><span class="middle-auto username">{{userName}},</span> <span class="middle-auto">祝你开心每一天！</span> 
      </div>
      <div class="fleX">
       <div class="right1">
         <div>未分配名单</div>
         <countTo :startVal='startVal' :endVal='endVal' :duration='1000' class="bigNum1"></countTo>
         
       </div>
       <div class="right2">
         <div>已分配</div>
         <countTo :startVal='startVal' :endVal='endVal' :duration='1000' class="bigNum2"></countTo>
        
       </div>
      </div>
    </div>
     <!-- <countTo :startVal='startVal' :endVal='endVal' :duration='3000' class="account-Num"></countTo> -->
     <div class="fleX">
        <div class="home-taskBox cardBS">
          <div class="task-title">
            <span :class="taskIndex==index?'link-active':''" @click="changeTask(index)" v-for="(item,index) in taskArr" :key="index">{{item}}</span>
          </div>
          <div class="flexWap">
            <div class="taskContent">
              <div class="row fleX">
                <div>成都金融号码外呼</div>
                <div class="lable doing">进行中</div>
              </div>
              <div class="row rowF fleX">
                <div class="progressBar">
                  <Progress :percent="45" :stroke-width="8" hide-info>
                </Progress>
                </div>
                 <span class="link-active">进度 2900/7800</span>
              </div>
              <div class="text">
                外呼号码:18023434343,32478374837
              </div>
              <div class="text">XXX创建于2018-09-20 11:09:211</div>
            </div>
            <div class="taskContent">
              <div class="row fleX">
                <div>成都金融号码外呼</div>
                <div class="lable doing">进行中</div>
              </div>
              <div class="row rowF fleX">
                <div class="progressBar">
                  <Progress :percent="45" :stroke-width="8" hide-info>
                </Progress>
                </div>
                 <span class="link-active">进度 2900/7800</span>
              </div>
              <div class="text">
                外呼号码:18023434343,32478374837
              </div>
              <div class="text">XXX创建于2018-09-20 11:09:211</div>
            </div>
            <div class="taskContent">
              <div class="row fleX">
                <div>成都金融号码外呼</div>
                <div class="lable end">进行中</div>
              </div>
              <div class="row rowF fleX">
                <div class="progressBar">
                  <Progress :percent="45" :stroke-width="8" hide-info>
                </Progress>
                </div>
                 <span class="link-active">进度 2900/7800</span>
              </div>
              <div class="text">
                外呼号码:18023434343,32478374837
              </div>
              <div class="text">XXX创建于2018-09-20 11:09:211</div>
            </div>
            <div class="taskContent">
              <div class="row fleX">
                <div>成都金融号码外呼</div>
                <div class="lable finished">进行中</div>
              </div>
              <div class="row rowF fleX">
                <div class="progressBar">
                  <Progress :percent="45" :stroke-width="8" hide-info>
                </Progress>
                </div>
                 <span class="link-active">进度 2900/7800</span>
              </div>
              <div>
                外呼号码:18023434343,32478374837
              </div>
              <div>XXX创建于2018-09-20 11:09:211</div>
            </div>
            <div class="taskContent">
              <div class="row fleX">
                <div>成都金融号码外呼</div>
                <div class="lable parseing">进行中</div>
              </div>
              <div class="row rowF fleX">
                <div class="progressBar">
                  <Progress :percent="45" :stroke-width="8" hide-info>
                </Progress>
                </div>
                 <span class="link-active">进度 2900/7800</span>
              </div>
              <div>
                外呼号码:18023434343,32478374837
              </div>
              <div>XXX创建于2018-09-20 11:09:211</div>
            </div>
          </div>
        </div>
        <div class="home-right">
          <div class="rTop-box ">
            <div class="title">快速开始/便捷导航</div>
            <div class="content">
              <div @click="linkTo(item.route)" v-for="(item,index) in shortcutNavList" :key="index">
                {{item.name}}
              </div>
            </div>
          </div>
          <div class="rBottom-box">
            <div class="title">进度监控器</div>
            <div class="waterBox">
              <div id="water-earth" class="water-ball"></div>
            </div>
          </div>
        </div>
     </div>
     <div class="home-accountData">
       <div class="home-title">今天数据</div>
        <div class="fleX data-num">
            <div>
              <p>外呼数</p>
              <p class="textColor">288</p>
            </div>
            <div>
              <p>接通数</p>
              <p class="textColor">233</p>
            </div>
            <div>
              <p>接通率</p>
              <p class="textColor">344</p>
            </div>
            <div>
              <p>意向客户</p>
              <p class="textColor">23</p>
            </div>
            <div>
              <p>任务数</p>
              <p class="textColor">34</p>
            </div>
            <div>
              <p>通话时间</p>
              <p class="textColor">20分钟</p>
            </div>
            <div>
              <p>平均时长</p>
              <p class="textColor">38秒</p>
            </div>
            <div>
              <p>短信量</p>
              <p class="textColor">44</p>
            </div> 
        </div> 
     </div>
     <div class="home-totalCall fleX">
       <div class="">
          <div home-title>总呼叫量</div>
          <div class="fleX long-num">
            <span :key="index" v-for="(item,index) in callCountArr" class="home-call-item">{{item}}</span>
          </div>
          <div class="fleX bottom-smallT">
            <div>
             周同比 12% <img src="../../../assets/images/up.png" alt="" srcset="">
            </div>
            <div>昨日：2155</div>
          </div>
       </div>
       <div>
         <div home-title>触达人数</div>
         <div class="fleX long-num">
           <span :key="index" v-for="(item,index) in callCountArr" class="home-call-item">{{item}}</span>
           </div>
           <div class="fleX bottom-smallT">
            <div>
             周同比 12% <img src="../../../assets/images/up.png" alt="">
            </div>
            <div>昨日：2155</div>
          </div>
       </div>
     </div>
    
    <div class="home-row">
      <div class="home-l">
        <div class="panel">
          <div class="panel-body">
           <div class="fleX">
              <p class="home-title">拨号数据</p>
            <div class="home-opr">
              <RadioGroup class="home-radio"
                          v-model="callForm.days"
                          @on-change="handleCallDaysChange"
                          type="button">
                <Radio v-for="item in callArr"
                       :key="item.value"
                       :label="item.value">{{ item.label }}</Radio>
              </RadioGroup>
              
            </div>
           </div>
            <div class="home-body">
             
              <div class="home-call-r">
                <div class="home-chart">
                  <div id="echart1"
                       class="echarts" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="home-r">
        <div class="panel">
          <div class="panel-body">
            <div class="fleX">
               <p class="home-title">意向分布</p>
            <div class="home-opr">
              <RadioGroup class="home-radio"
                          v-model="levelForm.days"
                          @on-change="handleLevelChartChange"
                          type="button">
                <Radio v-for="item in callArr"
                       :key="item.value"
                       :label="item.value">{{ item.label }}</Radio>
              </RadioGroup>
             
            </div>
            </div>
            <div class="home-body">
              <div class="home-chart">
                <div id="echart2"
                     class="echarts mt20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import countTo from 'vue-count-to';
import defaultAvatar from '@/assets/images/avtor.jpg'
import echarts from 'echarts'
import liquidfill from 'echarts-liquidfill'
import API from '@/api/index'
import API_CALL from '@/api/common/call'
import Util from '@/util/util'
import { mapState,mapGetters } from 'vuex'
import { downloadBase64Img } from '@/util'

const API_STCS = API.ems.statistics
// 1 七天  2 三十天 3 年
const RadioArr = [
  { label: '7天', value: 1 },
  { label: '30天', value: 2 },
  { label: '1年', value: 3 },
]
// 日期格式化
const getDateFormat = date => {
  const temp = new Date(date.replace(/-/g, '/'))
  return temp.getDate() + '/' + (temp.getMonth() + 1)
}
// 获取折线图配置
const getLineChart = (res = {}, t) => {
  const all = []
  const fail = []
  const refuse = []
  const success = []
  const dt = []
  let temp = null
  const type = 'line'
  res.statisticeList.forEach((e, i) => {
    all.push(e.callAllCount)
    fail.push(e.callFail)
    refuse.push(e.callRefuse)
    success.push(e.callSuccess)
    dt.push(getDateFormat(e.sdate))
  })
  return {
    
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: [{
        name: '呼出总数',
        textStyle: {
          color: '#3EC093'
        }
      }, {
        name: '接通数量',
        textStyle: {
          color: '#53C9D7'
        }
      }, {
        name: '无法接通',
        textStyle: {
          color: '#C03E80'
        }
      }, {
        name: '拒接',
        textStyle: {
          color: '#F0734B'
        }
      }]
    },
    xAxis: {
      type: 'category',
      boundaryGap: t !== 0,
      data: dt
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    series: [{
      name: '呼出总数',
      data: all,
      type: type
    }, {
      name: '接通数量',
      data: success,
      type: type
    }, {
      name: '无法接通',
      data: fail,
      type: type
    }, {
      name: '拒接',
      data: refuse,
      type: type
    }],
    color: ['#0086fe', '#44c566', '#C03E80', '#F0734B']
  }
}
// 获取圆饼图配置
const getLevelChart = res => {
  let allCount = 0
  for (let key in res) {
    allCount += (+res[key])
  }
  allCount = allCount - res.allCount
  return {
    tooltip: {
      trigger: 'item',
      formatter: "{b}级: {d}% | {c}"
    },
    legend: {
      orient: 'horizontal',
      left: 20,
      bottom: 40,
      data: ['A', 'B', 'C', 'D', 'E', 'F'],
      formatter: function (name) {
        let formatName = name
        for (let key in res) {
          let val = res[key]
          if (key.split('level')[1] === name) {
            val = (val / allCount) * 100 || 0
            formatName = name + '级: ' + ((val | 0) === val ? val : val.toFixed(2)) + '%'
          }
        }
        return formatName
      }
    },
    series: [{
      type: 'pie',
      center: ['50%', '40%'],
      radius: ['40%', '60%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
        },
        emphasis: {
          show: false
        }
      },
      labelLine: {
        normal: {
          show: true
        }
      },
      itemStyle: { // 此配置
                normal: {
                    borderWidth: 4,
                    borderColor: '#fff',
                }
            },
      data: [
        { value: res.levelA, name: 'A' },
        { value: res.levelB, name: 'B' },
        { value: res.levelC, name: 'C' },
        { value: res.levelD, name: 'D' },
        { value: res.levelE, name: 'E' },
        { value: res.levelF, name: 'F' }
      ]
    }],
    color: ['#59c6ff', '#5983ff', '#f5d761', '#833EC0', '#F31668', '#F30000']
  }
}

export default {
  name: 'Home',
  data() {
    return {
      startVal: 0,
      endVal: 2017,
      defaultAvatar:defaultAvatar,
      timer: null,
      callCount: 0,
      homepage: {},
      taskArr:["最近的任务","进行中的任务","全部任务"],
      shortcutNavList:[
      {name:'任务管理',route:"marketingTask"},
      {name:'呼叫记录',route:"marketingCall"},
      {name:'话术列表',route:"whisperingIndex"},
      {name:'新话术列表',route:"whisperingNewIndex"},
      {name:'中继线计费',route:"relayLine"},
      {name:'客户管理',route:"clientManager"},
      {name:'时间模板',route:"emsTime"},
      {name:'短信模板',route:"emsMessage"}],
      taskIndex:0,
      callArr: RadioArr,
      callForm: {
        days: 1,
        type: 0, // 选择折线图0 | 柱状图1
      },
      callData: {
        yesterday: 0,
        today: 0
      },
      callLink: '',
      callOptionData: {},
      echart1: null,
      levelArr: RadioArr,
      levelForm: {
        days: 1
      },
      levelLink: '',
      levelOptionData: {},
      echart2: null,
      echart3:null
    }
  },
  components:{
    countTo
  },
  computed: {
    ...mapState(['userType']),
    ...mapGetters([
      'userName',
      'userAvatar'
    ]),
    
    callCountArr() {
      const count = this.callCount
      if (Number.isInteger(count)) {
        let str = '' + count
        let space = ''
        if (str.length < 7) {
          const l = 7 - str.length
          for (let i = 0; i < l; i++) {
            space += '0'
          }
        }
        str = space + str
        return str.split('')
      } else {
        return [ 0, 0, 0, 0, 0, 0, 0]
      }
    }
  },
  mounted() {
    this.fetchCallCount() // 实时呼叫总数
    this.fetchCallLink()
    this.fetchData() // 首页其他数据
    this.fetchChartData() // 获取图表数据
    this.fetchLevelLink()
    this.waterEarth();
    this.echart1 = echarts.init(window.document.getElementById('echart1'))
    this.echart2 = echarts.init(window.document.getElementById('echart2'))
    window.addEventListener('resize', () => {
      this.echart1.resize()
      this.echart2.resize()
      this.echart3.resize()
    })
    // 实时数据
    this.timer = window.setInterval(() => {
      this.fetchCallCount()
    }, 30000)
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    waterEarth(){
       this.echart3 = echarts.init(document.getElementById('water-earth'));
       let option = {
    series: [{
        type: 'liquidFill',
        data: [0.6],
        color: ['#5983ff'],
        radius: '80%',
        waveAnimation: true,
        animationDuration: 0,
        animationDurationUpdate: 0,
        outline: {
            borderDistance: 0,
            itemStyle: {
                borderWidth: 5,
                borderColor: '#5983ff',
                shadowBlur: 20,
                shadowColor: 'rgba(255, 0, 0, 1)'
            }
        },
        backgroundStyle: {
        color: '#fff',
         borderWidth: 4,
        borderColor: '#fff',
    },
        label: {
            formatter: function(param) {
                return '完成率\n\n'+ param.value*100+"%";
            },
            fontSize: 18,
            color: '#333'
        }
    }]
};
       this.echart3.setOption(option);

    },
    changeTask(index){
      this.taskIndex = index;
    },
    fetchCallCount() {
      API_CALL.getCallCount()
        .then(res => {
          if (res !== this.callCount) {
            this.callCount = res
          }
        })
    },
    getCallData() {
      // 获取拨号数据
      API_STCS.getCallList(this.callForm.days)
        .then(res => {
          this.callOptionData = res
          this.callData.today = res.todayCount
          this.callData.yesterday = res.yesterdayCount
          this.echart1.setOption(getLineChart(res, this.callForm.type), true)
        })
    },
    getLevelData() {
      API_STCS.getLevelList(this.levelForm.days)
        .then(res => {
          this.levelOptionData = res
          this.echart2.setOption(getLevelChart(res), true)
        })
    },
    fetchData() {
      API_STCS.getHomeData()
        .then(res => {
          this.homepage = res
        })
    },
    fetchChartData() {
      // 获取图表数据
      this.getCallData()
      this.getLevelData()
    },
    fetchCallLink() {
      // TODO
      // API_STCS.getExportCall(this.callForm.days)
      //   .then(res => {
      //     this.callLink = res
      //   })
    },
    fetchLevelLink() {
      // API_STCS.getExportLevel(this.callForm.days)
      //   .then(res => {
      //     this.levelLink = res
      //   })
    },
    handleCallDaysChange() {
      this.getCallData()
      this.fetchCallLink()
    },
    handleLevelChartChange() {
      this.getLevelData()
      this.fetchLevelLink()
    },
    handleCallChartChange() {
      this.echart1.setOption(getLineChart(this.callOptionData, this.callForm.type), true)
    },
    linkTo(name) {
      Util.openPage(this, name)
    },
    exportCallImg() {
      if (this.echart1) {
        downloadBase64Img(this.echart1.getDataURL(), '拨号数据')
      }
    },
    exportLevelImg() {
      if (this.echart2) {
        downloadBase64Img(this.echart2.getDataURL(), '客户等级占比')
      }
    }
  }
}
</script>
