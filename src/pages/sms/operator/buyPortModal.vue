<template>
    <div>
        <Modal :value="value"
               title="购买端口"
               @on-visible-change="onVisible">
            <div>

                <h3 class="mb10">后台端口信息</h3>
                <Row class="tc mb20">
                    <Col :span="12"> 剩余年端口数：{{platePortInfo.accountRemainPort }}</Col>
                    <Col :span="12"> 剩余月端口数：{{platePortInfo.accountRemainMonthPort}}</Col>
                </Row>
                <h3 class="mb10">{{pObj.name}}运营商端口信息</h3>
                <Row class="tc mb20">
                    <Col :span="12"> 已购买端口数：{{pObj.cardAllCount}}</Col>
                    <Col :span="12"> 剩余可用端口数：{{pObj.cardRemainCount}}</Col>
                </Row>
                <Row class="tc mb20">
                    <Col :span="12"> 已购买月端口数：{{pObj.monthCardAllCount}}</Col>
                    <Col :span="12"> 剩余可用月端口数：{{pObj.monthCardRemainCount}}</Col>
                </Row>

                <i-form :model="formData"
                        :label-width="100"
                        ref="formRef"
                        :rules="fromRules">
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
                                     v-model="formData.ports"
                                     style="width:45%;"></InputNumber>
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
export default {
    data() {
        let validateNumber = (rule, value, cb) => {
            if (!/^[0-9]*$/.test(value)) {
                return cb(new Error('必须为数字值!'))
            }
            cb();
        }
        return {
            formData: {
                ports: null,
                price: null,
                portType: ""
            },
            typeString: '购买年端口数',
            fromRules: {
                ports: [{
                    required: true,
                    message: '请输入端口数',
                }, {
                    validator: validateNumber
                }],
                price: [{
                    required: true,
                    message: '请输入金额',
                },
                {
                    validator: validateNumber
                }],
                portType: [{ required: true, message: '购买类型不能为空' }]

            },
            platePortInfo:''
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        pObj: {
            type: Object,
            default: () => {
                return {
                    cardAllCount: '',
                    cardRemainCount: ''
                }
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
    methods: {
        dialogClose() {
            this.$emit("input", false);
            this.$refs.formRef.resetFields()
        },
        onVisible(vs) {
            if (!vs) {
                this.dialogClose()
            }
        },
        onConfirm() {
            this.$refs['formRef'].validate((valid) => {
                if (valid) {
                    this.$smsApi.operator.addPort(Object.assign({}, this.formData, {
                        id: this.pObj.id
                    })).then((data) => {
                        this.dialogClose()
                        this.$emit('reload', true)
                    })
                } else {
                    return
                }
            })

        },
        getPlatePort() {
             this.$smsApi.statistics.getPlatePort().then(res=>{
                 this.platePortInfo=res
             })
        }
    },
    mounted() {
        this.getPlatePort()
    },
}
</script>
