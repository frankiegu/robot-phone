<template>
  <div class="root">
    <SortableList lockAxis="y"
                  v-model="computedList"
                  helperClass="sort-list-helper"
                  @sortStart="sortStart">
      <SortableItem v-for="(item, index) in list"
                    :index="index"
                    :key="index"
                    :item="item" />
    </SortableList>
  </div>
</template>

<script>
import { ContainerMixin, ElementMixin } from 'vue-slicksort'

const SortableList = {
  mixins: [ContainerMixin],
  template: `
    <ul class="sort-list">
      <slot />
    </ul>
  `
}

const SortableItem = {
  mixins: [ElementMixin],
  props: ['item'],
  template: `
    <li class="sort-list-item">{{item.name}}</li>
  `
}

export default {
  components: {
    SortableList,
    SortableItem
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    computedList: {
      get() {
        return this.list
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  methods: {
    sortStart(event, node, index, collection) {

    }
  }
}
</script>
