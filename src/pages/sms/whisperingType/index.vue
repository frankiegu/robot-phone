<template>
  <div class="divide"
       :class="{full: fullScreen}">
    <div class="divide-item">
      <div class="panel">
        <div class="panel-body">
          <Form class="panel-form clear"
                inline
                :label-width="80">
            <div class="fr">
              <FormItem>
                <i-input type="text"
                         placeholder="搜索分类名称"
                         v-model.trim="params.name"
                         @keyup.native.enter="search">
                  <Icon type="search"
                        slot="prepend"></Icon>
                </i-input>
              </FormItem>
              <FormItem :label-width="1">
                <Button type="primary"
                        @click="search">查询</Button>
              </FormItem>
            </div>
          </Form>
        </div>
      </div>
    </div>
    <div class="task">
      <div class="task-l divide-item">
        <div class="panel">
          <div class="panel-header">
            话术分类列表
            <div class="panel-header-tools">
              <Button type="primary"
                      icon="plus"
                      @click="showForm()">新增</Button>
            </div>
          </div>
          <div class="panel-body">
            <p class="nodata"
               v-show="!table.list.length">暂无数据</p>

            <ul class="list"
                v-show="table.list.length">
              <li v-for="item in table.list"
                  :key="item.id"
                  :class="{active: detail.entity.id === item.id}"
                  @click="showDetail(item.id)">
                <div class="list-item">
                  <div class="list-item-main">
                    <p class="list-item-title">
                      <b>{{item.name}}</b>
                    </p>
                  </div>
                </div>
              </li>
            </ul>
            <ms-pagination :pageNum="params.pageNum"
                           :pageSize="params.pageSize"
                           :total="page.totalNum"
                           @change="list"
                           simple />
          </div>
        </div>
      </div>
      <div class="task-r divide-main">
        <div class="panel">
          <div class="panel-header">
            <i class="icon icon-enlarge panel-header-icon"
               :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'"
               @click="toggleFullScreen"></i>
            详情
            <div class="panel-header-tools" v-if="detail.entity && detail.entity.id">
              <Button type="primary"
                      @click="showForm(detail.entity)">编辑</Button>
              <Button type="error"
                      @click="showDel(detail.entity.id)">删除</Button>
            </div>
            <div class="panel-body" v-if="detail.entity && detail.entity.id">
              <div class="task-detail">
                <h1>{{detail.entity.name}}
                </h1>
                <sub>
                  <b>创建于 {{detail.entity.createTime | date}}</b>
                </sub>
                <div class="mt-20">
                  <Row>
                    <i-col span="8">
                      <p>
                        <b>ID: {{detail.entity.id}}</b>
                      </p>
                    </i-col>
                  </Row>
                </div>
              </div>
            </div>
            <div class="panel-body" v-else >
              <p class="nodata">暂无数据!!</p>
            </div>
          </div>
        </div>
      </div>
    </div>

     <ms-panel v-model="form.show"
              :title="form.entity.id ? '编辑话术分类' : '新增话术分类'">
      <template v-if="form.show">
        <mod-form :data="form.entity"
                  @on-cancel="cancelForm"
                  @after-submit="afterSubmitForm" />
      </template>
    </ms-panel>

  </div>
</template>
<script>
import { indexMixin } from '@/mixins'
import whisperingTypeApi from '@/api/sms/whisperingType'
import ModForm from './form'

export default {
  mixins: [indexMixin],
  components: {
    ModForm
  },
  data() {
    return {
      params: {
        name: ''
      },
      fullScreen: false
    }
  },
  methods: {
    getApi() {
      return whisperingTypeApi
    },
    /**
     * 查询列表第一页
     */
    search() {
      this.table.selection = []
      this.listAndDetail(0)
    },
    afterDel() {
      this.success('删除成功')
      this.listAndDetail(0)
    },
    afterSubmitForm(data, entity) {
      this.form.show = false
      this.listAndDetail()
      this.success(`${entity.id ? '编辑' : '新增'}成功`)
    },
    toggleFullScreen() {
      this.fullScreen = !this.fullScreen
    }
  }
}
</script>