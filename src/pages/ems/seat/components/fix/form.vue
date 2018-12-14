<template>
  <Form :label-width="150" :model="entity" :rules="rules" ref="form">
    <Row>
      <i-col :span="8">
        <FormItem label="方言" prop="dialect">
          <Select placeholder="请选择" style="width:230px;" v-model="entity.dialect">
            <Option v-for="(v, k) in dialectMap" :key="k" :value="k">{{v}}</Option>
          </Select>
        </FormItem>
      </i-col>
    </Row>
    <FormItem label="请选择话术版本" prop="whisperingId" >
      <Select v-show="whisperingList.length" placeholder="请选择" style="width:230px;" v-model="entity.whisperingId">
        <Option v-for="(v, k) in whisperingList" :key="k" :value="v.id" :label="v.title">
          <div @click="setWhispering(v)">
             <p>{{v.title}}</p>
          <p v-if="v.isChange === 1" class="c-warning">话术已变更，请提交审核</p>
          </div>
        </Option>
      </Select>
      <p class="nodata" v-show="!whisperingList.length">暂无话术</p>
    </FormItem>
    <div class="from_baseLine" style="width:24rem;"  @click="showOrHidden">
     <span>{{isShow?"收起":"展开"}}<Icon type="ios-arrow-up" v-if="isShow"/><Icon v-else type="ios-arrow-down" /></span>
    </div>
     <collapse-transition>
     <div v-show="isShow">
           <Row>
      <i-col :span="24">
        <FormItem label="初筛微信推送" prop="keyTemplate1">
          <CheckboxGroup v-model="entity.wxLevelList">
            <Checkbox label="A"/>
            <Checkbox label="B"/>
            <Checkbox label="C"/>
            <Checkbox label="D"/>
            <Checkbox label="E"/>
            <Checkbox label="F"/>
          </CheckboxGroup>
          <p>注：未勾选则不发送信息，如选择多个销售人员，将按顺序循环分配给销售人员</p>
          <employee-select
            v-model="entity.wxUserList"
            nodataText="暂无销售人员"
            :options="{multiple: true}"
          />
        </FormItem>
        <FormItem label="备注" prop="remarks">
          <i-input style="width:230px;" type="textarea" :rows="4" placeholder="请输入备注" v-model="entity.remarks"/>
        </FormItem>
      </i-col>
      
    </Row>
    <Row>
      <i-col :span="24">
        <FormItem label="指定特殊词语短信" prop="keyTemplate">
          <RadioGroup v-model="entity.keyOpen">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
         <p> <message-template-select
            v-model="entity.keyTemplate"
            nodataText="暂无可用短信模板"
            :params="{type: 2}"
            :options="{disabled: entity.keyOpen === 0}"
          /></p>
          <p
            class="c-warning"
          >企业可用短信数量: {{messageCount.messageUseCount}}/{{messageCount.messageAllCount}}</p>
        </FormItem>
        <FormItem label="初筛推送短信" prop="keyTemplate">
          <CheckboxGroup v-model="entity.messageLevelList">
            <Checkbox label="A"/>
            <Checkbox label="B"/>
            <Checkbox label="C"/>
            <Checkbox label="D"/>
            <Checkbox label="E"/>
            <Checkbox label="F"/>
          </CheckboxGroup>
          <p>注：未勾选则不发送短信</p>
          <message-template-select
            v-model="entity.messageTemplate"
            nodataText="暂无可用短信模板"
            :params="{type: 1}"
          />
        </FormItem>
      </i-col>
    </Row>
    <ms-fold title="有效A级客户设置">
      <div class="mt-20">
        <FormItem label="命中有效关键字次数" prop="validKeyNum">
          <input-number placeholder="达到该设定值时，认定为是A级客户" style="width:230px;" v-model="entity.validKeyNum" :min="0"/>
          <!-- <span class="ml-20">命中关键字次数达到该设定值时，认定为是A级客户</span> -->
        </FormItem>
        <FormItem label="通话轮次" prop="callNum">
          <input-number placeholder="达到该设定值时，认定为是A级客户" style="width:230px;" v-model="entity.callNum" :min="1"/>
          <!-- <span class="ml-20">通话轮次达到该设定值时，认定为是A级客户</span> -->
        </FormItem>
        <FormItem label="通话时长(秒)" prop="callTime">
          <input-number placeholder="达到该设定值时，认定为是A级客户" style="width:230px;" v-model="entity.callTime" :min="1" :step="60"/>
          <!-- <span class="ml-20">通话时长达到该设定值时，认定为是A级客户</span> -->
        </FormItem>
      </div>
    </ms-fold>
     </div>
      </collapse-transition>
   
  </Form>
</template>

<script>
import { formMixin } from "@/mixins";
import taskApi from "@/api/ems/task";
import * as cardSlotApi from "@/api/ems/cardSlot";
import entity from "./src/entity";
import {
  MessageTemplateSelect,
  EmployeeSelect
} from "@/components/packages/ems/select";
import dialectMap from "@/pages/ems/marketing/components/task/src/dialect";

export default {
  mixins: [formMixin],
  components: {
    MessageTemplateSelect,
    EmployeeSelect
  },
  data() {
    return {
       isShow:false,
      entity: entity({
        validKeyNum: 1,
        callNum: 1,
        callTime: 30,
        keyOpen: 1,
        messageLevelList: [],
        cardSlotList: [],
        wxLevelList: [],
        wxUserList: [],
        dialect: "mandarin"
      }),
      rules: {
        whisperingId: [{ required: true, message: "请选择话术版本" }],
        dialect: [{ required: true, message: "请选择方言" }]
      },
      whisperingList: [],
      messageCount: {
        messageAllCount: 0,
        messageUseCount: 0
      },
      dialectMap
    };
  },
  methods: {
     showOrHidden(){
     this.isShow = !this.isShow;
   },
    getApi() {
      return taskApi;
    },
    initData(resolve) {
      resolve(
        taskApi.listWhispering().then(data => {
          this.whisperingList = data;
        })
      );
    },
    initReady() {
      taskApi.getMessageCount().then(data => {
        this.messageCount = data;
      });
    },
    setWhispering(v) {
      this.entity.whisperingId = v.id;
      this.entity.whisperingTitle =
        v.title + (v.version ? `(${v.version})` : "");
    },
    beforeSubmit(data) {
      if (data.keyOpen === 1 && !data.keyTemplate) {
        this.warning("请选择指定特殊词语短信");
        return false;
      }
      if (data.messageLevelList.length > 0 && !data.messageTemplate) {
        this.warning("请选择初筛推送短信");
        return false;
      }
      if (data.wxLevelList.length > 0 && data.wxUserList.length === 0) {
        this.warning("请选择初筛微信推送的销售人员");
        return false;
      }
    },
    submit() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          let entity = Object.assign({}, this.entity);
          if (this.beforeSubmit(entity) !== false) {
            cardSlotApi.setFixed(entity).then(data => {
              this.$emit("after-submit", data, entity);
            });
          }
        }
      });
    }
  }
};
</script>
