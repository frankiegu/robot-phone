<template>
  <div>
   <Breadcrumb separator=">">
        <span class="home" @click="linkTo('emsHomeIndex')">
          <BreadcrumbItem>首页</BreadcrumbItem>
        </span>
        <BreadcrumbItem>系统设置</BreadcrumbItem>
        <BreadcrumbItem>我的消息</BreadcrumbItem>
    </Breadcrumb>
    <div class="task">
      <div class="task-r" style="margin-left:0">
        <div class="title pt-20  pl20 contentAfter ml10" style="position: relative;">我的消息</div>
        <div class="panel pl80 pr80">
          <div class="panel-body">
            <div>
              <i-input type="text"
                       search
                       style="width:30%;margin-left:35%"
                       class="mb20"
                       enter-button
                       @on-search="search"
                       placeholder="搜索消息标题"
                       v-model.trim="params.title"
                       @keyup.native.enter="search">
                
              </i-input>
            </div>
           <div class="tabs-message mb20">
             
             <div 
                    :class="params.readStatus === '' ? 'active' : ''"
                    @click="changeStatus('')">全部消息</div>
              <div 
                      :class="params.readStatus === 0 ? 'active' : ''"
                      @click="changeStatus(0)">未读消息</div>

            <div 
                    :class="params.readStatus === 1 ? 'active' : ''"
                    @click="changeStatus(1)">已读消息</div>
           </div>
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
    <Modal :footer-hide="true" v-model="detail.show"
              title="消息详情">
      <mod-detail :data="detail.entity" />
    </Modal>
  </div>
</template>
<script>
import { indexMixin } from '@/mixins'
import noticeInfoApi from '@/api/common/noticeInfoApi'
import { fmt } from '@/util'
import ModDetail from './detail'
import Util from '@/util/util';
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
    linkTo(name) {
      Util.openPage(this, name);
    },
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