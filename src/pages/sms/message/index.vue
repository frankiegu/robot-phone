<template>
  <div>
    <div class="divide"
         :class="{ full: fullScreen }">
      <!-- 上方,搜索 -->
      <div class="divide-item">
        <div class="panel">
          <div class="panel-body">
            <i-form class="panel-form clear"
                    inline>
              <div class="fr">
                <FormItem>
                  <i-input placeholder="搜索模板ID/名称"
                           v-model.trim="params.idName"
                           @keyup.native.enter="search">
                    <Icon type="search"
                          slot="prepend"></Icon>
                  </i-input>
                </FormItem>
                <FormItem>
                  <i-button type="primary"
                            @click="search">查询</i-button>
                </FormItem>
              </div>
              <FormItem>
                <i-select class="w150"
                          placehoder="请选择模板分类"
                          v-model="params.type"
                          @on-change="search">
                  <i-option value="">全部</i-option>
                  <i-option value="1">初筛推送短信</i-option>
                  <i-option value="2">关键字短信</i-option>
                </i-select>
              </FormItem>
              <FormItem>
                <i-select class="w150"
                          placehoder="审核状态"
                          v-model="params.isCheck"
                          @on-change="search">
                  <i-option value="">全部</i-option>
                  <i-option value="0">待审核</i-option>
                  <i-option value="1">通过</i-option>
                  <i-option value="2">拒绝</i-option>
                </i-select>
              </FormItem>
              <FormItem>
                <operator-select v-model="params.platformId" />
              </FormItem>
              <FormItem>
                <firm-select v-model="params.adminId"
                             :platformId="params.platformId"
                             @change="search"
                             v-show="params.platformId"
                             placeholder="暂无企业" />
              </FormItem>

            </i-form>
          </div>
        </div>
      </div>
      <div class="task">
        <!-- 左侧 -->
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              短信模板列表
            </div>
            <div class="panel-body">
              <p class="nodata"
                 v-show="!table.list.length">暂无数据</p>
              <div v-show="table.list.length">
                <ul class="list">
                  <li v-for="( item, i ) in table.list"
                      :key="i"
                      :class="detail.entity.id === item.id ? 'active' : ''"
                      @click="showDetail(item.id)">
                    <div class="list-item">
                      <div class="list-item-ext">
                        <div class="list-item-ext-text ellipsis"
                             style="max-width: 120px">
                          {{item.adminName}}
                        </div>
                      </div>
                      <div class="list-item-main">
                        <p class="list-item-title">
                          {{ item.name }}
                        </p>
                        <div>
                          发送量：{{ item.sendCount }}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="page-wrapper cf">
                  <ms-pagination simple
                                 :pageNum="params.pageNum"
                                 :pageSize="params.pageSize"
                                 :total="page.totalNum"
                                 @change="list" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="task-r divide-main">
          <message-detail @toggleFullScreen="toggleFullScreen"
                          :fullScreen="fullScreen"
                          :data="detail.entity" />
        </div>
      </div>
      <!-- 弹窗 -->
      <ms-panel v-model="form.show"
                :title="form.entity.id ? '编辑短信模板' : '新增短信模板'">
        <template v-if="form.show">

        </template>
      </ms-panel>
    </div>
  </div>
</template>

<script>
import { indexMixin } from '@/mixins'
import messageTemplateApi from '@/api/sms/messageTemplate'
import MessageDetail from './detail.vue'
import messageEventBus from './src/messageEventBus'
import { OperatorSelect, FirmSelect } from '@/components/packages/common/select'

export default {
  name: 'emsMessage',
  mixins: [indexMixin],
  components: {
    MessageDetail,
    OperatorSelect,
    FirmSelect
  },
  data() {
    return {
      params: {
        idName: '',
        type: '',
        isCheck: '',
        platformId: '',
        adminId: ''
      },
      fullScreen: false
    }
  },
  created() {
    // 更新模板时触发，更新营销任务列表，并重新读取当前的详情
    messageEventBus.$on('list.update', (data, entity) => {
      this.listAndDetail()
    })
  },
  methods: {
    getApi() {
      return messageTemplateApi
    },
    toggleFullScreen(val) {
      this.fullScreen = val
    },
    search() {
      this.table.selection = []
      this.params.pageNum = 1
      this.listAndDetail(0)
    }

  }
}
</script>