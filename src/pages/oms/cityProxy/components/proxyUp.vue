<template>
    <div>
        <Modal :value="value" title="升级代理" @on-visible-change="onVisible">
            <div>
                <i-form :model="formData" :label-width="120" ref="formRef" :rules="fromRules">
                    
                    <FormItem label="当前等级：" prop="">
                        <Button disabled plain>
                        <span :class="['medal',{'medal-gold':pObj.proxyType==3,'medal-sliver':pObj.proxyType==2,'medal-bronze':pObj.proxyType==1}]">{{pObj.proxyType|proxyType}}牌代理</span>
                        </Button>
                    </FormItem>
                    <FormItem label="升级代理类型：" prop="proxyType">
                        <RadioGroup v-model="formData.proxyType" type="button">
                            <Radio v-for="(item,index) in proxyTypeList" :key="index" :label="item.value" :disabled="item.value<=pObj.proxyType">
                                <span :class="['medal','medal-'+item.class]">{{item.label+'牌代理' }}</span></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="新增端口数：" prop="newAddPort">
                        <span class="vm mr20" v-if="formData.newAddPort">{{formData.newAddPort}}</span>
                        <span class="fc-red fs12" v-else>(请先选择想要升级多代理类型)</span>
                        <span>（账户剩余端口数：{{pObj.remainPort}}）</span>
                    </FormItem>
                </i-form>
            </div>
            <div slot="footer">
                <i-button @click="dialogClose">取消</i-button>
                <i-button type="primary" @click="onConfirm">确定</i-button>
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
                    proxyType: null,
                    newAddPort:null
                },
                proxyTypeList: [{
                    value: 3,
                    label: '金',
                    class: 'gold'
                }, {
                    value: 2,
                    label: '银',
                    class: 'sliver'
                }, {
                    value: 1,
                    label: '铜',
                    class: 'bronze'
                }],
                fromRules: {
                    proxyType: [{
                        required: true,
                        message: '请选择代理类型',
                    }],
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
                        remainPort: '',
                        totalPort: ''
                    }
                }
            }
        },
        created() {
            this.$watch('formData.proxyType',function(val){
                if(val){
                    this.getNewAddPort()
                }
            })
        },
        mounted() {
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
            async getNewAddPort(){
                let result = await this.$omsApi.cityProxy.getAddPort({
                    id:this.pObj.id,
                    proxyType:this.formData.proxyType
                })
                this.formData.newAddPort = result
            },
            onConfirm() {
                this.$refs['formRef'].validate((valid) => {
                    if (valid) {
                        let fd = this.formData
                        this.$omsApi.cityProxy.addProxyUp({
                            ports: (+fd.newAddPort),
                            proxyType: (+fd.proxyType),
                            id: this.pObj.id,
                        }).then((data) => {
                            this.dialogClose()
                            this.$emit('reload', true)
                        })
                    } else {
                        return
                    }
                })
    
            }
        }
    }
</script>
