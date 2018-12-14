<template>
  <div class="node">
    <div class="node-header">
      <div class="fr">
        <a href="javascript: void(0);"
           class="node-header-btn mr-5"
           v-if="showSort && list.length > 1"
           @click="clickSort">
          排序
        </a>
        <a href="javascript: void(0);"
           class="node-header-btn"
           @click="clickCreate()">
          +新增
        </a>
      </div>
      <a href="javascript: void(0);"
         @click="() => expand = !expand">
        <Icon :type="expand ? 'arrow-up-b' : 'arrow-down-b'"></Icon>
        {{title}}
      </a>
    </div>
    <div class="node-body">
      <collapse-transition>
        <div v-show="expand">
          <p class="nodata"
             v-show="list.length === 0">暂无数据</p>
          <template v-show="list.length">
            <a href="javascript: void(0)"
               class="node-item"
               v-for="(v, i) in list"
               :key="i"
               :class="{active: currentNode && (currentNode === v || currentNode.id === v.id)}"
               @click="clickNode(v)">{{v.name}}</a>
          </template>
        </div>
      </collapse-transition>
    </div>
  </div>
</template>

<script>
import CollapseTransition from '~/iview/src/components/base/collapse-transition'

export default {
  components: {
    CollapseTransition
  },
  props: {
    title: {
      default: '流程标题'
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    currentNode: {
      required: false
    },
    showSort: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      expand: true
    }
  },
  methods: {
    clickSort() {
      this.$emit('clickSort', this.list)
    },
    clickCreate() {
      this.$emit('clickCreate')
    },
    clickNode(v) {
      this.$emit('clickNode', v)
    }
  }
}
</script>
<style scoped>
.node-body {
  max-height: 300px;
  overflow: auto;
}
</style>
