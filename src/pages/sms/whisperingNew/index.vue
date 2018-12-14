<template>
  <div class="divide"
       :class="{full: fullScreen}">
    <div class="divide-item">
      <div class="panel">
        <div class="panel-body">
          <Form class="panel-form"
                inline
                :label-width="80">
            <div class="fr">
              <FormItem>
                <i-input type="text"
                         placeholder="搜索话术名称"
                         v-model.trim="params.title"
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
            <FormItem label="话术分类">
              <whispering-type-select v-model="params.whisperingTypeId"
                                      @change="search" />
            </FormItem>
            <FormItem label="话术类型">
              <Select style="width: 120px;"
                      v-model="params.owner"
                      placeholder="全部"
                      clearable
                      @on-change="changeOwner">
                <Option :value="1">共享话术</Option>
                <Option :value="2">企业话术</Option>
              </Select>
            </FormItem>
            <FormItem label="审核状态"
                      v-show="params.owner === 2">
              <Select style="width: 120px;"
                      v-model="params.checkStatus"
                      placeholder="全部"
                      clearable
                      @on-change="search">
                <Option value="0">待审核</Option>
                <Option value="1">已通过</Option>
                <Option value="2">已拒绝</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div class="task">
      <div class="task-l divide-item">
        <div class="panel">
          <div class="panel-header">
            话术列表
            <div class="panel-header-tools">
              <import-whispering isNew
                                 @create="showForm()"
                                 @afterImportWhispering="listAndDetail(0)" />
            </div>
          </div>
          <div class="panel-body">
            <p class="nodata"
               v-show="!table.list.length">暂无数据</p>
            <ul class="list"
                v-show="table.list.length"
                style="max-height: 36rem; overflow: auto;">
              <li v-for="item in table.list"
                  :key="item.id"
                  :class="{active: detail.entity.id === item.id}"
                  @click="showDetail(item.id)">
                <div class="list-item">
                  <div class="list-item-ext"
                       v-show="item.owner === 2">
                    <div class="list-item-ext-text ellipsis"
                         style="max-width: 120px;">
                      {{item.adminName}}
                    </div>
                  </div>
                  <div class="list-item-main">
                    <p class="list-item-title">{{item.title}}</p>
                    <div class="list-item-info">
                      <ins class="keyword-item">{{item.typeName}}</ins>
                      <em v-show="item.owner === 1">企业数: {{item.firmCount || 0}}</em>
                    </div>
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
        <mod-detail @toggleFullScreen="toggleFullScreen"
                    :fullScreen="fullScreen"
                    :data="detail.entity"
                    @showForm="showForm" />
      </div>
    </div>

    <ms-panel v-model="form.show"
              :title="form.entity.id ? '编辑话术' : '新增话术'"
              @close="closeForm">
      <template v-if="form.show">
        <whispering-form :data="form.entity"
                         @cancel="closeForm" />
      </template>
    </ms-panel>
  </div>
</template>

<script>
import { indexMixin } from '@/mixins'
import whisperingNewApi from '@/api/common/whisperingNewApi'
import ModDetail from './detail'
import { ImportWhispering } from '@/components/packages/common/whispering'
import { WhisperingForm } from '@/components/packages/common/whisperingNew'
import { WhisperingTypeSelect } from '@/components/packages/sms/select'

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
        whisperingTypeId: '',
        title: '',
        owner: '',
        checkStatus: ''
      },
      fullScreen: false
    }
  },
  created() {
    // 更新话术列表，并重新读取当前话术的详情
    // 更新话术时使用
    this.$onBus('sms.whisperingNew.list.update', id => {
      this.listAndDetail()
    })

    // 更新话术列表，并定位到第一个话术的详情
    // 删除话术时使用
    this.$onBus('sms.whisperingNew.list.delete', id => {
      this.listAndDetail(0)
    })
  },
  methods: {
    getApi() {
      return whisperingNewApi
    },
    search() {
      this.table.selection = []
      // 切换筛选条件时，默认获取第一页
      this.params.pageNum = 1
      this.listAndDetail(0)
    },
    toggleFullScreen(val) {
      this.fullScreen = val
    },
    closeForm() {
      this.form.show = false
      if (this.form.entity.id) {
        this.listAndDetail()
      } else {
        this.listAndDetail(0)
      }
    },
    changeOwner() {
      this.params.checkStatus = ''
      this.search()
    }
  }
}
</script>
