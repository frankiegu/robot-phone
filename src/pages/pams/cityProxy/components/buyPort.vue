<template>
    <div>
        <Modal :value="visible"
               title="购买端口"
               @on-visible-change="onVisible">
            <div>
                <h3 class="mb10">后台端口信息</h3>
                <Row class="tc mb20">
                    <Col :span="12"> 剩余年端口数：{{platePortInfo.accountRemainPort }}</Col>
                    <Col :span="12"> 剩余月端口数：{{platePortInfo.accountRemainMonthPort}}</Col>
                </Row>
                <h3 class="mb10">{{formData.name}}市代里端口信息</h3>
                <Row class="tc mb20">
                    <Col :span="12"> 已购买年端口数：{{formData.totalPort}}</Col>
                    <Col :span="12"> 剩余可用年端口数：{{formData.remainPort}}</Col>
                </Row>
                <Row class="tc mb20">
                    <Col :span="12"> 已购买月端口数：{{formData.monthCardAllCount}}</Col>
                    <Col :span="12"> 剩余可用月端口数：{{formData.monthCardRemainCount}}</Col>
                </Row>
                <Row class="tc mb20">
                    <Col :span="12"> 省份：{{formData.provinceName}}</Col>
                    <Col :span="12"> 城市：{{formData.cityName}}</Col>
                </Row>
                <i-form :model="formData"
                        :label-width="120"
                        ref="formRef"
                        :rules="fromRules">

                    <!-- <FormItem label="省份：">
                        {{formData.provinceName}}
                    </FormItem>

                    <FormItem label="城市：">
                        {{formData.cityName}}
                    </FormItem> -->

                    <FormItem label="代理商：">
                        {{formData.name}}
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
                                     style="width:45%;"
                                     v-model="formData.ports"></InputNumber>
                    </FormItem>

                    <FormItem label="金额："
                              prop="price">
                        <i-input v-model="formData.price"
                                 style="width:45%;"></i-input>
                    </FormItem>

                </i-form>
            </div>
            <div slot="footer">
                <i-button @click="dialogClose">取消</i-button>
                <i-button type="primary"
                          @click="onConfirm">确定</i-button>
            </div>

        </Modal>
    </div>
</template>

<script>

const entity = {
    ports: 0,
    price: 0,
    adminId: '',
    portType: '',
    // 非提交数据
    name: '',
    provinceName: '',
    cityName: '',
    totalPort: 0,
    remainPort: 0,
    monthCardAllCount: '',
    monthCardRemainCount: ''
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
            formData: { ...entity },
            fromRules: {
                adminId: [{
                    required: true,
                    message: '请选择代理商',
                }],
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
        proxyId: '',
    },
    computed: {
        visible: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            },
        }
    },
    watch: {
        value: {
            handler(n) {
                if (n) { this.loadDetail() }
            },
            immadie: true,
        },
        'formData.portType'(n) {
            if (n == 0) {
                this.typeString = "购买年端口数:"
            } else if (n == 1) {
                this.typeString = "购买月端口数:"
            }
        }
    },
    methods: {
        loadDetail() {
            if (!this.proxyId) { return }
            this.$pmsApi.cityProxy.getCityProxyDetail(this.proxyId).then(data => {
                console.log(data)
                let { name, provinceName, cityName, totalPort, remainPort, id: adminId, monthCardAllCount, monthCardRemainCount } = data

                this.formData = Object.assign({}, this.formData, { name, provinceName, cityName, totalPort, remainPort, adminId, monthCardAllCount, monthCardRemainCount })
            })
        },
        dialogClose() {
            this.formData = { ...entity },
                this.$refs.formRef.resetFields()
            this.visible = false
        },
        onVisible(vs) {
            if (!vs) {
                this.dialogClose()
            }
        },
        onConfirm() {
            this.$refs['formRef'].validate((valid) => {
                if (valid) {
                    let fd = this.formData
                    this.$pmsApi.cityProxy.addSellPort({
                        ports: +fd.ports,
                        price: +fd.price,
                        adminId: fd.adminId,
                        portType: fd.portType
                    }).then((data) => {
                        this.dialogClose()
                        this.$emit('reload', true)
                        this.$message({ type: 'success', message: '操作成功' })
                    })
                } else {
                    return
                }
            })
        },
        getPlatePort() {
            this.$pmsApi.statistics.getPlatePort().then(res => {
                this.platePortInfo = res
            })
        }
    },
    mounted() {
        this.getPlatePort()
    }
}
</script>
