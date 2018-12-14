<template>
  <div>
    <div class="task">
      <div class="task-l1" style="width:28rem;">
        <div class="board" style="border-radius:0;">
          <div class="board-body" style="padding-top:0;padding-bottom:0;">
            <p>姓名: {{entity.userName}}</p>
            <p>电话: {{entity.mobile}}</p>
            <hr>
          </div>
          <div class="board-body">
            <p>任务名称: {{entity.taskName}}</p>
            <p>话术模板: {{entity.whisperingTitle}}</p>
            <p>机器坐席: {{entity.cardMobile}}</p>
            <p>呼叫时间: {{entity.callStartTime}}</p>
            <hr style="margin-bottom:10px;">
            <div class="nail">
              <div class="nail-item">
                <p class="h3">{{entity.callAllTime | duration }}</p>
                <p>通话时长</p>
              </div>
              <div class="nail-item">
                <p class="h3">{{entity.callCount || 0}}轮</p>
                <p>通话轮次</p>
              </div>
              <div class="nail-item">
                <p class="h3">{{entity.userLevel}}</p>
                <p>意向等级</p>
              </div>
            </div>

            <p class="mt-20">命中关键字: {{entity.keywords.length}}个</p>
            <div class="keyword">
              <ins
                class="keyword-item"
                v-for="(v, i) in entity.keywords"
                :key="i"
                :class="{'keyword-effect': v.status === 1}"
              >{{v.keyWord}}</ins>
            </div>
          </div>
        </div>
      </div>
      <div class="task-r1" style="width:100%;overflow:hidden;">
        <chat :data="entity" :autoScroll="autoScroll"/>
      </div>
    </div>
  </div>
</template>

<script>
import { detailMixin } from "@/mixins";
import Chat from "./components/chat.vue";

export default {
  mixins: [detailMixin],
  components: {
    Chat
  },
  props: {
    autoScroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      entity: {
        keywordList: []
      }
    };
  }
};
</script>
