<template>
  <div class="panel panel-full">
    <div class="panel-header">
      通话详情
      <div class="panel-header-tools">
        <Icon type="close" class="panel-close" @click.native="handleClose"></Icon>
      </div>
    </div>
    <div class="panel-body">
      <div class="task">
        <div class="task-l">
          <div class="board board-primary">
            <div class="board-header">
              客户信息
            </div>
            <div class="board-body">
              <p class="mt-10">姓名：{{ detail.userName || '' }}</p>
              <p>电话：{{ detail.mobile || '' }}</p>
            </div>
            <div class="board-header">
              通话信息
            </div>
            <div class="board-body">
              <p class="mt-10">任务名称：{{ detail.taskName || '' }}</p>
              <p>话术模板：{{ detail.whisperingTitle || '' }}</p>
              <p>机器坐席：{{ detail.cardMobile || '' }}</p>
              <p>呼叫时间：{{ detail.callStartTime || '' }}</p>
              <p>
                客户意向等级：
                <ins class="keyword-item keyword-primary" v-if="detail.userLevel === 'A'">A级</ins>
                <ins class="keyword-item keyword-success" v-if="detail.userLevel === 'B'">B级</ins>
                <ins class="keyword-item keyword-info" v-if="detail.userLevel === 'C'">C级</ins>
                <ins class="keyword-item keyword-default" v-if="detail.userLevel === 'D'">D级</ins>
                <ins class="keyword-item keyword-warning" v-if="detail.userLevel === 'E'">E级</ins>
                <ins class="keyword-item keyword-danger" v-if="detail.userLevel === 'F'">F级</ins>
              </p>
              <p>命中关键字：{{ detail.keywordList && detail.keywordList.length || 0 }}个</p>
            </div>
          </div>
        </div>
        <div class="task-r">
          <div class="board board-primary">
            <div class="board-header">
              通话记录
            </div>
            <div class="board-body">
              <p>录音</p>
              <div v-if="detail.recordDetailsList">
                <p class="call-keyword-list" v-for="item in detail.recordDetailsList">
                  <span>{{ item.callName }}</span>
                  <span>{{ item.callContent }}</span>
                  <span>{{ item.callType === 1 ? '系统' : '客户' }}</span>
                </p>
              </div>
              <p v-else>暂无通话记录</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/api/index'

const API_RECORD = API.ems.callRecord

export default {
  name: 'clientDetail',
  props: {
    hide: Function
  },
  data() {
    return {
      detail: {}
    }
  },
  methods: {
    init(id) {
      API_RECORD.getRecordDetailById(id)
        .then(res => {
          this.detail = res
        })
    },
    handleClose() {
      this.hide()
    }
  }
}
</script>
