<template>
    <div>
        <Modal :value="visible"
        :mask-closable="false"
               title="购买端口"
               @on-visible-change="onVisible">
            <div class="ml-25">
                <h3 class="mb10">后台端口信息</h3>
                <Row class="tc mb20 fs-14">
                    <Col :span="12" class="text-l ml-40"> 剩余年端口数：{{platePortInfo.accountRemainPort }}</Col>
                    <Col :span="8"  class="text-l"> 剩余月端口数：{{platePortInfo.accountRemainMonthPort}}</Col>
                </Row>
                <h3 class="mb10">{{entry.name}}市代里端口信息</h3>
                <Row class="tc fs-14 mb20">
                    <Col :span="12"  class="text-l ml-40"> 已购买年端口数：{{entry.totalPort}}</Col>
                    <Col :span="8"  class="text-l"> 剩余可用年端口数：{{entry.remainPort}}</Col>
                </Row>
                <Row class="tc fs-14 mb20">
                    <Col :span="12"  class="text-l ml-40"> 已购买月端口数：{{entry.monthCardAllCount}}</Col>
                    <Col :span="8"  class="text-l"> 剩余可用月端口数：{{entry.monthCardRemainCount}}</Col>
                </Row>
                <Row class="tc fs-14 mb20">
                    <Col :span="12"  class="text-l ml-40"> 省份：{{entry.provinceName}}</Col>
                    <Col :span="8"  class="text-l"> 城市：{{entry.cityName}}</Col>
                </Row>
                <i-form :model="formData"
                        :label-width="110"
                        ref="formRef"
                        :rules="fromRules">

                    <FormItem label="代理商："
                              prop="adminId">
                       <span class="fs-14"> {{entry.name}}</span>
                        <!-- <i-select clearable v-model="formData.adminId" placeholder="选择代理商" :disabled="!formData.cityId">
                            <Option v-for="(item,index) in adminList" :key="index" :value="item.id">{{item.name}}</Option>
                        </i-select> -->
                    </FormItem>
                    <FormItem label="购买类型"
                              prop="portType">
                        <i-select v-model="formData.portType"
                                  style="width:45%;"
                                  placeholder="请选择购买类型">
                            <i-option value="0">购买年端口</i-option>
                            <i-option value="1">购买月端口</i-option>
                        </i-select>
                    </FormItem>
                    <FormItem :label="typeString"
                              prop="ports">
                        <InputNumber :min="0"
                                     v-model="formData.ports"></InputNumber>
                    </FormItem>
                    <!-- <FormItem label="新增端口数："
                              prop="ports">
                        <InputNumber :min="1"
                                     v-model="formData.ports"
                                     :precision="0"
                                     placeholder="输入端口数"></InputNumber>
                    </FormItem> -->

                    <FormItem label="金额："
                              prop="price">
                        <InputNumber :min="0"
                                     v-model="formData.price"
                                     placeholder="输入金额"></InputNumber>
                    </FormItem>
                </i-form>
            </div>
            <div slot="footer">
                <i-button @click="dialogClose" type="text">取消</i-button>
                <i-button type="primary"
                          @click="onConfirm">确定</i-button>
            </div>
        </Modal>
    </div>
</template>

<script>
const formData = {
    ports: 1,
    price: 0,
    adminId: '',
    portType: ''
}
export default {
    data() {
        let validateNumber = (rule, value, cb) => {
            if (!/^[0-9]*$/.test(value)) {
                return cb(new Error('必须为数字值!'))
            }
            cb();
        }
        return {
            formData: { ...formData },
            fromRules: {
                ports: [{
                    required: true,
                    message: '请输入端口数',
                },
                {
                    validator: validateNumber
                }
                ],
                price: [{
                    required: true,
                    message: '请输入金额',
                },
                {
                    validator: validateNumber
                }
                ],
                portType: [{ required: true, message: '购买类型不能为空' }],

            },
            typeString: '购买年端口数',
            platePortInfo: ''
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        entry: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    watch: {
        'formData.portType'(n) {
            if (n == 0) {
                this.typeString = "购买年端口数:"
                console.log(this.pObj)
            } else if (n == 1) {
                this.typeString = "购买月端口数:"
            }
        }
    },
    computed: {
        visible: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    mounted() {
    },
    methods: {
        dialogClose() {
            this.visible = false
            this.$refs.formRef.resetFields()
            this.formData = { ...formData }
        },
        onVisible(v) {
            if (!v) {
                this.dialogClose()
            }
        },
        onConfirm() {
            let _valid = false
            this.$refs.formRef.validate((valid) => _valid = valid)
            if (_valid) {
                this.formData.adminId = this.entry.id
                this.$omsApi.cityProxy.addSellPort(this.formData).then((data) => {
                    this.$emit('after-save')
                    this.dialogClose()
                    this.$Message.success('购买成功')
                })
            }
        },
        getPlatePort() {
            this.$omsApi.statistics.getPlatePort().then(res => {
                this.platePortInfo = res
            })
        }
    },
    mounted() {
        this.getPlatePort()
    }
}
</script>
