<template>
  <div class="task-detail">
    <div v-show="!!templateId">
      <div class="cf">
        <div class="dib">
          <span class="title" style="margin:0;">{{template.templateName}}</span>
          <span>ID: {{template.id}}</span>
        </div>
        <div class="fr">
          <!-- <div class="mb10">状态：{{statusMap[template.status]}}</div> -->
          <i-switch
            v-model="template.status"
            size="large"
            :true-value="1"
            :false-value="0"
            @on-change="handlerChangeStatus"
          >
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </div>
      </div>

      <hr class="mt20">
      <div class="mt20">
        <div style="border:1px solid #E5E5E5;border-radius: 5px;" class="pd10 mb20">
 <Row>
          <i-col span="10">
            <div class="mb10">上午上班时间： {{template.amStartTime}}</div>
            <div class="mb10">上午下班时间： {{template.amEndTime}}</div>
          </i-col>
          <i-col span="10">
            <div class="mb10">下午上班时间： {{template.pmStartTime}}</div>
            <div class="mb10">下午下班时间： {{template.pmEndTime}}</div>
          </i-col>
        </Row>
        </div>
        <div class="mb10 cf pd10 mb20" style="border:1px solid #E5E5E5;border-radius: 5px;">
          <div class="dib mb10">拨号时间：</div>
          <div>
            <i-button
              type="primary"
              ghost
              class="mr15 mb15"
              v-for="(item,i) in weekDate"
              :key="i"
            >{{weekArray[item - 1]}}</i-button>
          </div>
        </div>
        <div class="mb20 cf pd10" style="border:1px solid #E5E5E5;border-radius: 5px;">
          <span class="dib">排除日期：</span>
          <div>
            <div>
              <span class="dib mr15 mb15" v-for="(item,i) in excludeDate" :key="i">{{item}}</span>
            </div>
          </div>
        </div>
        <div class="mb10 cf" style="border:1px solid #E5E5E5;border-radius: 5px;">
          <div style="font-size:0.7rem;">
            <i-button type="text"  @click="handlerShowExpire">
              已过期日期({{timeOutDate.length}})
              <Icon :type="showExpire ? 'ios-arrow-down': 'ios-arrow-up'"></Icon>
            </i-button>
            <transition name="slide-down">
              <div v-show="showExpire" class="ml15">
                <span class="dib mr15  mb15" v-for="(item,i) in timeOutDate" :key="i">{{item}}</span>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <!-- 没数据 -->
    <div v-show="!templateId" class="ptb50 tc">
      <span>暂无数据</span>
    </div>
  </div>
</template>
<script>
const template = {
  amEndTime: "",
  amStartTime: "",
  excludeDate: "",
  id: "",
  pmEndTime: "",
  pmStartTime: "",
  status: 0,
  templateName: "",
  timeOutDate: "",
  weekDate: ""
};

export default {
  props: {
    templateId: ""
  },
  data() {
    return {
      template: { ...template },
      showExpire: false,
      statusMap: { "0": "禁用", "1": "启用" },
      weekArray: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    };
  },
  computed: {
    weekDate() {
      return this.template.weekDate ? this.template.weekDate.split(",") : [];
    },
    excludeDate() {
      return this.template.excludeDate
        ? this.template.excludeDate.split(",")
        : [];
    },
    timeOutDate() {
      return this.template.timeOutDate
        ? this.template.timeOutDate.split(",")
        : [];
    }
  },
  watch: {
    templateId(n) {
      if (n) {
        this.loadDetail();
      } else {
        this.template = { ...template };
      }
    }
  },
  methods: {
    loadDetail() {
      this.$emsApi.timeTemplate
        .getTempalteDetail(this.templateId)
        .then(data => {
          this.template = data;
        });
    },
    refresh() {
      if (this.templateId) {
        this.loadDetail();
      } else {
        this.template = { ...template };
      }
    },
    async handlerChangeStatus(e) {
      let template = { ...this.template };
      template.status = e;
      await this.$emsApi.timeTemplate.updateTemplate(template).catch(() => {});
      this.loadDetail();
    },
    handlerShowExpire() {
      this.showExpire = !this.showExpire;
    }
  },
  created() {}
};
</script>
<style>
</style>
