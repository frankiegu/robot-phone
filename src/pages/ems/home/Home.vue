<template>
  <div class="home-body">
    <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
    </Breadcrumb>
       <div class="home-welcome fleX box-shadow">
      <div class="v-middle">
        <img class="user-avtor" :src="userAvatar || defaultAvatar">
        <span class="middle-auto">{{judgeDate()}},</span>
        <span class="middle-auto username">{{userName}},</span>
        <span class="middle-auto">祝您开心每一天！</span>
      </div>
    </div>
    <div class="fleX">
      <div class="home-taskBox cardBS">
        <div class="task-title">
          <span
            :class="taskIndex==index?'link-active':''"
            @click="changeTask(index)"
            v-for="(item,index) in taskArr"
            :key="index"
          >{{item}}</span>
        </div>
        <div class="flexWap" v-show="table.list.length">
          <div class="taskContent" :key="index" v-for="(item,index) in table.list">
            <div class="row fleX">
              <div>{{item.taskName}}</div>
              <div :class="item.status==4?'finished':item.status==3?'end':item.status==2?'parseing':'doing'" class="lable">{{item.status | value(['未开始', '进行中', '暂停', '终止', '完成'])}}</div>
            </div>
            <div class="row rowF fleX">
              <div class="progressBar">
                <Progress :percent="(item.completeUserCount/item.userCount*100)" :stroke-width="6" hide-info></Progress>
              </div>
              <span class="link-active">进度 {{item.completeUserCount}}/{{item.userCount}}</span>
            </div>
            <div class="text">机器坐席号码: {{item.mobile}}</div>
            <div class="text">创建于: {{item.createTime | date}}</div>
          </div>
        </div>
        <div v-show="!table.list.length ||  table.list.length==0">
            <p style="text-align: center;color:#666;margin: 8rem auto;">暂无数据</p>
          </div>
      </div>
      <div class="home-right">
        <div class="rTop-box">
          <div class="titles">快速开始/便捷导航</div>
          <div class="content">
            <div
              @click="linkTo(item.route)"
              v-for="(item,index) in shortcutNavList"
              :key="index"
            >{{item.name}}</div>
          </div>
        </div>
        <div class="rBottom-box">
          <div class="titles">进度监控器</div>
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
          <p class="textColor">{{homepage.todayCalledCount}}</p>
        </div>
        <div>
          <p>接通数</p>
          <p class="textColor">{{homepage.todayCallConnected}}</p>
        </div>
        <div>
          <p>接通率</p>
          <p class="textColor">{{homepage.todayConnectedRate}}</p>
        </div>
        <div>
          <p>A类意向客户</p>
          <p class="textColor">{{homepage.todayLevelACount}}</p>
        </div>
        <div>
          <p>B类意向客户</p>
          <p class="textColor">{{homepage.todayLevelBCount}}</p>
        </div>
        <div>
          <p>任务数</p>
          <p class="textColor">{{homepage.todayTaskCount}}</p>
        </div>
        <div>
          <p>通话时间</p>
          <p class="textColor">{{homepage.todayCalledDurations}}秒</p>
        </div>
        <div>
          <p>平均时长</p>
          <p class="textColor">{{homepage.todayCalledAvgDurations}}秒</p>
        </div>
        
      </div>
    </div>
    <div class="home-totalCall fleX">
      <div class>
        <div home-title>总呼叫量</div>
        <div class="fleX long-num">
          <span :key="index" v-for="(item,index) in callCountArr(callCount)" class="home-call-item">{{item}}</span>
        </div>
        <!-- <div class="fleX bottom-smallT">
          <div>周同比 12%
            <img src="../../../assets/images/up.png" alt srcset>
          </div>
          <div>昨日：2155</div>
        </div> -->
      </div>
      <div>
        <div home-title>昨日呼叫量</div>
        <div class="fleX long-num">
          <span :key="index" v-for="(item,index) in callCountArr(callData.yesterday)" class="home-call-item">{{item}}</span>
        </div>
        <!-- <div class="fleX bottom-smallT">
          <div>周同比 12%
            <img src="../../../assets/images/up.png" alt>
          </div>
          <div>昨日：2155</div>
        </div> -->
      </div>
    </div>

    <div class="home-row">
      <div class="home-l">
        <div class="panel box-shadow"  style="margin-bottom:0;">
          <div class="panel-body" style="padding:1.2rem">
            <div class="fleX">
              <p class="home-title">拨号数据</p>
              <div class="home-opr">
                <RadioGroup
                  class="home-radio"
                  v-model="callForm.days"
                  @on-change="handleCallDaysChange"
                  type="button"
                >
                  <Radio
                    v-for="item in callArr"
                    :key="item.value"
                    :label="item.value"
                  >{{ item.label }}</Radio>
                </RadioGroup>
              </div>
            </div>
            <div class="home-body">
              <div class="home-call-r">
                <div class="home-chart">
                  <div id="echart1" class="echarts"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="home-r">
        <div class="panel box-shadow"  style="margin-bottom:0;">
          <div class="panel-body" style="padding:1.2rem">
            <div class="fleX">
              <p class="home-title">意向分布</p>
              <div class="home-opr">
                <RadioGroup
                  class="home-radio"
                  v-model="levelForm.days"
                  @on-change="handleLevelChartChange"
                  type="button"
                >
                  <Radio
                    v-for="item in callArr"
                    :key="item.value"
                    :label="item.value"
                  >{{ item.label }}</Radio>
                </RadioGroup>
              </div>
            </div>
            <div class="home-body">
              <div class="home-chart">
                <div id="echart2" class="echarts mt20"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import defaultAvatar from "@/assets/images/avtor.jpg";
import echarts from "echarts";
import liquidfill from "echarts-liquidfill";
import API from "@/api/index";
import API_CALL from "@/api/common/call";
import Util from '@/util/util'
import { mapState, mapGetters } from "vuex";
import { downloadBase64Img } from "@/util";
import { indexMixin } from "@/mixins";
import taskApi from "@/api/ems/task";
const API_STCS = API.ems.statistics;
// 1 七天  2 三十天 3 年
const RadioArr = [
  { label: "7天", value: 1 },
  { label: "30天", value: 2 },
  { label: "1年", value: 3 }
];
// 日期格式化
const getDateFormat = date => {
  const temp = new Date(date.replace(/-/g, "/"));
  return temp.getDate() + "/" + (temp.getMonth() + 1);
};
// 获取折线图配置
const getLineChart = (res = {}, t) => {
  const all = [];
  const fail = [];
  const refuse = [];
  const success = [];
  const dt = [];
  let temp = null;
  const type = "line";
  res.statisticeList.forEach((e, i) => {
    all.push(e.callAllCount);
    fail.push(e.callFail);
    refuse.push(e.callRefuse);
    success.push(e.callSuccess);
    dt.push(getDateFormat(e.sdate));
  });
  return {
    tooltip: {
      trigger: "axis"
    },
    grid: {
      top: "30"
    },
    legend: {
       itemWidth: 15,
      itemHeight: 3,
      itemGap: 10,
       icon: "rect",
      data: [
        {
          name: "呼出总数",
          textStyle: {
            color: "#3EC093"
          }
        },
        {
          name: "接通数量",
          textStyle: {
            color: "#53C9D7"
          }
        },
        {
          name: "无法接通",
          textStyle: {
            color: "#C03E80"
          }
        },
        {
          name: "拒接",
          textStyle: {
            color: "#F0734B"
          }
        }
      ],
       bottom:0
    },
    
    xAxis: {
      type: "category",
      
      boundaryGap: t !== 0,
      data: dt
    },
    yAxis: {
      splitLine: {
                show: true,
                lineStyle:{
                    type:'dashed',
                    color: ['#ddd']
                }
            },

      type: "value",
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    series: [
      {
        name: "呼出总数",
        data: all,
        type: type,
        smooth: true //线条平滑
      },
      {
        name: "接通数量",
        data: success,
        type: type,
        smooth: true //线条平滑
      },
      {
        name: "无法接通",
        data: fail,
        type: type,
        smooth: true //线条平滑
      },
      {
        name: "拒接",
        data: refuse,
        type: type,
        smooth: true //线条平滑
      }
    ],
    color: ["#0086fe", "#44c566", "#f6ce1a", "#e94867"]
  };
};
// 获取圆饼图配置
const getLevelChart = res => {
  let allCount = 0;
  for (let key in res) {
    allCount += +res[key];
  }
  allCount = allCount - res.allCount;
  return {
    tooltip: {
      trigger: "item",
      formatter: "{b}级: {d}% | {c}"
    },
    legend: {
      itemWidth: 15,
      itemHeight: 3,
      itemGap: 10,
       icon: "rect",
      orient: "horizontal",
      left: 50,
      bottom: 10,
      data: ["A", "B", "C", "D", "E", "F"],
      formatter: function(name) {
        let formatName = name;
        for (let key in res) {
          let val = res[key];
          if (key.split("level")[1] === name) {
            val = (val / allCount) * 100 || 0;
            formatName =
              name + "级: " + ((val | 0) === val ? val : val.toFixed(2)) + "%";
          }
        }
        return formatName;
      }
    },
    series: [
      {
        type: "pie",
        center: ["50%", "40%"],
        radius: ["47%", "60%"],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false
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
        itemStyle: {
          // 此配置
          normal: {
            borderWidth: 4,
            borderColor: "#fff"
          }
        },
        data: [
          { value: res.levelA, name: "A" },
          { value: res.levelB, name: "B" },
          { value: res.levelC, name: "C" },
          { value: res.levelD, name: "D" },
          { value: res.levelE, name: "E" },
          { value: res.levelF, name: "F" }
        ]
      }
    ],
    color: ["#f6ce1a", "#e94867", "#8238e0", "#338cff", "#3dc1c0", "#49c45a"]
  };
};

export default {
  name: "Home",
  mixins: [indexMixin],
  data() {
    return {
      getDate: "",
       params: {
        pageNum: 1,
        pageSize: 6,
        status:null,
      },
      startVal: 0,
      endVal: 2017,
      defaultAvatar: defaultAvatar,
      timer: null,
      callCount: 0,
      homepage: {},
      taskArr: ["最近的任务", "进行中的任务", "全部任务"],
      shortcutNavList: [
        { name: "任务管理", route: "marketingTask" },
        { name: "呼叫记录", route: "marketingCall" },
        { name: "话术列表", route: "whisperingIndex" },
        { name: "新话术列表", route: "whisperingNewIndex" },
        { name: "中继线计费", route: "relayLine" },
        { name: "客户管理", route: "clientManager" },
        { name: "时间模板", route: "emsTime" },
        { name: "短信模板", route: "emsMessage" }
      ],
      taskIndex: 0,
      callArr: RadioArr,
      callForm: {
        days: 1,
        type: 0 // 选择折线图0 | 柱状图1
      },
      callData: {
        yesterday: 0,
        today: 0
      },
      callLink: "",
      callOptionData: {},
      echart1: null,
      levelArr: RadioArr,
      levelForm: {
        days: 1
      },
      levelLink: "",
      levelOptionData: {},
      echart2: null,
      echart3: null
    };
  },
  
  computed: {
    ...mapState(["userType"]),
    ...mapGetters(["userName", "userAvatar"]),

   
  },
 
  mounted() {
    this.fetchCallCount(); // 实时呼叫总数
    this.fetchCallLink();
    this.fetchChartData(); // 获取图表数据
    this.fetchLevelLink();
    this.asyncFun()
    this.echart1 = echarts.init(window.document.getElementById("echart1"));
    this.echart2 = echarts.init(window.document.getElementById("echart2"));
    window.addEventListener("resize", () => {
      this.echart1.resize();
      this.echart2.resize();
      this.echart3.resize();
    });
    // 实时数据
    this.timer = window.setInterval(() => {
      this.fetchCallCount();
      this.judgeDate();
    }, 30000);
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    async asyncFun(){
      await  this.fetchData();
      await  this.waterEarth();
    },
     callCountArr(callCount) {
      const count = callCount;
      if (Number.isInteger(count)) {
        let str = "" + count;
        let space = "";
        if (str.length < 7) {
          const l = 7 - str.length;
          for (let i = 0; i < l; i++) {
            space += "0";
          }
        }
        str = space + str;
        return str.split("");
      } else {
        return [0, 0, 0, 0, 0, 0, 0];
      }
    },
    judgeDate() {
      let now = new Date();
      let hour = now.getHours();
      if (hour < 6) {
        this.getDate = "凌晨好";
      } else if (hour < 9) {
        return (this.getDate = "早上好");
      } else if (hour < 12) {
        return (this.getDate = "上午好");
      } else if (hour < 14) {
        return (this.getDate = "中午好");
      } else if (hour < 17) {
        return (this.getDate = "下午好");
      } else if (hour < 19) {
        return (this.getDate = "傍晚好");
      } else if (hour < 22) {
        return (this.getDate = "晚上好");
      } else {
        return (this.getDate = "夜里好");
      }
    },
    getApi() {
      return taskApi;
    },
     waterEarth() {
      this.echart3 = echarts.init(document.getElementById("water-earth"));
      
      let option = {
        series: [
          {
            type: "liquidFill",
            data: [this.homepage.taskProgresses],
            color: ["#5983ff"],
            radius: "80%",
            waveAnimation: true,
            animationDuration: 0,
            animationDurationUpdate: 0,
            outline: {
              borderDistance: 0,
              itemStyle: {
                borderWidth: 5,
                borderColor: "#5983ff",
                shadowBlur: 20,
                shadowColor: "rgba(255, 0, 0, 1)"
              }
            },
            backgroundStyle: {
              color: "#fff",
              borderWidth: 4,
              borderColor: "#fff"
            },
            label: {
              formatter: function(param) {
                return "完成率\n\n" + param.value + "%";
              },
              fontSize: 18,
              color: "#333"
            }
          }
        ]
      };
      this.echart3.setOption(option);
    },
    changeTask(index) {
      this.taskIndex = index;
      this.table.selection = [];
      // 切换筛选条件时，默认获取第一页
      this.params.pageNum = 1;
      if(index==1){
        this.params.status = 1;
      }
      else if(index==2){
         Util.openPage(this, "marketingTask");
      }
      else{
        this.params.status = null;
      }
      this.listAndDetail(0);
    
    },
    fetchCallCount() {
      API_CALL.getCallCount().then(res => {
        if (res !== this.callCount) {
          this.callCount = res;
        }
      });
    },
    getCallData() {
      // 获取拨号数据
      API_STCS.getCallList(this.callForm.days).then(res => {
        this.callOptionData = res;
        this.callData.today = res.todayCount;
        this.callData.yesterday = res.yesterdayCount;
        this.echart1.setOption(getLineChart(res, this.callForm.type), true);
      });
    },
    getLevelData() {
      API_STCS.getLevelList(this.levelForm.days).then(res => {
        this.levelOptionData = res;
        this.echart2.setOption(getLevelChart(res), true);
      });
    },
     async fetchData() {
     await API_STCS.getHomeData().then(res => {
        this.homepage = res;
      });
    },
    fetchChartData() {
      // 获取图表数据
      this.getCallData();
      this.getLevelData();
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
      this.getCallData();
      this.fetchCallLink();
    },
    handleLevelChartChange() {
      this.getLevelData();
      this.fetchLevelLink();
    },
    handleCallChartChange() {
      this.echart1.setOption(
        getLineChart(this.callOptionData, this.callForm.type),
        true
      );
    },
    linkTo(name) {
      Util.openPage(this, name);
    },
    exportCallImg() {
      if (this.echart1) {
        downloadBase64Img(this.echart1.getDataURL(), "拨号数据");
      }
    },
    exportLevelImg() {
      if (this.echart2) {
        downloadBase64Img(this.echart2.getDataURL(), "客户等级占比");
      }
    }
  }
};
</script>
