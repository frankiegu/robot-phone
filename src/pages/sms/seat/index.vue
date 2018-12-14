<template>
  <div>
    <div class="divide" :class="{full: fullScreen}">
      <div class="divide-item">
        <div class="panel">
          <div class="panel-body">
            <Form class="panel-form" inline>
              <div class="fr">
                <FormItem>
                  <Input v-model="query.mobile" @on-enter='handlerTopSearch' type="text" placeholder="搜索坐席号码/客户名称">
                  <Icon type="search" slot="prepend"></Icon>
                  </Input>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="handlerTopSearch">查询</Button>
                </FormItem>
              </div>
              <FormItem label="" :label-width="0">
                <Select style="width: 180px;" @on-change='handlerTopSearch' v-model="query.cardType" placeholder="请选择坐席类型">
                  <Option v-for="(item,index) in cardTypeOption"  :value="item.value" :key="index">{{item.label}}</Option>
                </Select>
              </FormItem>
              <FormItem label="" :label-width="0">
                <Select style="width: 160px;" @on-change='handlerTopSearch' v-model="query.status" placeholder="请选择状态">
                  <Option v-for="(item,index) in statusOption"  :value="item.value" :key="index">{{item.label}}</Option>
                </Select>
              </FormItem>
              <FormItem label="" :label-width="0">
                <DatePicker type="daterange" placeholder="选择时间区间"  style="width: 200px" v-model="queryCreateTime" format="yyyy-MM-dd"></DatePicker>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              <Icon type="ios-list-outline" class="vm fs18 mr10"></Icon><span class="vm">机器人坐席列表</span>
            </div>
            <div class="panel-body">
              <ul class="list" v-if="seatList.length">
                <li v-for="(item,index) in seatList" :key="index" :class="{active:(item.id==activedId)}" @click="selectSeat(item)"  v-if="seatList.length">
                  <div class="list-item">
                    <div class="list-item-ext">
                      <div class="list-item-ext-text">
                        <i class="icon icon-phone"></i>
                        {{item.callNum}}
                      </div>
                    </div>
                    <div class="list-item-main">
                      <p class="list-item-title">{{item.mobile}}</p>
                      <div class="list-item-info">
                        {{item.cardType | cardType}}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="cf">
                <div class="fl simple-total">共<span class="c-primary fs14">{{seatPage.totalNum}}</span>条数据</div>
                <Page class="pagination fr" :total="seatPage.totalNum" simple @on-change="onSeatPageChange" :current="seatPage.pageNum" :page-size="seatPage.pageSize"></Page>
              </div>
            </div>
          </div>
        </div>
        <div class="task-r divide-main">
          <div class="panel">
            <div class="panel-header">
              <i class="icon icon-enlarge panel-header-icon" :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'" @click="() => fullScreen = !fullScreen"></i> 机器坐席详情
            </div>
            <div class="panel-body" v-show="!seatList.length">
                <p class="nodata">暂无数据!!</p>
             </div>
            <div class="panel-body"  v-show="seatList.length">
              <Tabs value="1" v-model='tabName'>
                <TabPane label="基础信息" name="1">
                  <!-- 基础信息 -->
                  <base-info :detail="detail" ></base-info>
                </TabPane>
                <TabPane label="通话记录" name="2">
                  <!-- 通话记录 -->
                  <call-record v-if="tabName=='2'" :card-mobile="activedMobile"></call-record>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import seatMixin from '@/mixins/seatMixin'
  import baseInfo from './baseInfo'
  import callRecord from './callRecord'
  const cardType = {'1': '机器人坐席', '2': '人工坐席', '3': '固定坐席'}
  export default {
    data() {
      return {
        tabName:'1',
        fullScreen: false,
        activedId: null, //侧栏选中id
        activedMobile: '',
        query: {
          status: '',
          startTime: '',
          endTime: '',
          mobile: '',
          cardType: ''
        },
        queryCreateTime: [],
        cardTypeOption:[
          {
          label: '全部',
          value: '',
        },{
          label: '机器人',
          value: 1,
        },{
          label: '人工坐席',
          value: 2,
        },{
          label: '固定坐席',
          value: 3,
        }],
        statusOption: [{
          label: '全部',
          value: '',
        },  
        {
          label: '正常',
          value: 1,
        }, {
          label: '已过期',
          value: 2,
        }, {
          label: '使用中',
          value: 3,
        }],
        detail: {
          id: 1,
          card_id: 1,
          mobile: '',
          endTime: '',
          createTime: '',
          status: 1,
          calledCount: null,
          receivingStatus: [],
          userLevel: [],
          callTime: [],
          callCount: []
        }
      };
    },
    mounted() {
      this.pageInit();
    },
    watch: {
      activedId: function(nv, ov) {
        this.getSeatDetail(nv)
      },
      queryCreateTime: {
      handler(n){
        this.query.startTime = n[0] ? n[0].getTime() : ''
        this.query.endTime = n[1] ? n[1].getTime() : ''
        this.handlerTopSearch()
      },
      deep: true
    },
    },
    components: {
      baseInfo,
      callRecord
    },
    mixins: [seatMixin],
    filters: {
      cardType (value){
        return cardType[`${value}`]
      }
    },
    methods: {
      pageInit() {
        this.getSeatList()
      },
      async getSeatList() {
        
        let vm = this
        let result = await this.$smsApi.seat.getList(vm.assignSeatQuery(vm.query))
        if (result.dataList&&result.dataList.length > 0) {
          this.selectSeat(result.dataList[0])
        }
        vm.initSeatData(result.totalNum||0, result.dataList||[])
        
      },
      async getSeatDetail(id) {
        let vm = this
        let result = await this.$smsApi.seat.getDetail(id)
        vm.detail = result
      },
      handlerTopSearch(){
        this.seatPage.pageNum = 1
        this.getSeatList()
      },
      //侧栏点击事件
      selectSeat(item) {
        this.activedId = item.id
        this.activedMobile = item.mobile
      }
    }
  };
</script>
