<template>
  <div>
    <i-form :label-width="100"
            :data="entity"
            :rules="rules"
            :model="entity"
            ref="form">
      <Row>
        <i-col :span="24">
          <FormItem label="白名单">
            <ms-xlsx-parser @change="changeCardSlotList"
                            :templateUrl="templateUrl">
              <span slot="desc">
                已导入
                <em class="c-primary">{{exportXlsCardSlotList.length}}</em> 个客户
                <span v-show="exportXlsCardSlotList.length > 0">
                  , 其中有效客户
                  <em class="c-primary">{{entity.cardSlotList.length}}</em> 个
                </span>
                <template v-if="exportXlsCardSlotList.length > 0">
                  <a href="javascript: void(0);"
                     class="c-info ml-10"
                     @click="cardSlotShow=true">查看</a>
                  <a href="javascript: void(0);"
                     class="c-danger ml-5"
                     @click="clearCardSlotList">删除</a>
                </template>
              </span>
            </ms-xlsx-parser>
          </FormItem>
        </i-col>
      </Row>
      <Modal :footer-hide="true" v-model="cardSlotShow"
             title="营销对象"
             width="600px">
        <ms-lazy :initial="cardSlotShow">
          <div class="text-c mb-10">
            <ButtonGroup class="text-c">
              <Button :type="cardSlot.type === 1 ? 'primary' : 'default'"
                      @click="() => cardSlot.type = 1">全部({{exportXlsCardSlotList.length}})</Button>
              <Button :type="cardSlot.type === 2 ? 'info' : 'default'"
                      @click="() => cardSlot.type = 2">有效客户({{entity.cardSlotList.length}})</Button>
              <Button :type="cardSlot.type === 3 ? 'warning' : 'default'"
                      @click="() => cardSlot.type = 3">无效客户({{invalidCardSlotList.length}})</Button>
            </ButtonGroup>
          </div>
          <Table width="100%"
                 height="300"
                 :columns="cardSlot.columns"
                 :data="[[], exportXlsCardSlotList, entity.cardSlotList, invalidCardSlotList][cardSlot.type]" />
        </ms-lazy>
        <div slot="footer"></div>
      </Modal>
    </i-form>
  </div>
</template>

<script>
import {
  formMixin
} from "@/mixins";
import entity from "./src/entity.js";
import userWhiteApi from "@/api/ems/userWhite";
import {
  EMS
} from "@/constants";
import {
  isTelOrMobile,
  desenPhone
} from '@/util'
export default {
  mixins: [formMixin],
  data() {
    return {
      entity: entity({
        cardSlotList: []
      }),
      cardSlotShow: false, //查看白名单模态框
      templateUrl: EMS.XLS_WHITE_TEMPLATE.WHITE_SLOT_LIST,
      exportXlsCardSlotList: [],
      cardSlot: {
        show: false,
        type: 1,
        columns: [{
          title: "姓名",
          key: "name"
        },
        {
          title: "手机号",
          key: "phone"
        },
        {
          title: "备注",
          key: "remarks"
        }
        ]
      }
    };
  },
  computed: {
    invalidCardSlotList() {
      return this.exportXlsCardSlotList.filter(v => {
        return this.entity.cardSlotList.indexOf(v) === -1;
      });
    }
  },
  watch: {
    exportXlsCardSlotList(list) {
      let mobileMap = {};
      this.entity.cardSlotList = list.filter(v => {
        if (mobileMap[v.phone]) {
          v.remarks = "重复号码";
          return false;
        }
        if (!v.phone) {
          v.remarks = "号码为空";
          return false;
        }
        if (!isTelOrMobile(v.phone)) {
          v.remarks = "无效号码";
          return false;
        }
        v.phone = v.phone.replace(/-/g, "");
        mobileMap[v.phone] = v;
        return true;
      });
    }
  },
  methods: {
    changeCardSlotList(data) {
      if (data && data.length) {
        this.exportXlsCardSlotList = data.map(v => {
          return {
            phone: (v["电话"] || "").trim(),
            name: (v["姓名"] || `客户${desenPhone(v['电话'])}`).trim(),
            remarks: (v["备注"] || "").trim()
          };
        });
      }
    },
    clearCardSlotList() {
      this.exportXlsCardSlotList = [];
    },

    submit() {
      if (this.exportXlsCardSlotList.length < 1) {
        this.warning('请导入正确的模板，当前客户为0')
        return
      }

      let list = this.entity.cardSlotList;
      userWhiteApi
        .batchSave({
          list
        })
        .then(data => {
          this.$emit("after-submit", data, list);
        });
    }
  }
};

</script>
