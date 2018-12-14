export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    data(val) {
      this.refreshTaskDetail(val)
    }
  },
  methods: {
    refreshTaskDetail() {}
  }
}
