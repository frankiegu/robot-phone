<template>
  <div>
    <div class="divide"
         :class="{full: fullScreen}">
      <div class="divide-item">
        <div class="panel">
          <div class="panel-body">
            <i-form class="panel-form clear"
                    inline>
              <div class="fr">
                <FormItem>
                  <i-input v-model="query.searchName"
                           type="text"
                           placeholder="搜索模板ID/名称"
                           @on-enter="handlerSearch">
                    <!-- <Icon type="search" slot="prepend"></Icon> -->
                  </i-input>
                </FormItem>
                <FormItem>
                  <i-button type="primary"
                            @click="handlerSearch">查询</i-button>
                </FormItem>
              </div>
            </i-form>
          </div>
        </div>
      </div>
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              时间模板列表
              <div class="panel-header-tools">
                <i-button type="primary"
                          icon="plus"
                          @click="handlerAddTemplate">添加模板</i-button>
              </div>
            </div>
            <div class="panel-body">
              <ul class="list">
                <li v-for="(item,i) in templateList"
                    :key="i"
                    :class="{'active' : currentTemplate.id == item.id }"
                    @click="handlerChangeTemplate(item)">
                  <div class="list-item">
                    <div class="list-item-main">
                      <p class="list-item-title">{{item.templateName}}</p>
                      <div class="list-item-info">使用任务数：{{item.taskCount}}</div>
                    </div>
                  </div>
                </li>
              </ul>

              <Page class="pagination"
                    show-sizer
                    simple
                    :total="templateTotal"
                    :current="currentPage"
                    @on-change="onPageChange" />
            </div>
          </div>
        </div>
        <div class="task-r divide-main">
          <div class="panel">
            <div class="panel-header">
              <i class="icon icon-enlarge panel-header-icon"
                 :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'"
                 @click="() => fullScreen = !fullScreen"></i>
              时间模板详情
              <div class="panel-header-tools"
                   v-show="currentTemplate && currentTemplate.id">
                <i-button type="primary"
                          @click="handlerEditTemplate">编辑</i-button>
                <i-button type="error"
                          @click="handlerDeleteTemplate">删除</i-button>
              </div>
            </div>
            <div class="panel-body">
              <Tabs value="1" v-model="tabName">
                <TabPane label="基础信息"
                         name="info">
                  <template-detail ref="templateDetail"
                                   :template-id="currentTemplate ? currentTemplate.id : ''"></template-detail>
                </TabPane>
                <TabPane label="任务列表"
                         name="taskList">
                  <task-list  v-if="tabName === 'taskList'"
                  :template-id="currentTemplate ? currentTemplate.id : ''"
                            ></task-list>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ms-panel v-model="newTemplateShow"
              title="时间模板">
      <template v-if="newTemplateShow">
        <time-template :template-id="editTemplateId"
                       @after-save="handlerAfterSave" />
      </template>
    </ms-panel>

  </div>
</template>

<script>
import tableMixin from "@/mixins/table-mixin.js";
import taskList from "./task-list";
import templateDetail from "./detail";
import timeTemplate from "./new";
export default {
  data() {
    return {
      tabName:'info',
      fullScreen: false,
      query: {
        searchName: "",
        pageSize: 10,
        pageNum: 1
      },
      templateList: [],
      templateTotal: 0,
      currentTemplate: {}, // 保存当前template

      // 新增编辑
      newTemplateShow: false,
      editTemplateId: '',
    };
  },
  mixins: [tableMixin],
  components: {
    taskList,
    templateDetail,
    timeTemplate
  },
  computed: {
    currentPage() {
      return this.query.pageNum;
    }
  },
  methods: {
    init() {
      this.loadTemplateList().then(data => {
        if (data.dataList.length) {
          this.currentTemplate = data.dataList[0];
        } else {
          this.currentTemplate = {}
        }
      });
    },
    loadTemplateList() {
      return this.$emsApi.timeTemplate
        .getTemplateList(this.query)
        .then(data => {
          this.templateList = data.dataList;
          this.templateTotal = data.totalNum;
          return data;
        });
    },
    handlerSearch() {
      this.query.pageNum = 1;
      this.init();
    },
    handlerChangeTemplate(tmp) {
      this.currentTemplate = tmp;
    },
    handlerAddTemplate() {
      this.newTemplateShow = true
      this.editTemplateId = ''

      // this.$router.push({name: 'emsTimeAdd'})
    },
    handlerEditTemplate() {
      this.newTemplateShow = true
      this.editTemplateId = this.currentTemplate.id
      // this.$router.push({name: 'emsTimeEdit',params: {templateId: this.currentTemplate.id}})
    },
    handlerAfterSave() {
      this.newTemplateShow = false
      this.editTemplateId = ''
      this.$refs.templateDetail.refresh()
      if (this.templateList.length) {
        this.loadTemplateList()
      } else {
        this.init()
      }

    },
    handlerDeleteTemplate() {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确定删除该时间模板？</p>',
        onOk: () => {
          this.$emsApi.timeTemplate
            .deleteTempalteById(this.currentTemplate.id)
            .then(data => {
              this.init();
            });
        }
      });

    },

    onPageChange(n) {
      this.query.pageNum = n;
      this.init();
    }
  },
  created() {
    this.init();
  }
};
</script>
