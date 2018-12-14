<template>
  <div class="fold">
    <div class="fold-header">
      {{title}}
      <template v-if="showFold">
        <Icon :type="collapse ? 'chevron-down' : 'chevron-up'"
              class="fold-collapse"
              @click.native="toggleCollapse"></Icon>
      </template>
    </div>
    <collapse-transition>
      <div class="fold-body"
           v-show="collapse">
        <slot />
      </div>
    </collapse-transition>
  </div>
</template>

<script>
import CollapseTransition from 'iview/src/components/base/collapse-transition'

export default {
  components: {
    CollapseTransition
  },
  props: {
    title: {
      type: String,
      default: '标题'
    },
    showFold: {
      type: Boolean,
      default: true
    },
    initialCollapse: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      collapse: this.initialCollapse
    }
  },
  methods: {
    toggleCollapse() {
      this.collapse = !this.collapse
    }
  }
}
</script>
