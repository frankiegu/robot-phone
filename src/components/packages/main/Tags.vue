<template>
  <div>
    <!-- <ins>
      <i class="icon icon-control"></i>
      控制面板
    </ins> -->
    <div class="control-container custom_scollBar">
      <a v-for="(item) in pageOpenedList"
        href="javascript: void(0)"
        :class="{ active: item.children ? (item.children[0].name === currentPageName) : (item.name === currentPageName) }"
        :key="item.name"
        @click="linkTo(item)">
        {{ item.title }}
        <Icon class="control-close"
          v-if="item.name !== defaultPageName"
         type="md-close"
          @click.native="handleTagClose(item.name, $event)">
        </Icon>
      </a>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
import Util from '@/util/util'

export default {
  name: 'tags',
  computed: {
    ...mapGetters([
      'pageOpenedList',
      'currentPageName',
      'system'
    ]),
    defaultPageName() {
      return Util.currentPageName(this.system)
    }
  },
  methods: {
    linkTo(item) {
      // 标签变动 -> 页面的切换
      this.$router.push(item)
      this.setCurrentPageName(item.name)
    },
    handleTagClose(name, event) {
      let pageOpenedList = this.pageOpenedList
      let lastPageObj = pageOpenedList[0]

      if (this.currentPageName === name) {
        // 关闭当前正打开的 page
        let len = pageOpenedList.length
        for (let i = 1; i < len; i++) {
          if (pageOpenedList[i].name === name) {
            if (i === (len - 1)) {
              lastPageObj = pageOpenedList[i - 1]
            } else {
              lastPageObj = pageOpenedList[i + 1]
            }
            break
          }
        }
        this.linkTo(lastPageObj)
      }

      this.closeTagAndPage(name)
      event.preventDefault()
      event.stopPropagation()
    },
    ...mapMutations({
      closeTagAndPage: 'CLOSE_TAG_AND_PAGE',
      setCurrentPageName: 'SET_CURRENT_PAGE_NAME'
    })
  }
}
</script>
<style lang="scss" scoped>
.ivu-tag {
  background: #fff;
}
.ivu-tag-checked {
  background: #f1f1f1;
}
</style>