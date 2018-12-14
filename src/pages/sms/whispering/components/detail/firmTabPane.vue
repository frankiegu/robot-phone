<template>
  <div>
    <Table :columns="table.columns"
           :data="table.list"
           ref="table" />
    <ms-pagination :pageNum="params.pageNum"
                   :pageSize="params.pageSize"
                   :total="page.totalNum"
                   @change="list" />

    <!-- 设置企业的话术权限 -->
    <Modal v-model="authorization.show"
           title="设置权限">
      <Form :label-width="120"
            :model="authorization.entity"
            :rules="authorization.rules"
            ref="authorizationForm"
            v-if="authorization.show">
        <FormItem label="是否允许复制">
          <Checkbox v-model="authorization.entity.isCopy"
                    :true-value="1"
                    :false-value="0" />
        </FormItem>
        <FormItem label="是否允许导出">
          <Checkbox v-model="authorization.entity.isDownload"
                    :true-value="1"
                    :false-value="0" />
        </FormItem>
        <FormItem>
          <Button type="ghost"
                  style="margin-right: 8px"
                  @click="cancelAuthorization">取消</Button>
          <Button type="primary"
                  @click="submitAuthorization">确定</Button>
        </FormItem>
      </Form>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { indexMixin } from '@/mixins'
import whisperingDetailMixin from './whisperingDetailMixin'
import whisperingApi from '@/api/sms/whispering'
import { fmt } from '@/util'
import whisperingEventBus from '../../src/whisperingEventBus'

export default {
  mixins: [indexMixin, whisperingDetailMixin],
  data() {
    return {
      params: {
        id: this.data.id
      },
      table: {
        columns: [{
          title: '序号',
          key: 'id',
          width: 60
        }, {
          title: '企业名称',
          key: 'name'
        }, {
          title: '所属省份',
          key: 'provinceName'
        }, {
          title: '所属城市',
          key: 'cityName'
        }, {
          title: '机器坐席数',
          key: 'machineSeatCount',
          width: 75
        }, {
          title: '人工坐席数',
          key: 'artSeatCount',
          width: 75
        }, {
          title: '开通时间',
          key: 'openTime',
          value: row => {
            return fmt.date(row.openTime)
          },
          render: (h, { row, column, index }) => {
            return h('span', column.value(row))
          }
        }, {
          key: 'isCopy',
          title: '允许复制',
          width: 60,
          render: (h, params) => {
            return h('span', params.row.isCopy === 1 ? '是' : '否')
          }
        },
        {
          key: 'isDownload',
          title: '允许导出',
          width: 60,
          render: (h, params) => {
            return h('span', params.row.isDownload === 1 ? '是' : '否')
          }
        }, {
          title: '操作',
          render: (h, { row }) => {
            let opts = [h('a', {
              on: {
                click: () => {
                  this.showAuthorization(row)
                }
              }
            }, '设置权限')]
            if (this.data.owner === 1) {
              opts.push(h('a', {
                on: {
                  click: () => {
                    this.cancelRelate(row)
                  }
                }
              }, '取消关联'))
            }
            return h('div', opts)
          }
        }]
      },
      authorization: {
        show: false,
        entity: {
          id: '',
          isCopy: 1,
          isDownload: 1
        },
        rules: {}
      }
    }
  },
  methods: {
    getApi() {
      return whisperingApi
    },
    refreshTaskDetail(data) {
      this.params.id = data.id
      this.search()
    },
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params)
      whisperingApi.listFirm(params).then(page => {
        this.setTableList(page.dataList)
        this.setPagination(page)
      })
    },
    // 取消话术关联
    cancelRelate(data) {
      this.$Modal.confirm({
        title: '确认取消关联',
        content: `确定取消话术[${this.data.title}]与企业[${data.name}]的关联？`,
        onOk: (action, instance) => {
          whisperingApi.removeRelate([data.id]).then(() => {
            this.success('取消关联成功')
            whisperingEventBus.$emit('list.update')
          })
        }
      })
    },
    showAuthorization(data) {
      this.authorization.entity.id = data.id
      this.authorization.entity.isCopy = data.isCopy
      this.authorization.entity.isDownload = data.isDownload
      this.authorization.show = true
    },
    submitAuthorization() {
      whisperingApi.authorization(this.authorization.entity).then(() => {
        this.success('设置成功')
        this.authorization.show = false
        whisperingEventBus.$emit('list.update')
      })
    },
    cancelAuthorization() {
      this.authorization.show = false
    }
  }
}
</script>
