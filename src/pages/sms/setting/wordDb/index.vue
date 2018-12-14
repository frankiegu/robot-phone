<template>
  <div>
    <!-- 上方,搜索 -->
    <div class="panel">
      <div class="panel-body">
        <i-form class="panel-form clear"
                inline>
          <div class="fr">
            <FormItem>
              <i-input placeholder="搜索单词"
                       v-model.trim="params.wordName"
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
                      placeholder="请选择状态"
                      v-model="params.status"
                      @on-change="search">
              <i-option value="">全部</i-option>
              <i-option value="0">否</i-option>
              <i-option value="1">是</i-option>
            </i-select>
          </FormItem>
        </i-form>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <div class="tool">
          <i-button type="error"
                    @click="deleteSelected">删除所选</i-button>
          <i-button type="primary"
                    @click="synchronousData">同步</i-button>
          <i-button type="primary"
                    @click="showForm()">新增</i-button>
        </div>
        <div style="overflow:hidden;">
          <Table :columns="table.columns"
                 :data="table.list"
                 ref="table"
                 @on-selection-change="handleTableSelection" />
          <Page :current="params.pageNum"
                :pageSize="params.pageSize"
                :total="page.totalNum"
                @on-change="list"
                @on-page-size-change="onPageSizeChange"
                show-sizer
                show-elevator
                style="float:right;margin:15px 0;" />
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <ms-panel v-model="form.show"
              :title="form.entity.id ? '编辑词库模板' : '新增词库模板'">
      <template v-if="form.show">
        <mod-form :data="form.entity"
                @cancel="closeForm" />
      </template>
    </ms-panel>
    <!-- 弹窗 -->
    <ms-panel v-model="detail.show"
              :title="'词库模板详情'">
      <template v-if="detail.show">
        <word-db-detail :data="detail.entity"
                        @cancel="closeDetail" />
      </template>
    </ms-panel>
  </div>
</template>

<script>
import { indexMixin } from '@/mixins'
import wordDbApi from '@/api/sms/wordDb'
import wordDbEventBus from './src/wordDbEventBus'
import WordDbDetail from './detail.vue'
import ModForm from './form'
import { fmt } from '@/util'

export default {
  mixins: [indexMixin],
  components: {
    WordDbDetail,
    ModForm
  },
  data() {
    let that = this
    return {
      params: {
        wordName: '',
        status: ''
      },
      table: {
        columns: [{
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        }, {
          title: 'ID',
          key: 'id',
          render: (h, { row }) => {
            return h('span', row.id)
          }
        }, {
          title: '单词',
          key: 'wordName',
          render: (h, { row }) => {
            return h('span', row.wordName)
          }
        }, {
          title: '创建时间',
          key: 'createTime',
          width: 200,
          value: row => {
            return fmt.date(row.createTime)
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }, {
          title: '编辑',
          key: 'action',
          align: 'center',
          render(h, { row }) {
            return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      that.showDetail(row.id, true)
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      that.showForm(row.id)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      that.showDel([row.id])
                    }
                  }
                }, '删除')
            ])
          }
        }],
        list: [],
        selection: []
      }
    }
  },
  created() {
    // 更新模板时触发，更新列表，并重新读取当前的详情
    // 更新时使用
    wordDbEventBus.$on('list.update', id => {
      this.closeForm(id)
    })
    // 新增时使用
    wordDbEventBus.$on('list.new', () => {
      this.closeForm()
    })

    // 更新列表，并定位到第一个的详情
    // 删除时使用
    wordDbEventBus.$on('list.delete', id => {
      this.closeForm(id)
    })
  },
  destroyed() {
    wordDbEventBus.$off('list.update')
    wordDbEventBus.$off('list.delete')
    wordDbEventBus.$off('list.new')
  },
  methods: {
    getApi() {
      return wordDbApi
    },
    toggleFullScreen(val) {
      this.fullScreen = val
    },
    search() {
      this.table.selection = []
      this.params.pageNum = 1
      this.listAndDetail(0)
    },
    // 更改每页数量
    onPageSizeChange(pz) {
      this.params.pageSize = pz
      this.listAndDetail()
    },
    /**
     * 显示详情
     * @param {any} entity
     */
    showDetail(entityOrId, show) {
      if (!show) {
        return
      }
      if (typeof entityOrId !== 'object') {
        this.getApi().getWordDbDetail(entityOrId).then(data => {
          this.detail.entity = data || {
            id: ''
          }
          this.detail.show = true
        })
      } else {
        this.detail.entity = entityOrId || {
          id: ''
        }
        this.detail.show = true
      }
    },
    closeDetail() {
      this.detail.show = false
      this.detail.entity = ''
    },
    /**
     * 显示新增/编辑
     * @param {any} entity
     */
    showForm(entityOrId) {
      if (!entityOrId || typeof entityOrId === 'object') {
        this.form.entity = entityOrId || {}
        this.form.show = true
      } else {
        this.getApi().getWordDbDetail(entityOrId).then(data => {
          this.showForm(data)
        })
      }
    },
    // 关闭弹框
    closeForm(id, noflash) {
      this.form.show = false
      if (noflash) {
        return
      }
      this.listAndDetail()
    },
    // 同步数据
    synchronousData() {
      this.getApi().synchroData().then(res => {
        this.success('同步成功')
      }, () => {})
    },
    showDel(idArr) {
      let content = '删除操作不可恢复，确认继续删除?'
      this.$Modal.confirm({
        title: '确认删除',
        content,
        onOk: (action, instance) => {
          wordDbApi.deleteWordDbTemplate(idArr).then(() => {
            this.success('删除成功')
            wordDbEventBus.$emit('list.delete')
          })
        }
      })
    },
    deleteSelected() {
      let selection = []
      let content = '删除操作不可恢复，确认继续删除'
      this.table.selection.forEach(val => {
        selection.push(val.id)
      })
      this.$Modal.confirm({
        title: '确认删除',
        content,
        onOk: (action, instance) => {
          this.getApi().deleteWordDbTemplate(selection).then(() => {
            this.success('删除成功')
            this.table.selection = []
            this.listAndDetail()
          })
        }
      })
    }
  }
}
</script>