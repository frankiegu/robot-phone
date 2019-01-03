<template>
  <div>
    <Breadcrumb separator=">">
      <span class="home" @click="linkTo('emsHomeIndex')">
        <BreadcrumbItem>首页</BreadcrumbItem>
      </span>
      <BreadcrumbItem>坐席管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="divide" :class="{full: fullScreen}">
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
             <Icon class="v-before fs18 mr10"></Icon>
              <span class="vm">坐席列表</span>
            </div>
            <div class="padding-10" style="padding-bottom:0;">
              <div class="fleX">
                <i-select style="width:50%;" v-model="query.status" @on-change='handlerSearch'  placeholder="请选择状态">
                  <i-option value="" >全部状态</i-option>
                  <!-- 本页面不会出现审核中的状态 -->
                  <i-option v-for="(item,i) in statusList" :value="i" :key="i" v-if="!!i">{{ item }}</i-option>
                </i-select>
                <DatePicker style="width:50%;" v-model="queryCreateTime" type="daterange" @on-change='handlerSearch' placeholder="选择创建时间"></DatePicker>
              </div>
              <div class="fleX mt-10">
                  <i-select v-model="query.adminId"  @on-change='handlerSearch' placeholder="请选择企业">
                  <i-option value="" >全部</i-option>
                  <i-option v-for="item in firmList" :key="item.id" :value="item.id">{{item.name}}</i-option>
                </i-select>
                <i-input search @on-search="handlerSearch" v-model="query.mobile" type="text"  @on-enter='handlerSearch' placeholder="搜索坐席号码"></i-input>
              </div>
            </div>
            <div class="panel-body">
              <ul class="list">
                <li v-for="(item,i) in seatList" :key="i" :class="{'active' : current.id == item.id }" @click="handlerChangeCurrent(item)">
                      <div class="mb-5">{{item.mobile}} </div>
                      <div>
                        <span class="mr10 w120" style="display:inline-block;">{{item.cardType | cardType}}</span>
                        <span v-show="item.remainDays">{{item.remainDays}}天后到期</span>
                        <span class="mt15">{{item.status | status}}</span>
                      </div>                  
                </li>
              </ul>

              <Page class="pagination" show-sizer simple :total="seatTotal" :current="currentPage" @on-change="onPageChange" />
            </div>
          </div>
        </div>
        
        <div class="task-r divide-main">
          <div class="panel">
           <div class="title mt-20 contentAfter">
                     坐席详情
                 </div>
            <div class="panel-body" v-if="!seatList.length">
               <p class="nodata">暂无数据!!</p>
            </div>
            <div class="panel-body" v-else>            
                  <seat-detail ref="detail" :current-id="current ? current.id : ''"></seat-detail>               
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import seatDetail from "./detail";
const status = ['审核中', '空闲', '已过期', '使用中', '异常']
const cardType = {'1': '机器人坐席','2': '人工坐席', '3': '固定坐席'}



export default {
  data() {
    return {
      fullScreen: false,
      query: {
        startTime: '',
        endTime: '',
        status: '',
        mobile: '',
        adminId: '',
        cardType: '', // 为空
        pageSize: 10,
        pageNum: 1
      },
      queryCreateTime: [],
      seatList: [],
      seatTotal: 0,
      current: {}, // 保存当前企业

      statusList: status,
      firmList: [], // 条件： 企业列表

    };
  },
  components: {
    seatDetail
  },
  filters: {
    cardType (input){
      return cardType[`${input}`]
    },
    status (input){
      return status[input]
    },
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
      },
      deep: true
    },
  },
  methods: {
     linkTo(name) {
      Util.openPage(this, name);
    },
    async init (){
      this.current = await this.loadSeatList()
    },
    loadFirmList(){
      this.$omsApi.firm.getAllFirmList().then(data => {
        this.firmList = data
      })
    },
    async loadSeatList() {
      return this.$omsApi.seat.getList(this.query).then(data => {
        this.seatList = data.dataList
        this.seatTotal = data.totalNum
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
    handlerChangeCurrent(obj){
      this.current = obj
    },


  },
  created() {
    this.init()
    this.loadFirmList() // 搜素条件
  }
};
</script>
