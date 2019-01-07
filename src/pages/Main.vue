<template>
  <div class="frame">
    <main-header class="frame-header" />
    <div class="frame-body">
     
      <main-menu class="frame-nav" />
      <div class="frame-wrapper">
         
        <div class="frame-main">
           <router-view class="frame-person"
                   name="person" />
          <router-view class="container" />
          <!-- <div class="bottom_footer">Copyright©2018-2023 杭州快象网络技术有限公司 All Rights Reeserved 浙ICP备325235</div> -->
        </div>
      </div>
    </div>

    <!-- <Modal v-model="protocol.show"
           title="用户协议"
           :footer-hide="true"
           :mask-closable="false"
           width="60%"
           v-if="shouldProtocolShow">
      <protocol />
      
    </Modal> -->
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
import mainHeader from '@/components/packages/main/Header.vue'
import mainMenu from '@/components/packages/main/Menu.vue'
import Util from '@/util/util'
import Protocol from './Protocol'
import { SYSTEM } from '@/constants'
import { protocolSession } from '@/storage/session'

export default {
  components: {
    mainHeader,
    mainMenu,
    Protocol
  },
  name: 'mainIndex',
  data() {
    return {
      protocol: {
        show: protocolSession.getOrDefault()
      }
    }
  },
  computed: {
    ...mapGetters([
      'pageOpenedList',
      'userType'
    ]),
    shouldProtocolShow() {
      return [SYSTEM.ADMIN_TYPE_EMS, SYSTEM.ADMIN_TYPE_STAFF].includes(this.userType)
    }
  },
  watch: {
    '$route'(to) {
      this.checkTag(to.name)
      this.setCurrentPageName(to.name)
    },
    'protocol.show'(val) {
      if (val === false) {
        protocolSession.set(false)
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initUser()
      this.updateMenuList()
      this.updateSubMenuList()
      // 获取缓存中的已打开的页面 && 页面名称
      this.initCachedPageNames()
      this.initCachedPageList()
      this.initCachedCurPage(this)
      this.checkTag(this.$route.name)
    },
    checkTag(name) {
      let openedPageHasTag = this.pageOpenedList.some(item => {
        if (item.name === name) {
          return true
        }
      })
      // 关闭当前标签 a 后，点击回退，没有标签 a 的问题
      if (!openedPageHasTag) {
        Util.openPage(this, name)
      }
    },
    ...mapMutations({
      initUser: 'INIT_USER',
      updateMenuList: 'UPDATE_MENU_LIST',
      updateSubMenuList: 'UPDATE_SUB_MENU_LIST',
      initCachedPageNames: 'INIT_CACHED_PAGE_NAMES',
      initCachedPageList: 'INIT_CACHED_PAGE_LIST',
      initCachedCurPage: 'INIT_CACHED_CUR_PAGE',
      setCurrentPageName: 'SET_CURRENT_PAGE_NAME'
    })
  }
}
</script>
