<template>
  <div>
    <Breadcrumb separator=">">
        <span class="home" @click="linkTo('emsHomeIndex')">
          <BreadcrumbItem>首页</BreadcrumbItem>
        </span>
        <BreadcrumbItem>系统设置</BreadcrumbItem>
        <BreadcrumbItem>时间模板管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="divide"
         :class="{full: fullScreen}">
      <div class="task">
        <div class="task-l divide-item" style="width:12rem;">
          <div class="panel">
            <div class="panel-header">
              时间模板列表
              <div class="panel-header-tools">
                <i-button type="primary"
                          @click="handlerAddTemplate(Num=0)">添加模板</i-button>
              </div>
            </div>
            <div class="pd10" style="padding-bottom:0;">
               <i-input v-model="query.searchName"
                           type="text"
                           search
                           @on-search="handlerSearch"
                           placeholder="搜索模板ID/名称"
                           @on-enter="handlerSearch">
                  </i-input>
            </div>
            <div class="panel-body">
              <ul class="list">
                <li v-for="(item,i) in templateList"
                    :key="i"
                    :class="{'active' : currentTemplate.id == item.id }"
                    @click="handlerChangeTemplate(item)">
                  <div class="list-item">
                    <div class="list-item-main">
                      <p>{{item.templateName}}</p>
                      <p>使用任务数：{{item.taskCount}}</p>
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
                <div class="panel-header-tools" slot="extra"
                   v-show="currentTemplate && currentTemplate.id">
                <i-button type="primary"
                class="mr10"
                          @click="handlerEditTemplate(Num=1)">编辑</i-button>
                <i-button type="error"
                          @click="handlerDeleteTemplate">删除</i-button>
              </div>
                
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal class-name="vertical-center-modal" :mask-closable="false" v-model="newTemplateShow"
              :title="Num==1?'编辑模板':'新增模板'">
      <template v-if="newTemplateShow">
        <time-template ref="MyForm" :template-id="editTemplateId"
                       @after-save="handlerAfterSave" />
      </template>
      <div slot="footer">
        <i-button
                    @click="cancelForm">取消</i-button>
<i-button type="primary"
                    @click="saveForm">保存</i-button>
      </div>
    </Modal>

  </div>
</template>

<script>
import tableMixin from "@/mixins/table-mixin.js";
import taskList from "./task-list";
import templateDetail from "./detail";
import timeTemplate from "./new";
import Util from '@/util/util';
export default {
  data() {
    return {
      Num:0,
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
     linkTo(name) {
      Util.openPage(this, name);
    },
    cancelForm(){
      this.newTemplateShow = false;
    },
    saveForm(){
      this.$refs.MyForm.handlerSave();
    },
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
