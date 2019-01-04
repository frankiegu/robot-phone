<template>
  <div>
    <Breadcrumb separator=">">
      <BreadcrumbItem>首页</BreadcrumbItem>
    </Breadcrumb>
    <div class="home-welcome box-shadow">
      <div class="v-middle">
        <img class="user-avtor" :src="userAvatar || defaultAvatar">
      </div>
      <div class="ml30">
        <div class="fs-18">
          <span class="middle-auto">{{judgeDate}}，{{userName}}，</span>
          <span class="middle-auto">祝您开心每一天！</span>
        </div>
        <div class="fs-14 fc6 mt-5">
          所有企业昨日呼叫次数共计
          <span class="fc-blue">{{callData.yesterday}}</span>次，今日已呼叫次数
          <span class="fc-blue">{{callData.today}}</span>次
        </div>
      </div>
    </div>
    <div class="panel home-accountData">
      <div class="home-header">数据汇总</div>
      <div class="fleX data-num">
        <div>
          <p>发布消息</p>
          <p class="textColor">{{ homepage.noticeCount || 0 }}</p>
        </div>
        <div>
          <p>省级代理商</p>
          <p class="textColor">{{ homepage.provinceProxyCount || 0 }}</p>
        </div>
        <div>
          <p>市级代理商</p>
          <p class="textColor">{{ homepage.cityProxyCount || 0 }}</p>
        </div>
        <div>
          <p>企业数</p>
          <p class="textColor">{{ homepage.adminCount || 0 }}</p>
        </div>
        <div>
          <p>年总端口数</p>
          <p class="textColor">{{ homepage.allPortCount || 0 }}</p>
        </div>

        <div>
          <p>月总端口数</p>
          <p class="textColor">{{ homepage.allMonthPortCount || 0 }}</p>
        </div>
        <div>
          <p>剩余月可用端口数</p>
          <p class="textColor">{{ homepage.freePortCount || 0 }}</p>
        </div>
        <div>
          <p>总销售额（万）</p>
          <p class="textColor">{{ homepage.allPrice || 0 }}</p>
        </div>
      </div>
    </div>
    <div class="panel home-row box-shadow pt-20 pl-25 pb-25">
      <div class="home-header">总呼叫量</div>
      <div class="pt-20 home-call">
        <span v-for="(item,index) in callCountArr" :key="index" class="home-call-item">{{ item }}</span>
      </div>
    </div>
    <div class="home-row">
      <div class="home-l">
        <div class="panel box-shadow pl-25 pt-20 pr-25">
          <div class="fleX">
            <div class="home-header">拨号数据</div>
          <div class="home-opr fr">
            <RadioGroup
              class="home-radio"
              v-model="callForm.days"
              @on-change="handleCallDaysChange"
              type="button"
            >
              <Radio v-for="item in callArr" :key="item.value" :label="item.value">{{ item.label }}</Radio>
            </RadioGroup>
          </div>
          </div>
          <div>
            <div class="home-call-r">
              <div class="home-chart">
                <div id="echart1" class="echarts"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="home-r">
        <div class="panel box-shadow  pl-25 pt-20 pr-25">
          <div class="fleX">
            <div class="home-header">意向分布</div>
            <div class="home-opr fr">
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
</template>
<script>
import defaultAvatar from "@/assets/images/avtor.jpg";
import { mapState, mapGetters } from "vuex";
import echarts from "echarts";
import API from "@/api/index";
import API_CALL from "@/api/common/call";
import Util from "@/util/util";
import { downloadBase64Img } from "@/util";

const API_STCS = API.oms.statistics;
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
  const type = t === 0 ? "line" : "bar";
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
       bottom:10
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
      bottom: 40,
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
        radius: ["47%", "63%"],
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
  data() {
    return {
      defaultAvatar: defaultAvatar,
      getDate: "",
      timer: null,
      callCount: 0,
      homepage: {},
      callArr: RadioArr,
      callForm: {
        days: 1,
        type: 0 // 选择折线图0 | 柱状图1
      },
      callData: {
        yesterday: 0,
        today: 0
      },
      callOptionData: {},
      echart1: null,
      levelArr: RadioArr,
      levelForm: {
        days: 1
      },
      levelOptionData: {},
      echart2: null
    };
  },

  computed: {
    ...mapState(["userType"]),
    ...mapGetters(["userName", "userAvatar"]),
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
    callCountArr() {
      const count = this.callCount;
      if (Number.isInteger(count)) {
        let str = "" + count;
        let space = "";
        if (str.length < 10) {
          const l = 10 - str.length;
          for (let i = 0; i < l; i++) {
            space += "0";
          }
        }
        str = space + str;
        return str.split("");
      } else {
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    }
  },
  
  mounted() {
    this.fetchCallCount(); // 实时呼叫总数
    this.fetchData(); // 首页其他数据
    this.fetchChartData(); // 获取图表数据
    this.echart1 = echarts.init(window.document.getElementById("echart1"));
    this.echart2 = echarts.init(window.document.getElementById("echart2"));
    window.addEventListener("resize", () => {
      this.echart1.resize();
      this.echart2.resize();
    });
    // 实时数据
    this.timer = window.setInterval(() => {
      this.fetchCallCount();
    }, 30000);
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
    this.timer = null;
  },
 
  methods: {
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
    fetchData() {
      API_STCS.getManagData().then(res => {
        this.homepage = res;
      });
    },
    fetchChartData() {
      // 获取图表数据
      this.getCallData();
      this.getLevelData();
    },

    handleCallDaysChange() {
      this.getCallData();
    },
    handleLevelChartChange() {
      this.getLevelData();
    }
  }
};
</script>
