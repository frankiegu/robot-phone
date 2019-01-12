<template>
  <div class="board" style="border-radius:0;box-shadow:none;">
    <!-- <div class="board-header" style="padding-top:0;">通话记录</div> -->
    <div class="board-body pl pr">
      <div class="audio">
       
        <div class="audio-file" style="margin-left: 7.2rem;">
          <audio controls :src="entity.allAutio" ref="fullCallAudio"/>
        </div>
      </div>
      <div class="chat" ref="chatBox">
        <ul v-if="entity.recordDetailsList.length" ref="chatUl">
          <li v-for="(v, i) in entity.recordDetailsList" :key="i">
            <!-- 客户 -->
            <template v-if="v.callType === 2">
              <div class="chat-item chat-other">
                <img :src="avtorCustomer" class="chat-avtor">
                <Poptip trigger="hover" placement="bottom-start" transfer>
                  <div class="chat-content chat-other-content">{{v.callContent}}</div>
                  <div slot="content">
                    <Button type="warning" icon="edit" @click="showCallContent(v)">修正内容</Button>
                  </div>
                </Poptip>
                <div class="chat-audio" @click="playAudio(v)">
                  <i class="icon icon-horn"></i>
                </div>
              </div>
            </template>
            <!-- 机器人 -->
            <template v-if="v.callType === 1">
              <div class="chat-item chat-mine">
                <div class="chat-audio" @click="playAudio(v)">
                  <i class="icon icon-horn"></i>
                </div>
                <div class="chat-content">{{v.callContent}}</div>
                <img :src="avtorRobot" class="chat-avtor">
              </div>
            </template>
          </li>
        </ul>
        <p class="nodata" v-else>暂无通话记录</p>
      </div>
      <div style="overflow: hidden;">
        <Button
          v-if="entity.recordDetailsList.length"
          class="fr"
          type="default"
          @click="exportImg"
        >导出图片</Button>
      </div>
    </div>

    <Modal title="修改内容" class="modal-hide-footer" v-model="callContent.show">
      <Form :label-width="1" :model="callContent.entity">
        <FormItem>
          <i-input
            v-model.trim="callContent.entity.callContent"
            placeholder="请输入修改后的内容"
            ref="callContentInput"
            :maxlength="128"
          />
          <p class="c-info">机器人最快会在一周后自动学习改善识别</p>
        </FormItem>
        <FormItem class="text-c">
          <Button  style="margin-right: 8px" @click="cancelCallContent">取消</Button>
          <Button type="primary" @click="submitCallContent">确定</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { detailMixin } from "@/mixins";
import { audio } from "@/util";
import avtorCustomer from "@/assets/images/avtor-customer1.png";
import avtorRobot from "@/assets/images/avtor-robot1.png";
import $ from "jquery";
import callRecordApi from "@/api/ems/callRecord";
import html2canvas from "html2canvas";
import { downloadBase64Img } from "@/util";

export default {
  mixins: [detailMixin],
  props: {
    autoScroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      avtorCustomer,
      avtorRobot,
      pasuedScroll: false,
      autoScrollRange: 100,
      callContent: {
        show: false,
        data: {},
        entity: {
          id: "",
          callContent: ""
        }
      }
    };
  },
  mounted() {
    if (this.autoScroll) {
      let $chatBox = $(this.$refs.chatBox);
      let height = $chatBox.innerHeight();

      this.$watch("data", val => {
        if (!this.pasuedScroll) {
          setTimeout(() => {
            $chatBox.animate(
              {
                scrollTop: $chatBox[0].scrollHeight - height
              },
              500
            );
          }, 0);
        }
      });

      $chatBox.scroll(() => {
        let scrollTop = $chatBox.scrollTop();
        let scrollHeight = $chatBox[0].scrollHeight;
        if (scrollTop + this.autoScrollRange < scrollHeight - height) {
          this.pasuedScroll = true;
        } else {
          this.pasuedScroll = false;
        }
      });
    }
  },
  beforeDestroy() {
    if (this.$refs.fullCallAudio) {
      this.$refs.fullCallAudio.pause();
    }
    audio.destroy();
  },
  methods: {
    playAudio(v) {
      audio.play(v.callAudio);
    },
    showCallContent(data) {
      this.callContent.entity.id = data.id;
      this.callContent.entity.callContent = data.callContent;
      this.callContent.data = data;
      this.callContent.show = true;
      this.$refs.callContentInput.focus();
    },
    cancelCallContent() {
      this.callContent.show = false;
    },
    submitCallContent() {
      callRecordApi.callContent(this.callContent.entity).then(() => {
        this.success("修改成功");
        this.callContent.data.callContent = this.callContent.entity.callContent;
        this.callContent.show = false;
      });
    },
    exportImg() {
      html2canvas(this.$refs.chatUl).then(canvas => {
        downloadBase64Img(canvas.toDataURL(), "通话记录.jpg");
      });
    }
  }
};
</script>
