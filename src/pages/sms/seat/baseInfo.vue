<template>
    <div class="task-detail">
        <div v-show="detail.id">
            <h1>{{detail.mobile}}
                <div class="fr">
                    <ins class="keyword-item keyword-primary"
                         :class="{'keyword-success':detail.status==1,'keyword-default':detail.status==0,'keyword-primary':detail.status==3,'keyword-danger':detail.status==2}">{{detail.status|seatStatus}}</ins>
                </div>
            </h1>
            <sub>
                <span>{{detail.nickName}}</span>
                <em class="ml-10">{{detail.cardType | value(cardType)}}</em>
                <em class="ml-10">共呼出{{detail.callNum||0}}次</em>
            </sub>
            <hr class="mt-20">
            <Row class="mt-15 fs-16">
                <Col span="11">创建时间：{{detail.createTime|msToDate}}</Col>
                <Col span="11">有效时间：{{detail.endTime|msToDate}}</Col>
            </Row>
            <Row class="mt-15 fs-16">
                <Col span="11">
                <i-form>
                    <FormItem label="所属商家：">
                        {{detail.name}}
                    </FormItem>
                    <FormItem label="所属设备：">
                        {{detail.machineName}}
                    </FormItem>
                    <FormItem label="所属端口：">
                        {{detail.slotNo}}
                    </FormItem>
                </i-form>
                </Col>
                <Col span="11">
                <i-form>
                    <FormItem label="市级代理商：">
                        {{detail.cityName}}
                    </FormItem>
                    <FormItem label="省级代理商：">
                        {{detail.provinceName}}
                    </FormItem>
                </i-form>
                </Col>
            </Row>
        </div>
        <!-- 没数据 -->
        <div v-show="!detail.id"
             class="ptb50 tc">
            <span>暂无数据</span>
        </div>
    </div>
</template>

<script>
const cardType = { '1': '机器人坐席', '2': '人工坐席', '3': '固定坐席' }
export default {
    data() {
        return {
            cardType
        }
    },
    props: {
        detail: {
            type: Object,
            default: () => {
                return {}
            },
        }
    },
}
</script>
