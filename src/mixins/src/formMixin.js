export default {
  props: {
    data: {
      type: Object,
      default () {
        return {
          id: ''
        }
      }
    }
  },
  data() {
    return {
      entity: {
        id: ''
      },
      rules: {}
    }
  },
  watch: {
    'data' () {
      this.get()
    }
  },
  mounted() {
    // 初始化服务端数据后再执行ready
    new Promise(new Proxy(this.initData, this)).then(() => {
      this.init()
    })
  },
  methods: {
    getApi() {
      throw new Error('请重写getApi提供service')
    },
    /**
     * 初始化服务端数据
     * @param {any} resolve Promise.resolve
     * @param {any} reject Promise.reject
     */
    initData(resolve, reject) {
      resolve()
    },
    init() {
      this.initValidate()
      this.initReady()
      this.get()
    },
    initValidate() {},
    initReady() {},
    afterEntity(entity) {},
    beforeSubmit(entity) {},
    beforeCancel() {},
    get() {
      this.entity = Object.assign({}, this.entity, this.data)
      this.afterEntity(this.entity)
      // 不知道为什么此处要调用list()方法，不然，点击学习时，主流程的数据没有调用
      this.list()
    },
    submit() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          let entity = Object.assign({}, this.entity)
          if (this.beforeSubmit(entity) !== false) {
            this.getApi().saveOrUpdate(entity).then(data => {
              this.$emit('after-submit', data, entity)
            })
          }
        }
      })
    },
    cancel() {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      if (this.beforeCancel() !== false) {
        this.$emit('on-cancel')
      }
    }
  }
}
