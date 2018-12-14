<template>
  <div class="task">
    <div>
      <div class=" board-primary">
        
        <div class="board-body">
          <whispering-flow-item
            title="主流程"
            :list="node.main.list"
            :currentNode="current.entity"
            @clickSort="showSortableNode(node.main.list, '主流程排序')"
            @clickCreate="createWhisperingNode(3)"
            @clickNode="v => showWhisperingNode(v.id)"
          />

          <whispering-flow-item
            title="旁白流程"
            :list="node.aside.list"
            :currentNode="current.entity"
            :showSort="false"
            @clickCreate="createWhisperingNode(1)"
            @clickNode="v => showWhisperingNode(v.id)"
          />

          <whispering-flow-item
            title="关键字结束流程"
            :list="node.end.list"
            :currentNode="current.entity"
            :showSort="false"
            @clickCreate="createWhisperingNode(6)"
            @clickNode="v => showWhisperingNode(v.id)"
          />

          <whispering-flow-item
            title="挽回结束流程"
            :list="node.redeemEnd.list"
            :currentNode="current.entity"
            :showSort="false"
            @clickCreate="createWhisperingNode(7)"
            @clickNode="v => showWhisperingNode(v.id)"
          />

          <whispering-flow-item
            title="无人应答流程"
            :list="node.noResponse.list"
            :currentNode="current.entity"
            :showSort="false"
            @clickCreate="createWhisperingNode(8)"
            @clickNode="v => showWhisperingNode(v.id)"
          />

          <whispering-flow-item
            title="未匹配关键字流程"
            :list="node.unmatch.list"
            :currentNode="current.entity"
            :showSort="false"
            @clickCreate="createWhisperingNode(9)"
            @clickNode="v => showWhisperingNode(v.id)"
          />

          <whispering-flow-item
            title="转接人工流程"
            :list="node.manual.list"
            :currentNode="current.entity"
            :showSort="false"
            @clickCreate="createWhisperingNode(10)"
            @clickNode="v => showWhisperingNode(v.id)"
          />
        </div>
      </div>
    </div>
    <div class="task-r" style="border-radius:0;box-shadow:none;border: 1px solid #dcdcdc;">
      <div class="board2">
        <div class="board-body">
          <whispering-node
            :data="current.entity"
            @after-submit="afterSubmitWhisperingNode"
            @remove="removeWhisperingNode"
            @restore="restoreWhisperingNode"
            v-if="current.entity"
            ref="whisperingNode"
          />
          <p class="nodata" v-else>左侧请选择话术节点或创建新的话术节点</p>
        </div>
      </div>
    </div>
    <Modal v-model="sort.show" :title="sort.title">
      <sortable-node :list="sort.list" @change="sortList"/>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { formMixin } from "@/mixins";
import WhisperingNode from "./components/whisperingNode";
import nodeEntity from "./src/nodeEntity";
import whisperingNodeApi from "@/api/ems/whisperingNode";
import SortableNode from "./components/sortableNode";
import WhisperingFlowItem from "./components/whisperingFlowItem";
import FlowItem from "./src/flowItem";

export default {
  mixins: [formMixin],
  components: {
    WhisperingNode,
    SortableNode,
    WhisperingFlowItem
  },
  data() {
    FlowItem.clear();
    return {
      node: {
        // 主流程
        main: new FlowItem({ getType: 1, nodeType: 3, title: "主流程" }),
        // 旁白流程
        aside: new FlowItem({ getType: 2, nodeType: 1, title: "旁白流程" }),
        // 关键字结束流程
        end: new FlowItem({ getType: 3, nodeType: 6, title: "关键字结束流程" }),
        // 挽回结束流程
        redeemEnd: new FlowItem({
          getType: 4,
          nodeType: 7,
          title: "挽回结束流程"
        }),
        // 无人应答流程
        noResponse: new FlowItem({
          getType: 5,
          nodeType: 8,
          title: "无人应答流程"
        }),
        // 未匹配关键字流程
        unmatch: new FlowItem({
          getType: 6,
          nodeType: 9,
          title: "未匹配关键字流程"
        }),
        // 转接人工流程
        manual: new FlowItem({
          getType: 7,
          nodeType: 10,
          title: "转接人工流程"
        })
      },
      current: {
        // 当前流程数据
        entity: null
      },
      sort: {
        show: false,
        title: "排序",
        list: []
      }
    };
  },
  destroyed() {
    FlowItem.clear();
  },
  methods: {
    afterEntity(entity) {
      // 编辑话术时，获取节点列表
      if (entity.id) {
        this.listNode();
      }
    },
    // 读取节点列表，并划分为  主流程/旁白流程/结束流程
    listNode() {
      return whisperingNodeApi
        .list({
          id: this.entity.id
        })
        .then(data => {
          FlowItem.addData(data);
        });
    },
    // 读取节点列表，如果当前有选中节点则同时更新该节点详情，否则不显示详情
    listNodeAndRefresh() {
      this.listNode().then(() => {
        if (this.current.entity.id) {
          this.showWhisperingNode(this.current.entity.id);
        } else {
          this.current.entity = null;
        }
      });
    },
    // 读取节点列表，如果当前节点列表有节点数据则打开第一个节点详情，否则不显示详情
    listNodeAndOpenFirst() {
      this.listNode().then(() => {
        let firstItem = FlowItem.getListFirstItem();
        if (firstItem) {
          this.showWhisperingNode(firstItem.id);
        } else {
          this.current.entity = null;
        }
      });
    },
    // 判断当前节点是否有数据变更，当有数据变更时不允许新增或切换到新节点
    couldChangeWhisperingNode() {
      if (
        this.current.entity &&
        this.$refs.whisperingNode &&
        this.$refs.whisperingNode.hasModify()
      ) {
        return false;
      }
      return true;
    },
    // 显示话术节点详情
    // 支持 id/Object
    showWhisperingNode(idOrEntity) {
      if (!this.couldChangeWhisperingNode()) {
        return this.warning("请先保存当前话术节点的变更");
      }

      if (typeof idOrEntity === "object") {
        this.current.entity = idOrEntity;
        return Promise.resolve();
      } else {
        return whisperingNodeApi.get(idOrEntity).then(data => {
          this.current.entity = data;
        });
      }
    },
    // 创建新的话术节点
    createWhisperingNode(type) {
      if (!this.couldChangeWhisperingNode()) {
        return this.warning("请先保存当前话术节点的变更");
      }

      this.current.entity = nodeEntity({
        type,
        whisperingId: this.entity.id,
        keyStatus: 1,
        name: this.getNodeTitle(type)
      });
      let list = this.getNodeList(type);
      if (list) {
        list.push(this.current.entity);
      }
    },
    getNodeTitle(nodeType) {
      let flow = FlowItem.nodeTypeMap[nodeType];
      return (flow && flow.title) || "";
    },
    // 根据nodeType取得当前流程list
    getNodeList(nodeType) {
      let flow = FlowItem.nodeTypeMap[nodeType];
      return (flow && flow.list) || null;
    },
    // 创建/更新话术节点后，更新节点列表并刷新当前节点数据
    afterSubmitWhisperingNode(id, entity) {
      // 如果是新增，回写ID到current.entity.id，用于更新节点列表后选中并刷新当前节点
      if (!entity.id) {
        this.current.entity.id = id;
      }
      this.listNodeAndRefresh();
    },
    // 移除话术节点
    // 1.1、若移除的节点为新增节点，则本地移除
    // 1.2、若移除的节点为已存在的节点，则请求接口删除节点
    // 2、并切换到同一个流程的第个话术节点，若不存在则不显示
    removeWhisperingNode() {
      let entity = this.current.entity;
      let list = this.getNodeList(entity.type);
      let index = -1;
      this.current.entity = null;
      if (list && list.length) {
        if (entity.id) {
          whisperingNodeApi.del(entity.id).then(() => {
            this.success("移除成功");
            this.listNodeAndOpenFirst();
          });
        } else {
          index = list.indexOf(entity);
          list.splice(index, 1);
          this.success("移除成功");

          // 自动切换到第一个节点详情
          if (list.length) {
            this.showWhisperingNode(list[0].id);
          }
        }
      }
    },
    // 还原话术节点，新增节点不提供该功能
    restoreWhisperingNode() {
      if (this.current.entity.id) {
        this.showWhisperingNode(this.current.entity.id).then(() => {
          this.success("还原成功");
        });
      }
    },
    // 显示排序
    showSortableNode(list, title) {
      if (list.length > 1) {
        this.sort.list = list;
        this.sort.title = title;
        this.sort.show = true;
      } else {
        this.info("数据至少有两条才能排序");
      }
    },
    // 执行排序
    sortList(list) {
      if (JSON.stringify(list) !== JSON.stringify(this.sort.list)) {
        let oldList = this.sort.list;
        this.sort.list = list;
        whisperingNodeApi.sort(list).then(
          () => {
            this.success(`${this.sort.title}成功`);
            this.listNode();
          },
          err => {
            this.sort.list = oldList;
            Promise.reject(err);
          }
        );
      }
    }
  }
};
</script>
