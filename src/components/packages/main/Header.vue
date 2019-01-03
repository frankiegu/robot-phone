<template>
  <div>
    <div class="fleX">
      <!-- <button class="logout-btn" @click.native="handleLogout">退出</button> -->
      <div class="fleX">
        <div class="l-logo">
            <img class="logo" :src="platformLogo"
           v-if="platformLogo">
       <span class="logoText">{{ systemTitle }}</span>
       </div>
       
        <div v-if="iSExitFullscreen" class="top-fullScreen" @click="exitFullscreen">
         <img src="../../../../static/images/exitFullScreen.svg" alt="">
       </div>
       <div v-else class="top-fullScreen" @click="handleFullScreen">
         <img src="../../../../static/images/fullScrenn.svg" alt="">
       </div>
      </div>
      <div  style="margin-right:40px;"> 
      <Dropdown>
        <div class="userMessage">
         <img class="user-avtor" :src="userAvatar || defaultAvatar" />
        <span class="companyNick">{{ userName }}</span>
       </div>
        <DropdownMenu slot="list">
          <DropdownItem name="password"
                        @click.native="handlePersonClick">个人设置</DropdownItem>
          <DropdownItem divided
                        name="logout"
                        @click.native="handleLogout">退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      </div>
    </div>
    
  </div>
</template>
<script>
import defaultAvatar from '@/assets/images/avtor.jpg'
import { mapMutations, mapGetters } from 'vuex'
import API_ADMIN from '@/api/common/adminInfoApi'
import Util from '@/util/util'

export default {
  name: 'mainHeader',
  data(){
    return{
      defaultAvatar: defaultAvatar,
      iSExitFullscreen:false
    }
  },
  computed: {
    ...mapGetters([
      'userName',
      'userAvatar',
      'userId',
      'system',
      'platformLogo'
    ]),
    systemTitle() {
      return Util.titles[this.system]
    }
  },
  mounted() {
    this.fetchUserInfo()
  },
  methods: {
    handleFullScreen() {
      this.iSExitFullscreen = true;
            var de = document.documentElement;
            if (de.requestFullscreen) {
                de.requestFullscreen();
            } else if (de.mozRequestFullScreen) {
                de.mozRequestFullScreen();
            } else if (de.webkitRequestFullScreen) {
                de.webkitRequestFullScreen();
            }
        },
         exitFullscreen() {
           this.iSExitFullscreen = false;
            var de = document;
            if (de.exitFullscreen) {
                de.exitFullscreen();

            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();

            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();

            }
            
        },
    fetchUserInfo() {
      API_ADMIN.getAdminInfo()
        .then(res => {
          Util.title(res.platformName)
          this.fetchUser({
            account: res.account,
            id: res.id,
            name: res.name,
            type: res.type,
            menus: res.menuList,
            platformName: res.platformName,
            platformLogo: res.platformLogo
          })
        })
    },
    handlePersonClick() {
      const s = Util.shortFix(this.system)
      this.$router.push({
        name: s + 'PersonSetting'
      })
    },
    handleLogout() {
      this.$Modal.confirm({
        title: '退出登录',
        content: '<p>确认退出？</p>',
        onOk: () => {
          this.logout(this)
          Util.title('AI智能电话机器人')
        },
        onCancel: () => {
          return
        }
      })
    },
    ...mapMutations({
      logout: 'LOGOUT',
      fetchUser: 'FETCH_USER'
    })
  }
}
</script>