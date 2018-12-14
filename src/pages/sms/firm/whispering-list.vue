<template>
  <div>
    <i-table :data="tableParams.list"
             :columns="columns"></i-table>
    <div class="page-wrapper cf">
      <Page simple
            show-sizer
            :total="tableParams.total"
            :current="currentPage"
            @on-change="onPageChange" />
      <span class="fr">{{tableParams.total}}共条数据</span>
    </div>
    <!-- 企业关联话术 -->
    <Modal v-model="relate.show"
           title="关联话术">
      <Form :label-width="120"
            :model="relate.entity"
            :rules="relate.rules"
            ref="relateForm"
            v-if="relate.show">
        <FormItem label="选择话术"
                  prop="ids">
          <unrelate-whispering-select v-model="relate.entity.ids"
                                      :options="{multiple: true}"
                                      :firmId="firmId" />
        </FormItem>
        <FormItem label="是否允许复制">
          <Checkbox v-model="relate.entity.isCopy"
                    :true-value="1"
                    :false-value="0" />
        </FormItem>
        <FormItem label="是否允许导出">
          <Checkbox v-model="relate.entity.isDownload"
                    :true-value="1"
                    :false-value="0" />
        </FormItem>
        <FormItem>
          <Button type="ghost"
                  style="margin-right: 8px"
                  @click="cancelRelate">取消</Button>
          <Button type="primary"
                  @click="submitRelate">确定</Button>
        </FormItem>
      </Form>
      <div slot="footer"></div>
    </Modal>

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
import { fmt, duration } from "@/util";
import tableMixin from "@/mixins/table-mixin";
import { UnrelateWhisperingSelect } from '@/components/packages/sms/select'

export default {
  props: {
    firmId: ""
  },
  data() {
    return {
      columns: [
        { type: 'index', title: '序号', width: 60 },
        {          key: 'title', title: '话术名称', render: (h, params) => {
            return (<span>{(params.row.isNew === 1 ? '(新)' : '') + params.row.title}</span>)
          }        },
        { key: 'typeName', title: '话术分类' },
        {
          key: 'isCopy',
          title: '允许复制',
          render: (h, params) => {
            return h('span', params.row.isCopy === 1 ? '是' : '否')
          }
        },
        {
          key: 'isDownload',
          title: '允许导出',
          render: (h, params) => {
            return h('span', params.row.isDownload === 1 ? '是' : '否')
          }
        },
        {
          key: 'createTime',
          title: '创建时间',
          render: (h, params) => {
            return h('span', fmt.date(params.row.createTime))
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            if (params.row.owner === 1) {
              return (
                <div>
                  <span class="text-link" onClick={() => { this.removeRelate(params.row.id) }}>取消关联</span>
                  <span class="text-link ml10" onClick={() => { this.showAuthorization(params.row) }}>设置权限</span>
                </div>
              )
            }
          }
        },
      ],
      relate: {
        show: false,
        entity: {
          ids: [],
          isCopy: 0,
          isDownload: 0
        },
        rules: {
          ids: [
            {
              validator(rule, value, callback, source, options) {
                let errors = []
                if (value && value.length === 0) {
                  errors.push(rule.message)
                }
                callback(errors)
              }, message: '请选择话术'
            }
          ]
        }
      },
      authorization: {
        show: false,
        entity: {
          id: '',
          isCopy: 0,
          isDownload: 0
        },
        rules: {}
      }
    };

  },
  mixins: [tableMixin],
  components: { UnrelateWhisperingSelect },
  watch: {
    firmId(n, o) {
      if (n) {
        this.onSearch()
      } else {
        this.tableParams.list = []
        this.tableParams.total = 0
        this.tableParams.pageNum = 1
      }
    }
  },
  // mounted() {
  //   this.loadList()
  // },
  methods: {
    loadList() {
      let query = this.assignQuery({ id: this.firmId })
      this.$smsApi.firm.listWhispering(query).then(data => {
        this.tableParams.list = data.dataList
        this.tableParams.total = data.totalNum
      })
    },
    removeRelate(id) {
      this.$Modal.confirm({
        title: '确认取消关联',
        content: `确定取消话术与企业的关联？`,
        onOk: (action, instance) => {
          this.$smsApi.whispering.removeRelate([id]).then(() => {
            this.success('取消关联成功')
            this.loadList()
          })
        }
      })
    },
    listWhispering() {
      this.loadList()
    },
    showRelate() {
      this.relate.entity.ids = []
      this.relate.entity.isCopy = 0
      this.relate.entity.isDownload = 0
      this.relate.show = true
    },
    cancelRelate() {
      this.relate.show = false
    },
    submitRelate() {
      this.$refs.relateForm.validate().then(valid => {
        if (valid) {
          this.$smsApi.firm.addRelate(Object.assign({}, this.relate.entity, {
            adminId: this.firmId
          })).then(() => {
            this.success('关联成功')
            this.relate.show = false
            this.loadList()
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
      this.$smsApi.firm.authorization(this.authorization.entity).then(() => {
        this.success('设置成功')
        this.authorization.show = false
        this.loadList()
      })
    },
    cancelAuthorization() {
      this.authorization.show = false
    }
  },
  created() {
    this.$on('on-add-whispering', this.showRelate)
  }
};
</script>
<style>
</style>

