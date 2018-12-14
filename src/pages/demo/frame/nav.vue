<template>
  <div>
    <div class="user">
      <img :src="userAvtor"
           class="user-avtor">
      <p>周杰伦</p>
    </div>
    <div class="nav"
         ref="nav">
      <ul v-if="navData.length">
        <li v-for="(v, i) in navData"
            :key="i"
            :class="{active: activeIndex[0] === i}">
          <a href="javascript: void(0)"
             class="nav-title"
             @click="() => showChildNav(v, [i])">
            <i class="icon"
               :class="v.icon"></i>
            <span>{{v.title}}</span>
            <Icon :type="activeIndex[0] === i ? 'chevron-up' : 'chevron-down'"
                  class="nav-arrow"
                  v-if="v.children.length"></Icon>
          </a>
          <collapse-transition v-if="v.children.length">
            <ul class="nav-child"
                v-show="activeIndex[0] === i">
              <li v-for="(c, j) in v.children"
                  :key="j"
                  :class="{active: activeIndex[0] === i && activeIndex[1] === j}">
                <a href="javascirpt: void(0);"
                   class="nav-title"
                   @click="() => showChildNav(c, [i, j])">{{c.title}}</a>
              </li>
            </ul>
          </collapse-transition>
        </li>
      </ul>
      <p class="nav-nodata"
         v-else>暂无菜单</p>
    </div>
  </div>
</template>

<script>
import userAvtor from '@/assets/images/avtor.jpg'
import CollapseTransition from '~/iview/src/components/base/collapse-transition'
import navData from './navData'

export default {
  components: {
    CollapseTransition
  },
  data() {
    return {
      userAvtor,
      navData,
      activeIndex: []
    }
  },
  methods: {
    showChildNav(v, activeIndex) {
      if (activeIndex.length >= this.activeIndex.length && JSON.stringify(activeIndex) !== JSON.stringify(this.activeIndex)) {
        this.activeIndex = activeIndex
      } else {
        this.activeIndex = activeIndex.filter((v, i) => {
          return !this.activeIndex[i] || this.activeIndex[i] && this.activeIndex[i] !== v
        })
      }
      if (v.hasChild) {
        v.showChild = !v.showChild
      } else {
        if (v.name) {
          this.$router.push({
            name: v.name
          })
        }
      }
    }
  }
}
</script>
