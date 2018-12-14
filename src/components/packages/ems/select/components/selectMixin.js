export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: '',
    options: {
      type: Object,
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    widths: {
      type: String,
      default: '180px'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: true
    },
    nodataText: {
      type: String,
      default: '暂无可用数据'
    },
    showNodata: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      map: {},
      initial: false
    }
  },
  computed: {
    computedValue: {
      get() {
        return this.initial ? this.value : ''
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.getData().then(data => {
        this.list = data
        data.forEach(v => {
          this.map[v.id] = v
        })
        this.initial = true
      })
    },
    getData() {
      throw new Error('请重写该方法并返回一个Promise实例')
    },
    getObj(id) {
      return this.map[id]
    },
    change() {
      this.$emit('change', this.computedValue)
    }
  }
}
