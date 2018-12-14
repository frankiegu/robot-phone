<template>
  <span v-if="visible">
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    initial: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false
    }
  },
  watch: {
    initial() {
      this.change()
    }
  },
  created() {
    this.change()
  },
  methods: {
    change() {
      if (this.initial === true && this.visible === false) {
        this.visible = true
      }
    }
  }
}
</script>
