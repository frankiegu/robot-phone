<template>
  <div>
    <div class="nav" ref="nav">
      <ul v-if="menuList.length" id="menuUl">
        <li v-for="(item, i) in menuList"
          v-show="isHome(item.name) || (item.meta && menus.indexOf(String(item.meta.id)) !== -1)"
          :key="i"
          :class="{ active: item.name === currentPageName, dn: item.inline }">
          <a class="nav-title"
            href="javascript:void(0)"
            @click.prevent="handleMenuSelect(item, [i])">
            <i class="icon" :class="item.icon"></i>
            <span>{{ item.title }}</span>
            <Icon v-if="item.children && item.children.length"
              class="ivu-icon ivu-icon-ios-arrow-down ivu-menu-submenu-title-icon"
              :type="activeIndex[0] === i ? 'ios-arrow-up' : 'ios-arrow-down'">
            </Icon>
          </a>
          <collapse-transition v-if="item.children && item.children.length">
            <ul class="nav-child"
                v-show="activeIndex[0] === i">
              <li v-for="(child, j) in item.children"
                  v-show="child.meta && menus.indexOf(child.meta.id) !== -1"
                  :key="j"
                  :class="{ active: child.name === currentPageName, dn: child.inline}">
                <a class="nav-title"
                  href="javascirpt:void(0);"
                  @click.prevent="handleMenuSelect(child, [i, j])">{{ child.title }}</a>
              </li>
            </ul>
          </collapse-transition>
        </li>
      </ul>
      <p v-else class="nav-nodata">暂无菜单</p>
    </div>
    <!-- <Menu theme="dark" @on-select="handleMenuSelect">
      <Submenu v-for="item in menuList" :name="item.name" :key="item.name">
        <template slot="title">
          <Icon :type="item.icon"></Icon>
          <span>{{ item.title }}</span>
        </template>
        <template v-if="item.children.length > 0">
          <MenuItem v-for="child in item.children" :name="child.name" :key="child.name">
            {{ child.title }}
          </MenuItem>
        </template>
      </Submenu>
    </Menu> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CollapseTransition from '~/iview/src/components/base/collapse-transition'
import Util from '@/util/util'
import {
  navActiveIndexSession
} from '@/storage/session'

export default {
  name: 'mainMenu',
  components: {
    CollapseTransition
  },
  data() {
    const defaultIndex = navActiveIndexSession.getBySystem() || [0]
    const menus = localStorage.menus.split(',')
    return {
      activeIndex: defaultIndex,
      menus: menus
    }
  },
  computed: {
    ...mapGetters([
      'menuList',
      'currentPageName',
      'system'
    ])
  },
  watch: {
    '$route' () {
      this.$nextTick(() => {
        // 跳转到某个页面，检查该页面父级菜单展开情况
        const $ul = window.document.getElementById('menuUl')
        if($ul.querySelector('li.active')){
          const $p = $ul.querySelector('li.active').parentNode
        if ($p && $p.style.display === 'none') {
          $p.style.display = 'block'
          $p.parentNode.click()
        }
        }
        
      })
    }
  },
  methods: {
    isHome(name) {
      if (name) {
        return name.toLowerCase().indexOf('homeindex') !== -1
      }
      return false
    },
    handleMenuSelect(item, activeIndex) {
     
      // const equal = JSON.stringify(activeIndex) === JSON.stringify(this.activeIndex)
      // if (!equal) {
      if (this.currentPageName !== item.name) {
        if (activeIndex.length >= this.activeIndex.length) {
          this.activeIndex = activeIndex
        } else {
          this.activeIndex = activeIndex.filter((v, i) => {
            return !this.activeIndex[i] || this.activeIndex[i] && this.activeIndex[i] !== v
          })
        }

        const name = item.name
        if (name && (name === Util.currentPageName(this.system) || activeIndex.length === 2)) {
          Util.openPage(this, name)
          // 缓存当前展开的菜单
          navActiveIndexSession.setBySystem(this.activeIndex)
        }
      }
    }
  }
}
</script>
