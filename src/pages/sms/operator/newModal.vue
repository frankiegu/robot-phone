<template>
    <div>
        <Modal :value="value"
               :title="formData.modalTitle"
               @on-visible-change="onVisible">
            <div>
                <i-form :model="formData"
                        :label-width="120"
                        ref="formData"
                        :rules="fromRules"
                        size="mini">
                    <FormItem label="运营商名称："
                              prop="name">
                        <i-input v-model="formData.name"></i-input>
                    </FormItem>
                    <FormItem label="运营商logo:"
                              prop="logo">
                        <ms-image-upload v-model="formData.logo" />
                    </FormItem>
                    <FormItem label="头像:"
                              prop="headUrl">
                        <ms-image-upload v-model="formData.headUrl" />
                    </FormItem>
                    <template v-if="formData.modalType === 'new'">
                        <FormItem label="年代理台数："
                                  prop="proxyPort">
                            <i-input v-model="formData.proxyPort"></i-input>
                        </FormItem>
                        <FormItem label="月代理台数："
                                  prop="proxyPort">
                            <i-input v-model="formData.monthProxyPort"></i-input>
                        </FormItem>
                        <FormItem label="代理价格："
                                  prop="proxyPrice">
                            <i-input v-model="formData.proxyPrice"
                                     placeholder="请输入收取的代理价格"></i-input>
                        </FormItem>
                    </template>

                    <FormItem label="运营商账号："
                              prop="account">
                        <i-input v-model="formData.account"
                                 :disabled="formData.modalType === 'edit'"
                                 placeholder="请输入英文字母和数字组合，6-30字符，用于登录"></i-input>
                    </FormItem>
                    <FormItem label="绑定手机号："
                              prop="mobile">
                        <i-input v-model="formData.mobile"
                                 placeholder="请输入手机号码"></i-input>
                    </FormItem>
                    <!-- <FormItem label="验证码："
                              prop="verifCode"
                              :required="verifCodeRequired">
                        <i-input v-model="formData.verifCode"
                                 placeholder="请输入手机验证码">
                           
                            <ge-code slot="append"
                                     :config="config"></ge-code>
                        </i-input>
                    </FormItem> -->
                    <FormItem label="初始密码："
                              prop="password">
                        <i-input v-model="formData.password"></i-input>
                    </FormItem>
                    <FormItem label="联系人："
                              prop="contactsName">
                        <i-input v-model="formData.contactsName"></i-input>
                    </FormItem>
                    <FormItem label="联系电话："
                              prop="contactsMobile">
                        <i-input v-model="formData.contactsMobile"></i-input>
                    </FormItem>
                    <FormItem label="联系地址："
                              prop="contactsAddress">
                        <i-input v-model="formData.contactsAddress"></i-input>
                    </FormItem>
                    <FormItem label="备注："
                              prop="remarks">
                        <i-input v-model="formData.remarks"
                                 type="textarea"
                                 :rows="3"></i-input>
                    </FormItem>
                    <FormItem label="微信模板ID："
                              prop="templateId">
                        <i-input v-model="formData.templateId"></i-input>
                    </FormItem>
                    <ms-fold title="微信公众号">
                        <div class="mt-20">
                            <FormItem label="appid："
                                      prop="appid">
                                <i-input v-model="formData.appid"
                                         placeholder="微信公众号appid"></i-input>
                            </FormItem>
                            <FormItem label="secret："
                                      prop="secret">
                                <i-input v-model="formData.secret"
                                         placeholder="微信公众号secret"></i-input>
                            </FormItem>
                        </div>
                    </ms-fold>
                </i-form>
            </div>
            <div slot="footer">
                <i-button @click="dialogClose">取消</i-button>
                <i-button type="primary"
                          @click.native="onConfirm">确定</i-button>
            </div>

        </Modal>
    </div>
</template>

<script>
import geCode from '@/components/libs/geCode'
let geCodeConfig = (context) => {
    let vm = context
    return {
        startText: '获取验证码',
        endText: '获取验证码',
        todo() {
            vm.$nextTick(() => {
                vm.sendMessage()
            })
        },
        click() {
        },
        canTodo: () => {
            //返回值判定是否可以发送
            let result = /^[1][0-9]{10}$/.test(vm.formData.mobile);
            if (!result) {
                vm.$Message.warning('请输入正确的手机号码');
            }
            return result;
        },
    }
}
export default {
    data() {
        let validateNumber = (rule, value, cb) => {
            if (!/^[0-9]*$/.test(value)) {
                return cb(new Error('必须为数字值!'))
            }
            cb();
        }
        let validateStringNum = (rule, value, cb) => {
            if (!/^[0-9a-zA-Z]+$/.test(value)) {
                return cb(new Error('必须为数字或者英文!'))
            }
            cb();
        }
        return {
            config: geCodeConfig(this),
            formData: {
                account: "",
                proxyPort: null,
                monthProxyPort: '',
                contactsAddress: "",
                contactsMobile: "",
                contactsName: "",
                mobile: "",
                name: "",
                logo: "",
                headUrl: "",
                password: "",
                proxyPice: null,
                remarks: "",
                // verifCode: "", //验证码
                modalTitle: "新建运营商",
                appid: '',
                secret: '',
                templateId: ''
            },
            tempMobile: '',
            verifCodeRequired: false,
            resetForm: {
                account: "",
                proxyPort: null,
                contactsAddress: "",
                contactsMobile: "",
                contactsName: "",
                logo: "",
                headUrl: "",
                mobile: "",
                name: "",
                password: "",
                proxyPice: null,
                remarks: "",
                verifCode: "",
                modalTitle: "新建运营商",
                appid: '',
                secret: '',
                templateId: ''
            },
            fromRules: {
                account: [{
                    required: true,
                    min: 6,
                    max: 30,
                    message: '请输入6-30字符',
                },
                {
                    validator: validateStringNum
                }
                ],
                proxyPort: [{
                    required: true,
                    message: '必填项',
                },
                {
                    validator: validateNumber
                }
                ],
                mobile: [{
                    required: true,
                    message: '必填项',
                }, {
                    validator: validateNumber
                }],
                name: [{
                    required: true,
                    message: '必填项',
                }],
                // logo: [{
                //     required: true,
                //     message: '必填项',
                //     trigger:'change',
                // }],
                password: [{
                    required: true,
                    message: '必填项',
                }],
                proxyPrice: [{
                    required: true,
                    message: '必填项',
                },
                {
                    validator: validateNumber
                }
                ],
                // verifCode: [{
                //     required: true,
                //     message: '必填项',
                // }],

            }
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
        value: function (val) {
            if (val) {
                this.formData = Object.assign({}, this.formData, this.pObj)
                this.tempMobile = this.pObj.mobile
                if (this.formData.modalType == "edit") {
                    this.verifCodeRequired = false
                    this.fromRules.verifCode && delete this.fromRules.verifCode
                } else {
                    this.verifCodeRequired = true
                    this.fromRules.verifCode = [{
                        required: true,
                        message: '必填项',
                    }]
                }
            } else {
                this.$emit('reload', {}, false)
                this.$refs.formData.resetFields()
                this.formData = Object.assign({}, this.restForm)
            }
        },
        'formData.mobile': function (value) {
            if (this.formData.modalType == "edit" && value && this.tempMobile && value == this.tempMobile) {
                this.verifCodeRequired = false
                this.fromRules.verifCode && delete this.fromRules.verifCode
            } else {
                this.verifCodeRequired = true
                this.fromRules.verifCode = [{
                    required: true,
                    message: '必填项',
                }]
            }
        }
    },
    components: {
        geCode
    },
    methods: {
        dialogClose() {
            this.$emit("input", false);
        },
        onVisible(vs) {
            if (!vs) {
                this.dialogClose()
            }
        },
        async sendMessage() {
            let result = await this.$smsApi.common.sendMessage(this.formData.mobile)
        },
        onConfirm() {
            this.$refs.formData.validate((valid) => {
                if (!this.formData.logo) {
                    this.$Message.warning({
                        content: '请上传运营商logo',
                        duration: 3
                    })
                    return
                }
                if (valid) {
                    if (this.formData.modalType == "new") {
                        this.$smsApi.operator.addOperator(Object.assign({}, this.formData
                        )).then((data) => {
                            this.dialogClose()
                            this.$emit('reload', {
                                modalType: 'new'
                            }, true)
                        })
                    } else {
                        this.$smsApi.operator.updateOperator(Object.assign({}, this.formData, {
                            id: this.pObj.id
                        })).then((data) => {
                            this.dialogClose()
                            this.$emit('reload', {
                                modalType: 'edit'
                            }, true)
                        })
                    }

                } else {
                    return
                }
            })

        }
    }
}
</script>
