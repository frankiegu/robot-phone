<template>
  <div>
    <div class="panel">
      <div class="panel-body">
        <Form class="panel-form clear"
              inline
              :label-width="80">
          <div class="fr">
            <FormItem>
              <i-input type="text"
                       placeholder="搜索消息标题"
                       v-model.trim="params.title"
                       @keyup.enter="search">
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
    <div class="task">
      <div class="task-l">
        <div class="panel">
          <div class="panel-body">
            <Button long
                    class="mb-20"
                    :type="params.readStatus === '' ? 'success' : 'default'"
                    @click="changeStatus('')">全部消息</Button>
            <Badge :count="count.unreadCount"
                   overflow-count="99"
                   style="display: block;">
              <Button long
                      class="mb-20"
                      :type="params.readStatus === 0 ? 'success' : 'default'"
                      @click="changeStatus(0)">未读消息</Button>
            </Badge>

            <Button long
                    class="mb-20"
                    :type="params.readStatus === 1 ? 'success' : 'default'"
                    @click="changeStatus(1)">已读消息</Button>
          </div>
        </div>
      </div>
      <div class="task-r">
        <div class="panel">
          <div class="panel-body">
            <div class="tool">
              <Button type="error"
                      @click="showBatchDel">批量删除</Button>
            </div>
            <Table :columns="table.columns"
                   :data="table.list"
                   @on-selection-change="handleTableSelection"
                   ref="table" />
            <ms-pagination :pageNum="params.pageNum"
                           :pageSize="params.pageSize"
                           :total="page.totalNum"
                           @change="list" />
          </div>
        </div>
      </div>
    </div>
    <ms-panel v-model="detail.show"
              title="消息详情">
      <mod-detail :data="detail.entity" />
    </ms-panel>
  </div>
</template>
<script>
import { indexMixin } from '@/mixins'
import noticeInfoApi from '@/api/common/noticeInfoApi'
import { fmt } from '@/util'
import ModDetail from './detail'

export default {
  mixins: [indexMixin],
  components: {
    ModDetail
  },
  data() {
    return {
      params: {
        title: '',
        readStatus: ''
      },
      table: {
        columns: [{
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        }, {
          title: '标题',
          key: 'title',
          render: (h, { row }) => {
            return h('a', {
              on: {
                click: () => {
                  this.showDetail(row.id)
                }
              }
            }, row.title)
          }
        }, {
          title: '提交时间',
          key: 'createTime',
          width: 200,
          value: row => {
            return fmt.date(row.createTime)
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }]
      },
      count: {
        allCount: 0,
        unreadCount: 0,
        readCount: 0
      }
    }
  },
  methods: {
    getApi() {
      return noticeInfoApi
    },
    initReady() {
      this.refreshCount()
    },
    refreshCount() {
      noticeInfoApi.count().then(data => {
        Object.assign(this.count, data)
      })
    },
    changeStatus(status) {
      this.params.readStatus = status
      this.search()
    },
    showDetail(id) {
      this.getApi().get(id).then(data => {
        this.detail.entity = data || {}
        this.detail.show = true
        this.refreshCount()
      })
    }
  }
}
</script>