<template>
  <div class="talk">
    <div class="talk-msg">
      <div class="chat"
           ref="chat">
        <ul v-show="list.length"
            ref="chatUl">
          <li v-for="(v, i) in list"
              :key="i">
            <template v-if="v.userType === 1">
              <div class="chat-item chat-mine">
                <div class="chat-content">
                  {{v.content}}
                </div>
                <img :src="v.avtor"
                     class="chat-avtor">
              </div>
            </template>
            <template v-else-if="v.userType === 2">
              <div class="chat-item chat-other">
                <img :src="v.avtor"
                     class="chat-avtor">
                <div class="chat-content chat-other-content">
                  {{v.content}}
                </div>
                <div class="chat-audio"
                     v-if="v.audioId"
                     @click="playAudio(v)">
                  <i class="icon icon-horn"></i>
                </div>
              </div>
            </template>
            <template v-else-if="v.userType === 3">
              <div class="chat-tip">
                <em>{{v.content}}</em>
              </div>
            </template>
          </li>
        </ul>
      </div>
    </div>
    <div class="talk-inp"
         :class="{active: focusInp}">
      <textarea @focus="focus"
                @blur="blur"
                v-model.trim="text.content"
                @keydown.enter="send"
                maxlength="200"
                placeholder="请在此处输入体验内容"
                ref="inp"></textarea>
      <div>
        <Button v-show="list.length"
                type="default"
                @click="exportImg">导出图片</Button>
        <Button class="talk-enter"
                @click="send">发送 (Enter)</Button>
      </div>
    </div>
  </div>
</template>

<script>
import avtorCustomer from '@/assets/images/avtor-customer1.png'
import avtorRobot from '@/assets/images/avtor-robot1.png'
import whisperingApi from '@/api/common/whisperingApi'
import { audio } from '@/util'
import $ from 'jquery'

export default {
  props: {
    whisperingId: {
      required: true
    }
  },
  data() {
    return {
      focusInp: false,
      text: {
        content: '',
        callId: '',
        whisperingId: this.whisperingId
      },
      list: []
    }
  },
  watch: {
    'whisperingId'(val) {
      this.init()
    }
  },
  mounted() {
    this.$refs.inp.focus()
    this.init()
  },
  beforeDestroy() {
    audio.destroy()
  },
  methods: {
    init() {
      if (this.whisperingId) {
        whisperingApi.initExperience(this.whisperingId).then(data => {
          this.text.callId = data.callId
          this.text.whisperingId = this.whisperingId
        })
      }
    },
    focus() {
      this.focusInp = true
    },
    blur() {
      this.focusInp = false
    },
    send() {
      let entity = Object.assign({}, this.text)
      whisperingApi.sendExperience(entity).then(data => {
        this.text.content = ''
        this.list.push({
          // 1-用户输入 2-机器人应答 3-提示文字
          userType: 1,
          content: entity.content,
          avtor: avtorCustomer,
          // 0-无语音/客户输入 1-播放语音 2-播放语音后挂断电话 3-直接挂断 4-转接人工
          status: 0
        })
        if (3 !== Number(data.status)) {
          this.list.push(Object.assign({
            userType: 2,
            avtor: avtorRobot
          }, data))
        }
        switch (data.status) {
          case 2:
          case 3:
          case 4:
            this.list.push({
              userType: 3,
              content: {
                '2': '播放语音后对方挂断电话',
                '3': '对方直接挂断',
                '4': '转接人工'
              }[data.status],
              status: 0
            })
            break
        }
        this.scrollToBottom()
      })
    },
    scrollToBottom() {
      setTimeout(() => {
        let $chat = $(this.$refs.chat)
        $chat.animate({
          scrollTop: this.$refs.chat.scrollHeight
        }, 100)
      }, 0)
    },
    playAudio(v) {
      audio.play(v.audioId)
    },
    exportImg() {
      this.$emit('exportImg', this.$refs.chatUl)
    }
  }
}
</script>
