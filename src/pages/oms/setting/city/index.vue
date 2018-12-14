<template>
  <div>
    <div class="divide"
         :class="{full: fullScreen}">
      <div class="divide-item">
        <div class="panel">
          <div class="panel-body">
            <Form class="panel-form"
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
              <FormItem label="城市等级"
                        :label-width="70">
                <Select style="width: 90px;"
                        v-model="params.level"
                        placeholder="全部"
                        clearable
                        @on-change="search">
                  <Option value="1">一线城市</Option>
                  <Option value="2">二线城市</Option>
                  <Option value="3">三线城市</Option>
                  <Option value="4">四线城市</Option>
                </Select>
              </FormItem>

              <FormItem label="省份"
                        :label-width="50">
                <province-select v-model="params.provinceId"
                                 @change="search" />
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              城市列表
              <div class="panel-header-tools">
                <Dropdown class="panel-header-dropdown mr-5">
                  <a href="javascript:void(0)">
                    {{params.sort | value(['', '累计代理最多', '金牌代理最多', '银牌代理最多', '铜牌代理最多'])}}
                    <Icon type="arrow-down-b"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem @click.native="changeSort(1)">累计代理最多</DropdownItem>
                    <DropdownItem @click.native="changeSort(2)">金牌代理最多</DropdownItem>
                    <DropdownItem @click.native="changeSort(3)">银牌代理最多</DropdownItem>
                    <DropdownItem @click.native="changeSort(4)">铜牌代理最多</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <div class="panel-body">
              <p class="nodata tc"
                 v-show="!table.list.length">暂无数据</p>
              <ul class="list"
                  v-show="table.list.length">
                <li v-for="item in table.list"
                    :key="item.id"
                    :class="{active: detail.entity.id === item.id}"
                    @click="showDetail(item)">
                  <div class="list-item">
                    <div class="list-item-main">
                      <p class="list-item-title">{{item.cityName}}</p>
                      <div class="list-item-info">
                        <ins class="keyword-item"
                             v-if="item.level">{{item.level | value(['', '一线城市', '二线城市', '三线城市', '四线城市'])}}</ins>
                        <span class="ml-5">金 {{item.goldCount || 0}}</span>
                        <span class="ml-5">银 {{item.silverCount || 0}}</span>
                        <span class="ml-5">铜 {{item.cuCount || 0}}</span>
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
                      :tableList='tableList' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { indexMixin } from '@/mixins'
import { ProvinceSelect } from '@/components/packages/oms/select'
import systemConfigApi from '@/api/oms/systemConfig'
import ModDetail from './detail'

export default {
  mixins: [indexMixin],
  components: {
    ProvinceSelect,
    ModDetail
  },
  data() {
    return {
      params: {
        provinceId: '',
        cityName: '',
        level: '',
        sort: '1'
      },
      fullScreen: false,
      cityLevelList: [],
      tableList:''

    }
  },
  methods: {
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params)
      return systemConfigApi.listCity(params).then(page => {
        this.setTableList(page.dataList)
        this.setPagination(page)
      })
    },
    search() {
      this.table.selection = []
      
      this.list(1).then((res) => {
        this.tableList=this.table.list
        if (this.table.list.length) {
          this.showDetail(this.table.list[0])
        }
      })
    },
    changeSort(sort) {
      this.params.sort = sort
      this.search()
    },
    toggleFullScreen(val) {
      this.fullScreen = val
    }
  },
  mounted() {
      
    },
}
</script>
