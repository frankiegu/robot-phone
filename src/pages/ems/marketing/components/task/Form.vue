<template>
  <Form :label-width="140"
        :model="entity"
        :rules="rules"
        ref="form">
    <Row>
      <i-col :span="24">
        <FormItem label="营销任务名称"
                  prop="taskName">
          <Input  style="width: 230px;" placeholder="请输入名称"
                 v-model="entity.taskName"
                 :maxlength="20" />
        </FormItem>
      </i-col>
    </Row>
    <FormItem :label-width="140" label="请选择话术版本"
              prop="whisperingId">
      <div v-show="whisperingList.length">
        <div class="plate"
             style="max-height: 300px; overflow: auto;">
             <Select v-model="entity.whisperingId" clearable style="width:230px">
        <Option v-for="v in whisperingList" :value="v.id" :key="v.id">
          {{ v.title }}
          <p v-if="v.isChange === 1" class="c-warning">话术已变更，请提交审核</p>
        </Option>
        
    </Select>
          
        </div>
      </div>
      <p class="nodata"
         v-show="!whisperingList.length">暂无话术</p>
    </FormItem>
    <Row v-show="entity.isTransfer === 0">
      <FormItem label="机器坐席"
                prop="cardRelateList">
        <card-select widths="230px" v-model="entity.cardRelateList"
                     nodataText="暂无可用坐席"
                     :options="{multiple: true}"
                     isFree />
      </FormItem>
    </Row>
    <FormItem label="营销对象:">
      <Input  v-model="phoneList" placeholder="手动单个输入,回车" style="width: 230px;margin-bottom:15px;" @on-enter="addPhone"/>
      
      <ms-xlsx-parser @change="changeCardSlotList"
                      :templateUrl="templateUrl">
        <span slot="desc">
          已导入
          <em class="c-primary">{{exportXlsCardSlotList.length}}</em> 个客户
          <span v-show="exportXlsCardSlotList.length > 0">
            , 其中有效客户
            <em class="c-primary">{{entity.cardSlotList.length}}</em> 个
          </span>
          <template v-if="exportXlsCardSlotList.length > 0">
            <a href="javascript: void(0);"
               class="c-info ml-10 a-a"
               @click="showCardSlotList"><img src="../../../../../assets/images/check.png" alt=""></a>
            <a href="javascript: void(0);"
               class="c-danger ml-5 a-a"
               @click="clearCardSlotList"><img src="../../../../../assets/images/delete.png" alt=""></a>
          </template>
        </span>
      </ms-xlsx-parser>
    </FormItem>
    <Row>
      <i-col :span="8">
        <FormItem label="方言"
                  prop="dialect">
          <Select style="width: 230px;" placeholder="请选择"
                  v-model="entity.dialect">
            <Option v-for="(v, k) in dialectMap"
                    :key="k"
                    :value="k">{{v}}</Option>
          </Select>
        </FormItem>
      </i-col>
    </Row>
     <Row>
      <i-col :span="16">
        <FormItem label="时间模板"
                  prop="timeTemplateId">
                  <!-- <span class="fr blue_link"    @click="goTimeTemplate">添加</span> -->
          <div style="overflow: hidden;">
            <time-template-select v-model="entity.timeTemplateId"
                                  nodataText="暂无可用模板，请先创建"
                                  ref="timeTemplateSelect" />
          </div>
        </FormItem>
      </i-col>
    </Row>
    <div class="from_baseLine" @click="showOrHidden">
      <span>{{isShow?"收起":"展开"}}<Icon type="ios-arrow-up" v-if="isShow"/><Icon v-else type="ios-arrow-down" /></span>
    </div>
     <collapse-transition>
              <div v-show="isShow">
       <Row>
      <i-col :span="16">
       <FormItem label="初筛微信推送"
                  prop="keyTemplate1">
          <CheckboxGroup v-model="entity.wxLevelList">
            <Checkbox label="A" />
            <Checkbox label="B" />
            <Checkbox label="C" />
          </CheckboxGroup>
          <p>注：未勾选则不发送信息</p>
          <employee-select  v-model="entity.wxUserList"
                           nodataText="暂无销售人员"
                           :options="{multiple: true}" />
        </FormItem>
      </i-col>
    </Row>
     <Row>
      <i-col :span="16">
       <FormItem label="初筛推送短信"
                  prop="keyTemplate">
          <CheckboxGroup v-model="entity.messageLevelList">
            <Checkbox label="A" />
            <Checkbox label="B" />
            <Checkbox label="C" />
            <Checkbox label="D" />
            <Checkbox label="E" />
          </CheckboxGroup>
          <p>注：未勾选则不发送短信</p>
          <message-template-select v-model="entity.messageTemplate"
                                   nodataText="暂无可用短信模板"
                                   :params="{type: 1}" />
        </FormItem>
      </i-col>
    </Row>
    <Row>
        <i-col :span="10">
          
        <FormItem label="是否转接人工"  
                  >
          <i-switch size="large" v-model="switch1" @on-change="changeSwicth1">
              <span slot="open">是</span>
              <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </i-col>
      <i-col :span="10" v-show="entity.isTransfer === 1">
        <Button style="margin-bottom:-12px" size="small" shape="circle" type="primary"
                class="ml-20"
                @click="showSeat">添加坐席</Button>
        </i-col>
    </Row>
    <Row v-show="entity.isTransfer === 1">
      <i-col :span="21">
        <FormItem label="人工坐席"
                  prop="seatList">
          <Table :columns="seat.columns"
                 :data="entity.seatList"
                 :max-height="300" />
        </FormItem>
      </i-col>
     
    </Row>
    <Row> 
       <i-col :span="4">
        <FormItem label="启动方式">
          <i-switch size="large" v-model="switch2" @on-change="changeSwicth2">
              <span slot="open">立即</span>
              <span slot="close">定时</span>
          </i-switch>        
        </FormItem>
      </i-col>
    </Row> 
    <Row> 
      <i-col :span="16"> 
        <FormItem label="启动时间"
                  prop="startTime"
                  v-show="entity.startType === 2">
          <DatePicker type="datetime"
                      placeholder="请选择启动时间"
                      :options="dateOptions"
                      v-model="temp.startTime" />
        </FormItem>
        <FormItem label="呼叫频率"
                  prop="callRate">
          <input-number style="width: 157px;" placeholder="单位秒" v-model="entity.callRate"
                        :min="0"
                        :max="99999999" />
        </FormItem>
      </i-col>
    </Row>
    <ms-fold title="有效A级客户设置">
      <div class="mt-20">
        <FormItem label="命中有效关键字次数"
                  prop="validKeyNum">
          <input-number style="width: 157px;margin-bottom:15px;" v-model="entity.validKeyNum"
                        :min="0"
                        :max="99999999" />
        </FormItem>
        <FormItem label="通话轮次"
                  prop="callNum">
          <input-number style="width: 157px;" v-model="entity.callNum"
                        :min="1"
                        :max="99999999" />
        </FormItem>
        <FormItem label="通话时长(秒)"
                  prop="callTime">
          <input-number style="width: 157px;" v-model="entity.callTime"
                        :min="1"
                        :max="99999999"
                        :step="60" />
        </FormItem>
      </div>
    </ms-fold>
    </div>
      </collapse-transition>
    <ms-fold title="转接人工条件设置"
             v-show="entity.isTransfer === 1">
      <div class="mt-20">
        <FormItem label="命中有效关键字次数"
                  prop="transferKeyNum">
          <input-number style="width: 157px;" v-model="entity.transferKeyNum"
                        :min="0" />
        </FormItem>
        <FormItem label="通话轮次"
                  prop="transferCallNum">
          <input-number style="width: 157px;" v-model="entity.transferCallNum"
                        :min="1" />
        </FormItem>
        <FormItem label="通话时长(秒)"
                  prop="transferCallTime">
          <input-number style="width: 157px;" v-model="entity.transferCallTime"
                        :min="1"
                        :step="60" />
        </FormItem>
      </div>
    </ms-fold>
      <!-- <div class="form_footer">
        <div>
          <Button size="large" type="text"
              style="margin-right: 8px"
              @click="cancel">取消</Button>
        </div>
      <div>
        <Button size="large" type="primary"
              @click="submit">确定</Button>
      </div>
      </div> -->
    <Modal v-model="cardSlot.show"
           title="营销对象"
           width="400px">
      <ms-lazy :initial="cardSlot.show">
        <div class="text-c mb-10">
          <ButtonGroup class="text-c">
            <Button :type="cardSlot.type === 1 ? 'primary' : 'default'"
                    @click="() => cardSlot.type = 1">全部({{exportXlsCardSlotList.length}})</Button>
            <Button :type="cardSlot.type === 2 ? 'info' : 'default'"
                    @click="() => cardSlot.type = 2">有效客户({{entity.cardSlotList.length}})</Button>
            <Button :type="cardSlot.type === 3 ? 'warning' : 'default'"
                    @click="() => cardSlot.type = 3">无效客户({{invalidCardSlotList.length}})</Button>
          </ButtonGroup>
        </div>
        <Table width="100%"
               height="300"
               :columns="cardSlot.columns"
               :data="[[], exportXlsCardSlotList, entity.cardSlotList, invalidCardSlotList][cardSlot.type]" />
      </ms-lazy>
      <div slot="footer"></div>
    </Modal>

    <Modal v-model="seat.show"
           title="添加人工坐席"
           width="500px"
           class="modal-hide-footer">
      <add-seat v-if="seat.show"
                @add="addSeat"
                @on-cancel="cancelSeat" />
    </Modal>

    <Modal v-model="addCardSlot.show"
           title="添加营销对象"
           width="600px"
           class="modal-hide-footer">
      <add-card-slot v-if="addCardSlot.show"
                     @after-submit="afterSubmitAddCardSlot"
                     @on-cancel="cancelAddCardSlot" />
    </Modal>
  </Form>
</template>
<style scoped>
.a-a img{
 margin-bottom: -6px;
}
</style>
<script>
import { formMixin } from '@/mixins'
import taskApi from '@/api/ems/task'
import entity from './src/entity'
import { watchDateToTimestamp, date, isTelOrMobile, desenPhone } from '@/util'
import { EMS } from '@/constants'
import { CardSelect, TimeTemplateSelect, MessageTemplateSelect, EmployeeSelect } from '@/components/packages/ems/select'
import TimeTemplateForm from '@/pages/ems/setting/time/new'
import dialectMap from './src/dialect'
import AddSeat from './components/form/addSeat'
import AddCardSlot from './components/form/addCardSlot'
import CollapseTransition from '~/iview/src/components/base/collapse-transition'
export default {
  mixins: [formMixin],
  components: {
    CardSelect,
    TimeTemplateSelect,
    TimeTemplateForm,
    MessageTemplateSelect,
    EmployeeSelect,
    AddSeat,
    AddCardSlot,
    CollapseTransition
  },
  data() {
    return {
      isShow:false,
      phoneList:'',
      switch1:false,
      switch2:false,
      entity: entity({
        startType: 1,
        validKeyNum: 1,
        callNum: 1,
        callTime: 30,
        keyOpen: 0,
        cardRelateList: [],
        messageLevelList: [],
        cardSlotList: [],
        wxLevelList: [],
        wxUserList: [],
        dialect: 'mandarin',
        callRate: 0,
        isTransfer: 0,
        seatList: [],
        transferCallNum: 1,
        transferCallTime: 30,
        transferKeyNum: 1
      }),
      exportXlsCardSlotList: [],
      cardSlot: {
        show: false,
        type: 1,
        columns: [ {
          title: '姓名',
          key: 'userName'
        },{
          title: '手机号',
          key: 'mobile'
        }, {
          title: '备注',
          key: 'remark'
        }]
      },
      addCardSlot: {
        show: false
      },
      temp: {
        startTime: ''
      },
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称' }
        ],
        dialect: [
          { required: true, message: '请选择方言' }
        ],
        whisperingId: [
          { required: true, message: '请选择话术版本' }
        ],
        timeTemplateId: [
          { required: true, message: '请选择时间模板' }
        ]
      },
      templateUrl: EMS.XLS_TEMPLATE.TASK_CALL_SLOT_LIST,
      whisperingList: [],
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now()
        }
      },
      time: {
        show: false
      },
      messageCount: {
        messageAllCount: 0,
        messageUseCount: 0
      },
      dialectMap,
      seat: {
        show: false,
        columns: [{
          title: '员工',
          key: 'employeeName'
        }, {
          title: '人工坐席',
          key: 'humanName'
        }, {
          title: '机器坐席',
          key: 'robotName'
        }, {
          title: '操作',
          render: (h, { row, index }) => {
            return h('a', {
              on: {
                click: () => {
                  this.removeSeat(index)
                }
              }
            }, '移除')
          }
        }]
      }
    }
  },
  computed: {
    invalidCardSlotList() {
      return this.exportXlsCardSlotList.filter(v => {
        return this.entity.cardSlotList.indexOf(v) === -1
      })
    }
  },
  watch: {
    exportXlsCardSlotList(list) {
      let mobileMap = {}
      this.entity.cardSlotList = list.filter(v => {
        if (mobileMap[v.mobile]) {
          v.remark = '重复号码'
          return false
        }
        if (!v.mobile) {
          v.remark = '号码为空'
          return false
        }
        if (!isTelOrMobile(v.mobile)) {
          v.remark = '无效号码'
          return false
        }
        v.mobile = v.mobile.replace(/-/g, '')
        mobileMap[v.mobile] = v
        return true
      })
    }
  },
  created() {
    this.$watch('temp.startTime', watchDateToTimestamp(() => this.entity, 'startTime'))
  },
  methods: {
   showOrHidden(){
     this.isShow = !this.isShow;
   },
    getApi() {
      return taskApi
    },
    initData(resolve) {
      resolve(taskApi.listWhispering().then(data => {
        this.whisperingList = data
      }))
    },
    addPhone(){
      let list = {"mobile":this.phoneList,'userName':`客户${desenPhone(this.phoneList)}`};
      let listArr = [];
      listArr.push(list);
      this.afterSubmitAddCardSlot(listArr);
    },
    changeSwicth1(status){
      if(status){
          this.entity.isTransfer = 1;
      }
      else{
          this.entity.isTransfer = 0;
      }
    },
    changeSwicth2(status){
       if(status){
          this.entity.startType = 1;
      }
      else{
          this.entity.startType = 2;
      }
      
    },
    initReady() {
      taskApi.getMessageCount().then(data => {
        this.messageCount = data
      })
    },
    afterEntity(entity) {
      if (entity.startTime) {
        this.temp.startTime = date.parse(entity.startTime, 'yyyy-MM-dd HH:mm:ss')
      }
    },
    beforeSubmit(data) {
      if (data.startType === 2 && this.temp.startTime) {
        // 启动时间必须大于当前时间
        if (this.temp.startTime.getTime() < new Date().getTime()) {
          this.warning('启动时间不能小于当前时间')
          return false
        }
      }
      if (data.keyOpen === 1 && !data.keyTemplate) {
        this.warning('请选择指定特殊词语短信')
        return false
      }
      if (data.messageLevelList.length > 0 && !data.messageTemplate) {
        this.warning('请选择初筛推送短信')
        return false
      }
      if (data.wxLevelList.length > 0 && data.wxUserList.length === 0) {
        this.warning('请选择初筛微信推送的销售人员')
        return false
      }

      // 转接人工时，判断机器坐席和人工坐席不能重复
      if (data.isTransfer === 1) {
        if (data.seatList.length === 0) {
          this.warning('至少添加一个人工坐席')
          return false
        }
        let robotMap = {}
        for (let v of data.seatList) {
          if (!robotMap[v.robotId]) {
            robotMap[v.robotId] = 1
          } else {
            this.warning(`机器坐席${v.robotName}不能重复选择`)
            return false
          }
        }
        let humanMap = {}
        for (let v of data.seatList) {
          if (!humanMap[v.humanId]) {
            humanMap[v.humanId] = 1
          } else {
            this.warning(`人工坐席${v.humanName}不能重复选择`)
            return false
          }
        }
      } else if (data.isTransfer === 0) {
        if (data.cardRelateList.length === 0) {
          this.warning('至少选择一个机器坐席')
          return false
        }
      }
    },
    goTimeTemplate() {
      // 跳转到创建时间模板页面
      this.time.show = true
    },
    changeCardSlotList(data) {
      let xlsCardSlotList = []
      if (data && data.length) {
        xlsCardSlotList = data.map(v => {
          return {
            mobile: (v['电话'] || '').trim(),
            userName: (v['姓名'] || `客户${desenPhone(v['电话'])}`).trim()
          }
        })
      }
      this.exportXlsCardSlotList = this.exportXlsCardSlotList.concat(xlsCardSlotList)
      this.success(`导入${data.length}个号码，有效${xlsCardSlotList.length}个`)
    },
    clearCardSlotList() {
      this.exportXlsCardSlotList = []
    },
    showCardSlotList() {
      this.cardSlot.show = true
    },
    setWhispering(v) {
      this.entity.whisperingId = v.id
      this.entity.whisperingTitle = v.title + (v.version ? `(${v.version})` : '')
    },
    afterAddTimeTemplate() {
      this.time.show = false
      this.$refs.timeTemplateSelect.refresh()
    },
    showSeat() {
      this.seat.show = true
    },
    cancelSeat() {
      this.seat.show = false
    },
    addSeat(v) {
      this.entity.seatList.push(v)
      this.seat.show = false
    },
    removeSeat(index) {
      this.entity.seatList.splice(index, 1)
    },
    showAddCardSlot() {
      this.addCardSlot.show = true
    },
    afterSubmitAddCardSlot(list) {
      this.exportXlsCardSlotList = this.exportXlsCardSlotList.concat(list)
    },
    cancelAddCardSlot() {
      this.addCardSlot.show = false
    }
  }
}
</script>
