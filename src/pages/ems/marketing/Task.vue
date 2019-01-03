<template>
  <div class="divide" :class="{full: fullScreen}">
    <Breadcrumb separator=">">
        <span class="home" @click="linkTo('emsHomeIndex')">
          <BreadcrumbItem>首页</BreadcrumbItem>
        </span>
        <BreadcrumbItem>AI外呼</BreadcrumbItem>
        <BreadcrumbItem>任务管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="task">
      <div class="task-l divide-item">
        <div class="panel" style="border-radius: 0;box-shadow: none">
          <div class="panel-body">
            <div class="fleX panel-header" style="align-items: center;">
              <div class="">任务管理列表</div>
              <div>
                <Button type="primary" @click="showForm()">创建任务</Button>
              </div>
            </div>
            <div class="mb20">
              <div class="fleX mb10">
                <Select
                style="width:50%;"
                v-model="params.status"
                placeholder="任务状态"
                clearable
                @on-change="search"
              >
                <Option value="0">未开始</Option>
                <Option value="1">进行中</Option>
                <Option value="2">暂停</Option>
                <Option value="3">终止</Option>
                <Option value="4">完成</Option>
              </Select>
              <DatePicker
                type="daterange"
                placeholder="创建日期"
                style="width: 50%;"
                v-model="dateRange"
                @on-change="delaySearch"
              />
              </div>
              <div class="mb10 fleX">
                  <card-select
                  widths='100%'
                v-model="params.cardRelateId"
                placeholder="坐席号码"
                @change="search"
              />
               <whispering-select v-model="params.whisperingId" widths='100%' placeholder="话术模板" @change="search"/>
              </div>
              
              <div class="mb10">
               <i-input
                type="text"
                search
                style="width: 100%;"
                placeholder="搜索任务ID/名称"
                v-model.trim="params.idOrName"
                @on-enter="search"
                @on-search="search"
              ></i-input>
              </div>
            </div>
            <p class="nodata" v-show="!table.list.length ||  table.list.length==0">暂无数据</p>
            <div
              class="card"
              v-show="table.list.length "
            >
              <div
                class="card-item"
                v-for="item in table.list"
                :key="item.id"
                :class="[['card-default', 'card-info', 'card-warning', 'card-danger', 'card-success'][item.status], 
                    detail.entity.id === item.id ? 'active' : '']"
                @click="showDetail(item.id)"
              >
                <div class="card-header fleX">
                  <div>{{item.taskName}}</div>
                  <div>
                    <div
                      class="task-pg-strip-desc"
                      :class="item.status==4?'finish':item.status==3?'parseing':'doing'"
                    >{{item.status | value(['未开始', '进行中', '暂停', '终止', '完成'])}}</div>
                  </div>
                </div>
                <div class="card-body">
                  <div
                    class="task-pg"
                    :class="['task-pg-default', 'task-pg-info', 'task-pg-warning', 'task-pg-danger', 'task-pg-success'][item.status]"
                  >
                    <div class="task-pg-strip">
                      <div class="task-pg-strip-bar">
                        <div class="porgress-bar" v-if="item.status==3||item.status==2">
                          <Progress
                            style="width:65%;"
                            status="wrong"
                            :stroke-width="6"
                            :percent="(item.completeUserCount/item.userCount*100)"
                          >
                            <Icon type="checkmark-circled"></Icon>
                            <span>进度 {{item.completeUserCount}}/{{item.userCount}}</span>
                          </Progress>
                        </div>
                        <div class="porgress-bar" v-else>
                          <Progress
                          style="width:65%;"
                            :stroke-width="6"
                            :percent="(item.completeUserCount/item.userCount*100)"
                          >
                            <Icon type="checkmark-circled"></Icon>
                            <span>进度 {{item.completeUserCount}}/{{item.userCount}}</span>
                          </Progress>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p style="word-break: break-all;">机器坐席号码: {{item.mobile}}</p>
                  <p>创建于: {{item.createTime | date}}</p>
                </div>
              </div>
            </div>
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
      <div class="task-r divide-main">
        <mod-detail
          @toggleFullScreen="toggleFullScreen"
          :fullScreen="fullScreen"
          :data="detail.entity"
        />
      </div>
    </div>
    <Modal
    class-name="vertical-center-modal"
      width="596"
      :mask-closable="false"
      v-model="form.show"
      :title="form.entity.id ? '编辑营销任务' : '新增营销任务'"
    >
      <template v-if="form.show">
        <mod-form
          ref="myForm"
          :data="form.entity"
          @on-cancel="cancelForm"
          @after-submit="afterSubmitForm"
        />
      </template>
      <div slot="footer">
         <Button size="large" type="text"
              style="margin-right: 8px"
              @click="cancelForm">取消</Button>
              <Button size="large" type="primary"
              @click="submitTask">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { indexMixin } from "@/mixins";
import taskApi from "@/api/ems/task";
import { watchDateRangeToTimestamp } from "@/util";
import ModDetail from "./components/task/detail";
import ModForm from "./components/task/Form";
import { CardSelect, WhisperingSelect } from "@/components/packages/ems/select";
import taskEventBus from "./components/task/taskEventBus";
import Util from '@/util/util'
export default {
  name: "marketingTask",
  mixins: [indexMixin],
  components: {
    ModDetail,
    ModForm,
    CardSelect,
    WhisperingSelect
  },
  data() {
    return {
      params: {
        status: "",
        createTimeBegin: "",
        createTimeEnd: "",
        whisperingId: "",
        cardRelateId: "",
        idOrName: ""
      },
      fullScreen: false,
      dateRange: ""
    };
  },
  created() {
    this.$watch(
      "dateRange",
      watchDateRangeToTimestamp(this.params, "createTimeBegin", "createTimeEnd")
    );

    // 更新营销任务列表，并重新读取当前营销任务的详情
    // 更新营销任务时使用
    taskEventBus.$on("task.update", id => {
      this.listAndDetail();
    });

    // 更新营销任务列表，并定位到第一个营销任务的详情
    // 删除营销任务时使用
    taskEventBus.$on("task.delete", id => {
      this.listAndDetail(0);
    });
  },
  methods: {
    getApi() {
      return taskApi;
    },
    linkTo(name) {
      Util.openPage(this, name);
    },
    submitTask() {
      this.$refs.myForm.submit();
    },
    search() {
      this.table.selection = [];
      // 切换筛选条件时，默认获取第一页
      this.params.pageNum = 1;
      this.listAndDetail(0);
    },
    toggleFullScreen(val) {
      this.fullScreen = val;
    },
    /*
     * 新建、编辑如果共用一个表单，表单"确认"按钮，'修改话术'并非'编辑'
     * @entity, form表单里面相关的数据，判断新增/编辑
     * @data,  提交表单后返回的数据
     */
    afterSubmitForm(data, entity) {
      this.form.show = false;
      // 编辑时刷新列表并更新当前对象
      // 新增时刷新列表并选中第一个对象
      if (entity.id) {
        this.listAndDetail();
      } else {
        this.listAndDetail(0);
      }
      this.success(`${entity.id ? "编辑" : "新增"}成功`);
    }
  }
};
</script>