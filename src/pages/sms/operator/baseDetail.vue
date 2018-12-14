<template>
    <div class="base-detail">
        <div class="task-detail">
            <h1>{{detail.name}}
                <!-- <em class="keyword-item keyword-warning">B级</em> -->
                <div class="fr line1">
                    <em class="fs16 fc6">状态:</em>
                    <i-switch :true-value="1"
                              :false-value="0"
                              @on-change="changeStatus"
                              v-model="detail.status">
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </i-switch>
                </div>
            </h1>
            <sub>ID：{{detail.id}}</sub>
            <!-- <div class="keyword mt-30"><ins class="keyword-item">有意向客户</ins> <ins class="keyword-item">客户标签</ins> <ins class="keyword-item">有钱</ins></div> -->
            <hr class="mt-20">
            <div class="mt-20">
                <Row>
                    <Col :xs="{span:12}"
                         :md="{span:8,offset:1}">
                    <p>累计认领年端口数：{{detail.cardAllCount}}台</p>
                    <p>已开通年端口数：{{detail.cardUseCount}}台</p>
                    <p>初始年端口数：{{detail.cardInitCount}}台</p>
                    <p>剩余可开通年端口数：{{detail.cardRemainCount}}台</p>
                    </Col>
                     <Col :xs="{span:12}"
                         :md="{span:8,offset:1}">
                    <p>累计认领月端口数：{{detail.monthCardAllCount}}台</p>
                    <p>已开通月端口数：{{detail.monthCardUseCount}}台</p>
                    <p>初始月端口数：{{detail.monthCardInitCount}}台</p>
                    <p>剩余可开通月端口数：{{detail.monthCardRemainCount}}台</p>
                    </Col>
                    <Col :xs="{span:12}"
                         :md="{span:8,offset:1}">
                    <p>机器坐席数：{{detail.robotNum}}台</p>
                    <p>固定坐席数：{{detail.fixedNum}}台</p>
                    </Col>
                     <Col :xs="{span:12}"
                         :md="{span:8,offset:1}">
                    <p>人工坐席数：{{detail.humanNum}}台</p>
                    </Col>
                </Row>
            </div>
            <hr class="mt-20">
            <div class="mt-20">
                <Row>
                    <Col :xs="{span:12}"
                         :md="{span:8,offset:1}">
                    <p>创建时间：{{detail.createTime|msToDate}}</p>
                    <p>联系人：{{detail.contactsName}}</p>
                    <p>联系电话：{{detail.contactsMobile}}</p>
                    <p>微信公众号appid：{{detail.appid}}</p>
                    <p>微信公众号secret：{{detail.secret}}</p>
                    </Col>
                    <Col :xs="{span:12}"
                         :md="{span:8,offset:1}">
                    <p></p>
                    <p>联系地址：{{detail.contactsAddress}}</p>
                    <p>备注：{{detail.remarks}}</p>
                    <p>短信条数：{{detail.messageUseCount || 0}}/{{detail.messageAllCount || 0}}</p>
                    <p>短信模板ID：{{detail.templateId}}</p>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            detail: {}
        }
    },
    props: {
        id: ''
    },
    watch: {
        id: function (n) {
            this.getDetail()
        }
    },
    methods: {
        async getDetail() {
            if (this.id !== '') {
                let result = await this.$smsApi.operator.getDetail(this.id)
                this.detail = result
                this.$emit('detail', result)
            }

        },
        changeStatus() {
            this.$smsApi.operator.changeStatus({
                id: this.id,
                status: this.detail.status
            }).then(() => {
                this.getDetail()
            }).catch(() => {
                this.getDetail()
            })
        }
    }
}
</script>
