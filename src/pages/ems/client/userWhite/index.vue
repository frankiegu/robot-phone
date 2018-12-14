<template>
  <div>
    <div class="divide" :class="{full: fullScreen}">
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header fleX">
              <i-button type="primary" ghost style="margin-right:20px;" @click="exportForm=true">导入黑名单</i-button>
                <i-button type="primary" @click="showBatchForm()"><Icon size="16" style="margin-top:-3px;" type="md-add" />新增黑名单</i-button>
            </div>
            <div class="pd10" style="padding-bottom:0;">
                            <div class="fleX">
              <Select
                  style="width: 50%;"
                  v-model="params.type"
                  placeholder="请选择白名单类型"
                  clearable
                  @on-change="search"
                >
                  <Option value="1">企业</Option>
                  <Option value="2">超级管理</Option>
                </Select>
                 <DatePicker
                  type="daterange"
                  placeholder="选择创建日期"
                  style="width: 50%;"
                  @on-change="delaySearch"
                  v-model="dateRange"
                />
            </div>
            <div class="mt10">
               <i-input
                    v-model="params.namePhone"
                    type="text"
                    search
                    @on-search="search"
                    placeholder="搜索客户名称/手机号"
                    @on-enter="search"
                  ></i-input>
            </div>
            </div>
            <div class="panel-body">
              <p class="nodata" v-show="!table.list.length">暂无数据</p>
              <ul class="list" v-show="table.list.length">
                <li
                  v-for="(item,i) in table.list"
                  :key="i"
                  :class="detail.entity.id === item.id ? 'active' : ''"
                  @click="showDetail(item.id)"
                >
                  <div class="list-item">
                    <div class="list-item-main">
                      <p>
                        {{item.phone}}
                        <span v-show="item.name">({{item.name}})</span>
                      </p>
                      <div class="list-item-info">
                        <span>{{getType(item.type)}}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <ms-pagination
                :pageNum="params.pageNum"
                :pageSize="params.pageSize"
                :total="page.totalNum"
                @change="list"
                simple
              />
            </div>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="task-r divide-main">
          <mod-detail
            @toggleFullScreen="toggleFullScreen"
            :fullScreen="fullScreen"
            :data="detail.entity"
          />
        </div>
      </div>
    </div>

    <!-- 编辑 -->
    <Modal :mask-closable="false" v-model="form.show" :title="form.entity.id ? '编辑白名单客户' : '新增白名单客户'">
        <template v-if="form.show">
        <mod-form :data="form.entity" @on-cancel="cancelForm" @after-submit="afterSubmitForm"></mod-form>
      </template>
    </Modal>

    <!-- 批量新增白名单客户 -->
    <Modal width="800px" :mask-closable="false" v-model="batchForm.show" title="批量新增白名单客户">
        <template v-if="batchForm.show">
        <batch-form
           ref="batchForms"
          :data="batchForm.entity"
          @on-cancel="cancelBatchForm"
          @after-submit="afterSubmitBatchForm"
        ></batch-form>
      </template>
      <div slot="footer">
         <i-button 
                  style="margin-right: 8px"
                  @click="cancelBatchForm">取消</i-button>
        <i-button type="primary"
                  @click="submitBatch">确定</i-button>
      </div>
    </Modal>

    <!-- 导入excel -->
    <Modal :mask-closable="false" v-model="exportForm"  title="导入白名单">
         <template v-if="exportForm">
        <export-form
          ref="exportForm"
          :data="batchForm.entity"
          @on-cancel="cancelExportForm"
          @after-submit="afterSubmitExpotForm"
        ></export-form>
      </template>
      <div slot="footer">
        <i-button 
                  style="margin-right: 8px"
                  @click="cancelExportForm">取消</i-button>
        <i-button type="primary"
                  @click="submitForm">确定</i-button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { indexMixin } from "@/mixins";
import userWhiteApi from "@/api/ems/userWhite";
import ModDetail from "./detail.vue";
import ModForm from "./form.vue";
import BatchForm from "./batchForm.vue";
import exportForm from "./exportForm.vue";
import modEventBus from "./src/eventBus";
import { watchDateRangeToTimestamp, getType } from "@/util";
export default {
  name: "emsMessage",
  mixins: [indexMixin],
  components: {
    ModDetail,
    ModForm,
    BatchForm,
    exportForm
  },
  data() {
    return {
      params: {
        namePhone: "",
        start_time: "",
        end_time: "",
        type: ""
      },
      fullScreen: false,
      batchForm: {
        show: false
      },
      exportForm: false,
      dateRange: ""
    };
  },
  created() {
    this.$watch(
      "dateRange",
      watchDateRangeToTimestamp(this.params, "start_time", "end_time")
    );
    // 更新时触发，更新列表，并重新读取当前的详情
    modEventBus.$on("list.update", (data, entity) => {
      this.afterSubmitForm(data, entity);
    });

    // 删除时触发，更新列表，并定位到第一个的详情
    modEventBus.$on("list.delete", id => {
      this.listAndDetail(0);
    });
  },
  destroyed() {
    modEventBus.$off("list.update");
    modEventBus.$off("list.delete");
  },
  methods: {
    submitBatch(){
      this.$refs.batchForms.submit();
    },
    submitForm(){
      this.$refs.exportForm.submit();
    },
    getApi() {
      return userWhiteApi;
    },
    toggleFullScreen(val) {
      this.fullScreen = val;
    },
    search() {
      this.table.selection = [];
      // 切换筛选条件时，默认获取第一页
      this.params.pageNum = 1;
      this.listAndDetail(0);
    },
    //判断白名单类型
    getType(type) {
      return getType(type);
    },
    /**
     * 新增/编辑成功后执行
     * @param {any} entity, 表单的数据
     * @param {any} data, 提交之后返回值
     */
    afterSubmitForm(data, entity) {
      this.form.show = false;
      // 根据id是否为空，判断新增/编辑
      if (entity.id) {
        this.listAndDetail();
      } else {
        this.listAndDetail(0);
      }
      this.success(`${entity.id ? "编辑" : "新增"}成功`);
    },
    showBatchForm() {
      this.batchForm.show = true;
    },
    cancelBatchForm() {
      this.batchForm.show = false;
    },
    cancelExportForm() {
      this.exportForm = false;
    },
    afterSubmitBatchForm() {
      this.batchForm.show = false;
      this.success("新增成功");
      this.listAndDetail(0);
    },
    afterSubmitExpotForm() {
      this.cancelExportForm();
      this.success("导入成功");
      this.listAndDetail(0);
    }
  }
};
</script>
