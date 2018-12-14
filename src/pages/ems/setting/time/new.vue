<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        {{title}}
        <div class="panel-header-tools">
          <i-button type="primary"
                    @click="handlerSave">保存</i-button>
        </div>
      </div>
      <div class="panel-body">
        <div>注：为建立健康、友好的营销呼叫平台，全平台限制只允许在 {{timeLimit.amWorkTime}} - {{timeLimit.amRestTime}} 和 {{timeLimit.pmWorkTime}} - {{timeLimit.pmRestTime}} 可呼叫，其余时间不可呼叫，敬请谅解！</div>
        <hr class="mtb10">
        <i-form ref="refForm"
                :model="template"
                :rules="rules"
                :label-width="140">
          <div class="max-w800">
            <FormItem label="时间模板名称："
                      prop="templateName">
              <i-input v-model="template.templateName"
                       type="text"
                       placeholder="输入模板名称"></i-input>
            </FormItem>
            <Row>
              <i-col span="10">
                <FormItem label="上午上班时间：">
                  <TimePicker v-model="template.amStartTime"
                              class="wp100"
                              type="time"
                              :clearable="false"
                              :disabled-hours="disabledHours"
                              format="HH:mm"
                              placeholder="选择时间"></TimePicker>
                </FormItem>
                <FormItem label="上午下班时间：">
                  <TimePicker v-model="template.amEndTime"
                              class="wp100"
                              type="time"
                              :clearable="false"
                              :disabled-hours="disabledHours"
                              format="HH:mm"
                              placeholder="选择时间"></TimePicker>
                </FormItem>
              </i-col>
              <i-col span="10"
                     offset="4">
                <FormItem label="下午上班时间：">
                  <TimePicker v-model="template.pmStartTime"
                              class="wp100"
                              type="time"
                              :clearable="false"
                              :disabled-hours="disabledHours"
                              format="HH:mm"
                              placeholder="选择时间"></TimePicker>
                </FormItem>
                <FormItem label="下午下班时间：">
                  <TimePicker v-model="template.pmEndTime"
                              class="wp100"
                              type="time"
                              :clearable="false"
                              :disabled-hours="disabledHours"
                              format="HH:mm"
                              placeholder="选择时间"></TimePicker>
                </FormItem>
              </i-col>
            </Row>
            <FormItem label="拨号时间：">
              <i-button :type="template.weekDate.includes(k) ? 'primary' : 'default'"
                        class="mr15 mb15"
                        v-for="(v,k) in weekArray"
                        :key="k"
                        @click="handlerChangeWeekDate(k)">{{v}}</i-button>
            </FormItem>
            <FormItem label="排除日期：">
              <DatePicker :open="dateOpen"
                          :value="dateModel"
                          confirm
                          type="date"
                          @on-change="handleChangeDate"
                          @on-ok="handlerOkDate">
                <i-button type="primary"
                          @click="handlerClickDate">选择时间</i-button>
              </DatePicker>
              <span>已选择{{template.excludeDate.length}}天</span>

              <div class="mt15">
                <Tag closable
                     class="mb15 mr15"
                     v-for="(item,i) in template.excludeDate"
                     :key="i"
                     @on-close="handleCloseDateTag(i)">{{item}}</Tag>
              </div>

            </FormItem>
          </div>
        </i-form>
      </div>
    </div>
  </div>
</template>

<script>
import { fmt } from "@/util";
const template = {
  amEndTime: "12:00",
  amStartTime: "08:00",
  excludeDate: [], // 接口数据为字符串用，连接；获取数据时 需要转换成数组， 提交数据时也需要转换成字符串
  pmEndTime: "18:00",
  pmStartTime: "14:00",
  templateName: "",
  weekDate: [] // 接口数据为字符串用，连接；获取数据时 需要转换成数组， 提交数据时也需要转换成字符串
}
export default {
  props: {
    templateId: ''
  },
  data() {
    return {
      template: initTemplate(),
      // disabledHours: [0,1, 2, 3, 4, 5, 6, 7, 23, 24],
      dateOpen: false,
      dateModel: "",
      weekArray: {
        "1": "周一",
        "2": "周二",
        "3": "周三",
        "4": "周四",
        "5": "周五",
        "6": "周六",
        "7": "周日"
      },
      rules: {
        templateName: [{ required: true, message: "必填字段", trigger: "blur" }]
      },
      timeLimit: {
        amWorkTime: '',
        amRestTime: '',
        pmWorkTime: '',
        pmRestTime: '',
      },
    };
  },
  mixins: [],
  components: {},

  computed: {
    isAdd() {
      return !this.templateId;
    },
    title() {
      return this.isAdd ? "新增模板" : "编辑模板";
    },
    disabledHours() {
      let arr = Array(24).fill(1).map((item, i) => i), min = +this.timeLimit.amWorkTime.slice(0, 2), max = +this.timeLimit.pmRestTime.slice(0, 2)
      if (min > max) {
        min -= max
        max += min
        min = max - min
      }
      let hours = arr.filter(i => { return i < min || i > max })
      return hours
    }
  },
  watch: {
    timeLimit: {
      handler(n) {
        this.template.amStartTime = template.amStartTime = n.amWorkTime
        this.template.amEndTime = template.amEndTime = n.amRestTime
        this.template.pmStartTime = template.pmStartTime = n.pmWorkTime
        this.template.pmEndTime = template.pmEndTime = n.pmRestTime
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getTimelimit() {
      this.$emsApi.task
        .getTimeLimit()
        .then(data => {
          this.timeLimit = data

        })
    },
    loadDetail() {
      this.$emsApi.timeTemplate
        .getTempalteDetail(this.templateId)
        .then(data => {
          this.template = data;
          this.template.weekDate = data.weekDate
            ? data.weekDate.split(",")
            : [];
          this.template.excludeDate = data.excludeDate
            ? data.excludeDate.split(",")
            : [];
        });
    },
    async handlerSave() {
      let _valid = false
      this.$refs.refForm.validate(valid => {
        _valid = valid
      });
      if (!_valid) { return }
      if (this.isAdd) {
        this.addTemplate();
      } else {
        this.updateTemplate();
      }
    },
    updateTemplate() {
      let template = formatTempate(this.template);
      this.$emsApi.timeTemplate.updateTemplate(template).then(() => {
        this.$Message.success('操作成功')
        this.$emit('after-save')
      });
    },
    addTemplate() {
      let template = formatTempate(this.template);
      this.$emsApi.timeTemplate.addTemplate(template).then(() => {
        this.$Message.success('操作成功')
        this.template = initTemplate()
        this.$refs.refForm.resetFields()
        this.$emit('addTimeTemplate')
        this.$emit('after-save')

      });
    },
    handlerChangeWeekDate(day) {
      let j = this.template.weekDate.indexOf(day);
      if (j >= 0) {
        this.template.weekDate.splice(j, 1);
      } else {
        this.template.weekDate.push(day);
      }
    },
    handlerClickDate() {
      this.dateOpen = !this.dateOpen;
    },
    handleChangeDate(data) {
      if (!data) {
        return;
      }
      let i = this.template.excludeDate.indexOf(data);
      if (i == -1) {
        this.template.excludeDate.push(data);
      }
    },
    handlerOkDate() {
      this.dateOpen = false;
    },
    handleCloseDateTag(i) {
      this.template.excludeDate.splice(i, 1);
    }
  },
  created() {
    if (this.templateId) {
      this.loadDetail();
    }
    this.getTimelimit()
  }
};

function initTemplate() {

  return Object.assign({}, template, { excludeDate: [], weekDate: ['1', '2', '3', '4', '5'] })
}



function formatTempate(template = {}) {
  let _template = Object.assign({}, template);
  let getTime = time => {
    let formatter = "hh:mm",
      _str = "";
    _str = fmt.date(time, formatter)
    return _str;
  };
  _template.excludeDate = _template.excludeDate.join(",");
  _template.weekDate = _template.weekDate.join(",");
  // _template.amStartTime = getTime(_template.amStartTime);
  // _template.amEndTime = getTime(_template.amEndTime);
  // _template.pmStartTime = getTime(_template.pmStartTime);
  // _template.pmEndTime = getTime(_template.pmEndTime);
  // console.log('dddd',getTime(_template.amStartTime))

  return _template;
}
</script>
<style>
.max-w800 {
  max-width: 800px;
}
</style>
