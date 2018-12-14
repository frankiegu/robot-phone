<template>
  <div class="task-detail">
    <div class="mt-20">
      <Row>
        <i-col span="8"><p>状态：{{ entity.status==1?'启用': '禁用' }}</p></i-col>
        <i-col span="8">
          <i-switch
          v-model="entity.status"
          size="large"
          :true-value="1"
          :false-value="3"
          @on-change="handleSwitchChange"
        >
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
        </i-col>
        <i-col span="8">
          <p>初筛微信销售人员: {{entity.wxUserName || '无'}}</p>
        </i-col>
      </Row>
      <Row>
        <i-col span="8">
          <p>设备名称: {{entity.machineName || '无'}}</p>
        </i-col>
        <i-col span="8">
          <p>设备号: {{entity.machineNo || '无'}}</p>
        </i-col>
        <i-col span="8">
          <p>设备端口号: {{entity.slotNo|| '无'}}</p>
        </i-col>
      </Row>
      <Row>
        <i-col span="8">
          <p>创建时间: {{entity.createTime | date}}</p>
        </i-col>
        <i-col span="8">
          <p>固定坐席号码: {{entity.mobile}}</p>
        </i-col>
        <i-col span="8">
          <p>
            话术模板: {{entity.whisperingTitle}}
            <span
              v-show="entity.whisperingVersion"
            >({{entity.whisperingVersion}})</span>
          </p>
        </i-col>
      </Row>
      <Row>
        <i-col span="8">
          <p>命中有效关键字次数: {{entity.validKeyNum}}</p>
        </i-col>
        <i-col span="8">
          <p>通话轮次: {{entity.callNum}}</p>
        </i-col>
        <i-col span="8">
          <p>通话时长: {{entity.callTime}}秒</p>
        </i-col>
      </Row>
      <Row>
        <i-col span="8">
          <p>关键字模板: {{entity.keyOpen | value(['未设置', entity.keyTemplateName])}}</p>
        </i-col>
        <i-col span="8">
          <p>初筛短信级别: {{messageLevel || '无'}}</p>
        </i-col>
        <i-col span="8">
          <p>初筛短信模板: {{entity.messageTemplateName || '无'}}</p>
        </i-col>
      </Row>
      <Row>
        <i-col span="8">
          <p>初筛微信级别: {{wxLevelList || '无'}}</p>
        </i-col>
        <i-col span="8">
          <p>方言: {{getDialectLabel(entity.dialect) || '无'}}</p>
        </i-col>
        <i-col span="8">
          <p>sip_id: {{entity.sipId || '无'}}</p>
        </i-col>
      </Row>
      
    </div>
  </div>
</template>

<script>
import { detailMixin } from "@/mixins";
import * as cardSlotApi from "@/api/ems/cardSlot";
import { getDialectLabel } from "@/pages/ems/marketing/components/task/src/dialect";

export default {
  mixins: [detailMixin],
  computed: {
    messageLevel() {
      let list = this.entity.messageLevelList
        ? this.entity.messageLevelList.slice(0)
        : [];
      return list.reverse().join(",");
    },
    wxLevelList() {
      let list = this.entity.wxLevelList
        ? this.entity.wxLevelList.slice(0)
        : [];
      return list.reverse().join(",");
    },
    wxUserList() {
      let list = this.entity.wxUserList ? this.entity.wxUserList.slice(0) : [];
      return list.reverse().join(",");
    }
  },
  methods: {
    getDialectLabel,
    handleSwitchChange() {
      cardSlotApi
        .updateFixedStatus({
          id: this.entity.id,
          status: this.entity.status
        })
        .then(() => {
          this.success(`${["", "启用", "", "禁用"][this.entity.status]}成功`);
          this.$emit("after-update");
        })
        .catch(res => {
          console.log(res);
          this.entity.status = 3;
        });
    }
  }
};
</script>
