<template>
  <Form :label-width="90" style="overflow: hidden;" :model="entity" :rules="rules" ref="form">
    <FormItem label="节点名称" prop="name">
      <Input placeholder="请输入节点名称" v-model.trim="entity.name" style="width:398px;" :maxlength="20"/>
    </FormItem>
    <FormItem label="提取标签" prop="label" v-if="showLabel">
      <Input
        placeholder="请输入提取标签"
        style="width:398px;"
        v-model.trim="entity.label"
        :maxlength="20"
      />
    </FormItem>
    <FormItem label="优先级" prop="priority" v-if="showPriority">
      <InputNumber :max="999999" style="width:398px;" :min="1" v-model="entity.priority"/>
    </FormItem>
    <key-word required v-model="entity.keyWord" v-if="showKeyWord"/>
    <slot/>
    <FormItem>
      <p>Ai语音</p>
      <i-input
        type="textarea"
        placeholder="对照语音输入文字"
        :rows="4"
        style="width:398px;"
        v-model.trim="entity.content"
        :maxlength="200"
      />
      <div></div>
      <RadioGroup v-model="audioModel" class="mt-15 mb-15">
        <div style="position:relative;width:340px;">
          <Radio label="audioFile">
          <Icon></Icon>
          <span>录音文件</span>
        </Radio>
        <Radio label="varable">
          <Icon></Icon>
          <span>变量合成</span>
        </Radio>
         <div v-if="audioModel=='audioFile'" style="position:absolute;top:-15px;right:0;">
           <FormItem :label-width="1" prop="videoUrl" >
        <!-- 旁白流程允许多条语音 -->
        <ms-upload
          v-model="entity.videoUrl"
          accept="audio/wav"
          :format="['wav']"
          :limit="1000"
           ref="msUp"
          :isShowList="false"
          :InUploadList="commonUploadList"
          :data="{id: this.entity.whisperingId}"
        >
          <span class="ml-10" slot="tip">支持wav格式</span>
        </ms-upload>
      </FormItem>
         </div>
       <div v-else class="mb10" style="position:absolute;top:0;right:5rem;">
        <Button size="small" type="primary" @click="addVariableList">添加变量</Button>
      </div>
        </div>
      </RadioGroup>
     
     
      <div style="max-height:20rem;overflow:auto;">
        <div v-for="(item,index) in commonUploadList" :key="index">
          <div class="fleX2">
            <audio controls :src="item.audio" v-if="Regular(item.audio)" class="mb10"/>
            <Input
              v-model="item.audio"
              placeholder="请输入"
              v-else
              style="width: 300px"
              class="mb10"
            />
            <Button type="primary" @click="deleteItem(index)" style="margin-top:-10px;" class="ml-10">删除</Button>
          </div>
        </div>
      </div>
      <!-- <div class="audio" v-if="entity.videoUrl">
        <div
          class="audio-file"
          style="margin-right: 0; margin-bottom: 10px;"
          v-for="v in entity.videoUrl.split(',')"
          :key="v"
        >
          <audio controls :src="v"/>
        </div>
      </div> -->
    </FormItem>
    <hr>
    <Row class="pd10">
      <i-col :span="6">
        <Checkbox v-model="entity.isEnd" :true-value="1" :false-value="0">结束通话</Checkbox>
      </i-col>
      <!-- 五期未完成屏蔽
      <i-col :span="6">
        <Checkbox v-model="entity.isInterrupt"
                  :true-value="1"
                  :false-value="0">不允许打断</Checkbox>
      </i-col>
      <i-col :span="6">
        <Checkbox v-model="entity.isTransfer"
                  :true-value="1"
                  :false-value="0">转接人工</Checkbox>
      </i-col>
      <i-col :span="6"
             v-if="showTogether">
        <Checkbox v-model="entity.isTogether"
                  :true-value="1"
                  :false-value="0">跟主流程一起播放</Checkbox>
      </i-col>
      -->
    </Row>
  </Form>
</template>

<script>
import { formMixin } from "@/mixins";
import entity from "../../src/entity";
import { numberValidator } from "@/assets/javascripts/asyncValidator/validators";
import { KeyWord } from "@/components/packages/common/whispering";

export default {
  mixins: [formMixin],
  components: {
    KeyWord
  },
  props: {
    showLabel: {
      type: Boolean,
      default: false
    },
    showPriority: {
      type: Boolean,
      default: false
    },
    showTogether: {
      type: Boolean,
      default: false
    },
    showKeyWord: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let rules = {
      name: [{ required: true, message: "请输入节点名称" }],
      videoUrl: [{ required: true, message: "请选择ai语音" }]
    };
    if (this.showPriority) {
      rules.priority = [
        { required: true, message: "请输入优先级" },
        { validator: numberValidator }
      ];
    }
    if (this.showKeyWord) {
      rules.keyWord = [{ required: true, message: "请至少输入一个关键字" }];
    }
    return {
      commonUploadList: [],
      inputAudioList: [],
      audioModel: "audioFile",
      variableList: [],
      audioList: [],
      audioListInput: [],
      entity: entity({
        isEnd: 0,
        isInterrupt: 0,
        isTogether: 0,
        isTransfer: 0,
        priority: 1
      }),
      rules
    };
  },
  mounted() {
    //this.getUrl();
    this.$nextTick(() => {
      setTimeout(()=>{
let audiourl = this.entity.videoUrl.split(",");
      for (var i = 0; i < audiourl.length; i++) {
        this.commonUploadList.push({ audio: audiourl[i] });
      }
      },100)
      
    });
  },
  methods: {
    async  getUrl() {
      await this.getlist()
      
    },
    getlist(){
       let audiourl = this.entity.videoUrl.split(",");
      for (var i = 0; i < audiourl.length; i++) {
        this.commonUploadList.push({ audio: audiourl[i] });
        
      }
    },
     addVariableList() {
      let cope = {
        audio: ""
      };
      this.commonUploadList.push(cope);
    },
    deleteItem(index) {
      this.commonUploadList.splice(index, 1);
      let audioUrl = [];
      this.commonUploadList.forEach(element => {
        if (element.audio) {
          audioUrl.push(element.audio);
        }
      });
      this.entity.videoUrl = audioUrl.join(",");
    },
    switchType() {
      let arr = this.commonUploadList;
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].audio!=="") {
          newArr.push(arr[i].audio.trim());
        } 
      }
      this.entity.videoUrl = newArr.join(',');
    },
    Regular(item){
      let videoUrl = /^https?.+\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb)$/i
      if(videoUrl.test(item)){
        return true;
      }
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve(Object.assign({}, this.entity));
          } else {
            reject("FORM_INVALID");
          }
        });
      });
    }
  }
};
</script>
