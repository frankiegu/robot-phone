<template>
  <div>
    <i-table :data="postList"
             :columns="columns"></i-table>

    <ms-panel v-model="modalShow"
              title="编辑端口">
      <new-port :entry="newPortEntry"
                @on-cancel="handlerCancel"
                @after-save="handlerAfterSave"></new-port>
    </ms-panel>

    <Modal v-model="moveSlot.show"
           title="迁移卡槽">
      <move-slot v-if="moveSlot.show"
                 :data="moveSlot.entity"
                 @after-submit="afterSubmitMoveSlot"
                 @on-cancel="cancelMoveSlot" />
      <div slot="footer"></div>
    </Modal>

  </div>
</template>
<script>
import { fmt, duration } from "@/util";
import newPort from "./components/new-port";
import MoveSlot from './components/move-slot';

const newPortEntry = {}
export default {
  props: {
    machineId: ""
  },
  data() {
    return {
      postList: [],
      columns: [
        // { type: "index", title: "序号", width: 60 },
        { key: "slotNo", title: "端口号" },
        { key: "mobile", title: "坐席号码" },
        {
          key: "name",
          title: "使用企业",
          render: (h, params) => {
            return (
              // class="text-link"
              <span onChick={() => { this.handler2Firm(params.row.adminId); }} >
                {params.row.name}
              </span>
            );
          }
        },
        {
          title: "坐席类型",
          render: (h, params) => {
            let cardType = { "1": "机器", "2": "人工", '3': '固定' };
            return h("span", cardType[`${params.row.cardType}`]);
          }
        },
        {
          title: "状态",
          render: (h, params) => {
            let status = ["未开始", "正常", "已过期", "使用中"];
            return h("span", status[params.row.status]);
          }
        },
        {
          title: "操作",
          render: (h, params) => {
            // debugger
            if(params.row.mobile===null) return
            let btn = <span class="text-link" onClick={() => { this.handlerEdit(params.row.id) }} > 编辑 </span>
            if (params.row.status == 0) { btn = '' }
            let moveBtn
            if (params.row.cardType && params.row.mobile && params.row.adminId) {
              moveBtn = <span class="text-link" onClick={() => { this.showMoveSlot(params.row) }} > 迁移卡槽 </span>
            }
            return (<div>
              {btn}
              {moveBtn}
              <span class="error-link" onClick={() => { this.handlerDelete(params.row.id) }} > 删除 </span>
            </div>);
          }
        }
      ],

      modalShow: false,
      newPortEntry: {},
      moveSlot: {
        show: false,
        entity: {}
      }
    };
  },
  // mixins: [tableMixin],
  components: { newPort, MoveSlot },
  watch: {
    machineId(n, o) {
      if (n) {
        this.loadList();
      } else {
        this.postList = [];
      }
    }
  },
  mounted() {
    this.loadList()
  },
  methods: {
    async loadList() {
      this.postList = await this.$smsApi.machine.getSlotList(this.machineId);
    },
    handler2Firm(id) {
      console.log("handler2Firm", id);
    },
    async handlerEdit(id) {
      this.modalShow = true
      let detail = await this.loadPortDetail(id)
      this.newPortEntry = { ...detail }
    },
    async loadPortDetail(id) {
      return await this.$smsApi.machine.getSlotDetail(id)
    },
    handlerDelete(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>该操纵将删除该端口，是否继续</p>',
        onOk: () => {
          this.$smsApi.machine.deletePortById(id).then(() => {
            this.loadList()
            this.$Message.success('操作成功')
          })
        }
      });
    },
    // 编辑
    handlerCancel() {
      this.modalShow = false
    },
    handlerAfterSave() {
      this.loadList()
      this.handlerCancel()
    },
    showMoveSlot(entity) {
      this.moveSlot.entity = entity
      this.moveSlot.show = true
    },
    afterSubmitMoveSlot() {
      this.moveSlot.show = false
      this.loadList()
    },
    cancelMoveSlot() {
      this.moveSlot.show = false
    }
  },
  created() { }
};
</script>
<style>
</style>

