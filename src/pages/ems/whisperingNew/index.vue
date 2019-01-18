<template>
  <div class="divide" :class="{full: fullScreen}">
    <Breadcrumb separator=">">
      <span class="home" @click="linkTo('emsHomeIndex')">
        <BreadcrumbItem>首页</BreadcrumbItem>
      </span>
      <BreadcrumbItem>话术管理</BreadcrumbItem>
      <BreadcrumbItem>新话术列表</BreadcrumbItem>
    </Breadcrumb>
    <div class="task">
      <div class="task-l divide-item">
        <div class="panel">
          <div class="panel-header">
            <Icon type="ios-list-outline" class="vm fs18 v-before mr10"></Icon>
            <span class="vm">话术列表</span>
            <div class="panel-header-tools">
              <import-whispering
                isNew
                @create="showForm()"
                @afterImportWhispering="listAndDetail(0)"
              />
            </div>
          </div>

          <div class="panel-body">
            <div class="checkBox-common">
              <div class="fleX">
                <whispering-type-select
                  widths="100%"
                  placeholder="请选择话术分类"
                  v-model="params.whisperingTypeId"
                  @change="search"
                />
                <Select
                  style="width:50%"
                  v-model="params.owner"
                  placeholder="请选择话术类型"
                  clearable
                  @on-change="changeOwner"
                >
                  <Option :value="1">共享话术</Option>
                  <Option :value="2">企业话术</Option>
                </Select>
              </div>
              <div v-show="params.owner === 2">
                <Select
                  style="width: 100%;"
                  v-model="params.checkStatus"
                  placeholder="请选择审核状态"
                  clearable
                  @on-change="search"
                >
                  <Option value="0">待审核</Option>
                  <Option value="1">已通过</Option>
                  <Option value="2">已拒绝</Option>
                </Select>
              </div>
              <div>
                <Input
                  search
                  placeholder="搜索话术名称"
                  v-model.trim="params.title"
                  @keyup.native.enter="search"
                  @on-search="search"
                />
              </div>
            </div>
            <p class="nodata" v-show="!table.list.length">暂无数据</p>
            <ul class="list" v-show="table.list.length">
              <li
                v-for="item in table.list"
                :key="item.id"
                :class="{active: detail.entity.id === item.id}"
                @click="showDetail(item.id)"
              >
                <div class="list-item">
                  <div class="list-item-main">
                    <div class="list-item-title2">
                      <span :title="item.title">{{item.title}}</span>
                    </div>
                    <div class="list-item-info">
                      <span>行业:</span>
                      <ins class="lable">{{item.typeName}}</ins>
                      <span>话术类型:</span>
                      <span class="bulueLable">{{item.owner | value(['', '共享话术', '企业话术'])}}</span>
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
      <div class="task-r divide-main">
        <mod-detail
          @toggleFullScreen="toggleFullScreen"
          :fullScreen="fullScreen"
          :data="detail.entity"
          @showForm="showForm"
        />
      </div>
    </div>

    <Modal
      width="1000"
      :footer-hide="true"
      :mask-closable="false"
      v-model="form.show"
      @close="closeForm"
      class-name="vertical-center-modal"
      :title="form.entity.id ? '编辑话术' : '新增话术'"
    >
      <template v-if="form.show">
        <whispering-form :data="form.entity" @cancel="closeForm"/>
      </template>
    </Modal>
  </div>
</template>

<script>
import { indexMixin } from "@/mixins";
import whisperingNewApi from "@/api/common/whisperingNewApi";
import ModDetail from "./detail";
import { WhisperingForm } from "@/components/packages/common/whisperingNew";
import { WhisperingTypeSelect } from "@/components/packages/ems/select";
import { ImportWhispering } from "@/components/packages/common/whispering";
import Util from "@/util/util";
export default {
  mixins: [indexMixin],
  components: {
    ModDetail,
    WhisperingForm,
    WhisperingTypeSelect,
    ImportWhispering
  },
  data() {
    return {
      params: {
        whisperingTypeId: "",
        title: "",
        owner: "",
        checkStatus: ""
      },
      fullScreen: false
    };
  },
  created() {
    // 更新话术列表，并重新读取当前话术的详情
    // 更新话术时使用
    this.$onBus("ems.whisperingNew.list.update", id => {
      this.listAndDetail();
    });

    // 更新话术列表，并定位到第一个话术的详情
    // 删除话术时使用
    this.$onBus("ems.whisperingNew.list.delete", id => {
      this.listAndDetail(0);
    });
  },
  methods: {
    linkTo(name) {
      Util.openPage(this, name);
    },
    getApi() {
      return whisperingNewApi;
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
    closeForm() {
      this.form.show = false;
      if (this.form.entity.id) {
        this.listAndDetail();
      } else {
        this.listAndDetail(0);
      }
    },
    changeOwner() {
      this.params.checkStatus = "";
      this.search();
    }
  }
};
</script>
