<template>
  <div>
    <div class="divide" :class="{full: fullScreen}">
      <div class="divide-item">
        <div class="panel">
          <div class="panel-body">
            <i-form class="panel-form clear" inline>
              <FormItem>
                <i-select v-model="query.status" @on-change='handlerSearch' placeholder="请选择标签状态" class="w150">
                  <i-option v-for="(item,i) in queryStatusList" :key="i" :value="item.value">{{item.label}}</i-option>
                </i-select>
              </FormItem>
              <div class="fr">
                <FormItem>
                <i-input v-model="query.searchName" type="text" placeholder="搜索模板ID/名称" @on-enter="handlerSearch">
                </i-input>
              </FormItem>
                <FormItem>
                  <i-button type="primary" @click="handlerSearch">查询</i-button>
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
              标签管理
              <div class="panel-header-tools">
                <i-button type="primary" @click="addManage">新增</i-button>
              </div>
            </div>
            <div class="panel-body">
              <ul class="list">
                <li v-for="(item,i) in labelList" :key="i" :class="{'active' : currentLabel.id == item.id }" @click="handlerChangeLable(item)">
                  <div class="list-item">
                    <div class="list-item-main">
                      <p class="list-item-title">{{item.labelName}}</p>
                      <div class="list-item-info">客户数：{{item.userCount}}</div>
                    </div>
                  </div>
                </li>
              </ul>

              <Page class="pagination" show-sizer simple :total="labelTotal" :current="currentPage" @on-change="onPageChange" />
            </div>
          </div>
        </div>
        <div class="task-r divide-main">
          <div class="panel">
            <div class="panel-header">
              <i class="icon icon-enlarge panel-header-icon" :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'" @click="() => fullScreen = !fullScreen"></i>
              标签详情
              <div class="panel-header-tools" v-show="currentLabel && currentLabel.id">
                <i-button type="primary" @click="handleEdit">编辑</i-button>
                <i-button type="error" @click="handlerDeleteLabel">删除</i-button>
              </div>
            </div>
            <div class="panel-body">
              <Tabs value="1" v-model="tabName">
                <TabPane label="基础信息" name="info">
                  <detail ref='detail' :label-id="currentLabel ? currentLabel.id : ''"></detail>
                </TabPane>
                <TabPane label="客户列表" name="2">
                  <user-list 
                  v-if="tabName === '2'"
                  :label-id="currentLabel ? currentLabel.id : ''"></user-list>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <!-- 弹窗 -->
			   <tagEdit v-show="editVisible" ref="edit" :confirm="editConfirm" :close="editClose"></tagEdit>
  </div>
</template>

<script>
import API from "@/api/index";
import { indexMixin } from '@/mixins'
import tagEdit from './new.vue'
import userList from "./user-list";
import detail from "./detail";
const API_LabelInfo = API.ems.labelInfo;
export default {
  mixins: [indexMixin],
	components: {tagEdit,userList,detail },
  data() {
    return {
      tabName:'info',
      fullScreen: false,
      query: {
        status: '',
        searchName: '',
        pageSize: 10,
        pageNum: 1
      },
      editVisible: false,
      visible: true,
      loading: true,
      queryStatusList: [{label: '全部',value: ''},{label: '禁用',value: '0'},{label: '启用',value: '1'}],
      labelList: [],
      labelTotal: 0,
      currentLabel: {},// 保存当前template
      updateId: "updateId", //编辑时的Id
    };
  },
  computed: {
    currentPage() {
      return this.query.pageNum;
    }
  },
  methods: {
    init() {
      this.loadLabelList().then(data => {
        if (data.dataList.length) {
          if(this.updateId!==this.currentLabel.id){
            this.currentLabel = data.dataList[0];
          }
        }else{
          this.currentLabel = {}
        }
      });
    },
    loadLabelList() {
      return this.$emsApi.labelInfo
        .getLabelList(this.query)
        .then(data => {
          this.labelList = data.dataList.reverse();
          this.labelTotal = data.totalNum;
          return data;
        });
    },
    handlerSearch() {
      this.query.pageNum = 1;
      this.init();
    },
    handlerChangeLable(label) {
      this.currentLabel = label;
    },

    
    editClose() {
      this.editVisible = false;
    },
    editConfirm(type, obj) {
      if (type === "add") {
        return  API_LabelInfo.addLabel(obj).then(res => {
          this.init();
          this.$Message.success("添加成功");
          
          this.loadLabelList();
          this.editClose();
          
        });
      } else if (type === "edit") {
        return  API_LabelInfo.updateLabel(obj).then(res => {
          console.log(res)
          this.$Message.success("修改成功");
          this.updateId = obj.id;
          this.$refs.detail.loadDetail()
          this.init()
          this.editClose();
        });
      }
    },
    addManage(){
       this.editVisible = true;
      this.$refs.edit.init("add");
    }
    ,
    handleEdit() {
      this.editVisible = true;
      this.$refs.edit.init("edit", this.$refs.detail.label);
    },
    handlerDeleteLabel() {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确定删除该标签？</p>',
        onOk: () => {
          this.$emsApi.labelInfo
            .deleteLabelById(this.currentLabel.id)
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
