<template>
  <div class="task-detail">
    <!-- <p class="h4">请选择话术模板</p> -->
    <p class="help-block">注: 修改话术模板后，将从下一个呼叫电话开始，使用修改后的话术模板</p>
    <div class="plate mt-20"
         style="max-height: 300px; overflow: auto;"
         v-show="whisperingList.length">
      <div class="plate-item"
           v-for="v in whisperingList"
           :key="v.id"
           :class="{active: entity.whisperingId == v.id}"
           @click="setWhispering(v)">
           {{v.title}}
        
        <p>{{v.content}}</p>
      </div>
      <p class="nodata"
         v-show="!whisperingList.length">暂无话术</p>
    </div>
    <!-- <div class="text-c">
      <Button 
              style="margin-right: 8px"
              @click="cancel">取消</Button>
      <Button type="primary"
              @click="submit">确定</Button>
    </div> -->
  </div>
</template>

<script>
import taskApi from '@/api/ems/task'

export default {
  props: {
    data: {
      type: Object,
      default() { }
    },
  },
  data() {
    return {
      whisperingList: [],
      entity: {
        whisperingId: this.data.whisperingId,
        whisperingTitle: this.data.whisperingTitle
      }
    }
  },
  created() {
    taskApi.listWhispering().then(data => {
      this.whisperingList = data
    })
  },
  methods: {
   
    setWhispering(v) {
      this.entity.whisperingId = v.id
      this.entity.whisperingTitle = `${v.title}`
    },
    cancel() {
      this.$emit('on-cancel')
    },
    submit() {
      if (!this.entity.whisperingId) {
        return this.warning('请选择话术模板')
      }
      taskApi.update({
        id: this.data.id,
        whisperingId: this.entity.whisperingId,
        whisperingTitle: this.entity.whisperingTitle
      }).then(() => {
        this.$emit('after-submit')
      })
    }
  }
}
</script>
