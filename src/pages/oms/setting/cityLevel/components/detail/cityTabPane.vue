<template>
  <div>
    <Form class="panel-form clear"
          inline>
      <div class="fr">
        <FormItem>
          <i-input type="text"
                   placeholder="搜索城市名称"
                   v-model.trim="params.cityName"
                   @keyup.native.enter="search">
            <Icon type="search"
                  slot="prepend"></Icon>
          </i-input>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="search">查询</Button>
        </FormItem>
      </div>
    </Form>
    <Table :columns="table.columns"
           :data="table.list"
           class="mt-20"
           ref="table" />
    <ms-pagination :pageNum="params.pageNum"
                   :pageSize="params.pageSize"
                   :total="page.totalNum"
                   @change="list" />
  </div>
</template>

<script>
import { indexMixin, detailMixin } from '@/mixins'
import systemConfigApi from '@/api/oms/systemConfig'
import { fmt } from '@/util'

export default {
  mixins: [indexMixin, detailMixin],
  data() {
    return {
      params: {
        level: this.data.level
      },
      table: {
        columns: [{
          title: '序号',
          key: 'id'
        }, {
          title: '城市名称',
          key: 'cityName'
        }, {
          title: '金牌代理',
          key: 'goldCount'
        }, {
          title: '银牌代理',
          key: 'silverCount'
        }, {
          title: '铜牌代理',
          key: 'cuCount'
        }]
      }
    }
  },
  methods: {
    afterEntity(data) {
      this.params.level = data.level
      this.search()
    },
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params)
      systemConfigApi.listCityPage(params).then(page => {
        this.setTableList(page.dataList)
        this.setPagination(page)
      })
    }
  }
}
</script>
