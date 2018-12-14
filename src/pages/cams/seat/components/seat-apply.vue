<template>
  <div class="task">
    <Form ref="form"
          :model="entity"
          :rules="rules"
          :label-width="80">
      <div class="task-l">
        <div class="board board-primary">
          <div class="board-header">
            企业信息
          </div>
          <div class="board-body">

            <FormItem label="开通企业"
                      prop="adminId">
              <i-select v-model="entity.adminId"
                        placeholder="请选择企业">
                <i-option v-for="item in firmList"
                          :key="item.adminId"
                          :value="item.adminId">{{item.name}}</i-option>
              </i-select>
            </FormItem>

            <FormItem label="坐席单价"
                      prop="perPrice">
              <i-input v-model="entity.perPrice"
                       placeholder="请输入单价">
                <span slot="append">元</span>
              </i-input>
            </FormItem>

            <FormItem label="市级代理:">
              {{entity.name}}
            </FormItem>

            <FormItem label="剩余年端口:">
              {{entity.remainPort}}
            </FormItem>
            <FormItem label="剩余月端口:">
              {{entity.monthCardRemainCount}}
            </FormItem>
            <FormItem label="购买类型"
                      prop="portType">
              <i-select v-model="entity.portType"
                        placeholder="请选择购买类型">
                <i-option value="0">购买年端口</i-option>
                <i-option value="1">购买月端口</i-option>
              </i-select>
            </FormItem>
            <FormItem label="购买期限"
                      prop="serviceLife">
              <i-input v-model="entity.serviceLife"
                       placeholder="请输入购买值">
                <span slot="append">{{typeString}}</span>
              </i-input>
            </FormItem>
          </div>
          <div class="board-header">
            通话信息
          </div>
          <div class="board-body">
            <FormItem label="快递名称"
                      prop="expressCompany">
              <i-select v-model="entity.expressCompany"
                        placeholder="请选择快递">
                <i-option v-for="item in expressList"
                          :key="item.id"
                          :value="item.id">{{item.name}}</i-option>
              </i-select>
            </FormItem>
            <FormItem label="快递单号"
                      prop="expressNo">
              <i-input v-model="entity.expressNo"
                       placeholder="请输入快递单号" />
            </FormItem>
          </div>
        </div>
      </div>
      <div class="task-r">
        <div class="board board-primary">
          <div class="board-header">
            开通机器坐席
            <span class="fr">合计数量: {{entity.robotSeats.length}}</span>
          </div>
          <div class="board-body">
            <div>
              <div class="text-r">
                <Button type="success"
                        @click="handlerAddSeat(1)"
                        v-show="!seatId">新增</Button>
              </div>
              <div>
                <div class="seat">
                  <FormItem v-for="(item,i) in entity.robotSeats"
                            :key="i"
                            class="cn"
                            :prop="'robotSeats.' + i"
                            :rules="rules.seatNum"
                            :label-width="1">
                    <div class="seat-item">
                      <i class="seat-num">{{i + 1}}</i>
                      <i-input v-model="entity.robotSeats[i]"
                               placeholder="请输入坐席号码"
                               class="seat-ipt"></i-input>
                      <a href="javascript: void(0)"
                         class="seat-btn-del"
                         v-show="!seatId"
                         @click="handlerDeleteSeat(i,1)">删除</a>
                    </div>
                  </FormItem>
                </div>
              </div>
            </div>
          </div>
          <div class="board-header mt-20">
            开通人工坐席
            <span class="fr">合计数量: {{entity.humanSeats.length}}</span>
          </div>
          <div class="board-body">
            <div>
              <div class="text-r">
                <Button type="success"
                        @click="handlerAddSeat(2)"
                        v-show="!seatId">新增</Button>
              </div>
              <div>
                <div class="seat">
                  <FormItem v-for="(item,i) in entity.humanSeats"
                            :key="i"
                            class="cn"
                            :prop="'humanSeats.' + i"
                            :rules="rules.seatNum"
                            :label-width="1">
                    <div class="seat-item">
                      <i class="seat-num">{{i + 1}}</i>
                      <i-input v-model="entity.humanSeats[i]"
                               placeholder="请输入坐席号码"
                               class="seat-ipt"></i-input>
                      <a href="javascript: void(0)"
                         class="seat-btn-del"
                         v-show="!seatId"
                         @click="handlerDeleteSeat(i,2)">删除</a>
                    </div>
                  </FormItem>
                </div>
              </div>
            </div>
          </div>
          <div class="board-header mt-20">
            开通固定坐席 <span class="vma-info">(固定坐席只支持三汇设备)</span>
            <span class="fr">合计数量: {{entity.fixedSeats.length}}</span>
          </div>
          <div class="board-body">
            <div>
              <div class="text-r">
                <Button type="success"
                        @click="handlerAddSeat(3)"
                        v-show="!seatId">新增</Button>
              </div>
              <div>
                <div class="seat">
                  <FormItem v-for="(item,i) in entity.fixedSeats"
                            :key="i"
                            class="cn"
                            :prop="'fixedSeats.' + i"
                            :rules="rules.seatNum"
                            :label-width="1">
                    <div class="seat-item">
                      <i class="seat-num">{{i + 1}}</i>
                      <i-input v-model="entity.fixedSeats[i]"
                               placeholder="请输入坐席号码"
                               class="seat-ipt"></i-input>
                      <a href="javascript: void(0)"
                         class="seat-btn-del"
                         v-show="!seatId"
                         @click="handlerDeleteSeat(i,3)">删除</a>
                    </div>
                  </FormItem>
                </div>
              </div>
            </div>
          </div>
          <div class="tc"
               v-show="!seatId">

            <i-button type="primary"
                      @click="handlerSave">保存</i-button>
            <i-button type="error"
                      @click="handlerCancel">取消</i-button>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import { currencyValidator, intValidator } from '@/assets/javascripts/asyncValidator/validators'
/**
 * 使用场景： 开通坐席，坐席详情（不做编辑）
 */
let entity = {
  adminId: '',// (integer, optional): 企业id ,
  expressCompany: '',// (string, optional): 快递公司 ,
  expressNo: '',// (string, optional): 快递单号 ,
  humanSeats: [],// (Array[string], optional): 人工坐席用 ,
  perPrice: 0,// (number, optional): 坐席单价 ,
  robotSeats: [],// (Array[string], optional): 机器坐席用
  fixedSeats: [],// (Array[string], optional): 固定坐席用

  // 辅助字段
  name: '', // 代理名称
  remainPort: 0,// 剩余年端口数
  monthCardRemainCount: 0,// 剩余月端口数
  serviceLife: '',
  portType: ""
}
export default {
  props: {
    visible: false,
    seatId: '',
    adminId: ''
  },
  data() {
    let _this = this
    return {
      entity: { ...entity, ...{ adminId: this.adminId, humanSeats: [], robotSeats: [] } },
      rules: {
        adminId: [{ required: true, message: '企业不能为空' }],
        expressCompany: [{ required: true, message: '快递不能为空' }],
        expressNo: [{ required: true, message: '快递单号不能为空' }],
        // 数组元素为基本类型时 使用动态验证 需要注意使用
        seatNum: [
          { required: true, message: '坐席号码不能为空' },
          { max: 11, min: 11, message: '请输入11位号吗' },
        ],
        portType: [{ required: true, message: '购买类型不能为空' }],
        serviceLife: [
          { required: true, message: '购买期限值不能为空' },
          { validator: intValidator, message: '请输入大于0的正整数' }
        ],
        perPrice: [
          { required: true, message: '请输入坐席单价' },
          { validator: currencyValidator, message: '请输入合法的价格' }
        ]
      },
      firmList: [], // 企业列表
      expressList: [], // 快递列表
      proxy: null, // 代理信息，
      typeString: "年"
    }
  },
  watch: {
    visible(n) {
      if (n) {
        this.loadFirmList()
        this.$nextTick(() => {
          if (this.seatId) {
            this.loadSeatApplyDetail()
          }
        })
      } else {
        this.entity = { ...entity, ...{ humanSeats: [], robotSeats: [] } }
        this.$refs.form.resetFields()
      }
    },
    adminId(n) {
      entity.adminId = n
      this.entity.adminId = n
    },
    'entity.portType'(n) {
      if (n == 0) {
        this.typeString = "年"
      } else if (n == 1) {
        this.typeString = "月"
      }
    }
  },
  methods: {
    init() {
      this.loadFirmList()
      this.loadExpressList()
      this.loadProxyDetail()
    },
    loadFirmList() {
      this.$pmsApi.seat.getFirmList().then(data => {
        this.firmList = data
      })
    },
    loadExpressList() {
      this.$pmsApi.seat.getLogisticsList().then(data => {
        this.expressList = data
      })
    },
    loadProxyDetail() {
      this.$pmsApi.seat.getProxyDetail().then(data => {
        let { name, price: perPrice, remainPort,monthCardRemainCount } = data
        entity = Object.assign(entity, { name, perPrice, remainPort,monthCardRemainCount })
        this.entity = Object.assign(this.entity, { name, perPrice, remainPort,monthCardRemainCount })
        return this.proxy = { name, perPrice, remainPort,monthCardRemainCount }
      })
    },
    loadSeatApplyDetail() {
      this.$pmsApi.seat.getApplyDetail(this.seatId).then(data => {
        debugger
        let { adminId, expressCompany, expressNo, humanSeats, robotSeats, name, perPrice, remainPort,monthCardRemainCount } = data
        this.entity = { adminId, expressCompany, expressNo, humanSeats, robotSeats, name, perPrice, remainPort,monthCardRemainCount }
      })
    },
    handlerAddSeat(type) {
      if (type == 1) {
        this.entity.robotSeats.push('')
      } else if (type == 2) {
        this.entity.humanSeats.push('')
      } else if (type == 3) {
        this.entity.fixedSeats.push('')
      }
    },
    handlerDeleteSeat(i, type) {
      if (type == 1) {
        this.entity.robotSeats.splice(i, 1)
      } else if (type == 2) {
        this.entity.humanSeats.splice(i, 1)
      } else if (type == 3) {
        this.entity.fixedSeats.splice(i, 1)
      }
    },

    async handlerSave() {
      let _valid = false
      this.$refs.form.validate(valid => { _valid = valid })
      if (!_valid) { return }

      let { adminId, expressCompany, expressNo, humanSeats, fixedSeats, perPrice, robotSeats,portType,serviceLife } = this.entity
      let postEntity = { adminId, expressCompany, expressNo, humanSeats, fixedSeats, perPrice, robotSeats,portType,serviceLife }
      await this.$pmsApi.seat.addSeat(postEntity)
      this.$Message.success('操作成功')
      this.$emit('after-save')
    },
    handlerCancel() {
      this.$emit('on-cancel')
    },
  },
  created() {
    this.init()
  }
};
</script>

<style>
</style>
