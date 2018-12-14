<template>
  <div class="panel" style="border-radius: 0;box-shadow: none">
    <div class="panel-header">
      <!-- <i class="icon icon-enlarge panel-header-icon"
         :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'"
         @click="toggleFullScreen"></i> -->
      任务详情
      <div class="panel-header-tools"
           v-if="entity.id">
        <template v-if="entity.status === 0">
          <Button type="primary"
                  @click="showWhispering">修改话术模板</Button>
          <template v-if="entity.startType === 1">
            <Button type="primary"
                    @click="updateTask(1)">开始任务</Button>
          </template>
          <template v-else-if="entity.startType === 2">
            <Button type="warning"
                    @click="updateTask(3)">终止任务</Button>
          </template>
        </template>
        <template v-if="entity.status === 1">
          <Button type="primary"
                  @click="updateTask(2)">暂停任务</Button>
          <Button type="warning"
                  @click="updateTask(3)">终止任务</Button>
        </template>
        <template v-if="entity.status === 2">
          <Button type="primary"
                  @click="showWhispering">修改话术模板</Button>
          <Button type="primary"
                  @click="updateTask(1)">继续任务</Button>
          <Button type="warning"
                  @click="updateTask(3)">终止任务</Button>
        </template>
        <template v-if="entity.status === 3">
          <Button type="error"
                  @click="showDel(entity.id)">删除任务</Button>
        </template>
        <template v-if="entity.status === 4">
          <Button type="error"
                  @click="showDel(entity.id)">删除任务</Button>
        </template>
      </div>
    </div>
    <div class="panel-body">
      <p class="nodata" v-show="!entity.id">暂无数据</p>
          <info-tab-panel :data="entity"/>
          <call-record-tab-panel :data="entity" />
    </div>

    <Modal v-model="whispering.show"
           title="修改话术模板"
           width="680"
           @on-ok="entrue"
           class-name="modal-lg">
        <whispering ref="mywhispering" :data="entity"
                    @on-cancel="cancelWhispering"
                    @after-submit="afterSubmitWhispering" />
      <!-- <div slot="footer"></div> -->
    </Modal>
  </div>
</template>

<script>
import { detailMixin } from '@/mixins'
import InfoTabPanel from './components/detail/infoTabPane'
import CallRecordTabPanel from './components/detail/callRecordTabPane'
import LogTabPanel from './components/detail/logTabPane'
import UserTabPanel from './components/detail/userTabPane'
import taskApi from '@/api/ems/task'
import taskEventBus from './taskEventBus'
import Whispering from './components/detail/whispering'

export default {
  mixins: [detailMixin],
  components: {
    InfoTabPanel,
    CallRecordTabPanel,
    LogTabPanel,
    UserTabPanel,
    Whispering
  },
  props: {
    fullScreen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tabName: 'info',
      whispering: {
        show: false
      }
    }
  },
  methods: {
    entrue(){
        this.$refs.mywhispering.submit();
    },
    toggleFullScreen() {
      this.$emit('toggleFullScreen', !this.fullScreen)
    },
    updateTask(status) {
      taskApi.update({
        id: this.entity.id,
        status
      }).then(() => {
        taskEventBus.$emit('task.update')
      })
    },
    showWhispering() {
      this.whispering.show = true
    },
    cancelWhispering() {
      this.whispering.show = false
    },
    afterSubmitWhispering() {
      this.whispering.show = false
      taskEventBus.$emit('task.update', this.entity.id)
    },
    showDel(id, content = '删除操作不可恢复，确认继续删除?') {
      this.$Modal.confirm({
        title: '确认删除',
        content,
        onOk: (action, instance) => {
          taskApi.del(id).then(() => {
            this.success('删除成功')
            taskEventBus.$emit('task.delete')
          })
        }
      })
    }
  }
}
</script>
