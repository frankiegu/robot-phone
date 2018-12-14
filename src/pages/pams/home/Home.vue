<template>
  <div>
    <div class="panel home-row">
      <div class="panel-body home-call">
        <span v-for="item in callCountArr"
              class="home-call-item">{{ item }}</span>
      </div>
    </div>
    <div class="home-row">
      <div class="home-pms-l">
        <div class="panel">
          <div class="panel-body">
            <p class="home-header">待处理数据</p>
            <div class="home-todo-list">
              <div class="home-todo-item">
                <p>{{ homepage.unreadCount || 0 }}</p>
                <p>未查看消息</p>
                <p>
                  <a class="dis">查看</a>
                </p>
              </div>
              <div class="home-todo-item">
                <p>{{ homepage.cityProxyCount || 0 }}</p>
                <p>市级代理商</p>
                <p>
                  <a class="dis">查看</a>
                </p>
              </div>
              <div class="home-todo-item">
                <p>{{ homepage.adminCount || 0 }}</p>
                <p>开通企业数</p>
                <p>
                  <a class="dis">查看</a>
                </p>
              </div>
              <div class="home-todo-item">
                <p>{{ homepage.allPortCount || 0 }}</p>
                <p>年总端口数</p>
                <p>
                  <a @click="linkTo('CAMS-PORT')">查看</a>
                </p>
              </div>
              <div class="home-todo-item">
                <p>{{ homepage.freePortCount || 0 }}</p>
                <p>剩余年可用端口数</p>
                <p>
                  <a @click="linkTo('CAMS-PORT')">查看</a>
                </p>
              </div>
              <div class="home-todo-item">
                <p>{{ homepage.allMonthPortCount || 0 }}</p>
                <p>月总端口数</p>
                <p>
                  <a @click="linkTo('CAMS-PORT')">查看</a>
                </p>
              </div>
              <div class="home-todo-item">
                <p>{{ homepage.freeMonthPortCount || 0 }}</p>
                <p>剩余月可用端口数</p>
                <p><a class="dis">查看</a></p>
              </div>
              <div class="home-todo-item">
                <p>{{ homepage.timeoutRobotCount || 0 }}</p>
                <p>已到期坐席数量</p>
                <p>
                  <a class="dis">查看</a>
                </p>
              </div>
              <div class="home-todo-item">
                <p>{{ homepage.allPrice || 0 }}</p>
                <p>总销售额(万元)</p>
                <p>
                  <a @click="linkTo('PAMS-FINANCE')">查看</a>
                </p>
              </div>
              <div class="home-todo-item">
                <p>{{ homepage.allProfit || 0 }}</p>
                <p>累计利润(万元)</p>
                <p>
                  <a @click="linkTo('PAMS-FINANCE')">查看</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="home-pms-r">
        <div class="panel">
          <div class="panel-body home-pms-block">
            <a class="home-pms-item"
               @click="linkTo('PAMS-CITY_PROXY_BASE')">开通市级代理</a>
            <a class="home-pms-item"
               @click="linkTo('PAMS-CITY_PROXY_BASE')">市级代理续费</a>
          </div>
        </div>
      </div>
    </div>
    <div class="home-row">
      <div class="home-l">
        <div class="panel">
          <div class="panel-body">
            <p class="home-header">拨号数据</p>
            <div class="home-opr">
              <RadioGroup class="home-radio"
                          v-model="callForm.days"
                          @on-change="handleCallDaysChange"
                          type="button">
                <Radio v-for="item in callArr"
                       :key="item.value"
                       :label="item.value">{{ item.label }}</Radio>
              </RadioGroup>
              <div class="fr">
                <RadioGroup class="home-radio-r"
                            v-model="callForm.type"
                            @on-change="handleCallChartChange"
                            type="button">
                  <Radio :label="0">折线图</Radio>
                  <Radio :label="1">柱状图</Radio>
                </RadioGroup>
                <span class="icon icon-download"
                      @click="exportCallImg"></span>
              </div>
            </div>
            <div class="home-body">
              <div class="home-call-l">
                <div class="home-call-block">
                  <div class="left">
                    <span class="circle circle-purple"></span>
                  </div>
                  <div class="right">
                    <p class="num">{{ callData.yesterday }}</p>
                    <p>昨日呼叫总数</p>
                  </div>
                </div>
                <div class="home-call-block">
                  <div class="left">
                    <span class="circle circle-blue"></span>
                  </div>
                  <div class="right">
                    <p class="num">{{ callData.today }}</p>
                    <p>今日呼叫总数</p>
                  </div>
                </div>
              </div>
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
            <p class="home-header">客户等级占比</p>
            <div class="home-opr">
              <RadioGroup class="home-radio"
                          v-model="levelForm.days"
                          @on-change="handleLevelChartChange"
                          type="button">
                <Radio v-for="item in callArr"
                       :key="item.value"
                       :label="item.value">{{ item.label }}</Radio>
              </RadioGroup>
              <div class="fr">
                <span class="icon icon-download"
                      @click="exportLevelImg"></span>
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
import echarts from 'echarts'
import API from '@/api/index'
import API_CALL from '@/api/common/call'
import Util from '@/util/util'
import { downloadBase64Img } from '@/util'

const API_STCS = API.pms.statistics
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
  const type = t === 0 ? 'line' : 'bar'
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
    color: ['#3EC093', '#53C9D7', '#C03E80', '#F0734B']
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
      orient: 'vertical',
      left: 0,
      top: 'middle',
      data: ['A', 'B', 'C', 'D', 'E', 'F'],
      formatter: function (name) {
        let formatName = name
        for (let key in res) {
          const val = res[key]
          if (key.split('level')[1] === name) {
            formatName = name + '级: ' + ((val / allCount) * 100 | 0) + '%'
          }
        }
        return formatName
      }
    },
    series: [{
      type: 'pie',
      center: ['55%', '50%'],
      radius: ['47%', '60%'],
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
          show: false
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
    color: ['#3EC093', '#F7AD60', '#0091DB', '#833EC0', '#F31668', '#F30000']
  }
}

export default {
  name: 'Home',
  data() {
    return {
      timer: null,
      callCount: 0,
      homepage: {},
      callArr: RadioArr,
      callForm: {
        days: 1,
        type: 0, // 选择折线图0 | 柱状图1
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
    }
  },
  computed: {
    callCountArr() {
      const count = this.callCount
      if (Number.isInteger(count)) {
        let str = '' + count
        let space = ''
        if (str.length < 10) {
          const l = 10 - str.length
          for (let i = 0; i < l; i++) {
            space += '0'
          }
        }
        str = space + str
        return str.split('')
      } else {
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    }
  },
  mounted() {
    this.fetchCallCount() // 实时呼叫总数
    this.fetchData() // 首页其他数据
    this.fetchChartData() // 获取图表数据
    this.echart1 = echarts.init(window.document.getElementById('echart1'))
    this.echart2 = echarts.init(window.document.getElementById('echart2'))
    window.addEventListener('resize', () => {
      this.echart1.resize()
      this.echart2.resize()
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
      // 省代理数据
      API_STCS.getProvince()
        .then(res => {
          this.homepage = res
        })
    },
    fetchChartData() {
      // 获取图表数据
      this.getCallData()
      this.getLevelData()
    },
    handleChartDown(type) {
      // TODO
      if (type === 'call') {
        // 拨号数据下载
        console.log('拨号数据下载')
      } else if (type === 'level') {
        // 客户等级占比数据下载
        console.log('客户等级占比数据下载')
      }
    },
    handleCallDaysChange() {
      this.getCallData()
    },
    handleLevelChartChange() {
      this.getLevelData()
    },
    handleCallChartChange() {
      this.echart1.setOption(getLineChart(this.callOptionData, this.callForm.type), true)
    },
    linkTo(name) {
      if (name) {
        Util.openPage(this, name)
      }
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
