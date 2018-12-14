<template>
  <Page class="pagination"
        v-bind="pageOptions"
        :current="pageNum"
        :page-size="pageSize"
        :total="total"
        @on-change="changePageNum"
        @on-page-size-change="changePageSize" />
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    simple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultOptions: {
        showSizer: true
      },
      currentPageSize: this.pageSize,
      currentPageNum: this.pageNum,
      timer: null
    }
  },
  watch: {
    pageNum(value) {
      if (value !== this.currentPageNum) {
        this.currentPageNum = value
      }
    },
    pageSize(value) {
      if (value !== this.currentPageSize) {
        this.currentPageSize = value
      }
    }
  },
  computed: {
    pageOptions() {
      return Object.assign({}, this.defaultOptions, this.options, {
        current: this.pageNum,
        pageSize: this.pageSize,
        total: this.total,
        simple: this.simple
      })
    }
  },
  destroyed() {
    this.clearTimer()
  },
  methods: {
    changePageNum(pageNum) {
      this.currentPageNum = pageNum
      this.emitChange()
    },
    changePageSize(pageSize) {
      this.currentPageSize = pageSize
      this.emitChange()
    },
    // iview.Page BUG
    // 步骤
    //  假设页数设置为[10, 20, 30, 40]，页码总数大于2页数初始为10，页码为1
    //  1、切换页数40(任何一个非10的页数)
    //  2、切换页码为2(任何一个非1的页码)
    //  3、切换页数为10(任何一个非40的页数)，此时iview.Page会先后触发 on-page-size-change 和 on-change 两个事件

    // iview.Page 在执行页码切换时，会先后触发 on-page-size-change 和 on-change 两个事件
    // 该组件按序分别收到 on-page-size-change 和 on-change 两个事件
    // 未合并事件情况下：
    //  1、在执行 on-page-size-change 时，使用 this.$emit('change', this.pageNum, pageSize) ，注意是 this.pageNum 而非 this.currentPageNum
    //  2、在执行 on-change 时，使用 this.$emit('change', pageNum, this.pageSize)，注意是 this.pageSize 而非 this.currentPageSize
    //  3、会导致父组件先后收到 change(1, 10) change(1, 40) 两个事件，最终的 pageSize = 40
    emitChange() {
      this.clearTimer()
      this.timer = setTimeout(() => {
        this.$emit('change', this.currentPageNum, this.currentPageSize)
        this.clearTimer()
      }, 0)
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    }
  }
}
</script>
