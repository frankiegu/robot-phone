<template>
  <div>
    <robot-seat :card-type="cardType" ref="seat">
      <template slot-scope="scope" slot="detailOperator">
        <div class="panel-header-tools">
          <Button type="primary" @click="showSetting(scope.data)">设置</Button>
        </div>
      </template>
      <template slot-scope="scope" slot="baseInfo">
        <mod-detail :data="scope.data" @after-update="afterUpdateDetail"/>
      </template>
      <template slot-scope="scope" slot="callRecord">
        <call-record :data="scope.data"/>
      </template>
    </robot-seat>
    <Modal v-model="form.show" title="设置固定坐席">
      <template v-if="form.show">
        <mod-form ref="modForm"  :data="form.entity" @on-cancel="cancelForm" @after-submit="afterSubmitForm"/>
      </template>
      <div slot="footer">
        <Button  style="margin-right: 8px" @click="cancelForm">取消</Button>
      <Button type="primary" @click="submitForm">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import robotSeat from "./common";
import ModForm from "./components/fix/form.vue";
import ModDetail from "./components/fix/detail.vue";
import CallRecord from "./components/fix/callRecord.vue";
import * as cardSlotApi from "@/api/ems/cardSlot";

export default {
  data() {
    return {
      cardType: 3,
      form: {
        show: false,
        entity: {}
      }
    };
  },
  components: {
    robotSeat,
    ModForm,
    ModDetail,
    CallRecord
  },
  methods: {
    showSetting(entity) {
      cardSlotApi.getFixedDetail(entity.id).then(data => {
        this.form.entity = data;
        this.form.show = true;
      });
    },
    cancelForm() {
      this.form.show = false;
    },
    submitForm(){
      this.$refs.modForm.submit();
    },
    afterSubmitForm() {
      this.success("设置固定坐席成功");
      this.form.show = false;
      this.$refs.seat.getSeatDetail();
    },
    afterUpdateDetail() {
      this.$refs.seat.getSeatDetail();
    }
  }
};
</script>