export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data() {
    return {
      entity: {
        id: ''
      }
    }
  },
  watch: {
    'data' () {
      this.get()
    }
  },
  created() {
    this.get()
  },
  methods: {
    afterEntity(entity) {},
    get() {
      this.entity = Object.assign({}, this.entity, this.data)
      // console.log('=========', this.entity)
      this.afterEntity(this.entity)
    }
  }
}
